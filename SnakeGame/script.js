const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRID_SIZE = 20;
const GRID_COUNT = 25;
canvas.width = GRID_SIZE * GRID_COUNT;
canvas.height = GRID_SIZE * GRID_COUNT;

const DIRECTIONS = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
};

const DIRECTION_VECTORS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

const LEVEL_SPEEDS = [
    { level: 1, speed: 200, minScore: 0 },
    { level: 2, speed: 160, minScore: 50 },
    { level: 3, speed: 120, minScore: 100 },
    { level: 4, speed: 100, minScore: 200 },
    { level: 5, speed: 80, minScore: 300 },
    { level: 6, speed: 60, minScore: 500 }
];

let gameState = {
    snake: [],
    food: null,
    direction: DIRECTIONS.RIGHT,
    nextDirection: DIRECTIONS.RIGHT,
    score: 0,
    highScore: 0,
    level: 1,
    foodCount: 0,
    gameStartTime: 0,
    gameTime: 0,
    isRunning: false,
    isPaused: false,
    isGameOver: false,
    isStarted: false,
    lastMoveTime: 0,
    currentSpeed: 200
};

let elements = {};

const LEADERBOARD_KEY = 'snakeLeaderboard';
const MAX_RECORDS = 20;
let currentRecordId = null;

function loadLeaderboard() {
    try {
        const saved = localStorage.getItem(LEADERBOARD_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
}

function sortLeaderboard(leaderboard) {
    return [...leaderboard].sort((a, b) => b.score - a.score).slice(0, MAX_RECORDS);
}

function clearLeaderboard() {
    localStorage.removeItem(LEADERBOARD_KEY);
    renderLeaderboard();
}

function saveGameRecord() {
    const leaderboard = loadLeaderboard();
    const previousHighScore = leaderboard.length > 0 ? leaderboard[0].score : 0;
    
    const record = {
        id: Date.now().toString(),
        score: gameState.score,
        level: gameState.level,
        gameTime: gameState.gameTime,
        foodCount: gameState.foodCount,
        avgSpeed: gameState.gameTime > 0 
            ? (gameState.foodCount / gameState.gameTime * 60).toFixed(2)
            : 0,
        endTime: new Date().toLocaleString('zh-CN'),
        isNewRecord: gameState.score > previousHighScore
    };

    leaderboard.push(record);
    const sortedLeaderboard = sortLeaderboard(leaderboard);
    currentRecordId = record.id;
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(sortedLeaderboard));
    return record;
}

function formatLeaderboardTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
}

function initGame() {
    elements = {
        currentScore: document.getElementById('currentScore'),
        highScore: document.getElementById('highScore'),
        level: document.getElementById('level'),
        gameTime: document.getElementById('gameTime'),
        foodCount: document.getElementById('foodCount'),
        finalScore: document.getElementById('finalScore'),
        finalFoodCount: document.getElementById('finalFoodCount'),
        finalGameTime: document.getElementById('finalGameTime'),
        startOverlay: document.getElementById('startOverlay'),
        pauseOverlay: document.getElementById('pauseOverlay'),
        gameOverOverlay: document.getElementById('gameOverOverlay'),
        startBtn: document.getElementById('startBtn'),
        resumeBtn: document.getElementById('resumeBtn'),
        restartBtn: document.getElementById('restartBtn'),
        restartBtn2: document.getElementById('restartBtn2'),
        pauseBtn: document.getElementById('pauseBtn'),
        leaderboardBtn: document.getElementById('leaderboardBtn'),
        leaderboardOverlay: document.getElementById('leaderboardOverlay'),
        closeLeaderboardBtn: document.getElementById('closeLeaderboardBtn'),
        clearLeaderboardBtn: document.getElementById('clearLeaderboardBtn'),
        leaderboardList: document.getElementById('leaderboardList')
    };

    loadHighScore();
    bindEvents();
    resetGame();
    updateUI();
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    const startX = Math.floor(GRID_COUNT / 2);
    const startY = Math.floor(GRID_COUNT / 2);
    
    gameState = {
        snake: [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ],
        food: null,
        direction: DIRECTIONS.RIGHT,
        nextDirection: DIRECTIONS.RIGHT,
        score: 0,
        highScore: gameState.highScore,
        level: 1,
        foodCount: 0,
        gameStartTime: 0,
        gameTime: 0,
        isRunning: false,
        isPaused: false,
        isGameOver: false,
        isStarted: false,
        lastMoveTime: 0,
        currentSpeed: LEVEL_SPEEDS[0].speed
    };

    generateFood();
    elements.startOverlay.style.display = 'flex';
    elements.pauseOverlay.style.display = 'none';
    elements.gameOverOverlay.style.display = 'none';
}

