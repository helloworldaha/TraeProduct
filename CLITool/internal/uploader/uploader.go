// Package uploader provides S3 upload functionality with retry and concurrency support.
// It supports both small file upload (PutObject) and large file upload (Multipart Upload).
package uploader

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"sort"
	"sync"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"go.uber.org/zap"

	appconfig "syncer/internal/config"
	"syncer/pkg/logger"
)

const (
	// S3MinPartSize is the minimum allowed part size for multipart upload (5MB)
	S3MinPartSize = 5 * 1024 * 1024
	// S3MaxPartSize is the maximum allowed part size for multipart upload (5GB)
	S3MaxPartSize = 5 * 1024 * 1024 * 1024
	// S3MaxParts is the maximum number of parts allowed in a multipart upload
	S3MaxParts = 10000
)

// Uploader defines the interface for file upload operations.
// This interface allows for easy mocking in tests.
type Uploader interface {
	// Upload uploads data to S3 with the specified key.
	// For small files, this uses PutObject.
	// For large files, this may use Multipart Upload.
	Upload(ctx context.Context, key string, data []byte) error

	// UploadReader uploads data from a reader to S3.
	// This is the preferred method for large files as it supports Multipart Upload.
	// The reader must implement io.ReaderAt for random access.
	UploadReader(ctx context.Context, key string, reader io.ReaderAt, size int64) error

	// Delete removes an object from S3.
	Delete(ctx context.Context, key string) error

	// Close cleans up any resources.
	Close()
}

// RetryConfig defines the retry behavior for S3 operations.
type RetryConfig struct {
	// MaxAttempts is the maximum number of retry attempts
	MaxAttempts int
	// InitialDelayMs is the initial delay between retries (exponential backoff)
	InitialDelayMs int
	// MaxDelayMs is the maximum delay between retries
	MaxDelayMs int
}

// MultipartConfig defines configuration for multipart uploads.
type MultipartConfig struct {
	// ThresholdBytes is the file size threshold for using multipart upload
	ThresholdBytes int64
	// PartSizeBytes is the size of each part (minimum 5MB)
	PartSizeBytes int64
	// DynamicPartSize enables dynamic part size adjustment for very large files
	DynamicPartSize bool
	// Concurrency is the maximum number of concurrent part uploads
	Concurrency int
}

// S3Config contains configuration for the S3 uploader.
type S3Config struct {
	// Bucket is the S3 bucket name
	Bucket string
	// Region is the AWS region (optional, will use default credential chain if empty)
	Region string
	// RetryConfig configures retry behavior
	RetryConfig RetryConfig
	// MultipartConfig configures multipart upload behavior
	MultipartConfig MultipartConfig
}

// DefaultRetryConfig returns sensible default retry settings.
func DefaultRetryConfig() RetryConfig {
	return RetryConfig{
		MaxAttempts:    3,
		InitialDelayMs: 1000,
		MaxDelayMs:     30000,
	}
}

// DefaultMultipartConfig returns sensible default multipart settings.
func DefaultMultipartConfig() MultipartConfig {
	return MultipartConfig{
		ThresholdBytes:   appconfig.DefaultMultipartThreshold,
		PartSizeBytes:    appconfig.DefaultPartSize,
		DynamicPartSize:  true,
		Concurrency:      5,
	}
}

// CompletedPart represents a successfully uploaded part.
type CompletedPart struct {
	// PartNumber is the 1-based part number
	PartNumber int32
	// ETag is the entity tag returned by S3 for this part
	ETag string
}

// PartUploadResult represents the result of uploading a single part.
type PartUploadResult struct {
	// PartNumber is the 1-based part number
	PartNumber int32
	// ETag is the entity tag (nil if failed)
	ETag *string
	// Error is the upload error (nil if successful)
	Error error
}

// PartUploadTask represents a part upload task for the worker pool.
type PartUploadTask struct {
	// PartNumber is the 1-based part number
	PartNumber int32
	// Data is the part data
	Data []byte
	// UploadID is the multipart upload ID
	UploadID string
	// Key is the S3 object key
	Key string
	// ResultChan is used to send the upload result
	ResultChan chan<- PartUploadResult
}

// S3Uploader implements the Uploader interface using AWS S3.
type S3Uploader struct {
	client *s3.Client
	bucket string
	config S3Config
	logger *zap.Logger
}

