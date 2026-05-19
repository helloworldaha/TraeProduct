const questionsData = require('../../data/questions.js');
const { Timer, TotalTimer } = require('../../utils/timer.js');
const ScoreSystem = require('../../utils/score.js');
const QuestionUtils = require('../../utils/question.js');
const Storage = require('../../utils/storage.js');

Page({
  data: {
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    score: 0,
    combo: 0,
    maxCombo: 0,
    level: { level: 1, name: '新手', color: '#84fab0' },
    selectedIndex: -1,
    showResult: false,
    showCombo: false,
    questionTime: 15,
    remainingTime: 15,
    correctCount: 0,
    totalQuestions: 10
  },

  onLoad() {
    this.initGame();
  },

  onUnload() {
    this.destroyTimers();
  },

  initGame() {
    const questions = QuestionUtils.prepareGameQuestions(questionsData, 10);
    
    this.setData({
      questions,
      totalQuestions: questions.length,
      currentIndex: 0,
      currentQuestion: questions[0],
      score: 0,
      combo: 0,
      level: ScoreSystem.getLevel(0),
      selectedIndex: -1,
      showResult: false,
      remainingTime: this.data.questionTime,
      correctCount: 0
    });

    this.initTimers();
    this.startQuestionTimer();
    this.startTotalTimer();
  },

  initTimers() {
    this.questionTimer = new Timer({
      duration: this.data.questionTime,
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

  onOptionSelect(e) {
    if (this.data.showResult) return;

    const { index } = e.detail;
    this.questionTimer.stop();
    
    const isCorrect = QuestionUtils.checkAnswer(this.data.currentQuestion, index);
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
  },

  handleCorrectAnswer() {
    const newCombo = this.data.combo + 1;
    const newMaxCombo = Math.max(this.data.maxCombo, newCombo);
    const addedScore = ScoreSystem.calculateScore(true, newCombo, this.data.remainingTime);
    const newScore = this.data.score + addedScore;
    const newLevel = ScoreSystem.getLevel(newScore);

    this.setData({
      score: newScore,
      combo: newCombo,
      maxCombo: newMaxCombo,
      level: newLevel,
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
      this.finishGame();
      return;
    }

    this.setData({
      currentIndex: nextIndex,
      currentQuestion: this.data.questions[nextIndex],
      selectedIndex: -1,
      showResult: false,
      remainingTime: this.data.questionTime
    });

    this.startQuestionTimer();
  },

  finishGame() {
    this.stopTimers();

    const { score, correctCount, totalQuestions, maxCombo } = this.data;
    const accuracy = ScoreSystem.getAccuracy(correctCount, totalQuestions);
    const usedTime = this.totalTimer ? this.totalTimer.formatTime() : '00:00';
    const evaluation = ScoreSystem.getEvaluation(score);

    const gameRecord = {
      score,
      correctCount,
      totalQuestions,
      accuracy,
      usedTime,
      evaluation,
      maxCombo,
      timestamp: Date.now()
    };

    Storage.saveHighScore(score);
    Storage.saveGameRecord(gameRecord);

    wx.redirectTo({
      url: `/pages/result/result?score=${score}&accuracy=${accuracy}&time=${usedTime}&correct=${correctCount}&total=${totalQuestions}&maxCombo=${maxCombo}`
    });
  },

  get progressPercent() {
    return ((this.data.currentIndex + 1) / this.data.totalQuestions) * 100;
  },

  get isLastQuestion() {
    return this.data.currentIndex >= this.data.questions.length - 1;
  }
});
