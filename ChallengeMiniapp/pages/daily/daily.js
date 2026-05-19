const DailyChallenge = require('../../utils/daily-challenge.js');
const AchievementSystem = require('../../utils/achievements.js');
const { Timer, TotalTimer } = require('../../utils/timer.js');
const ScoreSystem = require('../../utils/score.js');
const Storage = require('../../utils/storage.js');

Page({
  data: {
    dailyData: null,
    countdown: { hours: '00', minutes: '00', seconds: '00' },
    isPlaying: false,
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    score: 0,
    combo: 0,
    maxCombo: 0,
    selectedIndex: -1,
    showResult: false,
    showCombo: false,
    remainingTime: 15,
    correctCount: 0,
    leaderboard: [],
    showAchievement: false,
    newAchievement: null
  },

  onLoad() {
    this.loadDailyData();
    this.startCountdownTimer();
  },

  onUnload() {
    this.destroyTimers();
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  },

  loadDailyData() {
    const dailyData = DailyChallenge.getDailyData();
    const leaderboard = DailyChallenge.getDailyLeaderboard();
    
    this.setData({ 
      dailyData,
      leaderboard
    });
  },

  startCountdownTimer() {
    this.updateCountdown();
    this.countdownTimer = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  },

  updateCountdown() {
    const countdown = DailyChallenge.formatTimeUntilTomorrow();
    this.setData({ countdown });
  },

  startDailyChallenge() {
    if (!DailyChallenge.canPlayToday()) {
      wx.showToast({
        title: '今日挑战已完成',
        icon: 'none'
      });
      return;
    }

    const dailyData = DailyChallenge.getDailyData();
    const questions = dailyData.questions.length > 0 
      ? dailyData.questions 
      : DailyChallenge.generateDailyQuestions();

    this.initTimers();
    
    this.setData({
      isPlaying: true,
      questions,
      currentIndex: 0,
      currentQuestion: questions[0],
      score: 0,
      combo: 0,
      maxCombo: 0,
      selectedIndex: -1,
      showResult: false,
      remainingTime: 15,
      correctCount: 0
    });

    this.startQuestionTimer();
    this.startTotalTimer();
  },

  initTimers() {
    this.questionTimer = new Timer({
      duration: 15,
      onTick: (remaining) => {
        this.setData({ remainingTime: remaining });
      },
      onComplete: () => {
        this.onTimeOut();
      }
    });

    this.totalTimer = new TotalTimer();
  },

  startQuestionTimer() {
    if (this.questionTimer) {
      this.questionTimer.reset();
      this.questionTimer.start();
    }
  },

  startTotalTimer() {
    if (this.totalTimer) {
      this.totalTimer.start();
    }
  },

  stopTimers() {
    if (this.questionTimer) {
      this.questionTimer.stop();
    }
    if (this.totalTimer) {
      this.totalTimer.stop();
    }
  },

  destroyTimers() {
    if (this.questionTimer) {
      this.questionTimer.destroy();
    }
  },

  onOptionTap(e) {
    if (this.data.showResult) return;

    const { index } = e.currentTarget.dataset;
    this.questionTimer.stop();
    
    const isCorrect = this.data.currentQuestion.options[index].isCorrect;
    this.handleAnswer(isCorrect, index);
  },

  onTimeOut() {
    this.handleAnswer(false, -1);
  },

  handleAnswer(isCorrect, index) {
    this.setData({
      selectedIndex: index,
      showResult: true
    });

    if (isCorrect) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer();
    }

    setTimeout(() => {
      this.nextQuestion();
    }, 1000);
  },

  handleCorrectAnswer() {
    const newCombo = this.data.combo + 1;
    const addedScore = ScoreSystem.calculateScore(true, newCombo, this.data.remainingTime);
    const newScore = this.data.score + addedScore;

    this.setData({
      score: newScore,
      combo: newCombo,
      maxCombo: Math.max(this.data.maxCombo, newCombo),
      correctCount: this.data.correctCount + 1
    });

    if (newCombo > 1) {
      this.setData({ showCombo: true });
      setTimeout(() => {
        this.setData({ showCombo: false });
      }, 1000);
    }
  },

  handleWrongAnswer() {
    this.setData({ combo: 0 });
  },

  nextQuestion() {
    const nextIndex = this.data.currentIndex + 1;
    
    if (nextIndex >= this.data.questions.length) {
      this.finishDailyChallenge();
      return;
    }

    this.setData({
      currentIndex: nextIndex,
      currentQuestion: this.data.questions[nextIndex],
      selectedIndex: -1,
      showResult: false,
      remainingTime: 15
    });

    this.startQuestionTimer();
  },

  finishDailyChallenge() {
    this.stopTimers();

    const { score, correctCount, questions, maxCombo } = this.data;
    const accuracy = ScoreSystem.getAccuracy(correctCount, questions.length);
    const usedTime = this.totalTimer ? this.totalTimer.formatTime() : '00:00';

    DailyChallenge.saveDailyRecord(score);

    const gameData = {
      isCompleted: true,
      score,
      maxCombo,
      isDailyCompleted: true,
      consecutiveDays: this.data.dailyData.consecutiveDays + 1,
      isPerfect: correctCount === questions.length
    };

    const newAchievements = AchievementSystem.checkAchievements(gameData);
    if (newAchievements.length > 0) {
      this.setData({
        showAchievement: true,
        newAchievement: newAchievements[0]
      });
    }

    const gameRecord = {
      score,
      correctCount,
      totalQuestions: questions.length,
      accuracy,
      usedTime,
      timestamp: Date.now(),
      mode: 'daily'
    };
    Storage.saveHighScore(score);
    Storage.saveGameRecord(gameRecord);

    wx.redirectTo({
      url: `/pages/result/result?score=${score}&accuracy=${accuracy}&time=${usedTime}&correct=${correctCount}&total=${questions.length}&mode=daily&maxCombo=${maxCombo}`
    });
  },

  closeAchievement() {
    this.setData({
      showAchievement: false,
      newAchievement: null
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
