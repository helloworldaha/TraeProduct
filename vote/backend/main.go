package main

import (
	"log"
	"strconv"

	"vote/config"
	"vote/models"
	"vote/repository"
	"vote/routes"
	"vote/store"
)

func main() {
	config.LoadConfig()

	if config.AppConfig.TestMode {
		log.Println("Running in TEST MODE - using mock data")
		
		store.InitMockRedis()
		
		workRepo := repository.NewMockWorkRepository()
		repository.SetWorkRepository(workRepo)
		repository.SetVoteRepository(repository.NewMockVoteRepository())
		
		initMockRanking(workRepo)
		
		log.Println("Mock data initialized successfully")
	} else {
		log.Println("Running in PRODUCTION MODE - connecting to database")
		config.InitDB()
		config.InitRedis()

		err := config.DB.AutoMigrate(&models.Work{}, &models.Vote{})
		if err != nil {
			log.Fatalf("Failed to migrate database: %v", err)
		}
		log.Println("Database migration completed")

		repository.InitRepository()
	}

	r := routes.SetupRouter()

	port := config.AppConfig.Port
	log.Printf("Server starting on port %s...", port)
	
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func initMockRanking(workRepo *repository.MockWorkRepository) {
	works, err := workRepo.FindAll()
	if err != nil {
		log.Printf("Warning: Failed to load works for ranking: %v", err)
		return
	}
	
	for _, work := range works {
		workIDStr := strconv.FormatUint(uint64(work.ID), 10)
		store.MockRedisInstance.ZAdd("vote:rank:total", float64(work.VoteCount), workIDStr)
		store.MockRedisInstance.HSet("vote:count:"+workIDStr, "count", strconv.FormatInt(work.VoteCount, 10))
	}
	
	log.Printf("Initialized ranking for %d works", len(works))
}
