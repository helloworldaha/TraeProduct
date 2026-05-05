package repository

import (
	"errors"
	"strings"

	"vote/config"
	"vote/models"

	"gorm.io/gorm"
)

type DBWorkRepository struct {
	db *gorm.DB
}

type DBVoteRepository struct {
	db *gorm.DB
}

func NewDBWorkRepository() *DBWorkRepository {
	return &DBWorkRepository{db: config.DB}
}

func NewDBVoteRepository() *DBVoteRepository {
	return &DBVoteRepository{db: config.DB}
}

func (r *DBWorkRepository) FindAll() ([]models.Work, error) {
	var works []models.Work
	err := r.db.Order("vote_count DESC, id ASC").Find(&works).Error
	return works, err
}

func (r *DBWorkRepository) FindByID(id uint) (*models.Work, error) {
	var work models.Work
	err := r.db.First(&work, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &work, nil
}

func (r *DBWorkRepository) FindWithFilters(search string, isHot, isRecommend *bool) ([]models.Work, error) {
	query := r.db.Model(&models.Work{})

	if search != "" {
		searchPattern := "%" + strings.TrimSpace(search) + "%"
		query = query.Where("title LIKE ? OR description LIKE ?", searchPattern, searchPattern)
	}

	if isHot != nil {
		query = query.Where("is_hot = ?", *isHot)
	}

	if isRecommend != nil {
		query = query.Where("is_recommend = ?", *isRecommend)
	}

	var works []models.Work
	err := query.Order("vote_count DESC, id ASC").Find(&works).Error
	return works, err
}

func (r *DBWorkRepository) FindByIDs(ids []uint) ([]models.Work, error) {
	var works []models.Work
	if len(ids) == 0 {
		return works, nil
	}
	err := r.db.Where("id IN ?", ids).Find(&works).Error
	return works, err
}

func (r *DBWorkRepository) UpdateVoteCount(id uint, count int64) error {
	return r.db.Model(&models.Work{}).Where("id = ?", id).Update("vote_count", count).Error
}

func (r *DBVoteRepository) Create(vote *models.Vote) error {
	return r.db.Create(vote).Error
}

func (r *DBVoteRepository) FindByWorkID(workID uint, limit int) ([]models.Vote, error) {
	var votes []models.Vote
	err := r.db.Where("work_id = ?", workID).Order("created_at DESC").Limit(limit).Find(&votes).Error
	return votes, err
}

func (r *DBVoteRepository) FindAll(limit int) ([]models.Vote, error) {
	var votes []models.Vote
	err := r.db.Order("created_at DESC").Limit(limit).Find(&votes).Error
	return votes, err
}
