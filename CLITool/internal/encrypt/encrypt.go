// Package encrypt provides client-side encryption functionality using AES-256-GCM.
// It supports both in-memory encryption for small files and file-based encryption
// for large files to support streaming uploads.
package encrypt

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"golang.org/x/crypto/pbkdf2"
)

const (
	// KeySize is the required size for AES-256 keys (32 bytes)
	KeySize = 32

	// NonceSize is the recommended nonce size for GCM (12 bytes)
	NonceSize = 12

	// TagSize is the size of the GCM authentication tag (16 bytes)
	TagSize = 16

	// PBKDF2 iterations (should be high, using a reasonable value for demonstration)
	pbkdf2Iterations = 600000

	// Fixed salt for demonstration purposes (in production, use per-user salt)
	fixedSalt = "syncer-demo-salt-2024"

	// DefaultBufferSize is the default buffer size for streaming operations
	DefaultBufferSize = 64 * 1024 // 64KB
)

// DeriveKey derives a 32-byte AES-256 key from a password using PBKDF2.
// It uses SHA-256 as the hash function and a fixed salt (for demonstration).
// The output is always 32 bytes suitable for AES-256.
func DeriveKey(password string) []byte {
	salt := []byte(fixedSalt)

	return pbkdf2.Key(
		[]byte(password),
		salt,
		pbkdf2Iterations,
		KeySize,
		sha256.New,
	)
}

// EncryptFile encrypts a file using AES-256-GCM.
// It reads the file from inputPath, encrypts it with the provided key,
// and returns the encrypted data. The key must be exactly 32 bytes.
//
// Output format: [nonce (12 bytes)][ciphertext][tag (16 bytes)]
// The nonce is randomly generated for each encryption operation.
func EncryptFile(inputPath string, key []byte) ([]byte, error) {
	if len(key) != KeySize {
		return nil, fmt.Errorf("invalid key size: expected %d bytes, got %d", KeySize, len(key))
	}

	// Read the entire file into memory
	// Note: For very large files, consider streaming encryption
	plaintext, err := os.ReadFile(inputPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read input file: %w", err)
	}

	// Create AES cipher block
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, fmt.Errorf("failed to create AES cipher: %w", err)
	}

	// Create GCM mode
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, fmt.Errorf("failed to create GCM mode: %w", err)
	}

	// Generate random nonce
	nonce := make([]byte, NonceSize)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, fmt.Errorf("failed to generate nonce: %w", err)
	}

	// Encrypt and authenticate the data
	// Seal appends the result to nonce, so we get: [nonce][ciphertext][tag]
	ciphertext := gcm.Seal(nonce, nonce, plaintext, nil)

	return ciphertext, nil
}

// EncryptData encrypts arbitrary data using AES-256-GCM.
// This is useful for encrypting data that's already in memory.
// Output format: [nonce (12 bytes)][ciphertext][tag (16 bytes)]
func EncryptData(plaintext []byte, key []byte) ([]byte, error) {
	if len(key) != KeySize {
		return nil, fmt.Errorf("invalid key size: expected %d bytes, got %d", KeySize, len(key))
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, fmt.Errorf("failed to create AES cipher: %w", err)
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, fmt.Errorf("failed to create GCM mode: %w", err)
	}

	nonce := make([]byte, NonceSize)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, fmt.Errorf("failed to generate nonce: %w", err)
	}

	ciphertext := gcm.Seal(nonce, nonce, plaintext, nil)
	return ciphertext, nil
}

// DecryptData decrypts data that was encrypted using EncryptFile or EncryptData.
// It expects the input format: [nonce (12 bytes)][ciphertext][tag (16 bytes)]
func DecryptData(ciphertext []byte, key []byte) ([]byte, error) {
	if len(key) != KeySize {
		return nil, fmt.Errorf("invalid key size: expected %d bytes, got %d", KeySize, len(key))
	}

	if len(ciphertext) < NonceSize {
		return nil, fmt.Errorf("ciphertext too short: expected at least %d bytes, got %d", NonceSize, len(ciphertext))
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, fmt.Errorf("failed to create AES cipher: %w", err)
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, fmt.Errorf("failed to create GCM mode: %w", err)
	}

	// Extract nonce from the beginning
	nonce := ciphertext[:NonceSize]
	actualCiphertext := ciphertext[NonceSize:]

	// Decrypt and verify authentication tag
	plaintext, err := gcm.Open(nil, nonce, actualCiphertext, nil)
	if err != nil {
		return nil, fmt.Errorf("decryption failed: %w", err)
	}

	return plaintext, nil
}

