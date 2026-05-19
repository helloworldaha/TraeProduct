Component({
  properties: {
    achievement: {
      type: Object,
      value: null
    },
    visible: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onClose() {
      this.triggerEvent('close');
    }
  }
});
