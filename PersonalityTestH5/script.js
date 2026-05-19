const zodiacData = {
  aries: {
    name: "白羊座",
    icon: "♈",
    date: "3.21-4.19",
    traits: ["热情", "冲动", "行动力强", "勇敢", "乐观"],
    matchTags: ["领导型", "冒险型", "开拓者"],
    description: "你拥有极强的行动力和冒险精神，从不畏惧挑战，永远保持着对生活的热情和渴望。",
    element: "火象"
  },
  taurus: {
    name: "金牛座",
    icon: "♉",
    date: "4.20-5.20",
    traits: ["稳重", "踏实", "务实", "坚韧", "耐心"],
    matchTags: ["稳健型", "实干型", "守护者"],
    description: "你拥有稳重的性格和务实的态度，一旦确定目标就会坚持不懈地追求，给人十足的安全感。",
    element: "土象"
  },
  gemini: {
    name: "双子座",
    icon: "♊",
    date: "5.21-6.21",
    traits: ["机智", "善变", "好奇", "健谈", "灵活"],
    matchTags: ["社交型", "多变型", "传播者"],
    description: "你思维敏捷，好奇心旺盛，善于与人沟通，能够快速适应各种环境，是天生的社交达人。",
    element: "风象"
  },
  cancer: {
    name: "巨蟹座",
    icon: "♋",
    date: "6.22-7.22",
    traits: ["温柔", "敏感", "顾家", "情绪化", "体贴"],
    matchTags: ["关怀型", "家庭型", "守护者"],
    description: "你拥有温柔细腻的内心，非常重视家庭和情感，对所爱之人会全心全意地付出和保护。",
    element: "水象"
  },
  leo: {
    name: "狮子座",
    icon: "♌",
    date: "7.23-8.22",
    traits: ["自信", "慷慨", "霸气", "骄傲", "热情"],
    matchTags: ["王者型", "领袖型", "创造者"],
    description: "你拥有与生俱来的自信和领导气质，慷慨大方，喜欢成为众人瞩目的焦点，永远散发着光芒。",
    element: "火象"
  },
  virgo: {
    name: "处女座",
    icon: "♍",
    date: "8.23-9.22",
    traits: ["完美主义", "细致", "理性", "挑剔", "勤奋"],
    matchTags: ["完美型", "分析型", "服务者"],
    description: "你追求完美，注重细节，拥有敏锐的分析能力，对自己和他人都有很高的要求，是值得信赖的人。",
    element: "土象"
  },
  libra: {
    name: "天秤座",
    icon: "♎",
    date: "9.23-10.23",
    traits: ["优雅", "公正", "和谐", "犹豫", "社交"],
    matchTags: ["平衡型", "外交型", "协调者"],
    description: "你追求和谐与平衡，拥有优雅的气质和出色的社交能力，善于协调各种关系，是天生的外交家。",
    element: "风象"
  },
  scorpio: {
    name: "天蝎座",
    icon: "♏",
    date: "10.24-11.22",
    traits: ["神秘", "深刻", "执着", "占有欲", "洞察力"],
    matchTags: ["深邃型", "变革型", "探索者"],
    description: "你拥有神秘的气质和深刻的洞察力，对事物有着执着的追求，一旦认定就会全力以赴，绝不轻言放弃。",
    element: "水象"
  },
  sagittarius: {
    name: "射手座",
    icon: "♐",
    date: "11.23-12.21",
    traits: ["乐观", "自由", "坦率", "哲学", "冒险"],
    matchTags: ["自由型", "探索型", "哲学家"],
    description: "你热爱自由，乐观开朗，对世界充满好奇和探索的渴望，永远在追求真理和更广阔的天地。",
    element: "火象"
  },
  capricorn: {
    name: "摩羯座",
    icon: "♑",
    date: "12.22-1.19",
    traits: ["稳重", "野心", "务实", "自律", "坚韧"],
    matchTags: ["成就型", "实干型", "攀登者"],
    description: "你拥有超强的自律和野心，脚踏实地地追求目标，一步一个脚印地向上攀登，终将达到顶峰。",
    element: "土象"
  },
  aquarius: {
    name: "水瓶座",
    icon: "♒",
    date: "1.20-2.18",
    traits: ["独立", "创新", "理性", "独特", "博爱"],
    matchTags: ["创新型", "独立型", "变革者"],
    description: "你拥有独立的思想和创新的精神，不随波逐流，用独特的视角看待世界，是走在时代前沿的人。",
    element: "风象"
  },
  pisces: {
    name: "双鱼座",
    icon: "♓",
    date: "2.19-3.20",
    traits: ["浪漫", "梦幻", "敏感", "慈悲", "艺术"],
    matchTags: ["浪漫型", "艺术型", "梦想家"],
    description: "你拥有浪漫的灵魂和丰富的想象力，充满慈悲和艺术气息，活在自己的梦幻世界中，美好而纯粹。",
    element: "水象"
  }
};

const luckyKeywords = {
  aries: ["红色", "9", "红宝石", "勇气"],
  taurus: ["绿色", "6", "翡翠", "稳定"],
  gemini: ["黄色", "5", "黄水晶", "智慧"],
  cancer: ["银色", "2", "珍珠", "守护"],
  leo: ["金色", "1", "琥珀", "荣耀"],
  virgo: ["灰色", "7", "蓝宝石", "完美"],
  libra: ["粉色", "4", "粉晶", "和谐"],
  scorpio: ["黑色", "8", "黑玛瑙", "力量"],
  sagittarius: ["紫色", "3", "紫水晶", "自由"],
  capricorn: ["棕色", "10", "钻石", "成就"],
  aquarius: ["蓝色", "11", "海蓝宝", "创新"],
  pisces: ["海蓝", "12", "月光石", "梦想"]
};

const dailyHoroscopes = [
  "今天你的能量满满，适合开启新的计划和挑战，大胆去做吧！",
  "今天可能会有意外的惊喜降临，保持开放的心态迎接它。",
  "今天适合静下心来思考人生，或许会有新的领悟和启发。",
  "今天你的社交运势极佳，多与人交流可能会有意想不到的收获。",
  "今天适合放松身心，给自己一些独处的时间，充充电。",
  "今天你的创造力爆棚，适合做一些创意工作，会有不错的成果。",
  "今天可能会遇到贵人相助，抓住机会，不要犹豫。"
];

const relationshipTypes = [
  "灵魂搭档型",
  "欢喜冤家型",
  "互补成长型",
  "默契无间型",
  "激情火花型",
  "细水长流型",
  "互相成就型",
  "知己爱人型"
];

