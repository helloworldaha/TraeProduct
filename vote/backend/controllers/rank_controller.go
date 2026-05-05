package controllers

import (
	"net/http"
	"strconv"

	"vote/config"
	"vote/models"
	"vote/repository"
	"vote/utils"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

type RankItem struct {
	WorkID      uint   `json:"work_id"`
	Title       string `json:"title"`
	ImageURL    string `json:"image_url"`
	VoteCount   int64  `json:"vote_count"`
	Rank        int64  `json:"rank"`
	Trend       string `json:"trend"`
	IsHot       bool   `json:"is_hot"`
	IsRecommend bool   `json:"is_recommend"`
}

func GetRank(c *gin.Context) {
	rankType := c.DefaultQuery("type", "total")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "100"))

	if limit < 1 || limit > 200 {
		limit = 100
	}

	isDaily := rankType == "daily"

	ctx := config.GetContext()
	topN, err := utils.GetTopN(ctx, int64(limit), isDaily)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "获取排行榜失败",
		})
		return
	}

	workIDs := make([]uint, 0, len(topN))
	workVoteMap := make(map[uint]int64)
	for _, z := range topN {
		workIDStr, ok := z.Member.(string)
		if !ok {
			continue
		}
		workID, err := strconv.ParseUint(workIDStr, 10, 64)
		if err != nil {
			continue
		}
		workIDs = append(workIDs, uint(workID))
		workVoteMap[uint(workID)] = int64(z.Score)
	}

	var works []models.Work
	
	if config.AppConfig.TestMode {
		workRepo := repository.GetWorkRepository()
		dbWorks, err := workRepo.FindByIDs(workIDs)
		if err == nil {
			works = dbWorks
		}
	} else {
		if len(workIDs) > 0 {
			config.DB.Where("id IN ?", workIDs).Find(&works)
		}
	}

	workMap := make(map[uint]models.Work)
	for _, work := range works {
		workMap[work.ID] = work
	}

	rankItems := make([]RankItem, 0, len(workIDs))
	for idx, workID := range workIDs {
		work, exists := workMap[workID]
		if !exists {
			continue
		}

		voteCount := workVoteMap[workID]
		if voteCount == 0 {
			voteCount = work.VoteCount
		}

		rankItems = append(rankItems, RankItem{
			WorkID:      work.ID,
			Title:       work.Title,
			ImageURL:    work.ImageURL,
			VoteCount:   voteCount,
			Rank:        int64(idx + 1),
			Trend:       getTrend(),
			IsHot:       work.IsHot,
			IsRecommend: work.IsRecommend,
		})
	}

	var top3 []RankItem
	var rest []RankItem
	if len(rankItems) >= 3 {
		top3 = rankItems[:3]
		rest = rankItems[3:]
	} else {
		top3 = rankItems
		rest = []RankItem{}
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"data": gin.H{
			"type":      rankType,
			"top3":      top3,
			"list":      rest,
			"total":     len(rankItems),
		},
		"message": "success",
	})
}

func SyncVotesToDB(c *gin.Context) {
	ctx := config.GetContext()
	voteCounts, err := utils.SyncVoteCountFromRedisToDB(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "同步失败",
		})
		return
	}

	if config.AppConfig.TestMode {
		workRepo := repository.GetWorkRepository()
		for workID, count := range voteCounts {
			workRepo.UpdateVoteCount(workID, count)
		}
	} else {
		for workID, count := range voteCounts {
			config.DB.Model(&models.Work{}).Where("id = ?", workID).Update("vote_count", count)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    0,
		"data":    gin.H{"synced_count": len(voteCounts)},
		"message": "同步成功",
	})
}

func GetTrendData(c *gin.Context) {
	workIDStr := c.Query("work_id")
	if workIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "缺少作品ID",
		})
		return
	}

	workID, err := strconv.ParseUint(workIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "无效的作品ID",
		})
		return
	}

	ctx := config.GetContext()
	totalRank, err := utils.GetRank(ctx, uint(workID), false)
	if err != nil && err != redis.Nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "获取排名失败",
		})
		return
	}

	dailyRank, err := utils.GetRank(ctx, uint(workID), true)
	if err != nil && err != redis.Nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "获取排名失败",
		})
		return
	}

	voteCount, err := utils.GetVoteCount(ctx, uint(workID))
	if err != nil {
		voteCount = 0
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"data": gin.H{
			"work_id":     workID,
			"vote_count":  voteCount,
			"total_rank":  totalRank + 1,
			"daily_rank":  dailyRank + 1,
			"trend":       getTrend(),
		},
		"message": "success",
	})
}

func getTrend() string {
	trends := []string{"up", "down", "same", "new"}
	return trends[0]
}
