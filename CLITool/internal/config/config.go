// Package config provides configuration loading and validation functionality.
// It supports YAML configuration files and provides sensible defaults.
package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/spf13/viper"
)

// WatchConfig contains file system watching configuration.
type WatchConfig struct {
	// Path is the root directory to watch
	Path string `mapstructure:"path"`
	// Recursive indicates whether to watch subdirectories
	Recursive bool `mapstructure:"recursive"`
}

// S3Config contains AWS S3 related configuration.
type S3Config struct {
	// Bucket is the S3 bucket name
	Bucket string `mapstructure:"bucket"`
	// Prefix is the key prefix for uploaded objects
	Prefix string `mapstructure:"prefix"`
	// Region is the AWS region (optional, can be inferred from environment)
	Region string `mapstructure:"region"`
}

// EncryptionConfig contains encryption related configuration.
type EncryptionConfig struct {
	// Password is used to derive the encryption key
	Password string `mapstructure:"password"`
}

const (
	// DefaultMultipartThreshold is the default file size threshold for using multipart upload (100MB)
	DefaultMultipartThreshold = 100 * 1024 * 1024
	// DefaultPartSize is the default part size for multipart upload (5MB)
	DefaultPartSize = 5 * 1024 * 1024
	// MaxPartSize is the maximum allowed part size (5GB)
	MaxPartSize = 5 * 1024 * 1024 * 1024
	// MinPartSize is the minimum allowed part size (5MB, except last part)
	MinPartSize = 5 * 1024 * 1024
)

// SyncConfig contains synchronization behavior configuration.
type SyncConfig struct {
	// Concurrency is the maximum number of concurrent uploads
	Concurrency int `mapstructure:"concurrency"`
	// DebounceMs is the debounce time in milliseconds for file events
	DebounceMs int `mapstructure:"debounce_ms"`
	// RetryAttempts is the number of retry attempts for failed operations
	RetryAttempts int `mapstructure:"retry_attempts"`
	// RetryDelayMs is the initial delay between retries (exponential backoff)
	RetryDelayMs int `mapstructure:"retry_delay_ms"`
	// MultipartThresholdBytes is the file size threshold for using multipart upload
	// Files larger than this will use multipart upload
	MultipartThresholdBytes int64 `mapstructure:"multipart_threshold_bytes"`
	// PartSizeBytes is the part size for multipart upload
	PartSizeBytes int64 `mapstructure:"part_size_bytes"`
	// DynamicPartSize enables dynamic part size adjustment for very large files
	DynamicPartSize bool `mapstructure:"dynamic_part_size"`
}

// Config holds all application configuration.
type Config struct {
	Watch      WatchConfig      `mapstructure:"watch"`
	S3         S3Config         `mapstructure:"s3"`
	Encryption EncryptionConfig `mapstructure:"encryption"`
	Sync       SyncConfig       `mapstructure:"sync"`
}

// DefaultConfig returns a Config with sensible default values.
func DefaultConfig() *Config {
	return &Config{
		Watch: WatchConfig{
			Path:      "./data",
			Recursive: true,
		},
		S3: S3Config{
			Bucket: "",
			Prefix: "backup/",
			Region: "",
		},
		Encryption: EncryptionConfig{
			Password: "",
		},
		Sync: SyncConfig{
			Concurrency:              5,
			DebounceMs:               1000,
			RetryAttempts:            3,
			RetryDelayMs:             1000,
			MultipartThresholdBytes:  DefaultMultipartThreshold,
			PartSizeBytes:            DefaultPartSize,
			DynamicPartSize:          true,
		},
	}
}

// Load loads configuration from the specified YAML file.
// It merges the file configuration with defaults.
func Load(configPath string) (*Config, error) {
	cfg := DefaultConfig()

	if configPath == "" {
		return cfg, nil
	}

	// Check if config file exists
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("config file not found: %s", configPath)
	}

	v := viper.New()
	v.SetConfigFile(configPath)
	v.SetConfigType("yaml")

	if err := v.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}

	if err := v.Unmarshal(cfg); err != nil {
		return nil, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	// Normalize paths
	cfg.normalizePaths()

	// Apply defaults for zero values
	cfg.applyDefaults()

	return cfg, nil
}