const state = {
  currentQuestion: 0,
  answers: [],
  scores: {
    introvert: 0,
    extrovert: 0,
    thinking: 0,
    feeling: 0,
    judging: 0,
    perceiving: 0,
    sensing: 0,
    intuition: 0
  },
  result: null,
  shuffledQuestions: [],
  selectedZodiac: null,
  zodiacResult: null,
  mode: 'single',
  coupleStep: 1,
  coupleZodiacStep: 1,
  userAResult: null,
  userBResult: null,
  coupleResult: null,
  coupleZodiacResult: null
};

const elements = {
  homePage: document.getElementById('homePage'),
  testPage: document.getElementById('testPage'),
  resultPage: document.getElementById('resultPage'),
  zodiacSelectPage: document.getElementById('zodiacSelectPage'),
  zodiacResultPage: document.getElementById('zodiacResultPage'),
  coupleModePage: document.getElementById('coupleModePage'),
  coupleResultPage: document.getElementById('coupleResultPage'),
  questionTitle: document.getElementById('questionTitle'),
  questionDesc: document.getElementById('questionDesc'),
  optionsList: document.getElementById('optionsList'),
  currentNum: document.getElementById('currentNum'),
  progressPercent: document.getElementById('progressPercent'),
  progressFill: document.getElementById('progressFill'),
  prevBtn: document.getElementById('prevBtn'),
  startBtn: document.getElementById('startBtn'),
  resultContainer: document.getElementById('resultContainer'),
  posterBtn: document.getElementById('posterBtn'),
  retryBtn: document.getElementById('retryBtn'),
  homeBtn: document.getElementById('homeBtn'),
  posterModal: document.getElementById('posterModal'),
  posterCanvas: document.getElementById('posterCanvas'),
  savePosterBtn: document.getElementById('savePosterBtn'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  confettiContainer: document.getElementById('confettiContainer'),
  heartParticlesContainer: document.getElementById('heartParticlesContainer'),
  testCount: document.getElementById('testCount'),
  shareBtn: document.getElementById('shareBtn'),
  zodiacEntryBtn: document.getElementById('zodiacEntryBtn'),
  zodiacGrid: document.getElementById('zodiacGrid'),
  zodiacResultContainer: document.getElementById('zodiacResultContainer'),
  zodiacPosterBtn: document.getElementById('zodiacPosterBtn'),
  zodiacRetryBtn: document.getElementById('zodiacRetryBtn'),
  zodiacHomeBtn: document.getElementById('zodiacHomeBtn'),
  singleModeBtn: document.getElementById('singleModeBtn'),
  coupleModeBtn: document.getElementById('coupleModeBtn'),
  startCoupleTestBtn: document.getElementById('startCoupleTestBtn'),
  currentUserName: document.getElementById('currentUserName'),
  currentUserAvatar: document.getElementById('currentUserAvatar'),
  step1: document.getElementById('step1'),
  step2: document.getElementById('step2'),
  step3: document.getElementById('step3'),
  coupleResultContainer: document.getElementById('coupleResultContainer'),
  couplePosterBtn: document.getElementById('couplePosterBtn'),
  coupleRetryBtn: document.getElementById('coupleRetryBtn'),
  coupleHomeBtn: document.getElementById('coupleHomeBtn'),
  coupleZodiacBtn: document.getElementById('coupleZodiacBtn')
};

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function animateNumber(element, target, duration = 1000) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(start + (target - start) * progress);
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2
    };
  }
  
  function init() {
    resize();
    particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle());
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  
  window.addEventListener('resize', resize);
  init();
  animate();
}

function initStarBackground() {
  const starBg = document.createElement('div');
  starBg.className = 'star-bg';
  starBg.id = 'starBg';
  
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    starBg.appendChild(star);
  }
  
  for (let i = 0; i < 3; i++) {
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    shootingStar.style.left = Math.random() * 80 + 20 + '%';
    shootingStar.style.top = Math.random() * 40 + '%';
    shootingStar.style.animationDelay = (i * 4 + Math.random() * 2) + 's';
    starBg.appendChild(shootingStar);
  }
  
  document.body.appendChild(starBg);
}

function selectZodiac(zodiacKey) {
  state.selectedZodiac = zodiacKey;
  const zodiac = zodiacData[zodiacKey];
  const personality = state.result;
  
  const merged = mergePersonalityAndZodiac(personality, zodiac);
  state.zodiacResult = merged;
  
  saveZodiacHistory();
  showPage('zodiacResult');
  renderZodiacResult();
  createConfetti();
}

function selectCoupleZodiac(zodiacKey) {
  if (state.coupleZodiacStep === 1) {
    state.userAResult.zodiac = zodiacKey;
    state.coupleZodiacStep = 2;
    showPage('zodiacSelect');
  } else {
    state.userBResult.zodiac = zodiacKey;
    generateCoupleZodiacResult();
    showPage('coupleResult');
    renderCoupleResult();
    createHeartParticles();
  }
}

function generateCoupleZodiacResult() {
  const score = calculateMatchScore(state.userAResult, state.userBResult);
  const comparison = comparePersonality(state.userAResult, state.userBResult);
  const analysis = generateRelationshipAnalysis(comparison.strengths, comparison.conflicts);
  const tags = getCompatibilityTags(score);
  const relationshipType = relationshipTypes[Math.floor(Math.random() * relationshipTypes.length)];
  
  state.coupleResult = {
    score: score,
    relationshipType: relationshipType,
    tags: tags,
    analysis: analysis,
    userA: state.userAResult,
    userB: state.userBResult,
    hasZodiac: true,
    userAZodiac: zodiacData[state.userAResult.zodiac],
    userBZodiac: zodiacData[state.userBResult.zodiac]
  };
  
  saveCoupleHistory();
}

function getZodiacTraits(zodiacKey) {
  return zodiacData[zodiacKey]?.traits || [];
}

function mergePersonalityAndZodiac(personality, zodiac) {
  const combinedTraits = [...personality.tags, ...zodiac.traits].slice(0, 6);
  
  const traitAnalysis = generateTraitAnalysis(personality, zodiac);
  const socialStyle = generateSocialStyle(personality, zodiac);
  const loveStyle = generateLoveStyle(personality, zodiac);
  
  const lucky = luckyKeywords[Object.keys(zodiacData).find(key => zodiacData[key].name === zodiac.name)] || luckyKeywords.aquarius;
  const horoscope = dailyHoroscopes[Math.floor(Math.random() * dailyHoroscopes.length)];
  
  return {
    personality: personality,
    zodiac: zodiac,
    combinedTraits: combinedTraits,
    traitAnalysis: traitAnalysis,
    socialStyle: socialStyle,
    loveStyle: loveStyle,
    luckyKeywords: lucky,
    dailyHoroscope: horoscope
  };
}

