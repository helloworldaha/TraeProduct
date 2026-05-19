const EndlessMode = require('../../utils/endless-mode.js');
const AchievementSystem = require('../../utils/achievements.js');
const { Timer, TotalTimer } = require('../../utils/timer.js');
const ScoreSystem = require('../../utils/score.js');

Page({
  data: {
    isPlaying: false,
    gameState: null,
    difficulty: { level: 1, name: '入门', timePerQuestion: 15 },
    remainingTime: 15,
    survivalTime: '00:00',
    showAchievement: false,
    newAchievement: null,
    bestRecord: null,
    questions: []
  },

  onLoad() {
    this.loadBestRecord();
  },

  onUnload() {
    this.destroyTimers();
  },

  loadBestRecord() {
    const bestRecord = EndlessMode.getBestRecord();
    this.setData({ bestRecord });
  },

  startEndlessMode() {
    const gameState = EndlessMode.startEndlessMode();
    const questions = EndlessMode.generateInfiniteQuestions(gameState, 20);
    gameState.questions = questions;

    this.initTimers(gameState.difficulty.timePerQuestion);

    this.setData({
      isPlaying: true,
      gameState,
      difficulty: gameState.difficulty,
      remainingTime: gameState.difficulty.timePerQuestion,
      questions
    });

    this.startQuestionTimer();
    this.startTotalTimer();
  },

  initTimers(duration) {
    this.questionTimer = new Timer({
      duration: duration,
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
    if (this.data.gameState.showResult) return;

    const { index } = e.currentTarget.dataset;
    this.questionTimer.stop();
    
    const currentQuestion = this.data.questions[this.data.gameState.currentIndex];
    const isCorrect = currentQuestion.options[index].isCorrect;
    this.handleAnswer(isCorrect, index);
  },

  onTimeOut() {
    this.handleAnswer(false, -1);
  },

  handleAnswer(isCorrect, index) {
    let gameState = { ...this.data.gameState };
    gameState.selectedIndex = index;
    gameState.showResult = true;

    if (isCorrect) {
      gameState = EndlessMode.handleCorrectAnswer(gameState);
    } else {
      gameState = EndlessMode.handleWrongAnswer(gameState);
    }

    const newDifficulty = EndlessMode.increaseDifficulty(gameState);
    
    this.setData({ 
      gameState,
      difficulty: newDifficulty,
      survivalTime: this.totalTimer ? this.totalTimer.formatTime() : '00:00'
    });

    if (gameState.isGameOver || gameState.wrongCount >= 3) {
      setTimeout(() => {
        this.finishEndlessMode();
      }, 1000);
      return;
    }

    setTimeout(() => {
      this.nextQuestion();
    }, 800);
  },

  nextQuestion() {
    let gameState = { ...this.data.gameState };
    const nextIndex = gameState.currentIndex + 1;

    if (nextIndex >= this.data.questions.length - 3) {
      const newQuestions = EndlessMode.generateInfiniteQuestions(gameState, 10);
      this.setData({
        questions: [...this.data.questions, ...newQuestions]
      });
    }

    gameState.currentIndex = nextIndex;
    gameState.selectedIndex = -1;
    gameState.showResult = false;

    const newDifficulty = EndlessMode.increaseDifficulty(gameState);

    if (this.questionTimer) {
      this.questionTimer.destroy();
    }
    this.initTimers(newDifficulty.timePerQuestion);

    this.setData({ 
      gameState,
      difficulty: newDifficulty
    });

    this.startQuestionTimer();
  },

  finishEndlessMode() {
    this.stopTimers();

    const finalState = { ...this.data.gameState };
    finalState.startTime = finalState.startTime || Date.now();
    
    const record = EndlessMode.finishEndlessMode(finalState);
    
    const survivalSeconds = Math.floor((Date.now() - finalState.startTime) / 1000);

    const gameData = {
      isCompleted: true,
      score: record.score,
      maxCombo: record.maxCombo,
      survivalTime: survivalSeconds,
      isEndlessMode: true
    };

    const newAchievements = AchievementSystem.checkAchievements(gameData);
    if (newAchievements.length > 0) {
      this.setData({
        showAchievement: true,
        newAchievement: newAchievements[0]
      });
    }

    wx.redirectTo({
      url: `/pages/result/result?score=${record.score}&accuracy=0&time=${this.data.survivalTime}&correct=${record.correctCount}&total=0&mode=endless&maxCombo=${record.maxCombo}&survivalTime=${survivalSeconds}`
    });
  },

  closeAchievement() {
    this.setData({
      showAchievement: false,
      newAchievement: null
    });
  },

  exitGame() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出无限挑战吗？当前进度将不会保存。',
      success: (res) => {
        if (res.confirm) {
          this.stopTimers();
          this.setData({ isPlaying: false });
        }
      }
    });
  },

  formatSurvivalTime(seconds) {
    return EndlessMode.formatSurvivalTime(seconds);
  },

  getDifficultyColor(level) {
    return EndlessMode.getDifficultyColor(level);
  }
});