// NewS3Uploader creates a new S3Uploader instance.
// It loads AWS credentials from the default credential chain.
func NewS3Uploader(cfg S3Config) (*S3Uploader, error) {
	if cfg.Bucket == "" {
		return nil, fmt.Errorf("bucket name is required")
	}

	// Set default retry config if not provided
	if cfg.RetryConfig.MaxAttempts <= 0 {
		cfg.RetryConfig = DefaultRetryConfig()
	}

	// Set default multipart config if not provided
	if cfg.MultipartConfig.ThresholdBytes <= 0 {
		cfg.MultipartConfig.ThresholdBytes = DefaultMultipartConfig().ThresholdBytes
	}
	if cfg.MultipartConfig.PartSizeBytes <= 0 {
		cfg.MultipartConfig.PartSizeBytes = DefaultMultipartConfig().PartSizeBytes
	}
	// Validate and adjust part size
	if cfg.MultipartConfig.PartSizeBytes < S3MinPartSize {
		cfg.MultipartConfig.PartSizeBytes = S3MinPartSize
	}
	if cfg.MultipartConfig.PartSizeBytes > S3MaxPartSize {
		cfg.MultipartConfig.PartSizeBytes = S3MaxPartSize
	}
	if cfg.MultipartConfig.Concurrency <= 0 {
		cfg.MultipartConfig.Concurrency = DefaultMultipartConfig().Concurrency
	}

	// Load AWS configuration
	opts := []func(*awsconfig.LoadOptions) error{}
	if cfg.Region != "" {
		opts = append(opts, awsconfig.WithRegion(cfg.Region))
	}

	awsCfg, err := awsconfig.LoadDefaultConfig(context.TODO(), opts...)
	if err != nil {
		return nil, fmt.Errorf("failed to load AWS config: %w", err)
	}

	client := s3.NewFromConfig(awsCfg)

	u := &S3Uploader{
		client: client,
		bucket: cfg.Bucket,
		config: cfg,
		logger: logger.GetLogger(),
	}

	return u, nil
}

// Upload uploads data to S3 with exponential backoff retry.
// This uses PutObject for all uploads (kept for backward compatibility).
// For large files, use UploadReader instead for Multipart Upload support.
func (u *S3Uploader) Upload(ctx context.Context, key string, data []byte) error {
	// Check if we should use multipart upload
	if int64(len(data)) >= u.config.MultipartConfig.ThresholdBytes {
		reader := bytes.NewReader(data)
		return u.UploadReader(ctx, key, reader, int64(len(data)))
	}

	// Use PutObject for small files
	operation := func() error {
		_, err := u.client.PutObject(ctx, &s3.PutObjectInput{
			Bucket: aws.String(u.bucket),
			Key:    aws.String(key),
			Body:   bytes.NewReader(data),
		})
		return err
	}

	err := u.retryWithBackoff(ctx, operation, "upload", key)
	if err != nil {
		u.logger.Error("upload failed after retries",
			zap.String("key", key),
			zap.Error(err),
		)
		return err
	}

	u.logger.Info("upload successful",
		zap.String("key", key),
		zap.Int("size_bytes", len(data)),
	)
	return nil
}

// UploadReader uploads data from a reader to S3.
// This method automatically chooses between PutObject (small files) and
// Multipart Upload (large files) based on the configured threshold.
//
// Important: The reader is accessed single-threaded to read chunks, which are
// then distributed to workers for concurrent upload.
func (u *S3Uploader) UploadReader(ctx context.Context, key string, reader io.ReaderAt, size int64) error {
	// Check if we should use multipart upload
	if size < u.config.MultipartConfig.ThresholdBytes {
		// Small file: read all into memory and use PutObject
		data := make([]byte, size)
		_, err := reader.ReadAt(data, 0)
		if err != nil && err != io.EOF {
			return fmt.Errorf("failed to read data: %w", err)
		}
		return u.Upload(ctx, key, data)
	}

	// Large file: use Multipart Upload
	return u.uploadMultipart(ctx, key, reader, size)
}

