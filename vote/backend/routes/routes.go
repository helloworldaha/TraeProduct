package routes

import (
	"vote/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(CORSMiddleware())

	api := r.Group("/api")
	{
		api.GET("/activity", controllers.GetActivityInfo)
		
		api.GET("/works", controllers.GetWorks)
		api.GET("/works/:id", controllers.GetWorkByID)
		
		api.POST("/vote", controllers.Vote)
		api.GET("/vote-records", controllers.GetVoteRecords)
		
		api.GET("/rank", controllers.GetRank)
		api.GET("/trend", controllers.GetTrendData)
		
		api.POST("/sync-votes", controllers.SyncVotesToDB)
	}

	return r
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
