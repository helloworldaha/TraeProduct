// Package scheduler provides event scheduling with debounce and deduplication.
// It handles file system events and coordinates with encryption and upload modules.
package scheduler

import (
	"context"
	"fmt"
	"os"
	"sync"
	"time"

	"go.uber.org/zap"

	"syncer/internal/config"
	"syncer/internal/encrypt"
	"syncer/internal/uploader"
	"syncer/internal/watcher"
	"syncer/pkg/logger"
)

// ActionType represents the action to perform on a file.
type ActionType string

const (
	// ActionUpload indicates the file should be encrypted and uploaded
	ActionUpload ActionType = "UPLOAD"
	// ActionDelete indicates the file should be deleted from S3
	ActionDelete ActionType = "DELETE"
)

// SyncTask represents a task to be executed by the scheduler.
type SyncTask struct {
	// Path is the local file path
	Path string
	// Action is the action to perform (UPLOAD or DELETE)
	Action ActionType
	// S3Key is the corresponding S3 object key
	S3Key string
}

// pendingEvent tracks pending events for debounce.
type pendingEvent struct {
	// path is the file path
	path string
	// eventType is the original watcher event type
	eventType watcher.EventType
	// lastSeen is the last time this event was seen
	lastSeen time.Time
	// isDir indicates if the path is a directory
	isDir bool
}

// Scheduler coordinates file system events, encryption, and uploads.
type Scheduler struct {
	// config contains application configuration
	config *config.Config
	// encryptionKey is the derived AES-256 key
	encryptionKey []byte
	// uploader is the S3 uploader interface
	uploader uploader.Uploader
	// workerPool handles concurrent uploads (for small files and deletes)
	workerPool *uploader.WorkerPool
	// eventChan receives events from the watcher
	eventChan <-chan watcher.FileEvent
	// pendingEvents tracks events waiting for debounce
	pendingEvents map[string]*pendingEvent
	// pendingMu protects access to pendingEvents
	pendingMu sync.RWMutex
	// logger for structured logging
	logger *zap.Logger
	// ctx for cancellation
	ctx context.Context
	// cancel function for stopping
	cancel context.CancelFunc
	// wg for goroutine synchronization
	wg sync.WaitGroup
	// debounceDuration is the debounce window
	debounceDuration time.Duration
	// tickerInterval is how often to check for ready events
	tickerInterval time.Duration
}

// New creates a new Scheduler instance.
func New(
	cfg *config.Config,
	up uploader.Uploader,
	eventChan <-chan watcher.FileEvent,
) (*Scheduler, error) {
	// Derive encryption key from password
	encryptionKey := encrypt.DeriveKey(cfg.Encryption.Password)

	// Create worker pool
	workerPool := uploader.NewWorkerPool(up, cfg.Sync.Concurrency)

	s := &Scheduler{
		config:           cfg,
		encryptionKey:    encryptionKey,
		uploader:         up,
		workerPool:       workerPool,
		eventChan:        eventChan,
		pendingEvents:    make(map[string]*pendingEvent),
		logger:           logger.GetLogger(),
		debounceDuration: time.Duration(cfg.Sync.DebounceMs) * time.Millisecond,
		tickerInterval:   500 * time.Millisecond, // Check every 500ms
	}

	return s, nil
}

// Start starts the scheduler.
func (s *Scheduler) Start(ctx context.Context) {
	s.ctx, s.cancel = context.WithCancel(ctx)

	// Start worker pool
	s.workerPool.Start(s.ctx)

	// Start event processor goroutine
	s.wg.Add(2)
	go s.processEvents()
	go s.debounceTicker()

	s.logger.Info("scheduler started",
		zap.Int("concurrency", s.config.Sync.Concurrency),
		zap.Duration("debounce", s.debounceDuration),
	)
}

// Stop stops the scheduler and waits for all tasks to complete.
func (s *Scheduler) Stop() {
	s.logger.Info("stopping scheduler")

	if s.cancel != nil {
		s.cancel()
	}

	// Wait for goroutines to finish
	s.wg.Wait()

	// Stop worker pool (this will wait for pending tasks)
	s.workerPool.Stop()

	s.logger.Info("scheduler stopped")
}

