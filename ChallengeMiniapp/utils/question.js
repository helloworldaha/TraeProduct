const QuestionUtils = {
  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  },

  getRandomQuestions(questions, count) {
    const shuffled = this.shuffleArray(questions);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  },

  shuffleOptions(question) {
    if (!question.options || question.options.length === 0) {
      return question;
    }

    const shuffledOptions = this.shuffleArray([...question.options]);
    return {
      ...question,
      options: shuffledOptions
    };
  },

  checkAnswer(question, selectedIndex) {
    if (!question || selectedIndex === -1) return false;
    
    const selectedOption = question.options[selectedIndex];
    return selectedOption && selectedOption.isCorrect === true;
  },

  getCorrectAnswerIndex(question) {
    if (!question || !question.options) return -1;
    return question.options.findIndex(option => option.isCorrect === true);
  },

  formatQuestionNumber(current, total) {
    return `第 ${current} / ${total} 题`;
  },

  getQuestionTypeText(type) {
    const types = {
      'single': '单选题',
      'judge': '判断题'
    };
    return types[type] || '未知题型';
  },

  getQuestionTypeIcon(type) {
    const icons = {
      'single': '📝',
      'judge': '⚖️'
    };
    return icons[type] || '❓';
  },

  prepareGameQuestions(questions, count = 10) {
    const selected = this.getRandomQuestions(questions, count);
    return selected.map(q => this.shuffleOptions(q));
  }
};

module.exports = QuestionUtils;
