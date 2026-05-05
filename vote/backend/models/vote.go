package models

import (
	"time"

	"gorm.io/gorm"
)

type Vote struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	WorkID      uint           `json:"work_id" gorm:"not null;index"`
	IP          string         `json:"ip" gorm:"type:varchar(45);index"`
	DeviceID    string         `json:"device_id" gorm:"type:varchar(255);index"`
	Nickname    string         `json:"nickname" gorm:"type:varchar(100)"`
	IsAssisted  bool           `json:"is_assisted" gorm:"default:false"`
	ShareLinkID string         `json:"share_link_id" gorm:"type:varchar(255);index"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

func (Vote) TableName() string {
	return "votes"
}

type VoteRecord struct {
	ID        uint      `json:"id"`
	WorkID    uint      `json:"work_id"`
	Nickname  string    `json:"nickname"`
	CreatedAt time.Time `json:"created_at"`
}