// processEvents receives events from the watcher and adds them to the pending queue.
func (s *Scheduler) processEvents() {
	defer s.wg.Done()

	for {
		select {
		case <-s.ctx.Done():
			return
		case event, ok := <-s.eventChan:
			if !ok {
				return
			}
			s.handleEvent(event)
		}
	}
}

// handleEvent processes a single file event.
func (s *Scheduler) handleEvent(event watcher.FileEvent) {
	s.logger.Debug("received event",
		zap.String("path", event.Path),
		zap.String("type", string(event.Type)),
		zap.Bool("is_dir", event.IsDir),
	)

	// Skip directories (except for REMOVE events)
	// For CREATE/WRITE on directories, we don't need to upload anything
	if event.IsDir && event.Type != watcher.EventRemove {
		return
	}

	s.pendingMu.Lock()
	defer s.pendingMu.Unlock()

	existing, exists := s.pendingEvents[event.Path]

	if !exists {
		// New event
		s.pendingEvents[event.Path] = &pendingEvent{
			path:      event.Path,
			eventType: event.Type,
			lastSeen:  time.Now(),
			isDir:     event.IsDir,
		}
		return
	}

	// Update existing event
	existing.lastSeen = time.Now()

	// Merge event types
	// Rules:
	// - REMOVE takes precedence (if file is deleted, nothing else matters)
	// - CREATE + WRITE = UPLOAD (just treat as upload)
	// - WRITE after CREATE is still UPLOAD

	switch event.Type {
	case watcher.EventRemove, watcher.EventRename:
		// Remove/rename takes precedence
		existing.eventType = event.Type
		existing.isDir = event.IsDir
	case watcher.EventCreate, watcher.EventWrite:
		// If existing is REMOVE, don't change (file was deleted and recreated quickly)
		// Otherwise, update to CREATE/WRITE (both result in UPLOAD action)
		if existing.eventType != watcher.EventRemove && existing.eventType != watcher.EventRename {
			existing.eventType = event.Type
			existing.isDir = event.IsDir
		}
	}
}

// debounceTicker periodically checks for events that are ready to be processed.
func (s *Scheduler) debounceTicker() {
	defer s.wg.Done()

	ticker := time.NewTicker(s.tickerInterval)
	defer ticker.Stop()

	for {
		select {
		case <-s.ctx.Done():
			// Process any remaining pending events before exiting
			s.processAllPending()
			return
		case <-ticker.C:
			s.processReadyEvents()
		}
	}
}

// processReadyEvents processes events that have passed the debounce window.
func (s *Scheduler) processReadyEvents() {
	s.pendingMu.Lock()
	defer s.pendingMu.Unlock()

	now := time.Now()
	readyPaths := make([]string, 0)

	// Find events that are ready
	for path, event := range s.pendingEvents {
		if now.Sub(event.lastSeen) >= s.debounceDuration {
			readyPaths = append(readyPaths, path)
		}
	}

	// Process ready events
	for _, path := range readyPaths {
		event := s.pendingEvents[path]
		delete(s.pendingEvents, path)

		s.processPendingEvent(event)
	}
}

// processAllPending processes all pending events (used during shutdown).
func (s *Scheduler) processAllPending() {
	s.pendingMu.Lock()
	defer s.pendingMu.Unlock()

	for path, event := range s.pendingEvents {
		delete(s.pendingEvents, path)
		s.processPendingEvent(event)
	}
}

// processPendingEvent converts a pending event to a sync task and executes it.
func (s *Scheduler) processPendingEvent(event *pendingEvent) {
	// Determine the action
	var action ActionType
	switch event.eventType {
	case watcher.EventCreate, watcher.EventWrite:
		action = ActionUpload
	case watcher.EventRemove, watcher.EventRename:
		action = ActionDelete
	default:
		// Unknown event type, skip
		s.logger.Warn("unknown event type, skipping",
			zap.String("path", event.path),
			zap.String("type", string(event.eventType)),
		)
		return
	}

	// For UPLOAD actions, wait for file to be accessible
	// This handles the case where the file is still being written
	if action == ActionUpload {
		if !s.waitForFileReady(event.path) {
			s.logger.Warn("file not ready after waiting, skipping",
				zap.String("path", event.path),
			)
			return
		}
	}

	// Compute S3 key
	s3Key := s.config.GetRelativeKey(event.path)

	// Create task
	task := SyncTask{
		Path:   event.path,
		Action: action,
		S3Key:  s3Key,
	}

	s.logger.Info("processing task",
		zap.String("path", task.Path),
		zap.String("action", string(task.Action)),
		zap.String("s3_key", task.S3Key),
	)

	// Execute task
	s.executeTask(task)
}

