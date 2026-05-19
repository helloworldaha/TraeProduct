const AchievementSystem = require('../../utils/achievements.js');

Page({
  data: {
    achievements: [],
    unlockedCount: 0,
    totalCount: 0,
    progressPercent: 0
  },

  onLoad() {
    this.loadAchievements();
  },

  onShow() {
    this.loadAchievements();
  },

  loadAchievements() {
    const achievements = AchievementSystem.renderAchievements();
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;
    const progressPercent = Math.floor((unlockedCount / totalCount) * 100);

    this.setData({
      achievements,
      unlockedCount,
      totalCount,
      progressPercent
    });
  },

  onAchievementTap(e) {
    const { id } = e.currentTarget.dataset;
    const achievement = this.data.achievements.find(a => a.id === id);
    
    if (achievement && achievement.unlocked) {
      wx.showToast({
        title: `已解锁：${achievement.title}`,
        icon: 'none',
        duration: 2000
      });
    } else if (achievement) {
      wx.showToast({
        title: `进度：${achievement.progress}/${achievement.target}`,
        icon: 'none',
        duration: 2000
      });
    }
  },

  formatDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}`;
  }
});