// uploadMultipart performs a multipart upload.
// Flow:
// 1. CreateMultipartUpload → Get UploadId
// 2. Single-threaded read chunks from reader
// 3. Distribute chunks to workers for concurrent UploadPart
// 4. Collect ETags, sort by PartNumber
// 5. CompleteMultipartUpload
// 6. On failure: AbortMultipartUpload
func (u *S3Uploader) uploadMultipart(ctx context.Context, key string, reader io.ReaderAt, size int64) error {
	// Calculate optimal part size
	partSize := u.calculateOptimalPartSize(size)
	numParts := u.calculateNumParts(size, partSize)

	u.logger.Info("starting multipart upload",
		zap.String("key", key),
		zap.Int64("total_size", size),
		zap.Int64("part_size", partSize),
		zap.Int("num_parts", numParts),
		zap.Int("concurrency", u.config.MultipartConfig.Concurrency),
	)

	// Step 1: Create multipart upload
	createOutput, err := u.createMultipartUpload(ctx, key)
	if err != nil {
		return err
	}
	uploadID := aws.ToString(createOutput.UploadId)

	u.logger.Debug("multipart upload created",
		zap.String("key", key),
		zap.String("upload_id", uploadID),
	)

	// Ensure we abort on failure
	var uploadErr error
	defer func() {
		if uploadErr != nil {
			u.logger.Warn("aborting multipart upload due to error",
				zap.String("key", key),
				zap.String("upload_id", uploadID),
				zap.Error(uploadErr),
			)
			abortErr := u.abortMultipartUpload(ctx, key, uploadID)
			if abortErr != nil {
				u.logger.Error("failed to abort multipart upload",
					zap.String("key", key),
					zap.String("upload_id", uploadID),
					zap.Error(abortErr),
				)
			}
		}
	}()

	// Step 2 & 3: Read chunks single-threaded, upload concurrently
	completedParts, uploadErr := u.uploadPartsConcurrently(ctx, key, uploadID, reader, size, partSize, numParts)
	if uploadErr != nil {
		return uploadErr
	}

	// Step 4 & 5: Sort parts and complete upload
	uploadErr = u.completeMultipartUpload(ctx, key, uploadID, completedParts)
	if uploadErr != nil {
		return uploadErr
	}

	u.logger.Info("multipart upload completed successfully",
		zap.String("key", key),
		zap.String("upload_id", uploadID),
		zap.Int("num_parts", numParts),
	)

	return nil
}

// calculateOptimalPartSize calculates the optimal part size based on file size.
// If DynamicPartSize is enabled, it increases part size for very large files
// to avoid exceeding the 10,000 part limit.
func (u *S3Uploader) calculateOptimalPartSize(fileSize int64) int64 {
	partSize := u.config.MultipartConfig.PartSizeBytes

	if !u.config.MultipartConfig.DynamicPartSize {
		return partSize
	}

	// Calculate minimum required part size to stay under 10,000 parts
	minRequiredPartSize := (fileSize + S3MaxParts - 1) / S3MaxParts

	// If minimum required is larger than configured, use the larger one
	if minRequiredPartSize > partSize {
		// But don't exceed max part size
		if minRequiredPartSize > S3MaxPartSize {
			minRequiredPartSize = S3MaxPartSize
		}
		u.logger.Debug("adjusting part size dynamically",
			zap.Int64("original_part_size", partSize),
			zap.Int64("new_part_size", minRequiredPartSize),
			zap.Int64("file_size", fileSize),
		)
		partSize = minRequiredPartSize
	}

	return partSize
}

// calculateNumParts calculates the number of parts needed.
func (u *S3Uploader) calculateNumParts(fileSize int64, partSize int64) int {
	return int((fileSize + partSize - 1) / partSize)
}

// createMultipartUpload initiates a multipart upload.
func (u *S3Uploader) createMultipartUpload(ctx context.Context, key string) (*s3.CreateMultipartUploadOutput, error) {
	var result *s3.CreateMultipartUploadOutput
	var err error

	operation := func() error {
		result, err = u.client.CreateMultipartUpload(ctx, &s3.CreateMultipartUploadInput{
			Bucket: aws.String(u.bucket),
			Key:    aws.String(key),
		})
		return err
	}

	err = u.retryWithBackoff(ctx, operation, "create_multipart", key)
	if err != nil {
		return nil, fmt.Errorf("failed to create multipart upload: %w", err)
	}

	return result, nil
}