function generateTraitAnalysis(personality, zodiac) {
  const analyses = [
    `${personality.name}的${personality.tags[0]}特质与${zodiac.name}的${zodiac.traits[0]}完美融合，让你在人群中独树一帜。`,
    `你的${personality.tags[1]}性格加上${zodiac.element}星座的能量，形成了你独特的处事风格。`,
    `${zodiac.name}的${zodiac.traits[1]}与${personality.typeCode}的思维方式相辅相成，让你拥有超强的综合能力。`
  ];
  return analyses.join(' ');
}

function generateSocialStyle(personality, zodiac) {
  return `在社交场合中，你展现出${personality.typeCode}特有的${personality.tags[0]}特质，同时融入了${zodiac.name}的${zodiac.traits[2]}，让你既能够保持独立思考，又能与他人和谐相处，是团队中不可或缺的存在。`;
}

function generateLoveStyle(personality, zodiac) {
  return `恋爱中的你，既有${personality.typeCode}的${personality.tags[Math.floor(Math.random() * personality.tags.length)]}，又带着${zodiac.name}的${zodiac.traits[Math.floor(Math.random() * zodiac.traits.length)]}，这种独特的组合让你的感情生活既充满深度又富有激情。`;
}

function renderZodiacGrid() {
  const grid = elements.zodiacGrid;
  grid.innerHTML = '';
  
  const isCoupleMode = state.mode === 'couple';
  const title = isCoupleMode ? (state.coupleZodiacStep === 1 ? '👤 选择用户 A 的星座' : '👤 选择用户 B 的星座') : '🌟 选择你的星座';
  
  const header = document.createElement('div');
  header.className = 'zodiac-header';
  header.innerHTML = `
    <h2 class="zodiac-title">${title}</h2>
    <p class="zodiac-subtitle">结合性格测试，解锁更深度的人格分析</p>
  `;
  grid.parentNode.insertBefore(header, grid);
  
  Object.entries(zodiacData).forEach(([key, zodiac]) => {
    const card = document.createElement('div');
    card.className = 'zodiac-card';
    card.innerHTML = `
      <span class="zodiac-icon">${zodiac.icon}</span>
      <div class="zodiac-name">${zodiac.name}</div>
      <div class="zodiac-date">${zodiac.date}</div>
    `;
    card.onclick = () => isCoupleMode ? selectCoupleZodiac(key) : selectZodiac(key);
    grid.appendChild(card);
  });
}

function renderZodiacResult() {
  const result = state.zodiacResult;
  if (!result) return;
  
  const container = elements.zodiacResultContainer;
  container.innerHTML = `
    <div class="zodiac-result-header">
      <div class="zodiac-result-type">
        <span class="personality-type">${result.personality.typeCode}</span>
        <span class="zodiac-cross">×</span>
        <span class="zodiac-icon">${result.zodiac.icon}</span>
        <span class="zodiac-type">${result.zodiac.name}</span>
      </div>
      <div class="zodiac-result-tags">
        ${result.combinedTraits.map(trait => `<span class="zodiac-tag">${trait}</span>`).join('')}
      </div>
      <div class="lucky-keywords">
        ${result.luckyKeywords.map(keyword => `<span class="lucky-keyword">✨ ${keyword}</span>`).join('')}
      </div>
    </div>
    
    <div class="analysis-section zodiac-analysis-section">
      <div class="analysis-title">
        <span>🌟</span> 综合人格分析
      </div>
      <div class="analysis-content">${result.traitAnalysis}</div>
    </div>
    
    <div class="analysis-section">
      <div class="analysis-title">
        <span>❤️</span> 情感倾向
      </div>
      <div class="analysis-content">${result.loveStyle}</div>
    </div>
    
    <div class="analysis-section">
      <div class="analysis-title">
        <span>👥</span> 社交风格
      </div>
      <div class="analysis-content">${result.socialStyle}</div>
    </div>
    
    <div class="analysis-section daily-horoscope">
      <div class="analysis-title">
        <span>🔮</span> 今日运势
      </div>
      <div class="analysis-content">${result.dailyHoroscope}</div>
    </div>
  `;
}

function saveZodiacHistory() {
  const history = {
    selectedZodiac: state.selectedZodiac,
    zodiacResult: state.zodiacResult,
    timestamp: Date.now()
  };
  localStorage.setItem('zodiacTest', JSON.stringify(history));
  
  const combinations = JSON.parse(localStorage.getItem('zodiacCombinations') || '[]');
  combinations.unshift({
    personalityType: state.result.typeCode,
    zodiac: state.selectedZodiac,
    timestamp: Date.now()
  });
  localStorage.setItem('zodiacCombinations', JSON.stringify(combinations.slice(0, 10)));
}

function loadZodiacHistory() {
  const saved = localStorage.getItem('zodiacTest');
  if (saved) {
    try {
      const history = JSON.parse(saved);
      const age = Date.now() - history.timestamp;
      
      if (age < 7 * 24 * 60 * 60 * 1000) {
        state.selectedZodiac = history.selectedZodiac;
        state.zodiacResult = history.zodiacResult;
        return true;
      }
    } catch (e) {
      console.error('Failed to load zodiac history:', e);
    }
  }
  return false;
}

function calculateMatchScore(personA, personB) {
  let score = 50;
  
  const typeA = personA.typeCode;
  const typeB = personB.typeCode;
  
  const eiA = typeA[0];
  const eiB = typeB[0];
  if (eiA !== eiB) score += 10;
  else score += 5;
  
  const snA = typeA[1];
  const snB = typeB[1];
  if (snA !== snB) score += 8;
  else score += 4;
  
  const tfA = typeA[2];
  const tfB = typeB[2];
  if (tfA !== tfB) score += 12;
  else score += 6;
  
  const jpA = typeA[3];
  const jpB = typeB[3];
  if (jpA !== jpB) score += 10;
  else score += 5;
  
  if (personA.zodiac && personB.zodiac) {
    const elementA = zodiacData[personA.zodiac]?.element;
    const elementB = zodiacData[personB.zodiac]?.element;
    if (elementA && elementB) {
      const compatibleElements = {
        '火象': ['火象', '风象'],
        '土象': ['土象', '水象'],
        '风象': ['风象', '火象'],
        '水象': ['水象', '土象']
      };
      if (compatibleElements[elementA]?.includes(elementB)) {
        score += 5;
      }
    }
  }
  
  score += Math.floor(Math.random() * 10);
  
  return Math.min(99, Math.max(60, score));
}

