const QuestionUtils = require('../../utils/question.js');

Component({
  properties: {
    question: {
      type: Object,
      value: null
    },
    showResult: {
      type: Boolean,
      value: false
    },
    selectedIndex: {
      type: Number,
      value: -1
    },
    currentIndex: {
      type: Number,
      value: 1
    },
    totalCount: {
      type: Number,
      value: 10
    }
  },

  data: {
    optionLabels: ['A', 'B', 'C', 'D'],
    optionClass: [],
    typeText: '',
    typeIcon: '',
    questionNumber: ''
  },

  observers: {
    'selectedIndex, showResult': function(selectedIndex, showResult) {
      this.updateOptionClass();
    },
    'question, currentIndex, totalCount': function(question, currentIndex, totalCount) {
      this.updateDisplayData();
    }
  },

  lifetimes: {
    attached() {
      this.initComponent();
    }
  },

  methods: {
    initComponent() {
      this.updateOptionClass();
      this.updateDisplayData();
    },

    updateDisplayData() {
      const { question, currentIndex, totalCount } = this.properties;
      
      let typeText = '';
      let typeIcon = '';
      
      if (question) {
        typeText = QuestionUtils.getQuestionTypeText(question.type);
        typeIcon = QuestionUtils.getQuestionTypeIcon(question.type);
      }
      
      const questionNumber = QuestionUtils.formatQuestionNumber(currentIndex, totalCount);
      
      this.setData({
        typeText,
        typeIcon,
        questionNumber
      });
    },

    updateOptionClass() {
      const { question, selectedIndex, showResult } = this.properties;
      const optionClass = [];
      
      if (question && question.options) {
        question.options.forEach((option, index) => {
          let classes = [];
          
          if (selectedIndex === index) {
            classes.push('selected');
          }
          
          if (showResult) {
            classes.push('disabled');
            if (option.isCorrect) {
              classes.push('correct');
            } else if (selectedIndex === index) {
              classes.push('wrong');
            }
          }
          
          optionClass.push(classes.join(' '));
        });
      }
      
      this.setData({ optionClass });
    },

    onOptionTap(e) {
      if (this.properties.showResult) return;
      if (!this.properties.question || !this.properties.question.options) return;
      
      const index = e.currentTarget.dataset.index;
      this.triggerEvent('select', {
        index: index,
        option: this.properties.question.options[index]
      });
    }
  }
});
