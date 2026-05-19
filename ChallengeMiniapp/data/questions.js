const questions = [
  {
    id: 1,
    type: 'single',
    title: '微信小程序的生命周期函数中，用于监听页面加载的是？',
    options: [
      { text: 'onLoad', isCorrect: true },
      { text: 'onShow', isCorrect: false },
      { text: 'onReady', isCorrect: false },
      { text: 'onUnload', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 2,
    type: 'judge',
    title: '微信小程序的页面路由可以通过 wx.navigateTo 实现。',
    options: [
      { text: '正确', isCorrect: true },
      { text: '错误', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 3,
    type: 'single',
    title: '小程序中用于本地数据存储的 API 是？',
    options: [
      { text: 'wx.setStorage', isCorrect: true },
      { text: 'wx.saveFile', isCorrect: false },
      { text: 'wx.setData', isCorrect: false },
      { text: 'wx.cache', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 4,
    type: 'single',
    title: '小程序的配置文件 app.json 中，pages 数组的第一个元素代表？',
    options: [
      { text: '首页', isCorrect: true },
      { text: '最后一页', isCorrect: false },
      { text: '任意页面', isCorrect: false },
      { text: '错误页面', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 5,
    type: 'judge',
    title: '小程序可以直接操作 DOM。',
    options: [
      { text: '正确', isCorrect: false },
      { text: '错误', isCorrect: true }
    ],
    difficulty: 1
  },
  {
    id: 6,
    type: 'single',
    title: '小程序中用于页面跳转并关闭当前页面的 API 是？',
    options: [
      { text: 'wx.redirectTo', isCorrect: true },
      { text: 'wx.navigateTo', isCorrect: false },
      { text: 'wx.switchTab', isCorrect: false },
      { text: 'wx.reLaunch', isCorrect: false }
    ],
    difficulty: 2
  },
  {
    id: 7,
    type: 'single',
    title: '小程序的 WXML 中，用于循环渲染的指令是？',
    options: [
      { text: 'wx:for', isCorrect: true },
      { text: 'wx:if', isCorrect: false },
      { text: 'wx:elif', isCorrect: false },
      { text: 'wx:loop', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 8,
    type: 'judge',
    title: '小程序的 wx.request 可以发起跨域请求。',
    options: [
      { text: '正确', isCorrect: true },
      { text: '错误', isCorrect: false }
    ],
    difficulty: 2
  },
  {
    id: 9,
    type: 'single',
    title: '小程序中用于获取用户信息的 API 是？',
    options: [
      { text: 'wx.getUserProfile', isCorrect: true },
      { text: 'wx.getUserInfo', isCorrect: false },
      { text: 'wx.getProfile', isCorrect: false },
      { text: 'wx.getUser', isCorrect: false }
    ],
    difficulty: 2
  },
  {
    id: 10,
    type: 'single',
    title: '小程序的样式文件扩展名是？',
    options: [
      { text: '.wxss', isCorrect: true },
      { text: '.css', isCorrect: false },
      { text: '.scss', isCorrect: false },
      { text: '.less', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 11,
    type: 'judge',
    title: '小程序的 setData 方法可以异步更新数据。',
    options: [
      { text: '正确', isCorrect: true },
      { text: '错误', isCorrect: false }
    ],
    difficulty: 2
  },
  {
    id: 12,
    type: 'single',
    title: '小程序中用于显示加载提示框的 API 是？',
    options: [
      { text: 'wx.showLoading', isCorrect: true },
      { text: 'wx.showToast', isCorrect: false },
      { text: 'wx.showModal', isCorrect: false },
      { text: 'wx.showActionSheet', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 13,
    type: 'single',
    title: 'JavaScript 中，以下哪个方法用于数组遍历？',
    options: [
      { text: 'forEach', isCorrect: true },
      { text: 'for', isCorrect: false },
      { text: 'loop', isCorrect: false },
      { text: 'each', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 14,
    type: 'judge',
    title: 'JavaScript 中，null == undefined 的结果是 true。',
    options: [
      { text: '正确', isCorrect: true },
      { text: '错误', isCorrect: false }
    ],
    difficulty: 2
  },
  {
    id: 15,
    type: 'single',
    title: 'JavaScript 中，以下哪个是箭头函数？',
    options: [
      { text: '() => {}', isCorrect: true },
      { text: 'function() {}', isCorrect: false },
      { text: 'function => {}', isCorrect: false },
      { text: '() -> {}', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 16,
    type: 'single',
    title: 'CSS3 中，用于设置圆角的属性是？',
    options: [
      { text: 'border-radius', isCorrect: true },
      { text: 'border-round', isCorrect: false },
      { text: 'corner-radius', isCorrect: false },
      { text: 'round-corner', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 17,
    type: 'judge',
    title: 'CSS 中，flex 布局可以实现垂直居中。',
    options: [
      { text: '正确', isCorrect: true },
      { text: '错误', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 18,
    type: 'single',
    title: 'HTML5 中，用于绘制图形的标签是？',
    options: [
      { text: 'canvas', isCorrect: true },
      { text: 'svg', isCorrect: false },
      { text: 'draw', isCorrect: false },
      { text: 'paint', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 19,
    type: 'single',
    title: '小程序中，用于创建自定义组件的配置文件是？',
    options: [
      { text: 'Component()', isCorrect: true },
      { text: 'Page()', isCorrect: false },
      { text: 'App()', isCorrect: false },
      { text: 'Widget()', isCorrect: false }
    ],
    difficulty: 2
  },
  {
    id: 20,
    type: 'judge',
    title: '小程序的自定义组件可以使用 slot 插槽。',
    options: [
      { text: '正确', isCorrect: true },
      { text: '错误', isCorrect: false }
    ],
    difficulty: 2
  },
  {
    id: 21,
    type: 'single',
    title: 'JavaScript 中，Promise 的状态不包括？',
    options: [
      { text: 'waiting', isCorrect: true },
      { text: 'pending', isCorrect: false },
      { text: 'fulfilled', isCorrect: false },
      { text: 'rejected', isCorrect: false }
    ],
    difficulty: 2
  },
  {
    id: 22,
    type: 'single',
    title: '小程序中，用于 Tab 切换的 API 是？',
    options: [
      { text: 'wx.switchTab', isCorrect: true },
      { text: 'wx.changeTab', isCorrect: false },
      { text: 'wx.jumpTab', isCorrect: false },
      { text: 'wx.toTab', isCorrect: false }
    ],
    difficulty: 2
  },
  {
    id: 23,
    type: 'judge',
    title: 'JavaScript 中，const 声明的变量可以重新赋值。',
    options: [
      { text: '正确', isCorrect: false },
      { text: '错误', isCorrect: true }
    ],
    difficulty: 1
  },
  {
    id: 24,
    type: 'single',
    title: '小程序中，用于下拉刷新的配置项是？',
    options: [
      { text: 'enablePullDownRefresh', isCorrect: true },
      { text: 'allowPullDown', isCorrect: false },
      { text: 'pullDownRefresh', isCorrect: false },
      { text: 'refreshEnable', isCorrect: false }
    ],
    difficulty: 2
  },
  {
    id: 25,
    type: 'single',
    title: 'CSS 中，以下哪个属性用于设置动画？',
    options: [
      { text: 'animation', isCorrect: true },
      { text: 'transition', isCorrect: false },
      { text: 'transform', isCorrect: false },
      { text: 'animate', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 26,
    type: 'judge',
    title: '小程序可以使用 npm 安装第三方包。',
    options: [
      { text: '正确', isCorrect: true },
      { text: '错误', isCorrect: false }
    ],
    difficulty: 2
  },
  {
    id: 27,
    type: 'single',
    title: 'JavaScript 中，以下哪个方法用于解析 JSON 字符串？',
    options: [
      { text: 'JSON.parse', isCorrect: true },
      { text: 'JSON.stringify', isCorrect: false },
      { text: 'JSON.decode', isCorrect: false },
      { text: 'JSON.encode', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 28,
    type: 'single',
    title: '小程序中，用于分享的生命周期函数是？',
    options: [
      { text: 'onShareAppMessage', isCorrect: true },
      { text: 'onShare', isCorrect: false },
      { text: 'onShareMessage', isCorrect: false },
      { text: 'shareAppMessage', isCorrect: false }
    ],
    difficulty: 2
  },
  {
    id: 29,
    type: 'judge',
    title: 'JavaScript 中，typeof null 的结果是 "object"。',
    options: [
      { text: '正确', isCorrect: true },
      { text: '错误', isCorrect: false }
    ],
    difficulty: 2
  },
  {
    id: 30,
    type: 'single',
    title: '小程序中，用于获取系统信息的 API 是？',
    options: [
      { text: 'wx.getSystemInfo', isCorrect: true },
      { text: 'wx.getDeviceInfo', isCorrect: false },
      { text: 'wx.getInfo', isCorrect: false },
      { text: 'wx.systemInfo', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 31,
    type: 'single',
    title: 'JavaScript 中，以下哪个是正确的模板字符串写法？',
    options: [
      { text: '`Hello ${name}`', isCorrect: true },
      { text: '"Hello ${name}"', isCorrect: false },
      { text: "'Hello ${name}'", isCorrect: false },
      { text: 'Hello ${name}', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 32,
    type: 'judge',
    title: '小程序的页面栈最多可以有 10 层。',
    options: [
      { text: '正确', isCorrect: true },
      { text: '错误', isCorrect: false }
    ],
    difficulty: 2
  },
  {
    id: 33,
    type: 'single',
    title: 'CSS 中，z-index 属性用于设置什么？',
    options: [
      { text: '元素的堆叠顺序', isCorrect: true },
      { text: '元素的透明度', isCorrect: false },
      { text: '元素的位置', isCorrect: false },
      { text: '元素的大小', isCorrect: false }
    ],
    difficulty: 1
  },
  {
    id: 34,
    type: 'single',
    title: '小程序中，用于选择文件的 API 是？',
    options: [
      { text: 'wx.chooseMessageFile', isCorrect: true },
      { text: 'wx.selectFile', isCorrect: false },
      { text: 'wx.pickFile', isCorrect: false },
      { text: 'wx.getFile', isCorrect: false }
    ],
    difficulty: 2
  },
  {
    id: 35,
    type: 'judge',
    title: 'JavaScript 中，数组的 push 方法会返回新数组的长度。',
    options: [
      { text: '正确', isCorrect: true },
      { text: '错误', isCorrect: false }
    ],
    difficulty: 1
  }
];

module.exports = questions;
