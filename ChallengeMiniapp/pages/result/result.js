const ScoreSystem = require('../../utils/score.js');
const Storage = require('../../utils/storage.js');
const ShareSystem = require('../../utils/share.js');
const AchievementSystem = require('../../utils/achievements.js');

Page({
  data: {
    score: 0,
    accuracy: 0,
    usedTime: '00:00',
    correct: 0,
    total: 10,
    mode: 'normal',
    maxCombo: 0,
    evaluation: { text: '继续努力', emoji: '💪', color: '#ff6b6b' },
    isNewRecord: false,
    showShareGuide: false,
    showAchievement: false,
    newAchievement: null
  },

  onLoad(options) {
    const { score, accuracy, time, correct, total, mode, maxCombo } = options;
    
    const evaluation = ScoreSystem.getEvaluation(parseInt(score));
    const isNewRecord = this.checkNewRecord(parseInt(score));

    this.setData({
      score: parseInt(score),
      accuracy: parseInt(accuracy) || 0,
      usedTime: time,
      correct: parseInt(correct),
      total: parseInt(total) || 10,
      mode: mode || 'normal',
      maxCombo: parseInt(maxCombo) || 0,
      evaluation,
      isNewRecord
    });

    this.checkAchievements();
  },

  checkNewRecord(score) {
    const highScore = Storage.getHighScore();
    return score >= highScore && score > 0;
  },

  checkAchievements() {
    const gameData = {
      isCompleted: true,
      score: this.data.score,
      maxCombo: this.data.maxCombo,
      isPerfect: this.data.correct === this.data.total && this.data.total > 0
    };

    const newAchievements = AchievementSystem.checkAchievements(gameData);
    if (newAchievements.length > 0) {
      this.setData({
        showAchievement: true,
        newAchievement: newAchievements[0]
      });
    }
  },

  playAgain() {
    if (this.data.mode === 'daily') {
      wx.redirectTo({
        url: '/pages/daily/daily'
      });
    } else if (this.data.mode === 'endless') {
      wx.redirectTo({
        url: '/pages/endless/endless'
      });
    } else {
      wx.redirectTo({
        url: '/pages/quiz/quiz'
      });
    }
  },

  goToHome() {
    wx.navigateBack({
      delta: 1
    });
  },

  showShareGuide() {
    this.setData({ showShareGuide: true });
  },

  hideShareGuide() {
    this.setData({ showShareGuide: false });
  },

  closeAchievement() {
    this.setData({
      showAchievement: false,
      newAchievement: null
    });
  },

  onShareAppMessage() {
    return ShareSystem.getShareAppMessage(this.data.score, this.data.maxCombo, this.data.mode);
  },

  onShareTimeline() {
    return ShareSystem.getShareTimeline(this.data.score, this.data.maxCombo);
  }
});
