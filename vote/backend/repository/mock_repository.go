package repository

import (
	"sort"
	"strings"
	"sync"
	"time"

	"vote/models"
	"vote/testdata"
)

type MockWorkRepository struct {
	works      map[uint]models.Work
	worksList  []models.Work
	nextWorkID uint
	mu         sync.RWMutex
}

type MockVoteRepository struct {
	votes      map[uint]models.Vote
	votesList  []models.Vote
	nextVoteID uint
	mu         sync.RWMutex
}

func NewMockWorkRepository() *MockWorkRepository {
	works := testdata.GetMockWorks()
	workMap := make(map[uint]models.Work)
	var maxID uint = 0

	for _, work := range works {
		workMap[work.ID] = work
		if work.ID > maxID {
			maxID = work.ID
		}
	}

	return &MockWorkRepository{
		works:      workMap,
		worksList:  works,
		nextWorkID: maxID + 1,
	}
}

func NewMockVoteRepository() *MockVoteRepository {
	votes := testdata.GetMockVotes()
	voteMap := make(map[uint]models.Vote)
	var maxID uint = 0

	for _, vote := range votes {
		voteMap[vote.ID] = vote
		if vote.ID > maxID {
			maxID = vote.ID
		}
	}

	return &MockVoteRepository{
		votes:      voteMap,
		votesList:  votes,
		nextVoteID: maxID + 1,
	}
}

func (r *MockWorkRepository) FindAll() ([]models.Work, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	result := make([]models.Work, len(r.worksList))
	copy(result, r.worksList)

	sort.Slice(result, func(i, j int) bool {
		if result[i].VoteCount == result[j].VoteCount {
			return result[i].ID < result[j].ID
		}
		return result[i].VoteCount > result[j].VoteCount
	})

	return result, nil
}

func (r *MockWorkRepository) FindByID(id uint) (*models.Work, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if work, exists := r.works[id]; exists {
		return &work, nil
	}
	return nil, nil
}

func (r *MockWorkRepository) FindWithFilters(search string, isHot, isRecommend *bool) ([]models.Work, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []models.Work
	searchLower := strings.ToLower(strings.TrimSpace(search))

	for _, work := range r.worksList {
		match := true

		if search != "" {
			if !strings.Contains(strings.ToLower(work.Title), searchLower) &&
				!strings.Contains(strings.ToLower(work.Description), searchLower) {
				match = false
			}
		}

		if isHot != nil && match {
			if work.IsHot != *isHot {
				match = false
			}
		}

		if isRecommend != nil && match {
			if work.IsRecommend != *isRecommend {
				match = false
			}
		}

		if match {
			result = append(result, work)
		}
	}

	sort.Slice(result, func(i, j int) bool {
		if result[i].VoteCount == result[j].VoteCount {
			return result[i].ID < result[j].ID
		}
		return result[i].VoteCount > result[j].VoteCount
	})

	return result, nil
}

func (r *MockWorkRepository) FindByIDs(ids []uint) ([]models.Work, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []models.Work
	for _, id := range ids {
		if work, exists := r.works[id]; exists {
			result = append(result, work)
		}
	}
	return result, nil
}

func (r *MockWorkRepository) UpdateVoteCount(id uint, count int64) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if work, exists := r.works[id]; exists {
		work.VoteCount = count
		work.UpdatedAt = time.Now()
		r.works[id] = work

		for i, w := range r.worksList {
			if w.ID == id {
				r.worksList[i] = work
				break
			}
		}
	}
	return nil
}

func (r *MockVoteRepository) Create(vote *models.Vote) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	vote.ID = r.nextVoteID
	r.nextVoteID++
	vote.CreatedAt = time.Now()
	vote.UpdatedAt = time.Now()

	r.votes[vote.ID] = *vote
	r.votesList = append(r.votesList, *vote)
	return nil
}

func (r *MockVoteRepository) FindByWorkID(workID uint, limit int) ([]models.Vote, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []models.Vote
	for _, vote := range r.votesList {
		if vote.WorkID == workID {
			result = append(result, vote)
		}
	}

	sort.Slice(result, func(i, j int) bool {
		return result[i].CreatedAt.After(result[j].CreatedAt)
	})

	if limit > 0 && len(result) > limit {
		result = result[:limit]
	}

	return result, nil
}

func (r *MockVoteRepository) FindAll(limit int) ([]models.Vote, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	result := make([]models.Vote, len(r.votesList))
	copy(result, r.votesList)

	sort.Slice(result, func(i, j int) bool {
		return result[i].CreatedAt.After(result[j].CreatedAt)
	})

	if limit > 0 && len(result) > limit {
		result = result[:limit]
	}

	return result, nil
}
