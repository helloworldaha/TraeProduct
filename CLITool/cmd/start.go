package cmd

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"github.com/spf13/cobra"
	"go.uber.org/zap"

	"syncer/internal/config"
	"syncer/internal/scheduler"
	"syncer/internal/uploader"
	"syncer/internal/watcher"
	"syncer/pkg/logger"
)

// startCmd represents the start command
var startCmd = &cobra.Command{
	Use:   "start",
	Short: "Start the file monitor and sync service",
	Long: `Start continuously monitors the configured directory for file changes,
encrypts new/modified files using AES-256-GCM, and syncs them to AWS S3.

It also handles file deletions by removing the corresponding objects from S3.

The service runs until interrupted by SIGINT (Ctrl+C) or SIGTERM.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		return runStart(cmd)
	},
}

func init() {
	rootCmd.AddCommand(startCmd)

	// Define flags for the start command
	startCmd.Flags().StringP("config", "c", "", "Path to configuration file (required)")
	startCmd.MarkFlagRequired("config")
}

// runStart executes the start command logic.
func runStart(cmd *cobra.Command) error {
	log := logger.GetLogger()

	// Get config file path
	configPath, err := cmd.Flags().GetString("config")
	if err != nil {
		return err
	}

	// Load configuration
	log.Info("loading configuration", zap.String("path", configPath))
	cfg, err := config.Load(configPath)
	if err != nil {
		return err
	}

	// Validate configuration
	if err := cfg.Validate(); err != nil {
		return err
	}

	log.Info("configuration loaded successfully",
		zap.String("watch_path", cfg.Watch.Path),
		zap.String("s3_bucket", cfg.S3.Bucket),
		zap.Int("concurrency", cfg.Sync.Concurrency),
		zap.Int("debounce_ms", cfg.Sync.DebounceMs),
	)

	// Create context with signal handling
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Set up signal handling for graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Create event channel
	eventChan := make(chan watcher.FileEvent, 100)

	// Create watcher
	log.Info("initializing file watcher")
	w, err := watcher.New(cfg.Watch.Path, cfg.Watch.Recursive, eventChan)
	if err != nil {
		return err
	}

	// Create S3 uploader
	log.Info("initializing S3 uploader")
	s3Cfg := uploader.S3Config{
		Bucket: cfg.S3.Bucket,
		Region: cfg.S3.Region,
		RetryConfig: uploader.RetryConfig{
			MaxAttempts:    cfg.Sync.RetryAttempts,
			InitialDelayMs: cfg.Sync.RetryDelayMs,
			MaxDelayMs:     30000,
		},
		MultipartConfig: uploader.MultipartConfig{
			ThresholdBytes:  cfg.Sync.MultipartThresholdBytes,
			PartSizeBytes:   cfg.Sync.PartSizeBytes,
			DynamicPartSize: cfg.Sync.DynamicPartSize,
			Concurrency:     cfg.Sync.Concurrency,
		},
	}

	s3Uploader, err := uploader.NewS3Uploader(s3Cfg)
	if err != nil {
		return err
	}
	defer s3Uploader.Close()

	// Create scheduler
	log.Info("initializing scheduler")
	sched, err := scheduler.New(cfg, s3Uploader, eventChan)
	if err != nil {
		return err
	}

	// Start all components
	log.Info("starting all components")

	if err := w.Start(ctx); err != nil {
		return err
	}
	defer w.Stop()

	sched.Start(ctx)
	defer sched.Stop()

	log.Info("syncer is running. Press Ctrl+C to stop.")

	// Wait for shutdown signal
	select {
	case <-sigChan:
		log.Info("received shutdown signal, stopping gracefully...")
	case <-ctx.Done():
		log.Info("context cancelled, stopping gracefully...")
	}

	// Cancel context to stop all components
	cancel()

	log.Info("shutdown complete")
	return nil
}
