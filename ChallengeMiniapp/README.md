# 🎯 答题闯关微信小程序

## 项目介绍

一款现代化、游戏化的答题闯关微信小程序，采用深色主题设计，支持单选题、判断题，包含计时器、连击加分、等级系统、排行榜等功能。

## 技术栈

- **框架**: 微信小程序原生开发
- **样式**: WXSS (CSS3 动画、渐变)
- **逻辑**: JavaScript (ES6+)
- **数据存储**: 微信 Storage API
- **自定义组件**: 组件化开发

## 项目结构

```
ChallengeMiniapp/
├── app.js                 # 小程序入口文件
├── app.json              # 小程序全局配置
├── app.wxss              # 全局样式
├── sitemap.json          # 站点地图配置
├── project.config.json   # 项目配置文件
├── README.md             # 项目说明文档
│
├── utils/                # 工具类模块
│   ├── storage.js        # 本地存储封装
│   ├── timer.js          # 计时器类
│   ├── score.js          # 分数计算系统
│   └── question.js       # 题目处理工具
│
├── data/                 # 数据模块
│   └── questions.js      # 题目数据
│
├── components/           # 自定义组件
│   ├── question-card/    # 题目卡片组件
│   ├── countdown/        # 倒计时组件
│   ├── combo-effect/     # 连击特效组件
│   └── leaderboard/      # 排行榜项组件
│
├── pages/                # 页面
│   ├── index/            # 首页/开始页
│   ├── quiz/             # 答题页
│   ├── result/           # 结果页
│   └── leaderboard/      # 排行榜页
│
└── assets/               # 资源文件
    ├── images/           # 图片资源
    ├── icons/            # 图标资源
    └── audio/            # 音频资源
```

## 功能特性

### 🎮 核心玩法
- **随机出题**: 每次游戏从题库中随机抽取10道题目
- **题型支持**: 单选题、判断题
- **选项乱序**: 题目选项随机排序，增加挑战性
- **限时答题**: 每题15秒倒计时，超时自动判错

### 🔥 游戏化设计
- **连击系统**: 连续答对获得额外加分
- **等级系统**: 根据分数自动升级（新手→入门→进阶→高手→大师→王者）
- **实时分数**: 答题过程中实时更新分数
- **连击特效**: 连续答对时显示炫酷连击动画

### 📊 数据统计
- **正确率统计**: 记录答对题数和正确率
- **用时统计**: 统计总答题用时
- **历史最高分**: 自动保存最高分数记录
- **排行榜**: 保存历史最佳记录（Top 10）

### 🎨 UI 设计
- **深色主题**: 科技感深色背景
- **渐变效果**: 炫酷的渐变色按钮和边框
- **流畅动画**: 页面入场动画、按钮点击反馈、连击特效
- **粒子背景**: 浮动粒子营造科技氛围
- **毛玻璃效果**: 卡片采用半透明毛玻璃设计

### 💾 数据持久化
- 使用微信 Storage API 存储游戏数据
- 小程序重启后数据不丢失
- 历史最高分永久保存

## 页面说明

### 首页 (index)
- 活动标题与规则说明
- 历史最高分展示
- 开始挑战按钮
- 排行榜入口
- 浮动粒子动画背景

### 答题页 (quiz)
- 题目进度条
- 圆形倒计时组件
- 实时分数、连击数、等级展示
- 题目卡片（支持单选、判断）
- 选项高亮反馈（正确/错误）
- 连击特效动画

### 结果页 (result)
- 最终得分展示
- 评价系统（继续努力→不错→优秀→闯关大师）
- 详细统计：正确率、准确率、用时
- 新纪录标识
- 再来一次/返回首页按钮
- 支持分享功能

### 排行榜页 (leaderboard)
- 历史游戏记录列表
- 排名展示（前三名特殊样式）
- 每条记录包含：分数、正确率、用时
- 空状态友好提示

## 启动方式

### 微信开发者工具运行

1. **下载并安装微信开发者工具**
   - 访问 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   - 下载对应操作系统版本并安装

2. **导入项目**
   - 打开微信开发者工具
   - 选择「小程序」项目类型
   - 点击「导入项目」
   - 选择本项目根目录 `ChallengeMiniapp`
   - 填写 AppID（可选择「测试号」进行开发）
   - 点击「导入」

3. **运行项目**
   - 项目导入后会自动编译
   - 在模拟器中即可预览和测试小程序功能

### 真机预览

1. 在微信开发者工具中点击「预览」
2. 使用微信扫描生成的二维码
3. 在手机微信中体验完整功能

## 核心 API 说明

### Storage 存储模块
```javascript
const Storage = require('./utils/storage.js');

// 保存/获取最高分
Storage.saveHighScore(score);
Storage.getHighScore();

// 保存/获取游戏记录
Storage.saveGameRecord(record);
Storage.getGameRecords();
```

### Timer 计时器模块
```javascript
const { Timer, TotalTimer } = require('./utils/timer.js');

// 单题计时器
const timer = new Timer({
  duration: 15,
  onTick: (remaining) => {},
  onComplete: () => {}
});
timer.start();

// 总计时器
const totalTimer = new TotalTimer();
totalTimer.start();
totalTimer.formatTime(); // "01:30"
```

### ScoreSystem 分数系统
```javascript
const ScoreSystem = require('./utils/score.js');

// 计算得分
const score = ScoreSystem.calculateScore(isCorrect, combo, timeRemaining);

// 获取等级信息
const level = ScoreSystem.getLevel(score);

// 获取评价
const evaluation = ScoreSystem.getEvaluation(score);
```

### QuestionUtils 题目工具
```javascript
const QuestionUtils = require('./utils/question.js');

// 准备游戏题目
const questions = QuestionUtils.prepareGameQuestions(allQuestions, 10);

// 检查答案是否正确
const isCorrect = QuestionUtils.checkAnswer(question, selectedIndex);
```

## 后续扩展建议

### 功能扩展
1. **更多题型**: 增加多选题、填空题、图文题
2. **题库分类**: 按学科、难度分类，支持选择难度
3. **道具系统**: 增加「提示」、「跳过」等道具
4. **好友对战**: 支持邀请好友进行 PK
5. **成就系统**: 解锁各种答题成就
6. **每日签到**: 每日签到获得奖励

### 体验优化
1. **音效系统**: 增加背景音乐、答题音效
2. **更多动画**: 增加题目切换动画、结果页动效
3. **皮肤系统**: 支持多种主题皮肤切换
4. **震动反馈**: 答题时的震动反馈

### 数据功能
1. **云同步**: 使用微信云开发实现数据云同步
2. **全球排行榜**: 接入好友排行、全国排行
3. **数据统计**: 详细的答题数据分析
4. **错题本**: 自动收集错题，支持复习

### 社交功能
1. **分享成绩**: 生成精美的成绩分享卡片
2. **好友排行**: 查看好友的答题成绩
3. **邀请功能**: 邀请好友一起答题
4. **组队挑战**: 多人组队答题模式

## 开发说明

### 代码规范
- 使用 ES6+ 语法
- 模块化开发，每个功能独立封装
- 组件化设计，提高代码复用率
- 统一的命名规范和代码风格

### 性能优化
- 页面启动时间 < 3 秒
- 合理使用 setData，避免频繁更新
- 页面切换无明显卡顿
- 长时间运行无内存泄漏

## License

MIT License - 详见 LICENSE 文件

---

**🎉 祝你答题愉快！**
