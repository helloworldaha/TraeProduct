// Package logger provides a structured logging wrapper using zap.
// It offers a singleton logger instance with configurable log levels.
package logger

import (
	"os"
	"sync"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var (
	instance *zap.Logger
	once     sync.Once
	mu       sync.RWMutex
)

// LogLevel represents the logging severity level.
type LogLevel string

const (
	DebugLevel LogLevel = "debug"
	InfoLevel  LogLevel = "info"
	WarnLevel  LogLevel = "warn"
	ErrorLevel LogLevel = "error"
)

// Init initializes the global logger with the specified log level.
// It is safe to call Init multiple times, but only the first call will initialize the logger.
// If Init is not called explicitly, GetLogger will automatically initialize with InfoLevel.
func Init(level LogLevel) {
	once.Do(func() {
		initLogger(level)
	})
}

// initLogger creates a new zap logger instance with the specified configuration.
func initLogger(level LogLevel) {
	zapLevel := toZapLevel(level)

	encoderConfig := zapcore.EncoderConfig{
		TimeKey:        "time",
		LevelKey:       "level",
		NameKey:        "logger",
		CallerKey:      "caller",
		MessageKey:     "msg",
		StacktraceKey:  "stacktrace",
		LineEnding:     zapcore.DefaultLineEnding,
		EncodeLevel:    zapcore.LowercaseLevelEncoder,
		EncodeTime:     zapcore.ISO8601TimeEncoder,
		EncodeDuration: zapcore.StringDurationEncoder,
		EncodeCaller:   zapcore.ShortCallerEncoder,
	}

	core := zapcore.NewCore(
		zapcore.NewJSONEncoder(encoderConfig),
		zapcore.AddSync(os.Stdout),
		zap.NewAtomicLevelAt(zapLevel),
	)

	instance = zap.New(core, zap.AddCaller(), zap.AddStacktrace(zapcore.ErrorLevel))
}

// toZapLevel converts LogLevel to zapcore.Level.
func toZapLevel(level LogLevel) zapcore.Level {
	switch level {
	case DebugLevel:
		return zapcore.DebugLevel
	case InfoLevel:
		return zapcore.InfoLevel
	case WarnLevel:
		return zapcore.WarnLevel
	case ErrorLevel:
		return zapcore.ErrorLevel
	default:
		return zapcore.InfoLevel
	}
}

// GetLogger returns the global logger instance.
// If the logger hasn't been initialized, it will be initialized with InfoLevel.
func GetLogger() *zap.Logger {
	mu.RLock()
	if instance != nil {
		mu.RUnlock()
		return instance
	}
	mu.RUnlock()

	// Double-checked locking pattern
	mu.Lock()
	defer mu.Unlock()
	if instance == nil {
		initLogger(InfoLevel)
	}
	return instance
}

// Sync flushes any buffered log entries.
// Applications should call Sync before exiting.
func Sync() {
	if instance != nil {
		_ = instance.Sync()
	}
}