function comparePersonality(personA, personB) {
  const strengths = [];
  const conflicts = [];
  
  if (personA.typeCode[0] !== personB.typeCode[0]) {
    strengths.push('内外向互补，社交与独处完美平衡');
  } else {
    conflicts.push('能量方向相似，可能在社交节奏上产生分歧');
  }
  
  if (personA.typeCode[2] !== personB.typeCode[2]) {
    strengths.push('思维方式互补，理性与感性完美结合');
  } else {
    conflicts.push('决策方式相似，可能在处理情绪上产生摩擦');
  }
  
  if (personA.typeCode[3] !== personB.typeCode[3]) {
    strengths.push('生活方式互补，计划与灵活相得益彰');
  } else {
    conflicts.push('生活态度相似，可能在执行力上产生冲突');
  }
  
  return { strengths, conflicts };
}

function generateRelationshipAnalysis(strengths, conflicts) {
  const advice = [];
  
  if (conflicts.length > 0) {
    advice.push('多沟通，理解彼此的差异是互补而非对立');
    advice.push('给对方足够的空间和尊重');
    advice.push('学会欣赏对方与自己不同的地方');
  }
  
  if (strengths.length > 1) {
    advice.push('利用你们的互补优势，共同成长');
    advice.push('你们的组合在团队中会非常有战斗力');
  }
  
  return {
    strengths: strengths,
    conflicts: conflicts.length > 0 ? conflicts : ['你们的性格非常契合，几乎没有明显的冲突点'],
    advice: advice.length > 0 ? advice : ['继续保持现在的相处方式，你们是天生的一对']
  };
}

function getCompatibilityTags(score) {
  const tags = [];
  
  if (score >= 90) {
    tags.push('天作之合', '灵魂伴侣', '默契满分');
  } else if (score >= 80) {
    tags.push('非常契合', '互补佳偶', '甜蜜满分');
  } else if (score >= 70) {
    tags.push('相处融洽', '共同成长', '欢喜冤家');
  } else {
    tags.push('需要磨合', '互相包容', '潜力无限');
  }
  
  return tags;
}

function createHeartParticles() {
  const hearts = ['❤️', '💕', '💖', '💗', '💓', '💞', '💘'];
  
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'heart-particle';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.bottom = '0';
      heart.style.animationDelay = Math.random() * 0.5 + 's';
      elements.heartParticlesContainer.appendChild(heart);
      
      setTimeout(() => heart.remove(), 4000);
    }, i * 100);
  }
}

function animateMatchScore(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeOut);
    element.textContent = current + '%';
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

function startCoupleMode() {
  state.mode = 'couple';
  state.coupleStep = 1;
  state.coupleZodiacStep = 1;
  state.userAResult = null;
  state.userBResult = null;
  updateCoupleStepUI();
  showPage('coupleMode');
}

function updateCoupleStepUI() {
  elements.step1.classList.remove('active', 'completed');
  elements.step2.classList.remove('active', 'completed');
  elements.step3.classList.remove('active', 'completed');
  
  if (state.coupleStep === 1) {
    elements.step1.classList.add('active');
    elements.currentUserName.textContent = '用户 A';
    elements.currentUserAvatar.textContent = '👤';
  } else if (state.coupleStep === 2) {
    elements.step1.classList.add('completed');
    elements.step2.classList.add('active');
    elements.currentUserName.textContent = '用户 B';
    elements.currentUserAvatar.textContent = '👤';
  } else {
    elements.step1.classList.add('completed');
    elements.step2.classList.add('completed');
    elements.step3.classList.add('active');
  }
}

function finishCoupleTest() {
  const typeCode = calculateResult();
  const result = {
    typeCode: typeCode,
    ...getPersonalityType(typeCode),
    scores: { ...state.scores }
  };
  
  if (state.coupleStep === 1) {
    state.userAResult = result;
    state.coupleStep = 2;
    resetTestState();
    updateCoupleStepUI();
    showPage('coupleMode');
  } else {
    state.userBResult = result;
    generateCoupleResult();
    state.coupleStep = 3;
    updateCoupleStepUI();
    showPage('coupleResult');
    renderCoupleResult();
    createHeartParticles();
    saveCoupleHistory();
  }
}

function generateCoupleResult() {
  const score = calculateMatchScore(state.userAResult, state.userBResult);
  const comparison = comparePersonality(state.userAResult, state.userBResult);
  const analysis = generateRelationshipAnalysis(comparison.strengths, comparison.conflicts);
  const tags = getCompatibilityTags(score);
  const relationshipType = relationshipTypes[Math.floor(Math.random() * relationshipTypes.length)];
  
  state.coupleResult = {
    score: score,
    relationshipType: relationshipType,
    tags: tags,
    analysis: analysis,
    userA: state.userAResult,
    userB: state.userBResult
  };
}

function renderCoupleResult() {
  const result = state.coupleResult;
  if (!result) return;
  
  const container = elements.coupleResultContainer;
  container.innerHTML = `
    <div class="match-score-section">
      <div class="match-score-number" id="matchScoreNumber">0%</div>
      <div class="match-score-label">情侣匹配指数</div>
      <div class="match-relationship-type">${result.relationshipType}</div>
      <div class="compatibility-tags">
        ${result.tags.map(tag => `<span class="compatibility-tag">${tag}</span>`).join('')}
      </div>
    </div>
    
    <div class="couple-personality-cards">
      <div class="couple-personality-card">
        <div class="couple-personality-avatar">👤</div>
        <div class="couple-personality-type">${result.userA.typeCode}</div>
        <div class="couple-personality-name">${result.userA.name}</div>
        ${result.hasZodiac && result.userAZodiac ? `<div class="couple-zodiac">${result.userAZodiac.icon} ${result.userAZodiac.name}</div>` : ''}
      </div>
      <div class="couple-personality-card">
        <div class="couple-personality-avatar">👤</div>
        <div class="couple-personality-type">${result.userB.typeCode}</div>
        <div class="couple-personality-name">${result.userB.name}</div>
        ${result.hasZodiac && result.userBZodiac ? `<div class="couple-zodiac">${result.userBZodiac.icon} ${result.userBZodiac.name}</div>` : ''}
      </div>
    </div>
    
    <div class="analysis-section strengths-section">
      <div class="analysis-title">
        <span>💪</span> 性格互补优势
      </div>
      <div class="analysis-content">
        <ul style="padding-left: 20px; margin: 0;">
          ${result.analysis.strengths.map(s => `<li style="margin-bottom: 8px;">${s}</li>`).join('')}
        </ul>
      </div>
    </div>
    
    <div class="analysis-section conflicts-section">
      <div class="analysis-title">
        <span>⚠️</span> 容易冲突的地方
      </div>
      <div class="analysis-content">
        <ul style="padding-left: 20px; margin: 0;">
          ${result.analysis.conflicts.map(c => `<li style="margin-bottom: 8px;">${c}</li>`).join('')}
        </ul>
      </div>
    </div>
    
    <div class="analysis-section advice-section">
      <div class="analysis-title">
        <span>💡</span> 相处建议
      </div>
      <div class="analysis-content">
        <ul style="padding-left: 20px; margin: 0;">
          ${result.analysis.advice.map(a => `<li style="margin-bottom: 8px;">${a}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    const scoreElement = document.getElementById('matchScoreNumber');
    animateMatchScore(scoreElement, result.score);
  }, 300);
}