function startGame() {
    if (gameState.isStarted) return;
    
    gameState.isStarted = true;
    gameState.isRunning = true;
    gameState.gameStartTime = Date.now();
    elements.startOverlay.style.display = 'none';
}

function pauseGame() {
    if (!gameState.isRunning || gameState.isGameOver) return;
    
    gameState.isPaused = true;
    gameState.isRunning = false;
    elements.pauseOverlay.style.display = 'flex';
}

function resumeGame() {
    if (!gameState.isPaused) return;
    
    gameState.isPaused = false;
    gameState.isRunning = true;
    elements.pauseOverlay.style.display = 'none';
}

function gameOver() {
    gameState.isGameOver = true;
    gameState.isRunning = false;
    
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        saveHighScore();
    }
    
    saveGameRecord();
    
    elements.finalScore.textContent = gameState.score;
    elements.finalFoodCount.textContent = gameState.foodCount;
    elements.finalGameTime.textContent = formatTime(gameState.gameTime);
    elements.gameOverOverlay.style.display = 'flex';
}

function gameLoop(timestamp) {
    if (gameState.isRunning && !gameState.isPaused) {
        if (timestamp - gameState.lastMoveTime >= gameState.currentSpeed) {
            moveSnake();
            gameState.lastMoveTime = timestamp;
        }
        
        updateGameTime();
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGrid();
    drawFood();
    drawSnake();
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= GRID_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
    }
}

