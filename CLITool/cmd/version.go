package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// Version information - these can be set at build time using ldflags
var (
	Version   = "dev"
	Commit    = "none"
	BuildDate = "unknown"
)

// versionCmd represents the version command
var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version information",
	Long: `Print the version, commit hash, and build date of the syncer CLI.

These values can be embedded at build time using Go linker flags:
  go build -ldflags "-X syncer/cmd.Version=1.0.0 -X syncer/cmd.Commit=abc123 -X syncer/cmd.BuildDate=2024-01-01"`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("syncer version: %s\n", Version)
		fmt.Printf("commit: %s\n", Commit)
		fmt.Printf("build date: %s\n", BuildDate)
	},
}

func init() {
	rootCmd.AddCommand(versionCmd)
}