function saveCoupleHistory() {
  const history = {
    userAResult: state.userAResult,
    userBResult: state.userBResult,
    coupleResult: state.coupleResult,
    timestamp: Date.now()
  };
  localStorage.setItem('coupleTest', JSON.stringify(history));
  
  const matches = JSON.parse(localStorage.getItem('matchHistory') || '[]');
  matches.unshift({
    userA: state.userAResult.typeCode,
    userB: state.userBResult.typeCode,
    score: state.coupleResult.score,
    timestamp: Date.now()
  });
  localStorage.setItem('matchHistory', JSON.stringify(matches.slice(0, 10)));
}

function loadCoupleHistory() {
  const saved = localStorage.getItem('coupleTest');
  if (saved) {
    try {
      const history = JSON.parse(saved);
      const age = Date.now() - history.timestamp;
      
      if (age < 7 * 24 * 60 * 60 * 1000) {
        state.userAResult = history.userAResult;
        state.userBResult = history.userBResult;
        state.coupleResult = history.coupleResult;
        return true;
      }
    } catch (e) {
      console.error('Failed to load couple history:', e);
    }
  }
  return false;
}

function resetTestState() {
  state.currentQuestion = 0;
  state.answers = [];
  state.scores = {
    introvert: 0, extrovert: 0, thinking: 0, feeling: 0,
    judging: 0, perceiving: 0, sensing: 0, intuition: 0
  };
  state.shuffledQuestions = shuffleArray(questions);
}

