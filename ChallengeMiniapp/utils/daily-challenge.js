const questionsData = require('../data/questions.js');
const Storage = require('./storage.js');

const DailyChallenge = {
  DAILY_QUESTION_COUNT: 10,
  MAX_ATTEMPTS: 3,

  getTodayDate() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  },

  getDailyData() {
    const today = this.getTodayDate();
    const data = Storage.get('dailyChallenge', {
      date: today,
      highScore: 0,
      completed: false,
      attempts: 0,
      consecutiveDays: 0,
      lastPlayedDate: null,
      questions: []
    });

    if (data.date !== today) {
      this.resetDailyChallenge(data);
    }

    return data;
  },

  resetDailyChallenge(oldData) {
    const today = this.getTodayDate();
    const newData = {
      date: today,
      highScore: 0,
      completed: false,
      attempts: 0,
      consecutiveDays: oldData.lastPlayedDate === this.getYesterdayDate() 
        ? oldData.consecutiveDays + 1 
        : 1,
      lastPlayedDate: null,
      questions: this.generateDailyQuestions()
    };

    Storage.set('dailyChallenge', newData);
    return newData;
  },

  getYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
  },

  generateDailyQuestions() {
    const today = this.getTodayDate();
    const seed = this.hashCode(today);
    
    const shuffled = [...questionsData].sort((a, b) => {
      const hashA = this.hashCode(a.id + seed);
      const hashB = this.hashCode(b.id + seed);
      return hashA - hashB;
    });

    return shuffled.slice(0, this.DAILY_QUESTION_COUNT);
  },

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < String(str).length; i++) {
      const char = String(str).charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  },

  checkDailyChallengeStatus() {
    const data = this.getDailyData();
    return {
      isCompleted: data.completed,
      highScore: data.highScore,
      remainingAttempts: this.MAX_ATTEMPTS - data.attempts,
      consecutiveDays: data.consecutiveDays
    };
  },

  saveDailyRecord(score) {
    const data = this.getDailyData();
    const today = this.getTodayDate();

    data.attempts += 1;
    data.lastPlayedDate = today;
    
    if (score > data.highScore) {
      data.highScore = score;
    }

    if (data.attempts >= this.MAX_ATTEMPTS || score >= 100) {
      data.completed = true;
    }

    Storage.set('dailyChallenge', data);
    return data;
  },

  canPlayToday() {
    const data = this.getDailyData();
    return data.attempts < this.MAX_ATTEMPTS && !data.completed;
  },

  getTimeUntilTomorrow() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
  },

  formatTimeUntilTomorrow() {
    const ms = this.getTimeUntilTomorrow();
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  },

  getDailyLeaderboard() {
    const mockLeaderboard = [
      { rank: 1, nickname: '答题王者', score: 280, avatar: '👑' },
      { rank: 2, nickname: '知识达人', score: 256, avatar: '🎯' },
      { rank: 3, nickname: '学霸本霸', score: 245, avatar: '📚' },
      { rank: 4, nickname: '聪明的我', score: 220, avatar: '🧠' },
      { rank: 5, nickname: '答题小能手', score: 198, avatar: '⭐' },
      { rank: 6, nickname: '好好学习', score: 185, avatar: '💪' },
      { rank: 7, nickname: '天天向上', score: 172, avatar: '🚀' },
      { rank: 8, nickname: '智者', score: 156, avatar: '🌟' }
    ];

    return mockLeaderboard;
  }
};

module.exports = DailyChallenge;
