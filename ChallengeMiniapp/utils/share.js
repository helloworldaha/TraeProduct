const shareConfig = require('../data/share-config.js');

const ShareSystem = {
  generateShareText(score, maxCombo = 0, mode = 'normal') {
    const level = shareConfig.getScoreLevel(score);
    const templates = shareConfig.titles[level];
    let template = shareConfig.getRandomItem(templates);

    const combo = maxCombo > 0 ? maxCombo : Math.floor(score / 20);
    
    template = template.replace('{score}', score);
    template = template.replace('{combo}', combo);

    const modeLabels = {
      normal: '',
      daily: '【每日挑战】',
      endless: '【无限模式】'
    };

    return (modeLabels[mode] || '') + template;
  },

  generateShareImage(score, maxCombo = 0) {
    const level = shareConfig.getScoreLevel(score);
    const texts = shareConfig.imageTexts[level];
    const text = shareConfig.getRandomItem(texts);

    const colors = {
      low: '#84fab0',
      medium: '#a18cd1',
      high: '#f093fb'
    };

    return {
      text,
      score,
      maxCombo,
      color: colors[level],
      level
    };
  },

  showShareGuide(pageInstance) {
    pageInstance.setData({
      showShareGuide: true
    });

    setTimeout(() => {
      pageInstance.setData({
        showShareGuide: false
      });
    }, 3000);
  },

  hideShareGuide(pageInstance) {
    pageInstance.setData({
      showShareGuide: false
    });
  },

  getShareAppMessage(score, maxCombo, mode = 'normal') {
    return {
      title: this.generateShareText(score, maxCombo, mode),
      path: '/pages/index/index',
      imageUrl: ''
    };
  },

  getShareTimeline(score, maxCombo) {
    return {
      title: this.generateShareText(score, maxCombo),
      query: '',
      imageUrl: ''
    };
  }
};

module.exports = ShareSystem;