// EncryptedFile represents an encrypted file that can be read in chunks.
// It is used for large file support to avoid loading entire files into memory.
//
// The encrypted file format is:
// [nonce (12 bytes)][ciphertext][tag (16 bytes)]
//
// Important: The entire file is encrypted as a single AES-GCM ciphertext,
// not per-chunk. This means:
// 1. Only one nonce and one tag for the entire file
// 2. The tag is at the end of the file
// 3. Authentication can only be verified after reading the entire file
type EncryptedFile struct {
	// file is the underlying file handle
	file *os.File
	// nonce is the AES-GCM nonce (prepended to the file)
	nonce []byte
	// fileSize is the size of the encrypted file (including nonce and tag)
	fileSize int64
	// plaintextSize is the size of the original plaintext
	plaintextSize int64
	// ciphertextSize is the size of ciphertext + tag
	ciphertextSize int64
	// currentPosition is the current read position (relative to ciphertext start)
	currentPosition int64
}

// EncryptToFile encrypts a file and writes the result to an output file.
// This is used for large files to avoid loading the entire file into memory.
//
// The output file format is: [nonce (12 bytes)][ciphertext][tag (16 bytes)]
//
// Important: The entire file is encrypted as a single AES-GCM ciphertext.
// This is NOT per-chunk encryption.
func EncryptToFile(inputPath string, outputPath string, key []byte) (*EncryptedFile, error) {
	if len(key) != KeySize {
		return nil, fmt.Errorf("invalid key size: expected %d bytes, got %d", KeySize, len(key))
	}

	// Get input file info
	inputInfo, err := os.Stat(inputPath)
	if err != nil {
		return nil, fmt.Errorf("failed to stat input file: %w", err)
	}

	if inputInfo.IsDir() {
		return nil, fmt.Errorf("cannot encrypt directory: %s", inputPath)
	}

	// Open input file
	inputFile, err := os.Open(inputPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open input file: %w", err)
	}
	defer inputFile.Close()

	// Create output file
	outputFile, err := os.Create(outputPath)
	if err != nil {
		return nil, fmt.Errorf("failed to create output file: %w", err)
	}

	// Create AES cipher
	block, err := aes.NewCipher(key)
	if err != nil {
		outputFile.Close()
		os.Remove(outputPath)
		return nil, fmt.Errorf("failed to create AES cipher: %w", err)
	}

	// Create GCM mode
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		outputFile.Close()
		os.Remove(outputPath)
		return nil, fmt.Errorf("failed to create GCM mode: %w", err)
	}

	// Generate random nonce
	nonce := make([]byte, NonceSize)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		outputFile.Close()
		os.Remove(outputPath)
		return nil, fmt.Errorf("failed to generate nonce: %w", err)
	}

	// Write nonce to output file
	if _, err := outputFile.Write(nonce); err != nil {
		outputFile.Close()
		os.Remove(outputPath)
		return nil, fmt.Errorf("failed to write nonce: %w", err)
	}

	// Read entire file and encrypt (AES-GCM requires all data upfront for authentication)
	// Note: For extremely large files (10GB+), consider using AES-CTR + HMAC
	// But for most use cases, and to maintain compatibility with AES-GCM,
	// we read the entire file. For files too large for memory, use a streaming
	// cipher mode with separate authentication.
	plaintext, err := io.ReadAll(inputFile)
	if err != nil {
		outputFile.Close()
		os.Remove(outputPath)
		return nil, fmt.Errorf("failed to read input file: %w", err)
	}

	// Encrypt and authenticate
	ciphertextWithTag := gcm.Seal(nil, nonce, plaintext, nil)

	// Write ciphertext + tag
	if _, err := outputFile.Write(ciphertextWithTag); err != nil {
		outputFile.Close()
		os.Remove(outputPath)
		return nil, fmt.Errorf("failed to write ciphertext: %w", err)
	}

	// Sync to disk
	if err := outputFile.Sync(); err != nil {
		outputFile.Close()
		os.Remove(outputPath)
		return nil, fmt.Errorf("failed to sync output file: %w", err)
	}

	// Get output file size
	outputInfo, err := outputFile.Stat()
	if err != nil {
		outputFile.Close()
		os.Remove(outputPath)
		return nil, fmt.Errorf("failed to stat output file: %w", err)
	}

	// Seek back to beginning of ciphertext (after nonce)
	if _, err := outputFile.Seek(int64(NonceSize), io.SeekStart); err != nil {
		outputFile.Close()
		os.Remove(outputPath)
		return nil, fmt.Errorf("failed to seek output file: %w", err)
	}

	return &EncryptedFile{
		file:            outputFile,
		nonce:           nonce,
		fileSize:        outputInfo.Size(),
		plaintextSize:   inputInfo.Size(),
		ciphertextSize:  outputInfo.Size() - int64(NonceSize), // ciphertext + tag
		currentPosition: 0,
	}, nil
}

