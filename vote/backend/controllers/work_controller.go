package controllers

import (
	"net/http"
	"strconv"

	"vote/config"
	"vote/models"
	"vote/repository"
	"vote/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type WorkWithRank struct {
	models.Work
	Rank int64 `json:"rank"`
}

func GetWorks(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	search := c.Query("search")
	isHotStr := c.Query("is_hot")
	isRecommendStr := c.Query("is_recommend")

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	var isHot *bool
	if isHotStr == "true" {
		val := true
		isHot = &val
	} else if isHotStr == "false" {
		val := false
		isHot = &val
	}

	var isRecommend *bool
	if isRecommendStr == "true" {
		val := true
		isRecommend = &val
	} else if isRecommendStr == "false" {
		val := false
		isRecommend = &val
	}

	var works []models.Work
	var total int64

	if config.AppConfig.TestMode {
		workRepo := repository.GetWorkRepository()
		filteredWorks, err := workRepo.FindWithFilters(search, isHot, isRecommend)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"code":    500,
				"message": "查询失败",
			})
			return
		}

		total = int64(len(filteredWorks))
		
		start := (page - 1) * pageSize
		if start >= len(filteredWorks) {
			works = []models.Work{}
		} else {
			end := start + pageSize
			if end > len(filteredWorks) {
				end = len(filteredWorks)
			}
			works = filteredWorks[start:end]
		}
	} else {
		query := config.DB.Model(&models.Work{})

		if search != "" {
			query = query.Where("title LIKE ? OR description LIKE ?", "%"+search+"%", "%"+search+"%")
		}
		if isHot != nil {
			query = query.Where("is_hot = ?", *isHot)
		}
		if isRecommend != nil {
			query = query.Where("is_recommend = ?", *isRecommend)
		}

		query.Count(&total)

		offset := (page - 1) * pageSize
		query.Order("vote_count DESC, id ASC").Offset(offset).Limit(pageSize).Find(&works)
	}

	ctx := config.GetContext()
	workWithRanks := make([]WorkWithRank, len(works))
	for i, work := range works {
		rank, err := utils.GetRank(ctx, work.ID, false)
		if err != nil {
			rank = -1
		}
		workWithRanks[i] = WorkWithRank{
			Work: work,
			Rank: rank + 1,
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"data": gin.H{
			"list":       workWithRanks,
			"total":      total,
			"page":       page,
			"page_size":  pageSize,
		},
		"message": "success",
	})
}

func GetWorkByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "无效的作品ID",
		})
		return
	}

	var work *models.Work
	
	if config.AppConfig.TestMode {
		workRepo := repository.GetWorkRepository()
		work, err = workRepo.FindByID(uint(id))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"code":    500,
				"message": "查询失败",
			})
			return
		}
	} else {
		var dbWork models.Work
		if err := config.DB.First(&dbWork, id).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusNotFound, gin.H{
					"code":    404,
					"message": "作品不存在",
				})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{
				"code":    500,
				"message": "查询失败",
			})
			return
		}
		work = &dbWork
	}

	if work == nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    404,
			"message": "作品不存在",
		})
		return
	}

	ctx := config.GetContext()
	rank, err := utils.GetRank(ctx, work.ID, false)
	if err != nil {
		rank = -1
	}

	redisVotes, err := utils.GetVoteCount(ctx, work.ID)
	if err == nil && redisVotes > work.VoteCount {
		work.VoteCount = redisVotes
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"data": gin.H{
			"work": work,
			"rank": rank + 1,
		},
		"message": "success",
	})
}
