package utils

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"vote/config"
	"vote/store"

	"github.com/go-redis/redis/v8"
)

const (
	RankKeyTotal    = "vote:rank:total"
	RankKeyDaily   = "vote:rank:daily"
	VoteCountKey  = "vote:count:"
	IPVoteKey     = "vote:ip:"
	DeviceVoteKey = "vote:device:"
	RecentVoteKey = "vote:recent:"
)

func getTodayKey() string {
	return time.Now().Format("20060102")
}

func getDailyRankKey() string {
	return fmt.Sprintf("%s:%s", RankKeyDaily, getTodayKey())
}

func IncrementVote(ctx context.Context, workID uint) error {
	if config.AppConfig.TestMode {
		workIDStr := strconv.FormatUint(uint64(workID), 10)
		store.MockRedisInstance.ZIncrBy(RankKeyTotal, 1, workIDStr)
		store.MockRedisInstance.ZIncrBy(getDailyRankKey(), 1, workIDStr)
		store.MockRedisInstance.HIncrBy(VoteCountKey+workIDStr, "count", 1)
		return nil
	}

	workIDStr := strconv.FormatUint(uint64(workID), 10)
	
	pipe := config.RedisClient.TxPipeline()
	
	pipe.ZIncrBy(ctx, RankKeyTotal, 1, workIDStr)
	pipe.ZIncrBy(ctx, getDailyRankKey(), 1, workIDStr)
	pipe.HIncrBy(ctx, VoteCountKey+workIDStr, "count", 1)
	
	_, err := pipe.Exec(ctx)
	return err
}

func GetTopN(ctx context.Context, n int64, isDaily bool) ([]redis.Z, error) {
	key := RankKeyTotal
	if isDaily {
		key = getDailyRankKey()
	}
	
	if config.AppConfig.TestMode {
		mockResults := store.MockRedisInstance.ZRevRangeWithScores(key, 0, n-1)
		results := make([]redis.Z, len(mockResults))
		for i, z := range mockResults {
			results[i] = redis.Z{
				Score:  z.Score,
				Member: z.Member,
			}
		}
		return results, nil
	}
	
	return config.RedisClient.ZRevRangeWithScores(ctx, key, 0, n-1).Result()
}

func GetRank(ctx context.Context, workID uint, isDaily bool) (int64, error) {
	workIDStr := strconv.FormatUint(uint64(workID), 10)
	key := RankKeyTotal
	if isDaily {
		key = getDailyRankKey()
	}
	
	if config.AppConfig.TestMode {
		rank, exists := store.MockRedisInstance.ZRevRank(key, workIDStr)
		if !exists {
			return -1, nil
		}
		return rank, nil
	}
	
	rank, err := config.RedisClient.ZRevRank(ctx, key, workIDStr).Result()
	if err == redis.Nil {
		return -1, nil
	}
	return rank, err
}

func GetVoteCount(ctx context.Context, workID uint) (int64, error) {
	workIDStr := strconv.FormatUint(uint64(workID), 10)
	
	if config.AppConfig.TestMode {
		val, exists := store.MockRedisInstance.HGet(VoteCountKey+workIDStr, "count")
		if !exists {
			return 0, nil
		}
		return strconv.ParseInt(val, 10, 64)
	}
	
	count, err := config.RedisClient.HGet(ctx, VoteCountKey+workIDStr, "count").Result()
	if err == redis.Nil {
		return 0, nil
	}
	if err != nil {
		return 0, err
	}
	
	return strconv.ParseInt(count, 10, 64)
}

func CheckDailyLimit(ctx context.Context, deviceID string, limit int) (bool, error) {
	key := fmt.Sprintf("%s:%s:%s", DeviceVoteKey, getTodayKey(), deviceID)
	
	if config.AppConfig.TestMode {
		val, exists := store.MockRedisInstance.Get(key)
		if !exists {
			return true, nil
		}
		count, _ := strconv.Atoi(val)
		return count < limit, nil
	}
	
	count, err := config.RedisClient.Get(ctx, key).Int()
	if err == redis.Nil {
		return true, nil
	}
	if err != nil {
		return false, err
	}
	
	return count < limit, nil
}

func IncrementDeviceVote(ctx context.Context, deviceID string) error {
	key := fmt.Sprintf("%s:%s:%s", DeviceVoteKey, getTodayKey(), deviceID)
	
	if config.AppConfig.TestMode {
		store.MockRedisInstance.IncrEx(key, 24*time.Hour)
		return nil
	}
	
	pipe := config.RedisClient.TxPipeline()
	pipe.Incr(ctx, key)
	pipe.Expire(ctx, key, 24*time.Hour)
	
	_, err := pipe.Exec(ctx)
	return err
}