function generateZodiacPoster() {
  const canvas = elements.posterCanvas;
  const ctx = canvas.getContext('2d');
  const result = state.zodiacResult;
  
  const width = 375;
  const height = 780;
  canvas.width = width;
  canvas.height = height;
  
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0f0f23');
  gradient.addColorStop(0.5, '#1a1a3e');
  gradient.addColorStop(1, '#0f0f23');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  ctx.fillStyle = 'rgba(102, 126, 234, 0.15)';
  ctx.beginPath();
  ctx.arc(50, 100, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width - 50, height - 100, 80, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(240, 147, 251, 0.1)';
  ctx.beginPath();
  ctx.arc(30, height - 80, 50, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.roundRect(20, 30, width - 40, 180, 20);
  ctx.fill();
  
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  const typeGradient = ctx.createLinearGradient(width/2 - 100, 0, width/2 + 100, 0);
  typeGradient.addColorStop(0, '#667eea');
  typeGradient.addColorStop(0.5, '#764ba2');
  typeGradient.addColorStop(1, '#f093fb');
  ctx.fillStyle = typeGradient;
  ctx.fillText(`${result.personality.typeCode} × ${result.zodiac.icon}`, width / 2, 80);
  
  ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${result.personality.name} · ${result.zodiac.name}`, width / 2, 120);
  
  ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#a0a0b0';
  const descLines = wrapText(ctx, result.traitAnalysis.substring(0, 50) + '...', width - 80);
  descLines.forEach((line, i) => {
    ctx.fillText(line, width / 2, 155 + i * 20);
  });
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.roundRect(20, 230, width - 40, 100, 16);
  ctx.fill();
  
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText('性格标签', 40, 260);
  
  ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
  let tagX = 40;
  let tagY = 285;
  result.combinedTraits.slice(0, 6).forEach((trait, i) => {
    const tagWidth = ctx.measureText(trait).width + 20;
    if (tagX + tagWidth > width - 40) {
      tagX = 40;
      tagY += 28;
    }
    ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
    ctx.roundRect(tagX, tagY - 18, tagWidth, 24, 12);
    ctx.fill();
    ctx.fillStyle = '#aabbff';
    ctx.fillText(trait, tagX + 10, tagY);
    tagX += tagWidth + 8;
  });
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.roundRect(20, 350, width - 40, 100, 16);
  ctx.fill();
  
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('幸运关键词', 40, 380);
  
  ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
  let luckyX = 40;
  let luckyY = 410;
  result.luckyKeywords.forEach((keyword, i) => {
    const kwWidth = ctx.measureText(keyword).width + 24;
    if (luckyX + kwWidth > width - 40) {
      luckyX = 40;
      luckyY += 28;
    }
    const kwGradient = ctx.createLinearGradient(luckyX, luckyY - 18, luckyX + kwWidth, luckyY);
    kwGradient.addColorStop(0, '#667eea');
    kwGradient.addColorStop(1, '#f093fb');
    ctx.fillStyle = kwGradient;
    ctx.roundRect(luckyX, luckyY - 18, kwWidth, 24, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(keyword, luckyX + 12, luckyY);
    luckyX += kwWidth + 8;
  });
  
  ctx.fillStyle = 'rgba(102, 126, 234, 0.15)';
  ctx.roundRect(20, 470, width - 40, 120, 16);
  ctx.fill();
  
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#667eea';
  ctx.fillText('🔮 今日运势', 40, 500);
  
  ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#a0a0b0';
  const horoscopeLines = wrapText(ctx, result.dailyHoroscope, width - 80);
  horoscopeLines.forEach((line, i) => {
    ctx.fillText(line, 40, 530 + i * 22);
  });
  
  const qrY = 620;
  const qrSize = 90;
  const qrX = (width - qrSize) / 2;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  
  const qrPattern = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],
    [1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1]
  ];
  
  const cellSize = qrSize / qrPattern.length;
  ctx.fillStyle = '#1a1a2e';
  qrPattern.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell) {
        ctx.fillRect(qrX + j * cellSize, qrY + i * cellSize, cellSize, cellSize);
      }
    });
  });
  
  ctx.textAlign = 'center';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#e0e0e8';
  ctx.fillText('扫描二维码，发现你的性格', width / 2, qrY + qrSize + 22);
  
  ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#b0b0c0';
  ctx.fillText('AI 性格测试 × 星座分析', width / 2, qrY + qrSize + 42);
  
  elements.posterModal.classList.add('active');
}

function generateCouplePoster() {
  const canvas = elements.posterCanvas;
  const ctx = canvas.getContext('2d');
  const result = state.coupleResult;
  
  const width = 375;
  const height = 900;
  canvas.width = width;
  canvas.height = height;
  
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1a0a1a');
  gradient.addColorStop(0.5, '#2d1a2d');
  gradient.addColorStop(1, '#1a0a1a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  ctx.fillStyle = 'rgba(255, 107, 107, 0.15)';
  ctx.beginPath();
  ctx.arc(50, 100, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width - 50, height - 200, 100, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(240, 147, 251, 0.1)';
  ctx.beginPath();
  ctx.arc(30, height - 180, 60, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.roundRect(20, 30, width - 40, 200, 20);
  ctx.fill();
  
  ctx.font = 'bold 64px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  const scoreGradient = ctx.createLinearGradient(width/2 - 80, 0, width/2 + 80, 0);
  scoreGradient.addColorStop(0, '#ff6b6b');
  scoreGradient.addColorStop(0.5, '#f093fb');
  scoreGradient.addColorStop(1, '#c44569');
  ctx.fillStyle = scoreGradient;
  ctx.fillText(result.score + '%', width / 2, 100);
  
  ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#a0a0b0';
  ctx.fillText('情侣匹配指数', width / 2, 135);
  
  const typeGradient2 = ctx.createLinearGradient(width/2 - 100, 0, width/2 + 100, 0);
  typeGradient2.addColorStop(0, '#ff6b6b');
  typeGradient2.addColorStop(1, '#f093fb');
  ctx.fillStyle = typeGradient2;
  ctx.roundRect(width/2 - 80, 155, 160, 36, 18);
  ctx.fill();
  
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(result.relationshipType, width / 2, 180);
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.roundRect(20, 250, width - 40, 120, 16);
  ctx.fill();
  
  const cardWidth = (width - 60) / 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.roundRect(40, 280, cardWidth, 60, 12);
  ctx.fill();
  
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
  const typeGradient3 = ctx.createLinearGradient(0, 0, width, 0);
  typeGradient3.addColorStop(0, '#667eea');
  typeGradient3.addColorStop(1, '#764ba2');
  ctx.fillStyle = typeGradient3;
  ctx.textAlign = 'center';
  ctx.fillText(result.userA.typeCode, 40 + cardWidth/2, 318);
  ctx.fillText(result.userB.typeCode, width - 40 - cardWidth/2, 318);
  
  ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#a0a0b0';
  ctx.fillText(result.userA.name, 40 + cardWidth/2, 338);
  ctx.fillText(result.userB.name, width - 40 - cardWidth/2, 338);
  
  ctx.font = '20px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#ff6b6b';
  ctx.fillText('❤', width / 2, 315);
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.roundRect(20, 390, width - 40, 100, 16);
  ctx.fill();
  
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText('匹配标签', 40, 420);
  
  ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
  let cTagX = 40;
  let cTagY = 445;
  result.tags.forEach((tag, i) => {
    const tagWidth = ctx.measureText(tag).width + 24;
    if (cTagX + tagWidth > width - 40) {
      cTagX = 40;
      cTagY += 28;
    }
    ctx.fillStyle = 'rgba(255, 107, 107, 0.3)';
    ctx.roundRect(cTagX, cTagY - 18, tagWidth, 24, 12);
    ctx.fill();
    ctx.fillStyle = '#ff9999';
    ctx.fillText(tag, cTagX + 12, cTagY);
    cTagX += tagWidth + 8;
  });
  
  ctx.fillStyle = 'rgba(76, 175, 80, 0.15)';
  ctx.roundRect(20, 510, width - 40, 100, 16);
  ctx.fill();
  
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#81c784';
  ctx.fillText('💪 互补优势', 40, 540);
  
  ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#a0a0b0';
  const strengthText = result.analysis.strengths[0] || '你们是天生的一对';
  const strengthLines = wrapText(ctx, strengthText, width - 80);
  strengthLines.forEach((line, i) => {
    ctx.fillText(line, 40, 565 + i * 20);
  });
  
  const qrY = 640;
  const qrSize = 90;
  const qrX = (width - qrSize) / 2;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  
  const qrPattern2 = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],
    [1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1]
  ];
  
  const cellSize2 = qrSize / qrPattern2.length;
  ctx.fillStyle = '#1a0a1a';
  qrPattern2.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell) {
        ctx.fillRect(qrX + j * cellSize2, qrY + i * cellSize2, cellSize2, cellSize2);
      }
    });
  });
  
  ctx.textAlign = 'center';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#e0e0e8';
  ctx.fillText('扫描二维码，测试你们的默契', width / 2, qrY + qrSize + 22);
  
  ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#b0b0c0';
  ctx.fillText('AI 情侣匹配 · 发现你们的缘分', width / 2, qrY + qrSize + 42);
  
  elements.posterModal.classList.add('active');
}

function startTest() {
  state.currentQuestion = 0;
  state.answers = [];
  state.scores = {
    introvert: 0, extrovert: 0, thinking: 0, feeling: 0,
    judging: 0, perceiving: 0, sensing: 0, intuition: 0
  };
  state.shuffledQuestions = shuffleArray(questions);
  
  showPage('test');
  renderQuestion();
  saveHistory();
}

function renderQuestion() {
  const question = state.shuffledQuestions[state.currentQuestion];
  
  elements.questionTitle.textContent = question.question;
  elements.questionDesc.textContent = question.description;
  
  elements.optionsList.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = option.text;
    btn.onclick = () => selectOption(index);
    elements.optionsList.appendChild(btn);
  });
  
  updateProgress();
  elements.prevBtn.disabled = state.currentQuestion === 0;
  
  const questionCard = document.querySelector('.question-card');
  questionCard.style.animation = 'none';
  questionCard.offsetHeight;
  questionCard.style.animation = 'cardIn 0.4s ease';
}

function selectOption(optionIndex) {
  const question = state.shuffledQuestions[state.currentQuestion];
  const selectedOption = question.options[optionIndex];
  
  if (state.answers[state.currentQuestion]) {
    const prevScore = state.answers[state.currentQuestion].score;
    Object.keys(prevScore).forEach(key => {
      state.scores[key] -= prevScore[key];
    });
  }
  
  state.answers[state.currentQuestion] = {
    questionIndex: state.currentQuestion,
    optionIndex: optionIndex,
    score: { ...selectedOption.score }
  };
  
  Object.keys(selectedOption.score).forEach(key => {
    state.scores[key] += selectedOption.score[key];
  });
  
  const buttons = elements.optionsList.querySelectorAll('.option-btn');
  buttons.forEach((btn, i) => {
    btn.classList.toggle('selected', i === optionIndex);
  });
  
  setTimeout(() => {
    if (state.currentQuestion < questions.length - 1) {
      nextQuestion();
    } else {
      finishTest();
    }
  }, 300);
  
  saveHistory();
}

function nextQuestion() {
  if (state.currentQuestion < questions.length - 1) {
    state.currentQuestion++;
    
    if (state.answers[state.currentQuestion]) {
      const savedAnswer = state.answers[state.currentQuestion];
      renderQuestion();
      const buttons = elements.optionsList.querySelectorAll('.option-btn');
      if (buttons[savedAnswer.optionIndex]) {
        buttons[savedAnswer.optionIndex].classList.add('selected');
      }
    } else {
      renderQuestion();
    }
  }
}

function goToPrevQuestion() {
  if (state.currentQuestion > 0) {
    state.currentQuestion--;
    renderQuestion();
    
    const savedAnswer = state.answers[state.currentQuestion];
    if (savedAnswer !== undefined) {
      const buttons = elements.optionsList.querySelectorAll('.option-btn');
      if (buttons[savedAnswer.optionIndex]) {
        buttons[savedAnswer.optionIndex].classList.add('selected');
      }
    }
  }
}

function updateProgress() {
  const current = state.currentQuestion + 1;
  const total = questions.length;
  const percent = Math.round((current / total) * 100);
  
  elements.currentNum.textContent = current;
  elements.progressPercent.textContent = percent + '%';
  elements.progressFill.style.width = percent + '%';
}

function calculateResult() {
  const { scores } = state;
  
  const ei = scores.extrovert >= scores.introvert ? 'E' : 'I';
  const sn = scores.intuition >= scores.sensing ? 'N' : 'S';
  const tf = scores.thinking >= scores.feeling ? 'T' : 'F';
  const jp = scores.judging >= scores.perceiving ? 'J' : 'P';
  
  return ei + sn + tf + jp;
}

function getPersonalityType(typeCode) {
  return personalityTypes[typeCode] || personalityTypes['INTJ'];
}

function finishTest() {
  if (state.mode === 'couple') {
    finishCoupleTest();
    return;
  }
  
  const typeCode = calculateResult();
  state.result = {
    typeCode: typeCode,
    ...getPersonalityType(typeCode),
    scores: { ...state.scores }
  };
  
  showPage('result');
  renderResult();
  createConfetti();
  saveHistory();
}

function renderResult() {
  const result = state.result;
  
  elements.resultContainer.innerHTML = `
    <div class="result-header">
      <div class="result-type">${result.typeCode}</div>
      <div class="result-name">${result.fullName}</div>
      <div class="result-tags">
        ${result.tags.map(tag => `<span class="result-tag">${tag}</span>`).join('')}
      </div>
    </div>
    
    <div class="result-section">
      <div class="section-title">
        <span>📝</span> 性格分析
      </div>
      <div class="section-content">${result.description}</div>
    </div>
    
    <div class="result-section">
      <div class="section-title">
        <span>💪</span> 性格优势
      </div>
      <div class="strength-list">
        ${result.strengths.map(s => `<span class="strength-item">${s}</span>`).join('')}
      </div>
    </div>
    
    <div class="result-section">
      <div class="section-title">
        <span>⚠️</span> 待改进之处
      </div>
      <div class="weakness-list">
        ${result.weaknesses.map(w => `<span class="weakness-item">${w}</span>`).join('')}
      </div>
    </div>
    
    <div class="result-section">
      <div class="section-title">
        <span>💼</span> 适合职业
      </div>
      <div class="career-list">
        ${result.careers.map(c => `<span class="career-item">${c}</span>`).join('')}
      </div>
    </div>
    
    <div class="result-section">
      <div class="section-title">
        <span>👥</span> 社交风格
      </div>
      <div class="section-content">${result.socialStyle}</div>
    </div>
    
    <div class="result-section">
      <div class="section-title">
        <span>❤️</span> 恋爱风格
      </div>
      <div class="section-content">${result.loveStyle}</div>
    </div>
    
    <div class="result-section">
      <div class="section-title">
        <span>🤝</span> 最佳匹配
      </div>
      <div class="match-list">
        ${result.matches.map(m => `<span class="match-item">${m}</span>`).join('')}
      </div>
    </div>
  `;
}

function generatePoster() {
  const canvas = elements.posterCanvas;
  const ctx = canvas.getContext('2d');
  const result = state.result;
  
  const width = 375;
  const height = 820;
  canvas.width = width;
  canvas.height = height;
  
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0f0f23');
  gradient.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
  ctx.beginPath();
  ctx.arc(50, 100, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width - 50, height - 180, 100, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.beginPath();
  ctx.arc(width - 30, 80, 50, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(240, 147, 251, 0.2)';
  ctx.beginPath();
  ctx.arc(30, height - 130, 60, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.roundRect(20, 30, width - 40, 200, 20);
  ctx.fill();
  
  ctx.font = 'bold 52px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  const typeGradient = ctx.createLinearGradient(width/2 - 80, 0, width/2 + 80, 0);
  typeGradient.addColorStop(0, '#667eea');
  typeGradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = typeGradient;
  ctx.fillText(result.typeCode, width / 2, 95);
  
  ctx.font = '22px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(result.name, width / 2, 135);
  
  ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#e0e0e8';
  const descLines = wrapText(ctx, result.description.substring(0, 52) + '...', width - 80);
  descLines.forEach((line, i) => {
    ctx.fillText(line, width / 2, 170 + i * 22);
  });
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.roundRect(20, 250, width - 40, 110, 16);
  ctx.fill();
  
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText('性格标签', 40, 280);
  
  ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
  let tagX = 40;
  let tagY = 310;
  result.tags.forEach((tag, i) => {
    const tagWidth = ctx.measureText(tag).width + 24;
    if (tagX + tagWidth > width - 40) {
      tagX = 40;
      tagY += 30;
    }
    ctx.fillStyle = 'rgba(102, 126, 234, 0.35)';
    ctx.roundRect(tagX, tagY - 18, tagWidth, 26, 13);
    ctx.fill();
    ctx.fillStyle = '#aabbff';
    ctx.fillText(tag, tagX + 12, tagY);
    tagX += tagWidth + 10;
  });
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.roundRect(20, 380, width - 40, 110, 16);
  ctx.fill();
  
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('适合职业', 40, 410);
  
  ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
  let careerX = 40;
  let careerY = 440;
  result.careers.slice(0, 4).forEach((career, i) => {
    const careerWidth = ctx.measureText(career).width + 24;
    if (careerX + careerWidth > width - 40) {
      careerX = 40;
      careerY += 30;
    }
    ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
    ctx.roundRect(careerX, careerY - 18, careerWidth, 26, 13);
    ctx.fill();
    ctx.fillStyle = '#85c1ff';
    ctx.fillText(career, careerX + 12, careerY);
    careerX += careerWidth + 10;
  });
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.roundRect(20, 510, width - 40, 110, 16);
  ctx.fill();
  
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('最佳匹配', 40, 540);
  
  const matchWidth = (width - 80) / 4;
  result.matches.forEach((match, i) => {
    ctx.fillStyle = 'rgba(102, 126, 234, 0.25)';
    ctx.roundRect(40 + i * matchWidth, 560, matchWidth - 8, 36, 8);
    ctx.fill();
    ctx.fillStyle = '#aabbff';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(match, 40 + i * matchWidth + (matchWidth - 8) / 2, 585);
  });
  
  const qrY = 640;
  const qrSize = 90;
  const qrX = (width - qrSize) / 2;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  
  const qrPattern = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],
    [1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1]
  ];
  
  const cellSize = qrSize / qrPattern.length;
  ctx.fillStyle = '#1a1a2e';
  qrPattern.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell) {
        ctx.fillRect(qrX + j * cellSize, qrY + i * cellSize, cellSize, cellSize);
      }
    });
  });
  
  ctx.textAlign = 'center';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#e0e0e8';
  ctx.fillText('扫描二维码，发现你的性格', width / 2, qrY + qrSize + 22);
  
  ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#b0b0c0';
  ctx.fillText('AI 性格测试 · 探索真实的自己', width / 2, qrY + qrSize + 42);
  
  elements.posterModal.classList.add('active');
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split('');
  const lines = [];
  let currentLine = '';
  
  words.forEach(char => {
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
  this.beginPath();
  this.moveTo(x + radius, y);
  this.lineTo(x + width - radius, y);
  this.quadraticCurveTo(x + width, y, x + width, y + radius);
  this.lineTo(x + width, y + height - radius);
  this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  this.lineTo(x + radius, y + height);
  this.quadraticCurveTo(x, y + height, x, y + height - radius);
  this.lineTo(x, y + radius);
  this.quadraticCurveTo(x, y, x + radius, y);
  this.closePath();
};

function savePoster() {
  const canvas = elements.posterCanvas;
  const link = document.createElement('a');
  link.download = `personality-${state.result.typeCode}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function createConfetti() {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
  
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      elements.confettiContainer.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 3000);
    }, i * 50);
  }
}

