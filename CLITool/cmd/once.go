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

// onceCmd represents the once command
var onceCmd = &cobra.Command{
	Use:   "once",
	Short: "Perform a one-time sync of all files to S3",
	Long: `Once performs a one-time synchronization of all files in the configured
directory to AWS S3. It encrypts each file using AES-256-GCM before uploading.

Unlike the 'start' command, 'once' does not monitor for changes. It simply
uploads all existing files and then exits.

This is useful for:
- Initial backup of existing files
- Periodic batch syncs
- Verifying your configuration`,
	RunE: func(cmd *cobra.Command, args []string) error {
		return runOnce(cmd)
	},
}

func init() {
	rootCmd.AddCommand(onceCmd)

	// Define flags for the once command
	onceCmd.Flags().StringP("config", "c", "", "Path to configuration file (required)")
	onceCmd.MarkFlagRequired("config")
}

// runOnce executes the once command logic.
func runOnce(cmd *cobra.Command) error {
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
	)

	// Create context with signal handling
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Set up signal handling for graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Handle shutdown in a goroutine
	go func() {
		select {
		case <-sigChan:
			log.Info("received shutdown signal, cancelling...")
			cancel()
		case <-ctx.Done():
		}
	}()

	// Create event channel (not used for once, but needed for scheduler)
	eventChan := make(chan watcher.FileEvent, 1)

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

	// Execute one-time sync
	log.Info("starting one-time sync")
	if err := sched.ExecuteOnce(ctx); err != nil {
		if err == context.Canceled {
			log.Info("one-time sync cancelled")
			return nil
		}
		return err
	}

	log.Info("one-time sync completed successfully")
	return nil
}
