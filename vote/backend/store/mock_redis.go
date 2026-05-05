package store

import (
	"sort"
	"strconv"
	"sync"
	"time"
)

type ZSet struct {
	Members map[string]float64
}

type Z struct {
	Score  float64
	Member interface{}
}

type MockRedis struct {
	zsetMutex sync.RWMutex
	zsets     map[string]*ZSet

	kvMutex  sync.RWMutex
	kvStore  map[string]string
	kvExpire map[string]time.Time

	hashMutex sync.RWMutex
	hashStore map[string]map[string]string
}

var MockRedisInstance *MockRedis

func InitMockRedis() {
	MockRedisInstance = &MockRedis{
		zsets:     make(map[string]*ZSet),
		kvStore:   make(map[string]string),
		kvExpire:  make(map[string]time.Time),
		hashStore: make(map[string]map[string]string),
	}
}

func (m *MockRedis) getZSet(key string) *ZSet {
	if m.zsets[key] == nil {
		m.zsets[key] = &ZSet{
			Members: make(map[string]float64),
		}
	}
	return m.zsets[key]
}

func (m *MockRedis) getHash(key string) map[string]string {
	if m.hashStore[key] == nil {
		m.hashStore[key] = make(map[string]string)
	}
	return m.hashStore[key]
}

func (m *MockRedis) cleanupExpired() {
	now := time.Now()
	for key, expireTime := range m.kvExpire {
		if now.After(expireTime) {
			delete(m.kvStore, key)
			delete(m.kvExpire, key)
		}
	}
}

func (m *MockRedis) ZIncrBy(key string, increment float64, member string) float64 {
	m.zsetMutex.Lock()
	defer m.zsetMutex.Unlock()

	zset := m.getZSet(key)
	zset.Members[member] += increment
	return zset.Members[member]
}

func (m *MockRedis) ZRevRangeWithScores(key string, start, stop int64) []Z {
	m.zsetMutex.RLock()
	defer m.zsetMutex.RUnlock()

	zset := m.zsets[key]
	if zset == nil || len(zset.Members) == 0 {
		return []Z{}
	}

	type memberScore struct {
		member string
		score  float64
	}

	msList := make([]memberScore, 0, len(zset.Members))
	for m, s := range zset.Members {
		msList = append(msList, memberScore{member: m, score: s})
	}

	sort.Slice(msList, func(i, j int) bool {
		if msList[i].score == msList[j].score {
			return msList[i].member < msList[j].member
		}
		return msList[i].score > msList[j].score
	})

	if stop == -1 || int(stop) >= len(msList) {
		stop = int64(len(msList) - 1)
	}

	result := make([]Z, 0)
	for i := start; i <= stop && int(i) < len(msList); i++ {
		result = append(result, Z{
			Score:  msList[i].score,
			Member: msList[i].member,
		})
	}

	return result
}

func (m *MockRedis) ZRevRank(key string, member string) (int64, bool) {
	m.zsetMutex.RLock()
	defer m.zsetMutex.RUnlock()

	zset := m.zsets[key]
	if zset == nil {
		return -1, false
	}

	_, exists := zset.Members[member]
	if !exists {
		return -1, false
	}

	type memberScore struct {
		member string
		score  float64
	}

	msList := make([]memberScore, 0, len(zset.Members))
	for m, s := range zset.Members {
		msList = append(msList, memberScore{member: m, score: s})
	}

	sort.Slice(msList, func(i, j int) bool {
		if msList[i].score == msList[j].score {
			return msList[i].member < msList[j].member
		}
		return msList[i].score > msList[j].score
	})

	for i, ms := range msList {
		if ms.member == member {
			return int64(i), true
		}
	}

	return -1, false
}

func (m *MockRedis) HIncrBy(key, field string, increment int64) int64 {
	m.hashMutex.Lock()
	defer m.hashMutex.Unlock()

	hash := m.getHash(key)
	current, _ := strconv.ParseInt(hash[field], 10, 64)
	newVal := current + increment
	hash[field] = strconv.FormatInt(newVal, 10)
	return newVal
}

func (m *MockRedis) HGet(key, field string) (string, bool) {
	m.hashMutex.RLock()
	defer m.hashMutex.RUnlock()

	hash := m.hashStore[key]
	if hash == nil {
		return "", false
	}
	val, exists := hash[field]
	return val, exists
}

func (m *MockRedis) HSet(key, field, value string) {
	m.hashMutex.Lock()
	defer m.hashMutex.Unlock()

	hash := m.getHash(key)
	hash[field] = value
}

func (m *MockRedis) Get(key string) (string, bool) {
	m.kvMutex.RLock()
	defer m.kvMutex.RUnlock()

	m.cleanupExpired()

	val, exists := m.kvStore[key]
	return val, exists
}

func (m *MockRedis) Set(key, value string) {
	m.kvMutex.Lock()
	defer m.kvMutex.Unlock()

	m.kvStore[key] = value
}

func (m *MockRedis) SetEx(key, value string, expiration time.Duration) {
	m.kvMutex.Lock()
	defer m.kvMutex.Unlock()

	m.kvStore[key] = value
	m.kvExpire[key] = time.Now().Add(expiration)
}

func (m *MockRedis) Incr(key string) int64 {
	m.kvMutex.Lock()
	defer m.kvMutex.Unlock()

	current, _ := strconv.ParseInt(m.kvStore[key], 10, 64)
	newVal := current + 1
	m.kvStore[key] = strconv.FormatInt(newVal, 10)
	return newVal
}

func (m *MockRedis) IncrEx(key string, expiration time.Duration) int64 {
	m.kvMutex.Lock()
	defer m.kvMutex.Unlock()

	current, _ := strconv.ParseInt(m.kvStore[key], 10, 64)
	newVal := current + 1
	m.kvStore[key] = strconv.FormatInt(newVal, 10)
	m.kvExpire[key] = time.Now().Add(expiration)
	return newVal
}

func (m *MockRedis) ZAdd(key string, score float64, member string) {
	m.zsetMutex.Lock()
	defer m.zsetMutex.Unlock()

	zset := m.getZSet(key)
	zset.Members[member] = score
}

func (m *MockRedis) ZRemRangeByScore(key string, min, max string) int64 {
	m.zsetMutex.Lock()
	defer m.zsetMutex.Unlock()

	zset := m.zsets[key]
	if zset == nil {
		return 0
	}

	minScore, _ := strconv.ParseFloat(min, 64)
	maxScore, _ := strconv.ParseFloat(max, 64)

	count := 0
	for member, score := range zset.Members {
		if score >= minScore && score <= maxScore {
			delete(zset.Members, member)
			count++
		}
	}

	return int64(count)
}

func (m *MockRedis) ZCard(key string) int64 {
	m.zsetMutex.RLock()
	defer m.zsetMutex.RUnlock()

	zset := m.zsets[key]
	if zset == nil {
		return 0
	}

	return int64(len(zset.Members))
}