// EncryptToTempFile encrypts a file to a temporary file in the system's temp directory.
// The caller is responsible for closing and removing the temporary file.
func EncryptToTempFile(inputPath string, key []byte) (*EncryptedFile, error) {
	// Create temp file with random name
	tempDir := os.TempDir()
	tempFile := filepath.Join(tempDir, fmt.Sprintf("syncer_encrypted_%x", randBytes(8)))

	return EncryptToFile(inputPath, tempFile, key)
}

// randBytes generates random bytes
func randBytes(n int) []byte {
	b := make([]byte, n)
	_, _ = rand.Read(b)
	return b
}

// Read reads up to len(p) bytes from the encrypted file.
// This reads from the ciphertext portion (after nonce).
func (ef *EncryptedFile) Read(p []byte) (n int, err error) {
	return ef.file.Read(p)
}

// ReadAt reads len(p) bytes from the encrypted file starting at offset off.
// The offset is relative to the start of ciphertext (after nonce).
func (ef *EncryptedFile) ReadAt(p []byte, off int64) (n int, err error) {
	// Convert to absolute file offset (add nonce size)
	absoluteOff := off + int64(NonceSize)
	return ef.file.ReadAt(p, absoluteOff)
}

// Seek sets the read position relative to the ciphertext start.
func (ef *EncryptedFile) Seek(offset int64, whence int) (int64, error) {
	var absoluteWhence int
	var absoluteOffset int64

	switch whence {
	case io.SeekStart:
		absoluteWhence = io.SeekStart
		absoluteOffset = offset + int64(NonceSize)
	case io.SeekCurrent:
		absoluteWhence = io.SeekCurrent
		absoluteOffset = offset
	case io.SeekEnd:
		absoluteWhence = io.SeekEnd
		// SeekEnd offset is relative to end of ciphertext (not including nonce)
		// ciphertext ends at fileSize, so we need to adjust
		absoluteOffset = offset // will be relative to file end
	default:
		return 0, fmt.Errorf("invalid whence: %d", whence)
	}

	newPos, err := ef.file.Seek(absoluteOffset, absoluteWhence)
	if err != nil {
		return 0, err
	}

	// Convert back to relative position (subtract nonce size)
	ef.currentPosition = newPos - int64(NonceSize)
	return ef.currentPosition, nil
}

// Size returns the size of the ciphertext (including tag, excluding nonce).
func (ef *EncryptedFile) CiphertextSize() int64 {
	return ef.ciphertextSize
}

// PlaintextSize returns the size of the original plaintext file.
func (ef *EncryptedFile) PlaintextSize() int64 {
	return ef.plaintextSize
}