// abortMultipartUpload aborts a multipart upload.
func (u *S3Uploader) abortMultipartUpload(ctx context.Context, key string, uploadID string) error {
	operation := func() error {
		_, err := u.client.AbortMultipartUpload(ctx, &s3.AbortMultipartUploadInput{
			Bucket:   aws.String(u.bucket),
			Key:      aws.String(key),
			UploadId: aws.String(uploadID),
		})
		return err
	}

	return u.retryWithBackoff(ctx, operation, "abort_multipart", key)
}

// uploadPartsConcurrently uploads all parts concurrently using a worker pool.
// This ensures:
// 1. Single-threaded reading from the reader
// 2. Concurrent uploading of parts
// 3. Each part has independent retry logic
func (u *S3Uploader) uploadPartsConcurrently(
	ctx context.Context,
	key string,
	uploadID string,
	reader io.ReaderAt,
	fileSize int64,
	partSize int64,
	numParts int,
) ([]CompletedPart, error) {
	// Create task channel
	taskChan := make(chan PartUploadTask, u.config.MultipartConfig.Concurrency*2)
	// Create result channel
	resultChan := make(chan PartUploadResult, numParts)

	// Create worker pool
	var wg sync.WaitGroup
	for i := 0; i < u.config.MultipartConfig.Concurrency; i++ {
		wg.Add(1)
		go u.partUploadWorker(ctx, taskChan, &wg)
	}

	// Single-threaded read and dispatch
	go func() {
		defer close(taskChan)

		for partNum := 1; partNum <= numParts; partNum++ {
			select {
			case <-ctx.Done():
				return
			default:
			}

			// Calculate part boundaries
			offset := int64(partNum-1) * partSize
			remaining := fileSize - offset
			chunkSize := partSize
			if remaining < partSize {
				chunkSize = remaining
			}

			// Read chunk (single-threaded)
			chunk := make([]byte, chunkSize)
			_, err := reader.ReadAt(chunk, offset)
			if err != nil && err != io.EOF {
				u.logger.Error("failed to read chunk",
					zap.String("key", key),
					zap.Int("part_number", partNum),
					zap.Error(err),
				)
				// Send error result
				resultChan <- PartUploadResult{
					PartNumber: int32(partNum),
					ETag:       nil,
					Error:      fmt.Errorf("failed to read chunk: %w", err),
				}
				return
			}

			// Submit task to worker pool
			select {
			case <-ctx.Done():
				return
			case taskChan <- PartUploadTask{
				PartNumber: int32(partNum),
				Data:       chunk,
				UploadID:   uploadID,
				Key:        key,
				ResultChan: resultChan,
			}:
			}
		}
	}()

	// Wait for workers in a separate goroutine
	go func() {
		wg.Wait()
		close(resultChan)
	}()

	// Collect results
	completedParts := make([]CompletedPart, 0, numParts)
	errors := make([]error, 0)

	for result := range resultChan {
		if result.Error != nil {
			errors = append(errors, result.Error)
			u.logger.Error("part upload failed",
				zap.String("key", key),
				zap.String("upload_id", uploadID),
				zap.Int32("part_number", result.PartNumber),
				zap.Error(result.Error),
			)
		} else {
			completedParts = append(completedParts, CompletedPart{
				PartNumber: result.PartNumber,
				ETag:       aws.ToString(result.ETag),
			})
			u.logger.Debug("part uploaded successfully",
				zap.String("key", key),
				zap.String("upload_id", uploadID),
				zap.Int32("part_number", result.PartNumber),
				zap.String("etag", aws.ToString(result.ETag)),
			)
		}
	}

	// Check for errors
	if len(errors) > 0 {
		return nil, fmt.Errorf("%d parts failed to upload", len(errors))
	}

	// Verify all parts are present
	if len(completedParts) != numParts {
		return nil, fmt.Errorf("expected %d parts, but only %d completed", numParts, len(completedParts))
	}

	// Sort parts by PartNumber (required for CompleteMultipartUpload)
	sort.Slice(completedParts, func(i, j int) bool {
		return completedParts[i].PartNumber < completedParts[j].PartNumber
	})

	return completedParts, nil
}

