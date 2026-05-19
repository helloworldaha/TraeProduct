const questions = [
  {
    id: 1,
    question: "周末你更倾向于？",
    description: "结束了一周的忙碌，终于迎来了周末时光",
    options: [
      { text: "独自待在家，享受宁静时光", score: { introvert: 2 } },
      { text: "和朋友聚会，热闹一番", score: { extrovert: 2 } }
    ]
  },
  {
    id: 2,
    question: "做决定时你更依赖？",
    description: "面对重要选择，你的决策方式是？",
    options: [
      { text: "逻辑分析和事实数据", score: { thinking: 2 } },
      { text: "个人感受和他人意见", score: { feeling: 2 } }
    ]
  },
  {
    id: 3,
    question: "面对新任务，你更喜欢？",
    description: "工作或学习中接到新任务时",
    options: [
      { text: "按计划一步步完成", score: { judging: 2 } },
      { text: "灵活调整，随机应变", score: { perceiving: 2 } }
    ]
  },
  {
    id: 4,
    question: "听别人说话时，你更关注？",
    description: "在交流和沟通中",
    options: [
      { text: "具体的事实和细节", score: { sensing: 2 } },
      { text: "言外之意和可能性", score: { intuition: 2 } }
    ]
  },
  {
    id: 5,
    question: "参加社交活动时，你会？",
    description: "在派对或聚会场合",
    options: [
      { text: "主动认识新朋友", score: { extrovert: 2 } },
      { text: "只和熟悉的人交流", score: { introvert: 2 } }
    ]
  },
  {
    id: 6,
    question: "处理冲突时，你倾向于？",
    description: "当与他人意见不合时",
    options: [
      { text: "直言不讳，追求真相", score: { thinking: 2 } },
      { text: "顾及感受，寻求和谐", score: { feeling: 2 } }
    ]
  },
  {
    id: 7,
    question: "旅行前你会？",
    description: "计划一次旅行时",
    options: [
      { text: "详细规划每一天的行程", score: { judging: 2 } },
      { text: "随性出发，走哪算哪", score: { perceiving: 2 } }
    ]
  },
  {
    id: 8,
    question: "学习新知识时，你偏好？",
    description: "接触新领域时",
    options: [
      { text: "从实际案例入手", score: { sensing: 2 } },
      { text: "先理解理论框架", score: { intuition: 2 } }
    ]
  },
  {
    id: 9,
    question: "工作疲惫时，你会？",
    description: "感到压力和疲惫时",
    options: [
      { text: "和朋友聊天吐槽", score: { extrovert: 2 } },
      { text: "一个人静静发呆", score: { introvert: 2 } }
    ]
  },
  {
    id: 10,
    question: "给朋友提建议时，你会？",
    description: "朋友遇到困难向你求助时",
    options: [
      { text: "客观分析问题本质", score: { thinking: 2 } },
      { text: "共情安慰给予支持", score: { feeling: 2 } }
    ]
  },
  {
    id: 11,
    question: "截止日期临近时，你会？",
    description: "任务即将到期时",
    options: [
      { text: "早就完成了，从容等待", score: { judging: 2 } },
      { text: "最后时刻冲刺完成", score: { perceiving: 2 } }
    ]
  },
  {
    id: 12,
    question: "看电影时，你更关注？",
    description: "欣赏影视作品时",
    options: [
      { text: "剧情的真实性和细节", score: { sensing: 2 } },
      { text: "隐喻和深层含义", score: { intuition: 2 } }
    ]
  },
  {
    id: 13,
    question: "在团队中，你更像是？",
    description: "团队合作中的角色",
    options: [
      { text: "活跃气氛的带动者", score: { extrovert: 2 } },
      { text: "冷静观察的思考者", score: { introvert: 2 } }
    ]
  },
  {
    id: 14,
    question: "评价他人时，你更看重？",
    description: "对一个人的判断标准",
    options: [
      { text: "能力和成就", score: { thinking: 2 } },
      { text: "人品和善意", score: { feeling: 2 } }
    ]
  },
  {
    id: 15,
    question: "你的办公桌/房间通常是？",
    description: "个人空间的状态",
    options: [
      { text: "整齐有序，分类清晰", score: { judging: 2 } },
      { text: "略显杂乱，但知道东西在哪", score: { perceiving: 2 } }
    ]
  },
  {
    id: 16,
    question: "面对未来，你更相信？",
    description: "对未来的态度",
    options: [
      { text: "经验和现实", score: { sensing: 2 } },
      { text: "灵感和可能性", score: { intuition: 2 } }
    ]
  },
  {
    id: 17,
    question: "聊天时，你更倾向于？",
    description: "日常对话中的风格",
    options: [
      { text: "分享自己的经历", score: { extrovert: 2 } },
      { text: "倾听对方的故事", score: { introvert: 2 } }
    ]
  },
  {
    id: 18,
    question: "做选择时，你更担心？",
    description: "决策时的顾虑",
    options: [
      { text: "选择错误，不够理性", score: { thinking: 2 } },
      { text: "伤害他人，引发矛盾", score: { feeling: 2 } }
    ]
  },
  {
    id: 19,
    question: "制定目标后，你会？",
    description: "设定目标后的行动",
    options: [
      { text: "严格执行，定期检查", score: { judging: 2 } },
      { text: "根据情况灵活调整", score: { perceiving: 2 } }
    ]
  },
  {
    id: 20,
    question: "遇到问题时，你首先想到的是？",
    description: "面对困难时的思维方式",
    options: [
      { text: "有没有现成的解决方案", score: { sensing: 2 } },
      { text: "能不能想出新方法", score: { intuition: 2 } }
    ]
  }
];
