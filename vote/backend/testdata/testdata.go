package testdata

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"vote/models"

	"gorm.io/gorm"
)

type TestWork struct {
	ID          uint      `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	ImageURL    string    `json:"image_url"`
	VideoURL    string    `json:"video_url"`
	VoteCount   int64     `json:"vote_count"`
	IsHot       bool      `json:"is_hot"`
	IsRecommend bool      `json:"is_recommend"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type TestVote struct {
	ID          uint      `json:"id"`
	WorkID      uint      `json:"work_id"`
	IP          string    `json:"ip"`
	DeviceID    string    `json:"device_id"`
	Nickname    string    `json:"nickname"`
	IsAssisted  bool      `json:"is_assisted"`
	ShareLinkID string    `json:"share_link_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func GetTestDataPath() string {
	dir, err := os.Getwd()
	if err != nil {
		return "testdata"
	}
	return filepath.Join(dir, "testdata")
}

func LoadWorks() ([]TestWork, error) {
	testDataPath := GetTestDataPath()
	filePath := filepath.Join(testDataPath, "works.json")

	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read works.json: %w", err)
	}

	var works []TestWork
	if err := json.Unmarshal(data, &works); err != nil {
		return nil, fmt.Errorf("failed to unmarshal works data: %w", err)
	}

	return works, nil
}

func LoadVotes() ([]TestVote, error) {
	testDataPath := GetTestDataPath()
	filePath := filepath.Join(testDataPath, "votes.json")

	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read votes.json: %w", err)
	}

	var votes []TestVote
	if err := json.Unmarshal(data, &votes); err != nil {
		return nil, fmt.Errorf("failed to unmarshal votes data: %w", err)
	}

	return votes, nil
}

func ConvertTestWorkToModel(work TestWork) models.Work {
	return models.Work{
		ID:          work.ID,
		Title:       work.Title,
		Description: work.Description,
		ImageURL:    work.ImageURL,
		VideoURL:    work.VideoURL,
		VoteCount:   work.VoteCount,
		IsHot:       work.IsHot,
		IsRecommend: work.IsRecommend,
		CreatedAt:   work.CreatedAt,
		UpdatedAt:   work.UpdatedAt,
		DeletedAt:   gorm.DeletedAt{},
	}
}

func ConvertTestVoteToModel(vote TestVote) models.Vote {
	return models.Vote{
		ID:          vote.ID,
		WorkID:      vote.WorkID,
		IP:          vote.IP,
		DeviceID:    vote.DeviceID,
		Nickname:    vote.Nickname,
		IsAssisted:  vote.IsAssisted,
		ShareLinkID: vote.ShareLinkID,
		CreatedAt:   vote.CreatedAt,
		UpdatedAt:   vote.UpdatedAt,
		DeletedAt:   gorm.DeletedAt{},
	}
}

func GetMockWorks() []models.Work {
	testWorks, err := LoadWorks()
	if err != nil {
		return getDefaultWorks()
	}

	works := make([]models.Work, len(testWorks))
	for i, w := range testWorks {
		works[i] = ConvertTestWorkToModel(w)
	}
	return works
}

func GetMockVotes() []models.Vote {
	testVotes, err := LoadVotes()
	if err != nil {
		return getDefaultVotes()
	}

	votes := make([]models.Vote, len(testVotes))
	for i, v := range testVotes {
		votes[i] = ConvertTestVoteToModel(v)
	}
	return votes
}

func getDefaultWorks() []models.Work {
	return []models.Work{
		{
			ID:          1,
			Title:       "2024年度最佳科技创新作品 - 智能助手AI",
			Description: "基于深度学习的智能助手系统",
			ImageURL:    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20AI%20robot%20assistant&image_size=square_hd",
			VoteCount:   1523,
			IsHot:       true,
			IsRecommend: true,
		},
		{
			ID:          2,
			Title:       "智能家居控制系统",
			Description: "全自动化智能家居解决方案",
			ImageURL:    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20home%20control%20system&image_size=square_hd",
			VoteCount:   1245,
			IsHot:       true,
			IsRecommend: false,
		},
	}
}

func getDefaultVotes() []models.Vote {
	return []models.Vote{
		{
			ID:       1,
			WorkID:   1,
			IP:       "192.168.1.101",
			DeviceID: "device_001_abc123",
			Nickname: "张小明",
		},
		{
			ID:       2,
			WorkID:   1,
			IP:       "192.168.1.102",
			DeviceID: "device_002_def456",
			Nickname: "李华",
		},
	}
}
