package models

import (
	"time"

	"gorm.io/gorm"
)

type Work struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Title       string         `json:"title" gorm:"type:varchar(255);not null"`
	Description string         `json:"description" gorm:"type:text"`
	ImageURL    string         `json:"image_url" gorm:"type:varchar(500)"`
	VideoURL    string         `json:"video_url" gorm:"type:varchar(500)"`
	VoteCount   int64          `json:"vote_count" gorm:"default:0"`
	IsHot       bool           `json:"is_hot" gorm:"default:false"`
	IsRecommend bool           `json:"is_recommend" gorm:"default:false"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

func (Work) TableName() string {
	return "works"
}
