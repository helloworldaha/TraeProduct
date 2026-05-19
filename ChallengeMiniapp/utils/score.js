const ScoreSystem = {
  BASE_SCORE: 10,
  COMBO_MULTIPLIER: 0.5,
  TIME_BONUS_MULTIPLIER: 0.1,

  calculateScore(isCorrect, combo, timeRemaining = 0) {
    if (!isCorrect) return 0;

    let score = this.BASE_SCORE;

    const comboBonus = Math.floor(combo * this.BASE_SCORE * this.COMBO_MULTIPLIER);
    score += comboBonus;

    const timeBonus = Math.floor(timeRemaining * this.BASE_SCORE * this.TIME_BONUS_MULTIPLIER);
    score += timeBonus;

    return score;
  },

  getComboMultiplier(combo) {
    return 1 + (combo * this.COMBO_MULTIPLIER);
  },

  getLevel(score) {
    if (score < 50) return { level: 1, name: '新手', color: '#84fab0' };
    if (score < 100) return { level: 2, name: '入门', color: '#8fd3f4' };
    if (score < 200) return { level: 3, name: '进阶', color: '#a18cd1' };
    if (score < 350) return { level: 4, name: '高手', color: '#fbc2eb' };
    if (score < 500) return { level: 5, name: '大师', color: '#ff9a9e' };
    return { level: 6, name: '王者', color: '#f093fb' };
  },

  getAccuracy(correctCount, totalCount) {
    if (totalCount === 0) return 0;
    return Math.round((correctCount / totalCount) * 100);
  },

  getEvaluation(score) {
    if (score < 60) return { text: '继续努力', emoji: '💪', color: '#ff6b6b' };
    if (score < 80) return { text: '不错', emoji: '👍', color: '#feca57' };
    if (score < 100) return { text: '优秀', emoji: '🎉', color: '#48dbfb' };
    return { text: '闯关大师', emoji: '👑', color: '#ff9ff3' };
  },

  animateScore(from, to, duration = 1000, callback) {
    const startTime = Date.now();
    const diff = to - from;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + diff * easeProgress);

      if (callback) {
        callback(current);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }
};

module.exports = ScoreSystem;
