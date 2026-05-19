const shareConfig = {
  titles: {
    low: [
      '我在答题闯关中获得了 {score} 分，你敢来挑战吗？',
      '刚玩了答题闯关，拿了 {score} 分，来比比看？',
      '答题挑战获得 {score} 分，快来超越我！'
    ],
    medium: [
      '厉害了！我在答题闯关中获得了 {score} 分，连续答对 {combo} 题！',
      '{score} 分达成！连续 {combo} 连击，你能做到吗？',
      '答题高手在此！{score} 分，{combo} 连击等你来战！'
    ],
    high: [
      '👑 王者归来！我在答题闯关中豪取 {score} 分，{combo} 连击无人能敌！',
      '🔥 战神附体！{score} 分，{combo} 连击，还有谁？！',
      '💎 答题之神！{score} 分完美通关，不服来战！'
    ]
  },

  imageTexts: {
    low: ['继续努力', '再接再厉', '加油加油'],
    medium: ['不错哦', '很厉害', '棒棒哒'],
    high: ['王者', '大神', '传说']
  },

  getScoreLevel(score) {
    if (score < 80) return 'low';
    if (score < 200) return 'medium';
    return 'high';
  },

  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
};

module.exports = shareConfig;
