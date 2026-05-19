const Storage = require('../../utils/storage.js');
const ShareSystem = require('../../utils/share.js');

Page({
  data: {
    highScore: 0,
    particles: [],
    showShareGuide: false
  },

  onLoad() {
    this.loadHighScore();
    this.generateParticles();
  },

  onShow() {
    this.loadHighScore();
  },

  loadHighScore() {
    const highScore = Storage.getHighScore();
    this.setData({ highScore });
  },

  generateParticles() {
    const particles = [];
    for (let i = 0; i < 15; i++) {
      particles.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 3
      });
    }
    this.setData({ particles });
  },

  startGame() {
    wx.navigateTo({
      url: '/pages/quiz/quiz'
    });
  },

  goToDaily() {
    wx.navigateTo({
      url: '/pages/daily/daily'
    });
  },

  goToEndless() {
    wx.navigateTo({
      url: '/pages/endless/endless'
    });
  },

  goToAchievements() {
    wx.navigateTo({
      url: '/pages/achievements/achievements'
    });
  },

  goToLeaderboard() {
    wx.navigateTo({
      url: '/pages/leaderboard/leaderboard'
    });
  },

  showShareGuide() {
    this.setData({ showShareGuide: true });
  },

  hideShareGuide() {
    this.setData({ showShareGuide: false });
  },

  onShareAppMessage() {
    return ShareSystem.getShareAppMessage(this.data.highScore, 0);
  },

  onShareTimeline() {
    return ShareSystem.getShareTimeline(this.data.highScore, 0);
  }
});
