const Storage = require('../../utils/storage.js');

Page({
  data: {
    records: []
  },

  onLoad() {
    this.loadRecords();
  },

  onShow() {
    this.loadRecords();
  },

  loadRecords() {
    const records = Storage.getGameRecords();
    this.setData({ records });
  },

  goBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});
