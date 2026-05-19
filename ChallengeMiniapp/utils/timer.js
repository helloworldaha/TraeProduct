class Timer {
  constructor(options = {}) {
    this.duration = options.duration || 15;
    this.onTick = options.onTick || null;
    this.onComplete = options.onComplete || null;
    this.remaining = this.duration;
    this.intervalId = null;
    this.isRunning = false;
    this.startTime = null;
    this.totalTime = 0;
  }

  start() {
    if (this.isRunning) return;
    
    this.remaining = this.duration;
    this.isRunning = true;
    this.startTime = Date.now();
    
    this.intervalId = setInterval(() => {
      this.remaining -= 0.1;
      
      if (this.onTick) {
        this.onTick(Math.max(0, this.remaining), this.duration);
      }
      
      if (this.remaining <= 0) {
        this.stop();
        if (this.onComplete) {
          this.onComplete();
        }
      }
    }, 100);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  reset(newDuration = null) {
    this.stop();
    if (newDuration !== null) {
      this.duration = newDuration;
    }
    this.remaining = this.duration;
  }

  getProgress() {
    return Math.max(0, this.remaining) / this.duration;
  }

  getRemaining() {
    return Math.max(0, Math.ceil(this.remaining));
  }

  destroy() {
    this.stop();
    this.onTick = null;
    this.onComplete = null;
  }
}

class TotalTimer {
  constructor() {
    this.startTime = null;
    this.endTime = null;
    this.isRunning = false;
  }

  start() {
    this.startTime = Date.now();
    this.isRunning = true;
  }

  stop() {
    this.endTime = Date.now();
    this.isRunning = false;
  }

  getElapsed() {
    const end = this.isRunning ? Date.now() : this.endTime;
    return end - this.startTime;
  }

  getElapsedSeconds() {
    return Math.floor(this.getElapsed() / 1000);
  }

  formatTime() {
    const seconds = this.getElapsedSeconds();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  reset() {
    this.startTime = null;
    this.endTime = null;
    this.isRunning = false;
  }
}

module.exports = {
  Timer,
  TotalTimer
};
