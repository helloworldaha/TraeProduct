package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	TestMode           bool
	Port               string
	DBHost             string
	DBPort             string
	DBUser             string
	DBPassword         string
	DBName             string
	RedisHost          string
	RedisPort          string
	RedisPassword      string
	RedisDB            int
	DailyVoteLimit     int
	IPVoteLimit        int
	DeviceVoteLimit    int
	TimeWindowMinutes  int
	BulkVoteThreshold  int
}

var AppConfig *Config

func LoadConfig() {
	envFile := os.Getenv("ENV_FILE")
	if envFile == "" {
		envFile = ".env"
	}

	err := godotenv.Load(envFile)
	if err != nil {
		log.Printf("Warning: %s file not found: %v", envFile, err)
	}

	AppConfig = &Config{
		TestMode:           getEnvAsBool("TEST_MODE", false),
		Port:               getEnv("PORT", "8080"),
		DBHost:             getEnv("DB_HOST", "localhost"),
		DBPort:             getEnv("DB_PORT", "3306"),
		DBUser:             getEnv("DB_USER", "root"),
		DBPassword:         getEnv("DB_PASSWORD", ""),
		DBName:             getEnv("DB_NAME", "vote_db"),
		RedisHost:          getEnv("REDIS_HOST", "localhost"),
		RedisPort:          getEnv("REDIS_PORT", "6379"),
		RedisPassword:      getEnv("REDIS_PASSWORD", ""),
		RedisDB:            getEnvAsInt("REDIS_DB", 0),
		DailyVoteLimit:     getEnvAsInt("DAILY_VOTE_LIMIT", 10),
		IPVoteLimit:        getEnvAsInt("IP_VOTE_LIMIT", 100),
		DeviceVoteLimit:    getEnvAsInt("DEVICE_VOTE_LIMIT", 20),
		TimeWindowMinutes:  getEnvAsInt("TIME_WINDOW_MINUTES", 10),
		BulkVoteThreshold:  getEnvAsInt("BULK_VOTE_THRESHOLD", 5),
	}
}

func getEnv(key, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultVal
}

func getEnvAsInt(key string, defaultVal int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultVal
}

func getEnvAsBool(key string, defaultVal bool) bool {
	valueStr := getEnv(key, "")
	if valueStr == "" {
		return defaultVal
	}
	value, err := strconv.ParseBool(valueStr)
	if err != nil {
		return defaultVal
	}
	return value
}
