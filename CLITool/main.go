// syncer is a cross-platform CLI tool for monitoring local folders,
// encrypting files with AES-256-GCM, and syncing to AWS S3.
//
// Usage:
//
//	syncer start --config config.yaml
//	syncer once --config config.yaml
//	syncer version
package main

import "syncer/cmd"

func main() {
	cmd.Execute()
}
