package repository

import (
	"vote/models"
)

type WorkRepository interface {
	FindAll() ([]models.Work, error)
	FindByID(id uint) (*models.Work, error)
	FindWithFilters(search string, isHot, isRecommend *bool) ([]models.Work, error)
	FindByIDs(ids []uint) ([]models.Work, error)
	UpdateVoteCount(id uint, count int64) error
}

type VoteRepository interface {
	Create(vote *models.Vote) error
	FindByWorkID(workID uint, limit int) ([]models.Vote, error)
	FindAll(limit int) ([]models.Vote, error)
}

var workRepo WorkRepository
var voteRepo VoteRepository

func InitRepository() {
	if workRepo == nil || voteRepo == nil {
		workRepo = NewDBWorkRepository()
		voteRepo = NewDBVoteRepository()
	}
}

func SetWorkRepository(repo WorkRepository) {
	workRepo = repo
}

func SetVoteRepository(repo VoteRepository) {
	voteRepo = repo
}

func GetWorkRepository() WorkRepository {
	return workRepo
}

func GetVoteRepository() VoteRepository {
	return voteRepo
}