function saveHistory() {
  const history = {
    answers: state.answers,
    scores: state.scores,
    currentQuestion: state.currentQuestion,
    result: state.result,
    timestamp: Date.now()
  };
  localStorage.setItem('personalityTest', JSON.stringify(history));
}

function loadHistory() {
  const saved = localStorage.getItem('personalityTest');
  if (saved) {
    try {
      const history = JSON.parse(saved);
      const age = Date.now() - history.timestamp;
      
      if (age < 24 * 60 * 60 * 1000) {
        state.answers = history.answers || [];
        state.scores = history.scores || state.scores;
        state.currentQuestion = history.currentQuestion || 0;
        state.result = history.result;
        
        if (state.result) {
          state.shuffledQuestions = shuffleArray(questions);
          showPage('result');
          renderResult();
          return true;
        }
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }
  return false;
}

function showPage(page) {
  elements.homePage.classList.remove('active');
  elements.testPage.classList.remove('active');
  elements.resultPage.classList.remove('active');
  elements.zodiacSelectPage.classList.remove('active');
  elements.zodiacResultPage.classList.remove('active');
  elements.coupleModePage.classList.remove('active');
  elements.coupleResultPage.classList.remove('active');
  
  switch (page) {
    case 'home':
      elements.homePage.classList.add('active');
      break;
    case 'test':
      elements.testPage.classList.add('active');
      break;
    case 'result':
      elements.resultPage.classList.add('active');
      break;
    case 'zodiacSelect':
      elements.zodiacSelectPage.classList.add('active');
      renderZodiacGrid();
      break;
    case 'zodiacResult':
      elements.zodiacResultPage.classList.add('active');
      break;
    case 'coupleMode':
      elements.coupleModePage.classList.add('active');
      break;
    case 'coupleResult':
      elements.coupleResultPage.classList.add('active');
      break;
  }
}

function bindEvents() {
  elements.startBtn.addEventListener('click', startTest);
  elements.prevBtn.addEventListener('click', goToPrevQuestion);
  
  elements.posterBtn.addEventListener('click', generatePoster);
  elements.retryBtn.addEventListener('click', startTest);
  elements.homeBtn.addEventListener('click', () => showPage('home'));
  
  elements.savePosterBtn.addEventListener('click', savePoster);
  elements.closeModalBtn.addEventListener('click', () => {
    elements.posterModal.classList.remove('active');
  });
  
  elements.posterModal.addEventListener('click', (e) => {
    if (e.target === elements.posterModal) {
      elements.posterModal.classList.remove('active');
    }
  });
  
  elements.shareBtn.addEventListener('click', shareWebsite);
  
  elements.zodiacEntryBtn.addEventListener('click', () => showPage('zodiacSelect'));
  elements.zodiacPosterBtn.addEventListener('click', generateZodiacPoster);
  elements.zodiacRetryBtn.addEventListener('click', () => showPage('zodiacSelect'));
  elements.zodiacHomeBtn.addEventListener('click', () => showPage('home'));
  
  elements.singleModeBtn.addEventListener('click', () => {
    state.mode = 'single';
    elements.singleModeBtn.classList.add('active');
    elements.coupleModeBtn.classList.remove('active');
  });
  elements.coupleModeBtn.addEventListener('click', () => {
    state.mode = 'couple';
    elements.singleModeBtn.classList.remove('active');
    elements.coupleModeBtn.classList.add('active');
    startCoupleMode();
  });
  
  elements.startCoupleTestBtn.addEventListener('click', startTest);
  elements.couplePosterBtn.addEventListener('click', generateCouplePoster);
  elements.coupleRetryBtn.addEventListener('click', startCoupleMode);
  elements.coupleHomeBtn.addEventListener('click', () => showPage('home'));
  elements.coupleZodiacBtn.addEventListener('click', () => {
    state.coupleZodiacStep = 1;
    showPage('zodiacSelect');
  });
}

function shareWebsite() {
  const shareData = {
    title: 'AI 性格测试',
    text: '快来探索你的性格奥秘，发现真实的自己！',
    url: window.location.href
  };
  
  if (navigator.share) {
    navigator.share(shareData)
      .then(() => console.log('分享成功'))
      .catch((error) => console.log('分享失败:', error));
  } else {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert('链接已复制到剪贴板！');
      })
      .catch(() => {
        alert('分享链接: ' + window.location.href);
      });
  }
}

function initApp() {
  initParticles();
  initStarBackground();
  bindEvents();
  
  animateNumber(elements.testCount, 128643 + Math.floor(Math.random() * 1000));
  
  const hasSavedResult = loadHistory();
  
  if (!hasSavedResult) {
    showPage('home');
  }
  
  state.mode = 'single';
  
  console.log('🎯 AI 性格测试已加载');
}

document.addEventListener('DOMContentLoaded', initApp);
