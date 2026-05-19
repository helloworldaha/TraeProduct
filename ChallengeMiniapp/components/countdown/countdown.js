Component({
  properties: {
    duration: {
      type: Number,
      value: 15
    },
    remaining: {
      type: Number,
      value: 15
    },
    urgentThreshold: {
      type: Number,
      value: 5
    }
  },

  data: {
    displayTime: 15,
    urgentClass: ''
  },

  observers: {
    'remaining, duration': function(remaining, duration) {
      this.updateDisplay();
      this.drawProgress();
    }
  },

  lifetimes: {
    attached() {
      this.initCanvas();
    },
    ready() {
      this.drawProgress();
    }
  },

  methods: {
    initCanvas() {
      this.ctx = wx.createCanvasContext('progressCanvas', this);
    },

    updateDisplay() {
      const { remaining, urgentThreshold } = this.properties;
      const displayTime = Math.ceil(Math.max(0, remaining));
      const urgentClass = remaining <= urgentThreshold ? 'urgent' : '';
      
      this.setData({
        displayTime,
        urgentClass
      });
    },

    drawProgress() {
      if (!this.ctx) {
        this.initCanvas();
      }

      const { remaining, duration } = this.properties;
      const progress = Math.max(0, remaining) / duration;
      const isUrgent = remaining <= this.properties.urgentThreshold;
      
      const centerX = 60;
      const centerY = 60;
      const radius = 50;
      const lineWidth = 6;
      
      this.ctx.clearRect(0, 0, 120, 120);
      
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      this.ctx.setStrokeStyle('rgba(255, 255, 255, 0.2)');
      this.ctx.setLineWidth(lineWidth);
      this.ctx.stroke();
      
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (2 * Math.PI * progress);
      
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      this.ctx.setStrokeStyle(isUrgent ? '#f87171' : '#4ade80');
      this.ctx.setLineWidth(lineWidth);
      this.ctx.setLineCap('round');
      this.ctx.stroke();
      
      this.ctx.draw();
    }
  }
});
