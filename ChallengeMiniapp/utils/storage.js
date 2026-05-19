const Storage = {
  set(key, data) {
    try {
      wx.setStorageSync(key, data);
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },

  get(key, defaultValue = null) {
    try {
      const data = wx.getStorageSync(key);
      return data !== '' ? data : defaultValue;
    } catch (e) {
      console.error('Storage get error:', e);
      return defaultValue;
    }
  },

  remove(key) {
    try {
      wx.removeStorageSync(key);
      return true;
    } catch (e) {
      console.error('Storage remove error:', e);
      return false;
    }
  },

  clear() {
    try {
      wx.clearStorageSync();
      return true;
    } catch (e) {
      console.error('Storage clear error:', e);
      return false;
    }
  },

  saveHighScore(score) {
    const currentHigh = this.get('highScore', 0);
    if (score > currentHigh) {
      this.set('highScore', score);
      return true;
    }
    return false;
  },

  getHighScore() {
    return this.get('highScore', 0);
  },

  saveGameRecord(record) {
    const records = this.get('gameRecords', []);
    records.push({
      ...record,
      timestamp: Date.now()
    });
    records.sort((a, b) => b.score - a.score);
    const topRecords = records.slice(0, 10);
    this.set('gameRecords', topRecords);
    return topRecords;
  },

  getGameRecords() {
    return this.get('gameRecords', []);
  }
};

module.exports = Storage;