// partUploadWorker is a worker that uploads parts.
func (u *S3Uploader) partUploadWorker(ctx context.Context, taskChan <-chan PartUploadTask, wg *sync.WaitGroup) {
	defer wg.Done()

	for task := range taskChan {
		select {
		case <-ctx.Done():
			return
		default:
		}

		// Upload part with retry
		var result PartUploadResult
		result.PartNumber = task.PartNumber

		operation := func() error {
			uploadOutput, err := u.client.UploadPart(ctx, &s3.UploadPartInput{
				Bucket:     aws.String(u.bucket),
				Key:        aws.String(task.Key),
				UploadId:   aws.String(task.UploadID),
				PartNumber: aws.Int32(task.PartNumber),
				Body:       bytes.NewReader(task.Data),
			})
			if err != nil {
				return err
			}
			result.ETag = uploadOutput.ETag
			return nil
		}

		err := u.retryWithBackoff(ctx, operation, "upload_part", task.Key)
		if err != nil {
			result.Error = err
		}

		// Send result
		select {
		case <-ctx.Done():
			return
		case task.ResultChan <- result:
		}
	}
}

// completeMultipartUpload completes a multipart upload.
func (u *S3Uploader) completeMultipartUpload(
	ctx context.Context,
	key string,
	uploadID string,
	completedParts []CompletedPart,
) error {
	// Convert to S3 CompletedPart type
	s3Parts := make([]types.CompletedPart, len(completedParts))
	for i, part := range completedParts {
		s3Parts[i] = types.CompletedPart{
			PartNumber: aws.Int32(part.PartNumber),
			ETag:       aws.String(part.ETag),
		}
	}

	operation := func() error {
		_, err := u.client.CompleteMultipartUpload(ctx, &s3.CompleteMultipartUploadInput{
			Bucket:          aws.String(u.bucket),
			Key:             aws.String(key),
			UploadId:        aws.String(uploadID),
			MultipartUpload: &types.CompletedMultipartUpload{Parts: s3Parts},
		})
		return err
	}

	err := u.retryWithBackoff(ctx, operation, "complete_multipart", key)
	if err != nil {
		return fmt.Errorf("failed to complete multipart upload: %w", err)
	}

	return nil
}

// Delete removes an object from S3 with exponential backoff retry.
func (u *S3Uploader) Delete(ctx context.Context, key string) error {
	operation := func() error {
		_, err := u.client.DeleteObject(ctx, &s3.DeleteObjectInput{
			Bucket: aws.String(u.bucket),
			Key:    aws.String(key),
		})
		return err
	}

	err := u.retryWithBackoff(ctx, operation, "delete", key)
	if err != nil {
		u.logger.Error("delete failed after retries",
			zap.String("key", key),
			zap.Error(err),
		)
		return err
	}

	u.logger.Info("delete successful",
		zap.String("key", key),
	)
	return nil
}

// Close is a no-op for S3Uploader (kept for interface compatibility).
func (u *S3Uploader) Close() {
	// S3 client doesn't need explicit closing
}

// retryWithBackoff executes an operation with exponential backoff retry.
func (u *S3Uploader) retryWithBackoff(
	ctx context.Context,
	operation func() error,
	opType string,
	key string,
) error {
	var lastErr error

	for attempt := 0; attempt < u.config.RetryConfig.MaxAttempts; attempt++ {
		// Check if context is cancelled before attempting
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		err := operation()
		if err == nil {
			return nil
		}

		lastErr = err
		u.logger.Warn("operation failed, will retry",
			zap.String("type", opType),
			zap.String("key", key),
			zap.Int("attempt", attempt+1),
			zap.Int("max_attempts", u.config.RetryConfig.MaxAttempts),
			zap.Error(err),
		)

		// Don't sleep after the last attempt
		if attempt < u.config.RetryConfig.MaxAttempts-1 {
			delay := u.calculateDelay(attempt)

			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(delay):
				// Continue to next attempt
			}
		}
	}

	return lastErr
}

// calculateDelay computes the exponential backoff delay for a given attempt.
// The delay is: initialDelay * 2^attempt, capped at maxDelay.
func (u *S3Uploader) calculateDelay(attempt int) time.Duration {
	initialDelay := time.Duration(u.config.RetryConfig.InitialDelayMs) * time.Millisecond
	maxDelay := time.Duration(u.config.RetryConfig.MaxDelayMs) * time.Millisecond

	// Exponential backoff: initialDelay * 2^attempt
	delay := initialDelay * (1 << attempt)

	// Cap at max delay
	if delay > maxDelay {
		delay = maxDelay
	}

	return delay
}

