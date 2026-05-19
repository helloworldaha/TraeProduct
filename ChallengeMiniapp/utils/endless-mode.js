const questionsData = require('../data/questions.js');
const Storage = require('./storage.js');
const ScoreSystem = require('./score.js');

const EndlessMode = {
  MAX_WRONG_COUNT: 3,
  
  DIFFICULTY_LEVELS: [
    { level: 1, name: '入门', timePerQuestion: 15, questionCount: 10 },
    { level: 2, name: '进阶', timePerQuestion: 12, questionCount: 20 },
    { level: 3, name: '高手', timePerQuestion: 10, questionCount: 30 },
    { level: 4, name: '大师', timePerQuestion: 8, questionCount: 50 },
    { level: 5, name: '王者', timePerQuestion: 5, questionCount: 100 }
  ],

  startEndlessMode() {
    return {
      questions: [],
      currentIndex: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      wrongCount: 0,
      difficulty: this.DIFFICULTY_LEVELS[0],
      usedQuestions: new Set(),
      startTime: Date.now(),
      correctCount: 0
    };
  },

  generateInfiniteQuestions(state, count = 5) {
    const availableQuestions = questionsData.filter(q => !state.usedQuestions.has(q.id));
    
    if (availableQuestions.length < count) {
      state.usedQuestions.clear();
    }

    const shuffled = this.shuffleArray(
      availableQuestions.length > 0 ? availableQuestions : questionsData
    );

    const newQuestions = shuffled.slice(0, count);
    newQuestions.forEach(q => state.usedQuestions.add(q.id));
    
    return [...state.questions, ...newQuestions];
  },

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  increaseDifficulty(state) {
    const questionCount = state.correctCount;
    let newDifficulty = this.DIFFICULTY_LEVELS[0];

    for (let i = this.DIFFICULTY_LEVELS.length - 1; i >= 0; i--) {
      if (questionCount >= this.DIFFICULTY_LEVELS[i].questionCount) {
        newDifficulty = this.DIFFICULTY_LEVELS[i];
        break;
      }
    }

    return newDifficulty;
  },

  handleCorrectAnswer(state) {
    const newCombo = state.combo + 1;
    const addedScore = ScoreSystem.calculateScore(true, newCombo, state.difficulty.timePerQuestion);
    
    return {
      ...state,
      score: state.score + addedScore,
      combo: newCombo,
      maxCombo: Math.max(state.maxCombo, newCombo),
      correctCount: state.correctCount + 1
    };
  },

  handleWrongAnswer(state) {
    const newWrongCount = state.wrongCount + 1;
    const isGameOver = newWrongCount >= this.MAX_WRONG_COUNT;

    return {
      ...state,
      combo: 0,
      wrongCount: newWrongCount,
      isGameOver
    };
  },

  finishEndlessMode(state) {
    const endTime = Date.now();
    const survivalTime = Math.floor((endTime - state.startTime) / 1000);

    const record = {
      score: state.score,
      correctCount: state.correctCount,
      maxCombo: state.maxCombo,
      survivalTime,
      difficulty: state.difficulty.level,
      timestamp: endTime
    };

    this.saveEndlessRecord(record);
    return record;
  },

  saveEndlessRecord(record) {
    const records = Storage.get('endlessRecords', []);
    records.push(record);
    records.sort((a, b) => b.score - a.score);
    const topRecords = records.slice(0, 10);
    Storage.set('endlessRecords', topRecords);
    return topRecords;
  },

  getEndlessRecords() {
    return Storage.get('endlessRecords', []);
  },

  getBestRecord() {
    const records = this.getEndlessRecords();
    return records.length > 0 ? records[0] : null;
  },

  formatSurvivalTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  getDifficultyColor(level) {
    const colors = ['#84fab0', '#8fd3f4', '#a18cd1', '#fbc2eb', '#ff9a9e'];
    return colors[Math.min(level - 1, colors.length - 1)];
  }
};

module.exports = EndlessMode;
