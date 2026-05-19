const achievementsConfig = require('../data/achievements.js');
const Storage = require('./storage.js');

const AchievementSystem = {
  getAchievements() {
    const saved = Storage.get('achievements', null);
    if (saved) {
      return saved;
    }
    return this.initAchievements();
  },

  initAchievements() {
    const achievements = achievementsConfig.map(a => ({
      ...a,
      unlocked: false,
      unlockedAt: null,
      progress: 0
    }));
    Storage.set('achievements', achievements);
    return achievements;
  },

  saveAchievementData(achievements) {
    Storage.set('achievements', achievements);
    return achievements;
  },

  updateProgress(achievementId, value) {
    const achievements = this.getAchievements();
    const achievement = achievements.find(a => a.id === achievementId);
    
    if (!achievement || achievement.unlocked) {
      return { achievements, newlyUnlocked: null };
    }

    achievement.progress = Math.max(achievement.progress, value);
    let newlyUnlocked = null;

    if (achievement.progress >= achievement.target) {
      newlyUnlocked = this.unlockAchievement(achievementId, achievements);
    }

    this.saveAchievementData(achievements);
    this.checkAllAchievements(achievements);
    return { achievements, newlyUnlocked };
  },

  unlockAchievement(achievementId, achievements = null) {
    const achs = achievements || this.getAchievements();
    const achievement = achs.find(a => a.id === achievementId);

    if (!achievement || achievement.unlocked) {
      return null;
    }

    achievement.unlocked = true;
    achievement.unlockedAt = Date.now();
    achievement.progress = achievement.target;

    if (!achievements) {
      this.saveAchievementData(achs);
    }

    return achievement;
  },

  checkAllAchievements(achievements) {
    const unlockedCount = achievements.filter(a => a.unlocked && a.id !== 'all_achievements').length;
    const allAchievement = achievements.find(a => a.id === 'all_achievements');
    
    if (allAchievement && !allAchievement.unlocked) {
      allAchievement.progress = unlockedCount;
      if (unlockedCount >= allAchievement.target) {
        allAchievement.unlocked = true;
        allAchievement.unlockedAt = Date.now();
      }
    }
  },

  checkAchievements(gameData) {
    const newlyUnlocked = [];
    const achievements = this.getAchievements();

    const checks = [
      {
        id: 'first_challenge',
        condition: () => gameData.isCompleted
      },
      {
        id: 'combo_10',
        condition: () => gameData.maxCombo >= 10
      },
      {
        id: 'combo_50',
        condition: () => gameData.maxCombo >= 50
      },
      {
        id: 'score_100',
        condition: () => gameData.score >= 100
      },
      {
        id: 'score_500',
        condition: () => gameData.score >= 500
      },
      {
        id: 'daily_complete',
        condition: () => gameData.isDailyCompleted
      },
      {
        id: 'daily_7_days',
        condition: () => gameData.consecutiveDays >= 7
      },
      {
        id: 'questions_100',
        condition: () => this.getTotalCorrectCount() >= 100,
        value: this.getTotalCorrectCount()
      },
      {
        id: 'endless_5min',
        condition: () => gameData.survivalTime >= 300
      },
      {
        id: 'endless_10min',
        condition: () => gameData.survivalTime >= 600
      },
      {
        id: 'perfect_round',
        condition: () => gameData.isPerfect
      }
    ];

    checks.forEach(check => {
      const achievement = achievements.find(a => a.id === check.id);
      if (achievement && !achievement.unlocked && check.condition()) {
        const value = check.value !== undefined ? check.value : achievement.target;
        const result = this.updateProgress(check.id, value);
        if (result.newlyUnlocked) {
          newlyUnlocked.push(result.newlyUnlocked);
        }
      }
    });

    return newlyUnlocked;
  },

  getTotalCorrectCount() {
    const records = Storage.get('gameRecords', []);
    return records.reduce((sum, r) => sum + (r.correctCount || 0), 0);
  },

  getUnlockedCount() {
    const achievements = this.getAchievements();
    return achievements.filter(a => a.unlocked).length;
  },

  getTotalCount() {
    return achievementsConfig.length;
  },

  renderAchievements() {
    return this.getAchievements();
  }
};

module.exports = AchievementSystem;