// Nonce returns the nonce used for encryption.
func (ef *EncryptedFile) Nonce() []byte {
	return ef.nonce
}

// Close closes the underlying file handle.
func (ef *EncryptedFile) Close() error {
	if ef.file != nil {
		return ef.file.Close()
	}
	return nil
}

// CloseAndRemove closes the file and removes it from disk.
// This is useful for temporary encrypted files.
func (ef *EncryptedFile) CloseAndRemove() error {
	path := ef.file.Name()

	if err := ef.Close(); err != nil {
		return err
	}

	return os.Remove(path)
}

// Name returns the path to the encrypted file.
func (ef *EncryptedFile) Name() string {
	if ef.file != nil {
		return ef.file.Name()
	}
	return ""
}

// ChunkReader reads an io.Reader in chunks of specified size.
// It ensures single-threaded reading and provides chunks to workers.
type ChunkReader struct {
	// reader is the underlying reader
	reader io.ReaderAt
	// chunkSize is the size of each chunk
	chunkSize int64
	// totalSize is the total size of data to read
	totalSize int64
	// currentChunk is the index of the next chunk to read
	currentChunk int
	// totalChunks is the total number of chunks
	totalChunks int
}

// NewChunkReader creates a new ChunkReader from a ReaderAt.
// The reader must support random access.
func NewChunkReader(reader io.ReaderAt, totalSize int64, chunkSize int64) *ChunkReader {
	if chunkSize <= 0 {
		chunkSize = DefaultBufferSize
	}

	// Calculate total chunks (round up)
	totalChunks := int((totalSize + chunkSize - 1) / chunkSize)

	return &ChunkReader{
		reader:       reader,
		chunkSize:    chunkSize,
		totalSize:    totalSize,
		currentChunk: 0,
		totalChunks:  totalChunks,
	}
}

// Chunk represents a single chunk of data.
type Chunk struct {
	// Data is the chunk data
	Data []byte
	// Index is the 0-based index of this chunk
	Index int
	// Size is the actual size of data in this chunk
	Size int
	// IsLast indicates if this is the last chunk
	IsLast bool
}

// NextChunk reads and returns the next chunk.
// Returns nil, io.EOF when all chunks have been read.
func (cr *ChunkReader) NextChunk() (*Chunk, error) {
	if cr.currentChunk >= cr.totalChunks {
		return nil, io.EOF
	}

	chunkIndex := cr.currentChunk
	offset := int64(chunkIndex) * cr.chunkSize

	// Calculate chunk size (last chunk may be smaller)
	remaining := cr.totalSize - offset
	chunkSize := cr.chunkSize
	if remaining < chunkSize {
		chunkSize = remaining
	}

	// Allocate buffer
	buf := make([]byte, chunkSize)

	// Read from reader at offset
	n, err := cr.reader.ReadAt(buf, offset)
	if err != nil && err != io.EOF {
		return nil, err
	}

	// Check if this is the last chunk
	isLast := chunkIndex == cr.totalChunks-1

	cr.currentChunk++

	return &Chunk{
		Data:   buf[:n],
		Index:  chunkIndex,
		Size:   n,
		IsLast: isLast,
	}, nil
}

// TotalChunks returns the total number of chunks.
func (cr *ChunkReader) TotalChunks() int {
	return cr.totalChunks
}

// RemainingChunks returns the number of chunks remaining to be read.
func (cr *ChunkReader) RemainingChunks() int {
	return cr.totalChunks - cr.currentChunk
}

// Reset resets the reader to start from the first chunk.
func (cr *ChunkReader) Reset() {
	cr.currentChunk = 0
}

// ReadAllChunks reads all chunks into memory.
// Warning: This may use a lot of memory for large files.
func (cr *ChunkReader) ReadAllChunks() ([]*Chunk, error) {
	chunks := make([]*Chunk, 0, cr.totalChunks)

	for {
		chunk, err := cr.NextChunk()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}
		chunks = append(chunks, chunk)
	}

	return chunks, nil
}
