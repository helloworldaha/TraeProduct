// Package cmd contains the CLI command definitions.
package cmd

import (
	"os"

	"github.com/spf13/cobra"
	"go.uber.org/zap"

	"syncer/pkg/logger"
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "syncer",
	Short: "A CLI tool for monitoring and syncing files to AWS S3 with client-side encryption",
	Long: `syncer is a cross-platform CLI tool that monitors local directories,
encrypts files using AES-256-GCM, and syncs them to AWS S3.

It supports:
- Recursive directory watching
- Client-side AES-256-GCM encryption
- Concurrent uploads with retry
- Debounce to prevent frequent uploads
- Graceful shutdown on SIGINT`,
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		// Initialize logger with debug level if verbose flag is set
		verbose, _ := cmd.Flags().GetBool("verbose")
		if verbose {
			logger.Init(logger.DebugLevel)
		} else {
			logger.Init(logger.InfoLevel)
		}
	},
	PersistentPostRun: func(cmd *cobra.Command, args []string) {
		// Sync logger before exiting
		logger.Sync()
	},
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	if err := rootCmd.Execute(); err != nil {
		log := logger.GetLogger()
		log.Error("command execution failed", zap.Error(err))
		logger.Sync()
		os.Exit(1)
	}
}

func init() {
	// Here you will define your flags and configuration settings.
	// Cobra supports persistent flags, which, if defined here,
	// will be global for your application.

	rootCmd.PersistentFlags().BoolP("verbose", "v", false, "Enable verbose (debug) logging")

	// Cobra also supports local flags, which will only run
	// when this action is called directly.
}
