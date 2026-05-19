App({
  globalData: {
    userInfo: null,
    highScore: 0,
    gameData: null
  },

  onLaunch() {
    this.initGameData();
  },

  initGameData() {
    try {
      const highScore = wx.getStorageSync('highScore') || 0;
      this.globalData.highScore = highScore;
    } catch (e) {
      console.error('初始化数据失败', e);
    }
  }
})
