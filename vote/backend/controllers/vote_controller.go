package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"vote/config"
	"vote/models"
	"vote/repository"
	"vote/utils"

	"github.com/gin-gonic/gin"
)

type VoteRequest struct {
	WorkID      uint   `json:"work_id" binding:"required"`
	DeviceID    string `json:"device_id" binding:"required"`
	Nickname    string `json:"nickname"`
	ShareLinkID string `json:"share_link_id"`
	IsAssisted  bool   `json:"is_assisted"`
}

func Vote(c *gin.Context) {
	var req VoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
		return
	}

	clientIP := getClientIP(c)

	var work *models.Work
	
	if config.AppConfig.TestMode {
		workRepo := repository.GetWorkRepository()
		var err error
		work, err = workRepo.FindByID(req.WorkID)
		if err != nil || work == nil {
			c.JSON(http.StatusNotFound, gin.H{
				"code":    404,
				"message": "作品不存在",
			})
			return
		}
	} else {
		var dbWork models.Work
		if err := config.DB.First(&dbWork, req.WorkID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"code":    404,
				"message": "作品不存在",
			})
			return
		}
		work = &dbWork
	}

	ctx := config.GetContext()

	canVote, err := utils.CheckDailyLimit(ctx, req.DeviceID, config.AppConfig.DailyVoteLimit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "系统错误",
		})
		return
	}
	if !canVote {
		c.JSON(http.StatusTooManyRequests, gin.H{
			"code":    429,
			"message": fmt.Sprintf("今日投票次数已达上限（每人每日%d票）", config.AppConfig.DailyVoteLimit),
		})
		return
	}

	canVoteIP, err := utils.CheckIPLimit(ctx, clientIP, config.AppConfig.IPVoteLimit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "系统错误",
		})
		return
	}
	if !canVoteIP {
		c.JSON(http.StatusTooManyRequests, gin.H{
			"code":    429,
			"message": "该IP今日投票次数已达上限",
		})
		return
	}

	isBulkVote, err := utils.CheckBulkVote(ctx, clientIP, config.AppConfig.BulkVoteThreshold, config.AppConfig.TimeWindowMinutes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "系统错误",
		})
		return
	}
	if isBulkVote {
		c.JSON(http.StatusTooManyRequests, gin.H{
			"code":    429,
			"message": "操作过于频繁，请稍后再试",
		})
		return
	}

	err = utils.IncrementVote(ctx, req.WorkID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "投票失败",
		})
		return
	}

	err = utils.IncrementDeviceVote(ctx, req.DeviceID)
	if err != nil {
		fmt.Printf("Warning: Failed to increment device vote: %v\n", err)
	}

	err = utils.IncrementIPVote(ctx, clientIP)
	if err != nil {
		fmt.Printf("Warning: Failed to increment IP vote: %v\n", err)
	}

	vote := models.Vote{
		WorkID:      req.WorkID,
		IP:          clientIP,
		DeviceID:    req.DeviceID,
		Nickname:    req.Nickname,
		IsAssisted:  req.IsAssisted,
		ShareLinkID: req.ShareLinkID,
	}
	
	if config.AppConfig.TestMode {
		voteRepo := repository.GetVoteRepository()
		voteRepo.Create(&vote)
		
		newCount, _ := utils.GetVoteCount(ctx, req.WorkID)
		newRank, _ := utils.GetRank(ctx, req.WorkID, false)
		
		workRepo := repository.GetWorkRepository()
		workRepo.UpdateVoteCount(req.WorkID, newCount)
		
		c.JSON(http.StatusOK, gin.H{
			"code": 0,
			"data": gin.H{
				"vote_count": newCount,
				"rank":       newRank + 1,
				"work_id":    req.WorkID,
			},
			"message": "投票成功",
		})
		return
	}

	config.DB.Create(&vote)

	newCount, _ := utils.GetVoteCount(ctx, req.WorkID)
	newRank, _ := utils.GetRank(ctx, req.WorkID, false)

	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"data": gin.H{
			"vote_count": newCount,
			"rank":       newRank + 1,
			"work_id":    req.WorkID,
		},
		"message": "投票成功",
	})
}

func GetVoteRecords(c *gin.Context) {
	workIDStr := c.Query("work_id")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if limit < 1 || limit > 50 {
		limit = 10
	}

	var votes []models.Vote
	
	if config.AppConfig.TestMode {
		voteRepo := repository.GetVoteRepository()
		if workIDStr != "" {
			workID, err := strconv.ParseUint(workIDStr, 10, 64)
			if err == nil {
				votes, _ = voteRepo.FindByWorkID(uint(workID), limit)
			} else {
				votes, _ = voteRepo.FindAll(limit)
			}
		} else {
			votes, _ = voteRepo.FindAll(limit)
		}
	} else {
		query := config.DB.Model(&models.Vote{}).Order("created_at DESC")

		if workIDStr != "" {
			workID, err := strconv.ParseUint(workIDStr, 10, 64)
			if err == nil {
				query = query.Where("work_id = ?", workID)
			}
		}

		query.Limit(limit).Find(&votes)
	}

	records := make([]models.VoteRecord, len(votes))
	for i, v := range votes {
		records[i] = models.VoteRecord{
			ID:        v.ID,
			WorkID:    v.WorkID,
			Nickname:  v.Nickname,
			CreatedAt: v.CreatedAt,
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    0,
		"data":    records,
		"message": "success",
	})
}

func GetActivityInfo(c *gin.Context) {
	now := time.Now()
	endDate := now.AddDate(0, 1, 0)

	daysLeft := int(endDate.Sub(now).Hours() / 24)

	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"data": gin.H{
			"title":        "2024年度最佳作品评选大赛",
			"subtitle":     "为您喜爱的作品投上宝贵的一票",
			"start_time":   now.Format("2006-01-02 12:00:00"),
			"end_time":     endDate.Format("2006-01-02 12:00:00"),
			"rewards":      []string{"一等奖: 奖金10000元 + 荣誉证书", "二等奖: 奖金5000元 + 荣誉证书", "三等奖: 奖金2000元 + 荣誉证书"},
			"days_left":    daysLeft,
			"hours_left":   int(endDate.Sub(now).Hours()) % 24,
		},
		"message": "success",
	})
}

func getClientIP(c *gin.Context) string {
	ip := c.GetHeader("X-Forwarded-For")
	if ip != "" {
		ips := strings.Split(ip, ",")
		if len(ips) > 0 {
			return strings.TrimSpace(ips[0])
		}
	}

	ip = c.GetHeader("X-Real-IP")
	if ip != "" {
		return ip
	}

	return c.ClientIP()
}