// waitForFileReady waits for a file to be accessible (not being written to).
// It returns true if the file is ready, false if it times out or disappears.
func (s *Scheduler) waitForFileReady(path string) bool {
	// Maximum wait time: 5 seconds
	maxWait := 5 * time.Second
	// Check interval: 200ms
	checkInterval := 200 * time.Millisecond

	start := time.Now()
	var lastSize int64 = -1
	var stableCount int

	for time.Since(start) < maxWait {
		select {
		case <-s.ctx.Done():
			return false
		default:
		}

		info, err := os.Stat(path)
		if err != nil {
			// File doesn't exist anymore (maybe deleted)
			if os.IsNotExist(err) {
				return false
			}
			// Other error, wait and retry
			time.Sleep(checkInterval)
			continue
		}

		if info.IsDir() {
			// Directories don't need upload
			return false
		}

		// Check if file size is stable
		if info.Size() == lastSize {
			stableCount++
			// Need 2 consecutive stable reads to consider file ready
			if stableCount >= 2 {
				return true
			}
		} else {
			stableCount = 0
			lastSize = info.Size()
		}

		time.Sleep(checkInterval)
	}

	// Timeout, but proceed anyway (best effort)
	s.logger.Warn("file stability check timed out, proceeding anyway",
		zap.String("path", path),
	)
	return true
}

// executeTask executes a sync task.
func (s *Scheduler) executeTask(task SyncTask) {
	if task.Action == ActionDelete {
		// Delete from S3
		s.workerPool.Submit(uploader.Task{
			Key:        task.S3Key,
			Data:       nil,
			IsDelete:   true,
			ResultChan: nil,
		})
		return
	}

	// Upload action: check file size to determine upload strategy
	fileInfo, err := os.Stat(task.Path)
	if err != nil {
		s.logger.Error("failed to stat file",
			zap.String("path", task.Path),
			zap.Error(err),
		)
		return
	}

	fileSize := fileInfo.Size()
	threshold := s.config.Sync.MultipartThresholdBytes

	if fileSize >= threshold {
		// Large file: use streaming upload (EncryptToTempFile + UploadReader)
		s.executeLargeFileUpload(task, fileSize)
	} else {
		// Small file: use in-memory upload (existing behavior)
		s.executeSmallFileUpload(task)
	}
}

// executeSmallFileUpload handles small file upload (in-memory encryption + WorkerPool)
func (s *Scheduler) executeSmallFileUpload(task SyncTask) {
	// Upload action: encrypt and upload
	encryptedData, err := s.encryptFile(task.Path)
	if err != nil {
		s.logger.Error("failed to encrypt file",
			zap.String("path", task.Path),
			zap.Error(err),
		)
		return
	}

	// Submit to worker pool
	s.workerPool.Submit(uploader.Task{
		Key:        task.S3Key,
		Data:       encryptedData,
		IsDelete:   false,
		ResultChan: nil,
	})
}

