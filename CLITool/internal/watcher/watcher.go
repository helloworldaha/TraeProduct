// Package watcher provides file system event monitoring using fsnotify.
// It supports recursive directory watching and emits events for file changes.
package watcher

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/fsnotify/fsnotify"
	"go.uber.org/zap"

	"syncer/pkg/logger"
)

// EventType represents the type of file system event.
type EventType string

const (
	// EventCreate indicates a file or directory was created
	EventCreate EventType = "CREATE"
	// EventWrite indicates a file was modified
	EventWrite EventType = "WRITE"
	// EventRemove indicates a file or directory was deleted
	EventRemove EventType = "REMOVE"
	// EventRename indicates a file or directory was renamed
	EventRename EventType = "RENAME"
)

// FileEvent represents a file system event.
type FileEvent struct {
	// Path is the normalized path to the file/directory
	Path string
	// Type is the event type (CREATE, WRITE, REMOVE, RENAME)
	Type EventType
	// IsDir indicates if the path is a directory
	IsDir bool
}

// Watcher monitors file system changes in a directory.
type Watcher struct {
	// rootPath is the root directory being watched
	rootPath string
	// recursive indicates if subdirectories should be watched
	recursive bool
	// eventChan is the channel for emitting file events
	eventChan chan<- FileEvent
	// internal watcher from fsnotify
	watcher *fsnotify.Watcher
	// logger for debugging and info
	logger *zap.Logger
	// ctx for cancellation
	ctx context.Context
	// cancel function for stopping the watcher
	cancel context.CancelFunc
	// wg for goroutine synchronization
	wg sync.WaitGroup
	// mu protects access to watched directories
	mu sync.RWMutex
	// watchedDirs tracks currently watched directories
	watchedDirs map[string]struct{}
}

// New creates a new Watcher instance.
// It does not start watching until Start() is called.
func New(rootPath string, recursive bool, eventChan chan<- FileEvent) (*Watcher, error) {
	// Normalize the root path
	normalizedRoot := normalizePath(rootPath)

	// Verify the path exists and is a directory
	info, err := os.Stat(normalizedRoot)
	if err != nil {
		return nil, fmt.Errorf("invalid watch path: %w", err)
	}
	if !info.IsDir() {
		return nil, fmt.Errorf("watch path is not a directory: %s", normalizedRoot)
	}

	w := &Watcher{
		rootPath:    normalizedRoot,
		recursive:   recursive,
		eventChan:   eventChan,
		logger:      logger.GetLogger(),
		watchedDirs: make(map[string]struct{}),
	}

	return w, nil
}

// Start begins watching the directory for file system events.
// It runs until Stop() is called or the context is cancelled.
func (w *Watcher) Start(ctx context.Context) error {
	var err error
	w.watcher, err = fsnotify.NewWatcher()
	if err != nil {
		return fmt.Errorf("failed to create fsnotify watcher: %w", err)
	}

	w.ctx, w.cancel = context.WithCancel(ctx)

	// Start the event processing goroutine
	w.wg.Add(1)
	go w.processEvents()

	// Add initial directories to watch
	if err := w.addInitialWatches(); err != nil {
		w.Stop()
		return fmt.Errorf("failed to add initial watches: %w", err)
	}

	w.logger.Info("watcher started",
		zap.String("path", w.rootPath),
		zap.Bool("recursive", w.recursive),
	)

	return nil
}

// Stop stops the watcher and cleans up resources.
func (w *Watcher) Stop() {
	w.logger.Info("stopping watcher")

	if w.cancel != nil {
		w.cancel()
	}

	if w.watcher != nil {
		_ = w.watcher.Close()
	}

	// Wait for goroutines to finish
	w.wg.Wait()

	w.logger.Info("watcher stopped")
}

// addInitialWatches adds the root directory and all subdirectories (if recursive) to the watcher.
func (w *Watcher) addInitialWatches() error {
	if !w.recursive {
		return w.addWatch(w.rootPath)
	}

	// Walk the directory tree and add all directories
	return filepath.Walk(w.rootPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			w.logger.Warn("failed to access path during initial walk",
				zap.String("path", path),
				zap.Error(err),
			)
			return nil
		}

		if info.IsDir() {
			normalized := normalizePath(path)
			if err := w.addWatch(normalized); err != nil {
				w.logger.Warn("failed to add watch for directory",
					zap.String("path", normalized),
					zap.Error(err),
				)
			}
		}
		return nil
	})
}

