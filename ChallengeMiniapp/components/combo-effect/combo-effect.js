Component({
  properties: {
    combo: {
      type: Number,
      value: 0
    },
    show: {
      type: Boolean,
      value: false
    }
  },

  observers: {
    'show': function(show) {
      if (show) {
        setTimeout(() => {
          this.setData({ show: false });
        }, 1000);
      }
    }
  },

  methods: {}
});
