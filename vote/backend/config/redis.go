package config

import (
	"context"
	"fmt"
	"log"

	"github.com/go-redis/redis/v8"
)

var RedisClient *redis.Client
var Ctx = context.Background()

func InitRedis() {
	if AppConfig.TestMode {
		log.Println("Test mode: Using in-memory store instead of Redis")
		return
	}

	RedisClient = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", AppConfig.RedisHost, AppConfig.RedisPort),
		Password: AppConfig.RedisPassword,
		DB:       AppConfig.RedisDB,
	})

	_, err := RedisClient.Ping(Ctx).Result()
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}

	log.Println("Redis connection established successfully")
}

func GetRedis() *redis.Client {
	return RedisClient
}

func GetContext() context.Context {
	return Ctx
}
