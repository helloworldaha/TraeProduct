Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onMaskTap() {
      this.triggerEvent('close');
    },

    stopPropagation() {
    }
  }
});