function drawSnake() {
    gameState.snake.forEach((segment, index) => {
        const x = segment.x * GRID_SIZE;
        const y = segment.y * GRID_SIZE;
        
        if (index === 0) {
            ctx.fillStyle = '#4ade80';
            ctx.shadowColor = '#4ade80';
            ctx.shadowBlur = 10;
        } else {
            const alpha = 1 - (index / gameState.snake.length) * 0.5;
            ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`;
            ctx.shadowBlur = 0;
        }
        
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, GRID_SIZE - 4, GRID_SIZE - 4, 4);
        ctx.fill();
        
        if (index === 0) {
            ctx.shadowBlur = 0;
            drawSnakeEyes(segment);
        }
    });
}

function drawSnakeEyes(head) {
    const eyeSize = 3;
    const offset = 5;
    ctx.fillStyle = '#1a1a2e';
    
    let eyePositions = [];
    
    if (gameState.direction === DIRECTIONS.RIGHT) {
        eyePositions = [
            { x: head.x * GRID_SIZE + GRID_SIZE - offset, y: head.y * GRID_SIZE + offset },
            { x: head.x * GRID_SIZE + GRID_SIZE - offset, y: head.y * GRID_SIZE + GRID_SIZE - offset - eyeSize }
        ];
    } else if (gameState.direction === DIRECTIONS.LEFT) {
        eyePositions = [
            { x: head.x * GRID_SIZE + offset - eyeSize, y: head.y * GRID_SIZE + offset },
            { x: head.x * GRID_SIZE + offset - eyeSize, y: head.y * GRID_SIZE + GRID_SIZE - offset - eyeSize }
        ];
    } else if (gameState.direction === DIRECTIONS.UP) {
        eyePositions = [
            { x: head.x * GRID_SIZE + offset, y: head.y * GRID_SIZE + offset - eyeSize },
            { x: head.x * GRID_SIZE + GRID_SIZE - offset - eyeSize, y: head.y * GRID_SIZE + offset - eyeSize }
        ];
    } else {
        eyePositions = [
            { x: head.x * GRID_SIZE + offset, y: head.y * GRID_SIZE + GRID_SIZE - offset },
            { x: head.x * GRID_SIZE + GRID_SIZE - offset - eyeSize, y: head.y * GRID_SIZE + GRID_SIZE - offset }
        ];
    }
    
    eyePositions.forEach(pos => {
        ctx.fillRect(pos.x, pos.y, eyeSize, eyeSize);
    });
}

function drawFood() {
    if (!gameState.food) return;
    
    const x = gameState.food.x * GRID_SIZE;
    const y = gameState.food.y * GRID_SIZE;
    const centerX = x + GRID_SIZE / 2;
    const centerY = y + GRID_SIZE / 2;
    
    const time = Date.now() / 200;
    const pulse = Math.sin(time) * 2 + GRID_SIZE / 2 - 3;
    
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 15;
    
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulse, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(centerX - 2, centerY - 2, 2, 0, Math.PI * 2);
    ctx.fill();
}

function moveSnake() {
    gameState.direction = gameState.nextDirection;
    const vector = DIRECTION_VECTORS[gameState.direction];
    
    const head = { ...gameState.snake[0] };
    head.x += vector.x;
    head.y += vector.y;
    
    if (checkCollision(head)) {
        gameOver();
        return;
    }
    
    gameState.snake.unshift(head);
    
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        eatFood();
    } else {
        gameState.snake.pop();
    }
}

function checkCollision(head) {
    if (head.x < 0 || head.x >= GRID_COUNT || head.y < 0 || head.y >= GRID_COUNT) {
        return true;
    }
    
    for (let i = 0; i < gameState.snake.length; i++) {
        if (gameState.snake[i].x === head.x && gameState.snake[i].y === head.y) {
            return true;
        }
    }
    
    return false;
}

function generateFood() {
    let newFood;
    let isOnSnake;
    
    do {
        isOnSnake = false;
        newFood = {
            x: Math.floor(Math.random() * GRID_COUNT),
            y: Math.floor(Math.random() * GRID_COUNT)
        };
        
        for (const segment of gameState.snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                isOnSnake = true;
                break;
            }
        }
    } while (isOnSnake);
    
    gameState.food = newFood;
}

function eatFood() {
    gameState.foodCount++;
    const points = 10 * gameState.level;
    gameState.score += points;
    
    updateLevel();
    generateFood();
    updateUI();
    animateScore();
}

function updateLevel() {
    for (let i = LEVEL_SPEEDS.length - 1; i >= 0; i--) {
        if (gameState.score >= LEVEL_SPEEDS[i].minScore && gameState.level !== LEVEL_SPEEDS[i].level) {
            gameState.level = LEVEL_SPEEDS[i].level;
            gameState.currentSpeed = LEVEL_SPEEDS[i].speed;
            break;
        }
    }
}

function updateGameTime() {
    if (!gameState.isRunning) return;
    
    const elapsed = Math.floor((Date.now() - gameState.gameStartTime) / 1000);
    if (elapsed !== gameState.gameTime) {
        gameState.gameTime = elapsed;
        elements.gameTime.textContent = formatTime(gameState.gameTime);
    }
}

function updateUI() {
    elements.currentScore.textContent = gameState.score;
    elements.highScore.textContent = gameState.highScore;
    elements.level.textContent = gameState.level;
    elements.foodCount.textContent = gameState.foodCount;
}

function animateScore() {
    elements.currentScore.classList.remove('score-animate');
    void elements.currentScore.offsetWidth;
    elements.currentScore.classList.add('score-animate');
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function renderLeaderboard() {
    const leaderboard = loadLeaderboard();
    const listEl = elements.leaderboardList;

    if (leaderboard.length === 0) {
        listEl.innerHTML = `
            <div class="empty-leaderboard">
                <p>暂无游戏记录</p>
            </div>
        `;
        return;
    }

    let html = '';
    leaderboard.forEach((record, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-other';
        const newClass = record.id === currentRecordId ? 'new-record' : '';
        const crownIcon = rank === 1 ? '<span class="crown-icon">👑</span>' : '';
        const recordBadge = record.isNewRecord ? '<span class="leaderboard-badge">破纪录!</span>' : '';

        html += `
            <div class="leaderboard-item ${newClass}" data-id="${record.id}">
                <div class="leaderboard-rank ${rankClass}">
                    ${crownIcon}
                    ${rank}
                </div>
                <div class="leaderboard-main">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="leaderboard-score">${record.score} 分</span>
                        ${recordBadge}
                    </div>
                    <div class="leaderboard-meta">
                        <span>🎮 等级: ${record.level}</span>
                        <span>⏱️ 时长: ${formatLeaderboardTime(record.gameTime)}</span>
                        <span>🍎 食物: ${record.foodCount} 个</span>
                        <span>⚡ 速度: ${record.avgSpeed} 个/分</span>
                        <span style="grid-column: span 2;">📅 ${record.endTime}</span>
                    </div>
                </div>
            </div>
        `;
    });

    listEl.innerHTML = html;
}

function highlightNewRecord() {
    if (!currentRecordId) return;
    
    const recordEl = document.querySelector(`[data-id="${currentRecordId}"]`);
    if (recordEl) {
        recordEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function saveHighScore() {
    localStorage.setItem('snakeHighScore', gameState.highScore.toString());
}

function loadHighScore() {
    const saved = localStorage.getItem('snakeHighScore');
    gameState.highScore = saved ? parseInt(saved) : 0;
}

function changeDirection(newDirection) {
    if (!gameState.isStarted) {
        startGame();
    }
    
    const opposites = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT'
    };
    
    if (opposites[newDirection] !== gameState.direction) {
        gameState.nextDirection = newDirection;
    }
}

function bindEvents() {
    document.addEventListener('keydown', handleKeydown);
    
    elements.startBtn.addEventListener('click', startGame);
    elements.resumeBtn.addEventListener('click', resumeGame);
    elements.restartBtn.addEventListener('click', () => {
        resetGame();
        updateUI();
    });
    elements.restartBtn2.addEventListener('click', () => {
        resetGame();
        updateUI();
    });
    elements.pauseBtn.addEventListener('click', () => {
        if (gameState.isRunning) {
            pauseGame();
        } else if (gameState.isPaused) {
            resumeGame();
        }
    });
    
    document.getElementById('upBtn').addEventListener('click', () => changeDirection(DIRECTIONS.UP));
    document.getElementById('downBtn').addEventListener('click', () => changeDirection(DIRECTIONS.DOWN));
    document.getElementById('leftBtn').addEventListener('click', () => changeDirection(DIRECTIONS.LEFT));
    document.getElementById('rightBtn').addEventListener('click', () => changeDirection(DIRECTIONS.RIGHT));
    
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    canvas.addEventListener('touchend', (e) => {
            if (!gameState.isStarted) {
                startGame();
                return;
            }
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            
            const minSwipe = 30;
            
            if (Math.abs(dx) > Math.abs(dy)) {
                if (Math.abs(dx) > minSwipe) {
                    changeDirection(dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT);
                }
            } else {
                if (Math.abs(dy) > minSwipe) {
                    changeDirection(dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP);
                }
            }
        });

        elements.leaderboardBtn.addEventListener('click', () => {
            renderLeaderboard();
            elements.leaderboardOverlay.style.display = 'flex';
            setTimeout(highlightNewRecord, 100);
        });

        elements.closeLeaderboardBtn.addEventListener('click', () => {
            elements.leaderboardOverlay.style.display = 'none';
        });

        elements.clearLeaderboardBtn.addEventListener('click', () => {
            if (confirm('确定要清空排行榜吗？此操作不可恢复！')) {
                clearLeaderboard();
            }
        });

        elements.leaderboardOverlay.addEventListener('click', (e) => {
            if (e.target === elements.leaderboardOverlay) {
                elements.leaderboardOverlay.style.display = 'none';
            }
        });
    }

function handleKeydown(e) {
    const keyMap = {
        'ArrowUp': DIRECTIONS.UP,
        'ArrowDown': DIRECTIONS.DOWN,
        'ArrowLeft': DIRECTIONS.LEFT,
        'ArrowRight': DIRECTIONS.RIGHT,
        'w': DIRECTIONS.UP,
        'W': DIRECTIONS.UP,
        's': DIRECTIONS.DOWN,
        'S': DIRECTIONS.DOWN,
        'a': DIRECTIONS.LEFT,
        'A': DIRECTIONS.LEFT,
        'd': DIRECTIONS.RIGHT,
        'D': DIRECTIONS.RIGHT
    };
    
    if (keyMap[e.key]) {
        e.preventDefault();
        changeDirection(keyMap[e.key]);
    }
    
    if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        
        if (!gameState.isStarted) {
            startGame();
        } else if (gameState.isRunning) {
            pauseGame();
        } else if (gameState.isPaused) {
            resumeGame();
        }
    }
}

window.addEventListener('load', initGame);
