Component({
  properties: {
    rank: {
      type: Number,
      value: 1
    },
    name: {
      type: String,
      value: '玩家'
    },
    score: {
      type: Number,
      value: 0
    },
    accuracy: {
      type: Number,
      value: 0
    },
    time: {
      type: String,
      value: '00:00'
    }
  },

  data: {
    rankClass: ''
  },

  lifetimes: {
    attached() {
      this.updateRankClass();
    }
  },

  observers: {
    'rank': function(rank) {
      this.updateRankClass();
    }
  },

  methods: {
    updateRankClass() {
      const rank = this.properties.rank;
      let rankClass = 'normal';
      if (rank === 1) rankClass = 'top1';
      else if (rank === 2) rankClass = 'top2';
      else if (rank === 3) rankClass = 'top3';
      
      this.setData({ rankClass });
    }
  }
});