// addWatch adds a single directory to the watcher.
func (w *Watcher) addWatch(path string) error {
	w.mu.Lock()
	defer w.mu.Unlock()

	// Check if already watching
	if _, exists := w.watchedDirs[path]; exists {
		return nil
	}

	if err := w.watcher.Add(path); err != nil {
		return fmt.Errorf("failed to add watch for %s: %w", path, err)
	}

	w.watchedDirs[path] = struct{}{}
	w.logger.Debug("added watch for directory", zap.String("path", path))
	return nil
}

// removeWatch removes a directory from the watcher.
func (w *Watcher) removeWatch(path string) {
	w.mu.Lock()
	defer w.mu.Unlock()

	if _, exists := w.watchedDirs[path]; exists {
		_ = w.watcher.Remove(path)
		delete(w.watchedDirs, path)
		w.logger.Debug("removed watch for directory", zap.String("path", path))
	}
}

// processEvents processes events from the fsnotify watcher.
func (w *Watcher) processEvents() {
	defer w.wg.Done()

	for {
		select {
		case <-w.ctx.Done():
			return
		case event, ok := <-w.watcher.Events:
			if !ok {
				return
			}
			w.handleEvent(event)
		case err, ok := <-w.watcher.Errors:
			if !ok {
				return
			}
			w.logger.Error("watcher error", zap.Error(err))
		}
	}
}

// handleEvent processes a single fsnotify event.
func (w *Watcher) handleEvent(event fsnotify.Event) {
	normalizedPath := normalizePath(event.Name)

	// Skip if it's the root path itself (sometimes triggered on startup)
	if normalizedPath == w.rootPath && !event.Has(fsnotify.Remove) {
		return
	}

	// Check if it's a directory (or was a directory before removal)
	isDir := w.isDir(normalizedPath)

	// Handle directory creation for recursive watching
	if event.Has(fsnotify.Create) && isDir && w.recursive {
		// Add watch for new directory
		if err := w.addWatch(normalizedPath); err != nil {
			w.logger.Warn("failed to add watch for new directory",
				zap.String("path", normalizedPath),
				zap.Error(err),
			)
		}
		// Also emit CREATE event for the directory
		w.emitEvent(normalizedPath, EventCreate, true)
		return
	}

	// Handle directory removal
	if event.Has(fsnotify.Remove) && isDir {
		w.removeWatch(normalizedPath)
		w.emitEvent(normalizedPath, EventRemove, true)
		return
	}

	// Map fsnotify events to our EventType
	switch {
	case event.Has(fsnotify.Create):
		w.emitEvent(normalizedPath, EventCreate, isDir)
	case event.Has(fsnotify.Write):
		// Only emit WRITE for files, not directories
		if !isDir {
			w.emitEvent(normalizedPath, EventWrite, false)
		}
	case event.Has(fsnotify.Remove):
		w.emitEvent(normalizedPath, EventRemove, isDir)
	case event.Has(fsnotify.Rename):
		// Rename is treated as remove from our perspective
		// The new name will trigger a CREATE event
		w.emitEvent(normalizedPath, EventRename, isDir)
	}
}

// emitEvent sends a FileEvent to the event channel.
func (w *Watcher) emitEvent(path string, eventType EventType, isDir bool) {
	// Skip directories for WRITE events (we only care about file content changes)
	if eventType == EventWrite && isDir {
		return
	}

	event := FileEvent{
		Path:  path,
		Type:  eventType,
		IsDir: isDir,
	}

	select {
	case <-w.ctx.Done():
		return
	case w.eventChan <- event:
		w.logger.Debug("emitted file event",
			zap.String("path", path),
			zap.String("type", string(eventType)),
		)
	default:
		// Channel is full, log and skip
		w.logger.Warn("event channel full, dropping event",
			zap.String("path", path),
			zap.String("type", string(eventType)),
		)
	}
}

// isDir checks if the path is a directory.
// For removed paths, it returns false (since we can't stat them).
func (w *Watcher) isDir(path string) bool {
	info, err := os.Stat(path)
	if err != nil {
		return false
	}
	return info.IsDir()
}

// normalizePath converts a path to a standardized format with forward slashes.
func normalizePath(path string) string {
	// Convert to absolute path
	absPath, err := filepath.Abs(path)
	if err != nil {
		absPath = path
	}

	// Convert to slash format and clean
	normalized := filepath.ToSlash(filepath.Clean(absPath))

	// Remove any trailing slash except for root
	if normalized != "/" && strings.HasSuffix(normalized, "/") {
		normalized = normalized[:len(normalized)-1]
	}

	return normalized
}

// GetWatchedPaths returns a list of all currently watched directories.
// This is useful for debugging.
func (w *Watcher) GetWatchedPaths() []string {
	w.mu.RLock()
	defer w.mu.RUnlock()

	paths := make([]string, 0, len(w.watchedDirs))
	for path := range w.watchedDirs {
		paths = append(paths, path)
	}
	return paths
}