// normalizePaths converts Windows paths to Unix-style and cleans paths.
func (c *Config) normalizePaths() {
	// Normalize watch path
	c.Watch.Path = normalizePath(c.Watch.Path)

	// Normalize S3 prefix (ensure it ends with / if not empty)
	if c.S3.Prefix != "" && !strings.HasSuffix(c.S3.Prefix, "/") {
		c.S3.Prefix = c.S3.Prefix + "/"
	}
	// Remove leading / from prefix for S3 compatibility
	c.S3.Prefix = strings.TrimPrefix(c.S3.Prefix, "/")
}

// applyDefaults sets default values for fields that are zero or invalid.
func (c *Config) applyDefaults() {
	defaults := DefaultConfig()

	if c.Sync.Concurrency <= 0 {
		c.Sync.Concurrency = defaults.Sync.Concurrency
	}
	if c.Sync.DebounceMs <= 0 {
		c.Sync.DebounceMs = defaults.Sync.DebounceMs
	}
	if c.Sync.RetryAttempts <= 0 {
		c.Sync.RetryAttempts = defaults.Sync.RetryAttempts
	}
	if c.Sync.RetryDelayMs <= 0 {
		c.Sync.RetryDelayMs = defaults.Sync.RetryDelayMs
	}
	if c.Sync.MultipartThresholdBytes <= 0 {
		c.Sync.MultipartThresholdBytes = defaults.Sync.MultipartThresholdBytes
	}
	if c.Sync.PartSizeBytes <= 0 {
		c.Sync.PartSizeBytes = defaults.Sync.PartSizeBytes
	}
	// Validate and adjust part size
	if c.Sync.PartSizeBytes < MinPartSize {
		c.Sync.PartSizeBytes = MinPartSize
	}
	if c.Sync.PartSizeBytes > MaxPartSize {
		c.Sync.PartSizeBytes = MaxPartSize
	}
}

// Validate checks if the configuration is valid and ready to use.
func (c *Config) Validate() error {
	var errors []string

	// Validate watch path
	if c.Watch.Path == "" {
		errors = append(errors, "watch.path is required")
	} else {
		info, err := os.Stat(c.Watch.Path)
		if os.IsNotExist(err) {
			errors = append(errors, fmt.Sprintf("watch.path does not exist: %s", c.Watch.Path))
		} else if err != nil {
			errors = append(errors, fmt.Sprintf("watch.path error: %v", err))
		} else if !info.IsDir() {
			errors = append(errors, fmt.Sprintf("watch.path is not a directory: %s", c.Watch.Path))
		}
	}

	// Validate S3 config
	if c.S3.Bucket == "" {
		errors = append(errors, "s3.bucket is required")
	}

	// Validate encryption
	if c.Encryption.Password == "" {
		errors = append(errors, "encryption.password is required")
	}

	if len(errors) > 0 {
		return fmt.Errorf("configuration validation failed: %s", strings.Join(errors, "; "))
	}

	return nil
}

// normalizePath converts any path to a Unix-style path with forward slashes.
func normalizePath(path string) string {
	// Convert to absolute path first
	absPath, err := filepath.Abs(path)
	if err != nil {
		absPath = path
	}

	// Replace all backslashes with forward slashes
	normalized := filepath.ToSlash(absPath)

	// Clean the path
	normalized = filepath.Clean(normalized)

	// Convert any remaining OS-specific separators
	return strings.ReplaceAll(normalized, string(os.PathSeparator), "/")
}

// GetRelativeKey computes the S3 object key for a given local file path.
// It normalizes paths and applies the configured prefix.
func (c *Config) GetRelativeKey(localPath string) string {
	normalizedLocal := normalizePath(localPath)
	normalizedWatch := normalizePath(c.Watch.Path)

	// Ensure watch path ends with / for proper prefix matching
	if !strings.HasSuffix(normalizedWatch, "/") {
		normalizedWatch += "/"
	}

	// Get relative path
	relPath := strings.TrimPrefix(normalizedLocal, normalizedWatch)

	// Combine with prefix
	key := c.S3.Prefix + relPath

	// Clean up any double slashes
	for strings.Contains(key, "//") {
		key = strings.ReplaceAll(key, "//", "/")
	}

	return key
}