// ============================================
// Legacy WorkerPool (kept for backward compatibility)
// ============================================

// Task represents a unit of work for the worker pool.
// This is kept for backward compatibility.
type Task struct {
	// Key is the S3 object key
	Key string
	// Data is the data to upload (nil for delete operations)
	Data []byte
	// IsDelete indicates if this is a delete operation
	IsDelete bool
	// ResultChan is used to notify when the task completes
	ResultChan chan<- error
}

// WorkerPool manages a pool of worker goroutines for concurrent uploads.
// This is kept for backward compatibility.
type WorkerPool struct {
	uploader    Uploader
	taskChan    chan Task
	workerCount int
	logger      *zap.Logger
	wg          WaitGroup
}

// WaitGroup is an interface for sync.WaitGroup to facilitate testing.
type WaitGroup interface {
	Add(delta int)
	Done()
	Wait()
}

// NewWorkerPool creates a new worker pool with the specified number of workers.
func NewWorkerPool(uploader Uploader, workerCount int) *WorkerPool {
	if workerCount <= 0 {
		workerCount = 5 // Default to 5 workers
	}

	return &WorkerPool{
		uploader:    uploader,
		taskChan:    make(chan Task, workerCount*2), // Buffered channel
		workerCount: workerCount,
		logger:      logger.GetLogger(),
		wg:          &syncWaitGroup{},
	}
}

// syncWaitGroup is a wrapper around sync.WaitGroup.
type syncWaitGroup struct {
	internal sync.WaitGroup
}

func (w *syncWaitGroup) Add(delta int) { w.internal.Add(delta) }
func (w *syncWaitGroup) Done()         { w.internal.Done() }
func (w *syncWaitGroup) Wait()         { w.internal.Wait() }

// Start starts the worker pool.
func (p *WorkerPool) Start(ctx context.Context) {
	p.logger.Info("starting worker pool",
		zap.Int("worker_count", p.workerCount),
	)

	for i := 0; i < p.workerCount; i++ {
		p.wg.Add(1)
		go p.worker(ctx, i)
	}
}

// Submit submits a task to the worker pool.
// It returns immediately; the task will be executed asynchronously.
func (p *WorkerPool) Submit(task Task) {
	select {
	case p.taskChan <- task:
		p.logger.Debug("task submitted",
			zap.String("key", task.Key),
			zap.Bool("is_delete", task.IsDelete),
		)
	default:
		// Channel is full, log warning
		p.logger.Warn("task channel full, blocking on submit",
			zap.String("key", task.Key),
		)
		// Block until we can submit
		p.taskChan <- task
	}
}

// Stop stops the worker pool and waits for all workers to finish.
func (p *WorkerPool) Stop() {
	p.logger.Info("stopping worker pool")

	// Close the task channel to signal workers to exit
	close(p.taskChan)

	// Wait for all workers to finish
	p.wg.Wait()

	p.logger.Info("worker pool stopped")
}

// worker is the main loop for a worker goroutine.
func (p *WorkerPool) worker(ctx context.Context, workerID int) {
	defer p.wg.Done()

	p.logger.Debug("worker started", zap.Int("id", workerID))

	for {
		select {
		case <-ctx.Done():
			p.logger.Debug("worker stopping due to context cancellation",
				zap.Int("id", workerID),
			)
			return
		case task, ok := <-p.taskChan:
			if !ok {
				// Channel closed, worker exits
				p.logger.Debug("worker stopping due to closed channel",
					zap.Int("id", workerID),
				)
				return
			}

			p.processTask(ctx, task, workerID)
		}
	}
}

// processTask executes a single task.
func (p *WorkerPool) processTask(ctx context.Context, task Task, workerID int) {
	var err error

	if task.IsDelete {
		err = p.uploader.Delete(ctx, task.Key)
	} else {
		err = p.uploader.Upload(ctx, task.Key, task.Data)
	}

	// Send result if channel is provided
	if task.ResultChan != nil {
		select {
		case task.ResultChan <- err:
		default:
			// Don't block if result channel is full
			p.logger.Warn("result channel full, dropping result",
				zap.String("key", task.Key),
			)
		}
	}
}