func CheckIPLimit(ctx context.Context, ip string, limit int) (bool, error) {
	key := fmt.Sprintf("%s:%s:%s", IPVoteKey, getTodayKey(), ip)
	
	if config.AppConfig.TestMode {
		val, exists := store.MockRedisInstance.Get(key)
		if !exists {
			return true, nil
		}
		count, _ := strconv.Atoi(val)
		return count < limit, nil
	}
	
	count, err := config.RedisClient.Get(ctx, key).Int()
	if err == redis.Nil {
		return true, nil
	}
	if err != nil {
		return false, err
	}
	
	return count < limit, nil
}

func IncrementIPVote(ctx context.Context, ip string) error {
	key := fmt.Sprintf("%s:%s:%s", IPVoteKey, getTodayKey(), ip)
	
	if config.AppConfig.TestMode {
		store.MockRedisInstance.IncrEx(key, 24*time.Hour)
		return nil
	}
	
	pipe := config.RedisClient.TxPipeline()
	pipe.Incr(ctx, key)
	pipe.Expire(ctx, key, 24*time.Hour)
	
	_, err := pipe.Exec(ctx)
	return err
}

func CheckBulkVote(ctx context.Context, ip string, threshold int, windowMinutes int) (bool, error) {
	key := fmt.Sprintf("%s:%s", RecentVoteKey, ip)
	
	if config.AppConfig.TestMode {
		now := float64(time.Now().Unix())
		cutoff := now - float64(windowMinutes*60)
		
		store.MockRedisInstance.ZRemRangeByScore(key, "0", fmt.Sprintf("%f", cutoff))
		store.MockRedisInstance.ZAdd(key, now, fmt.Sprintf("%f", now))
		count := store.MockRedisInstance.ZCard(key)
		
		return int(count) >= threshold, nil
	}
	
	now := float64(time.Now().Unix())
	cutoff := now - float64(windowMinutes*60)
	
	pipe := config.RedisClient.TxPipeline()
	pipe.ZRemRangeByScore(ctx, key, "0", fmt.Sprintf("%f", cutoff))
	pipe.ZAdd(ctx, key, &redis.Z{Score: now, Member: now})
	pipe.Expire(ctx, key, time.Duration(windowMinutes)*time.Minute)
	countCmd := pipe.ZCard(ctx, key)
	
	_, err := pipe.Exec(ctx)
	if err != nil {
		return false, err
	}
	
	count := countCmd.Val()
	return int(count) >= threshold, nil
}

func SyncVoteCountFromRedisToDB(ctx context.Context) (map[uint]int64, error) {
	if config.AppConfig.TestMode {
		results := store.MockRedisInstance.ZRevRangeWithScores(RankKeyTotal, 0, -1)
		voteCounts := make(map[uint]int64)
		for _, z := range results {
			workIDStr, ok := z.Member.(string)
			if !ok {
				continue
			}
			workID, err := strconv.ParseUint(workIDStr, 10, 64)
			if err != nil {
				continue
			}
			voteCounts[uint(workID)] = int64(z.Score)
		}
		return voteCounts, nil
	}

	results, err := config.RedisClient.ZRevRangeWithScores(ctx, RankKeyTotal, 0, -1).Result()
	if err != nil {
		return nil, err
	}
	
	voteCounts := make(map[uint]int64)
	for _, z := range results {
		workIDStr, ok := z.Member.(string)
		if !ok {
			continue
		}
		workID, err := strconv.ParseUint(workIDStr, 10, 64)
		if err != nil {
			continue
		}
		voteCounts[uint(workID)] = int64(z.Score)
	}
	
	return voteCounts, nil
}

func InitWorkRank(ctx context.Context, workID uint, initialVotes int64) error {
	workIDStr := strconv.FormatUint(uint64(workID), 10)
	
	if config.AppConfig.TestMode {
		store.MockRedisInstance.ZAdd(RankKeyTotal, float64(initialVotes), workIDStr)
		store.MockRedisInstance.HSet(VoteCountKey+workIDStr, "count", strconv.FormatInt(initialVotes, 10))
		return nil
	}
	
	pipe := config.RedisClient.TxPipeline()
	pipe.ZAdd(ctx, RankKeyTotal, &redis.Z{Score: float64(initialVotes), Member: workIDStr})
	pipe.HSet(ctx, VoteCountKey+workIDStr, "count", initialVotes)
	
	_, err := pipe.Exec(ctx)
	return err
}