// executeLargeFileUpload handles large file upload (streaming encryption + Multipart Upload)
// Flow:
// 1. Encrypt entire file to a temp file (single nonce, single tag - NOT per-chunk)
// 2. Use UploadReader to upload (single-threaded read chunks, concurrent upload parts)
// 3. Clean up temp file
func (s *Scheduler) executeLargeFileUpload(task SyncTask, fileSize int64) {
	s.logger.Info("processing large file upload",
		zap.String("path", task.Path),
		zap.Int64("file_size", fileSize),
		zap.Int64("multipart_threshold", s.config.Sync.MultipartThresholdBytes),
	)

	// Step 1: Encrypt entire file to temp file
	// Important: This is single encryption (one nonce, one tag), NOT per-chunk encryption
	encryptedFile, err := encrypt.EncryptToTempFile(task.Path, s.encryptionKey)
	if err != nil {
		s.logger.Error("failed to encrypt large file to temp",
			zap.String("path", task.Path),
			zap.Error(err),
		)
		return
	}
	// Ensure temp file is cleaned up
	defer func() {
		cleanupErr := encryptedFile.CloseAndRemove()
		if cleanupErr != nil {
			s.logger.Warn("failed to clean up temp encrypted file",
				zap.String("path", encryptedFile.Name()),
				zap.Error(cleanupErr),
			)
		}
	}()

	encryptedSize := encryptedFile.CiphertextSize()
	s.logger.Info("large file encrypted to temp",
		zap.String("temp_path", encryptedFile.Name()),
		zap.Int64("original_size", fileSize),
		zap.Int64("encrypted_size", encryptedSize),
	)

	// Step 2: Use UploadReader to upload
	// This will:
	// - Single-threaded read chunks from the encrypted file
	// - Distribute chunks to workers for concurrent UploadPart
	// - Each part has independent retry with exponential backoff
	err = s.uploader.UploadReader(s.ctx, task.S3Key, encryptedFile, encryptedSize)
	if err != nil {
		s.logger.Error("large file upload failed",
			zap.String("path", task.Path),
			zap.String("s3_key", task.S3Key),
			zap.Error(err),
		)
		return
	}

	s.logger.Info("large file upload completed successfully",
		zap.String("path", task.Path),
		zap.String("s3_key", task.S3Key),
		zap.Int64("size", encryptedSize),
	)
}

// encryptFile encrypts a file using the configured key.
func (s *Scheduler) encryptFile(path string) ([]byte, error) {
	// Verify file exists and is readable
	info, err := os.Stat(path)
	if err != nil {
		return nil, fmt.Errorf("failed to stat file: %w", err)
	}
	if info.IsDir() {
		return nil, fmt.Errorf("cannot encrypt directory: %s", path)
	}

	// Encrypt the file
	encrypted, err := encrypt.EncryptFile(path, s.encryptionKey)
	if err != nil {
		return nil, fmt.Errorf("encryption failed: %w", err)
	}

	s.logger.Debug("file encrypted",
		zap.String("path", path),
		zap.Int("original_size", int(info.Size())),
		zap.Int("encrypted_size", len(encrypted)),
	)

	return encrypted, nil
}

// ExecuteOnce performs a one-time sync of all files in the watch directory.
// This is used for the 'syncer once' command.
func (s *Scheduler) ExecuteOnce(ctx context.Context) error {
	s.logger.Info("starting one-time sync")

	// Walk the directory tree
	var tasks []SyncTask

	err := s.walkAndCollect(s.config.Watch.Path, &tasks)
	if err != nil {
		return fmt.Errorf("failed to collect files: %w", err)
	}

	s.logger.Info("collected files for one-time sync",
		zap.Int("count", len(tasks)),
	)

	// Start worker pool
	s.workerPool.Start(ctx)
	defer s.workerPool.Stop()

	// Execute all tasks
	for _, task := range tasks {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
			s.executeTask(task)
		}
	}

	s.logger.Info("one-time sync completed")
	return nil
}

// walkAndCollect walks the directory tree and collects upload tasks.
func (s *Scheduler) walkAndCollect(root string, tasks *[]SyncTask) error {
	entries, err := os.ReadDir(root)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		fullPath := root + "/" + entry.Name()

		if entry.IsDir() {
			// Recursively walk subdirectories
			if err := s.walkAndCollect(fullPath, tasks); err != nil {
				s.logger.Warn("failed to walk subdirectory",
					zap.String("path", fullPath),
					zap.Error(err),
				)
			}
		} else {
			// Regular file - add to tasks
			s3Key := s.config.GetRelativeKey(fullPath)
			*tasks = append(*tasks, SyncTask{
				Path:   fullPath,
				Action: ActionUpload,
				S3Key:  s3Key,
			})
		}
	}

	return nil
}
