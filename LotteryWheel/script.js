const prizes = [
    { name: 'iPhone 15 Pro', icon: '📱', color: '#FF6B6B', weight: 5 },
    { name: 'iPad Air', icon: '📟', color: '#4ECDC4', weight: 8 },
    { name: 'AirPods Pro', icon: '🎧', color: '#45B7D1', weight: 10 },
    { name: '100元红包', icon: '🧧', color: '#96CEB4', weight: 20 },
    { name: '50元优惠券', icon: '🎫', color: '#FFEAA7', weight: 25 },
    { name: '10元话费', icon: '💰', color: '#DDA0DD', weight: 15 },
    { name: '谢谢参与', icon: '😊', color: '#98D8C8', weight: 12 },
    { name: '再来一次', icon: '🎯', color: '#F7DC6F', weight: 5 }
];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const remainCountEl = document.getElementById('remain-count');
const prizesListEl = document.getElementById('prizesList');
const resultModal = document.getElementById('resultModal');
const closeBtn = document.getElementById('closeBtn');
const prizeIconEl = document.getElementById('prizeIcon');
const prizeNameEl = document.getElementById('prizeName');

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 230;
const sectorAngle = (2 * Math.PI) / prizes.length;

let currentAngle = 0;
let isSpinning = false;
let remainCount = 10;

const STORAGE_KEY = 'lottery_wheel_data';

function initStorage() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
        const data = JSON.parse(stored);
        if (data.date === today) {
            remainCount = data.count;
        } else {
            remainCount = 10;
            saveStorage();
        }
    } else {
        saveStorage();
    }
    
    updateRemainCount();
}

function saveStorage() {
    const data = {
        date: new Date().toDateString(),
        count: remainCount
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function updateRemainCount() {
    remainCountEl.textContent = remainCount;
}

let animationFrameId = null;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < prizes.length; i++) {
        const prize = prizes[i];
        const startAngle = currentAngle + i * sectorAngle;
        const endAngle = startAngle + sectorAngle;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = prize.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sectorAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(prize.name, radius - 30, 5);
        ctx.font = '24px Arial';
        ctx.fillText(prize.icon, radius - 60, 30);
        ctx.restore();
    }
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 4;
    ctx.stroke();
}

function getWeightedRandom() {
    const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < prizes.length; i++) {
        random -= prizes[i].weight;
        if (random <= 0) {
            return i;
        }
    }
    
    return prizes.length - 1;
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getActualPrizeIndexAtPointer() {
    const pointerAngle = -Math.PI / 2;
    
    for (let i = 0; i < prizes.length; i++) {
        const sectorStart = currentAngle + i * sectorAngle;
        const sectorEnd = sectorStart + sectorAngle;
        
        const normalizedPointer = ((pointerAngle - sectorStart) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        
        if (normalizedPointer < sectorAngle) {
            return i;
        }
    }
    return 0;
}

function forceAlignToPrize(winningIndex) {
    const pointerAngle = -Math.PI / 2;
    const targetSectorCenterAngle = winningIndex * sectorAngle + sectorAngle / 2;
    const targetCurrentAngle = pointerAngle - targetSectorCenterAngle;
    currentAngle = targetCurrentAngle;
    drawWheel();
}

function startSpin() {
    if (isSpinning || remainCount <= 0) {
        if (remainCount <= 0) {
            alert('今日抽奖次数已用完，明天再来吧！');
        }
        return;
    }
    
    isSpinning = true;
    startBtn.disabled = true;
    startBtn.classList.add('loading');
    startBtn.textContent = '';
    
    remainCount--;
    updateRemainCount();
    saveStorage();
    
    const winningIndex = getWeightedRandom();
    const prize = prizes[winningIndex];
    
    const pointerAngle = -Math.PI / 2;
    const targetSectorCenterAngle = winningIndex * sectorAngle + sectorAngle / 2;
    const targetCurrentAngle = pointerAngle - targetSectorCenterAngle;
    
    const startAngle = currentAngle;
    const finalAngle = targetCurrentAngle;
    
    let delta = finalAngle - startAngle;
    while (delta <= 0) {
        delta += 2 * Math.PI;
    }
    
    const fullRotations = 6 + Math.random() * 2;
    const totalRotation = fullRotations * 2 * Math.PI + delta;
    
    const duration = 5000;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = easeInOutCubic(progress);
        
        currentAngle = startAngle + totalRotation * easeProgress;
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            forceAlignToPrize(winningIndex);
            
            const actualIndex = getActualPrizeIndexAtPointer();
            if (actualIndex !== winningIndex) {
                forceAlignToPrize(winningIndex);
            }
            
            isSpinning = false;
            startBtn.disabled = false;
            startBtn.classList.remove('loading');
            startBtn.textContent = '开始抽奖';
            
            showResult(prize);
        }
    }
    
    requestAnimationFrame(animate);
}

function showResult(prize) {
    prizeIconEl.textContent = prize.icon;
    prizeNameEl.textContent = prize.name;
    resultModal.classList.add('show');
}

function closeModal() {
    resultModal.classList.remove('show');
}

function resetTodayCount() {
    if (confirm('确定要重置今天的抽奖次数吗？')) {
        remainCount = 10;
        saveStorage();
        updateRemainCount();
        alert('抽奖次数已重置为 10 次！');
    }
}

function renderPrizesList() {
    const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);
    
    prizesListEl.innerHTML = prizes.map(prize => {
        const probability = ((prize.weight / totalWeight) * 100).toFixed(1);
        return `
            <div class="prize-card">
                <div class="icon">${prize.icon}</div>
                <div class="name">${prize.name}</div>
                <div class="probability">概率 ${probability}%</div>
            </div>
        `;
    }).join('');
}

startBtn.addEventListener('click', startSpin);
resetBtn.addEventListener('click', resetTodayCount);
closeBtn.addEventListener('click', closeModal);
resultModal.addEventListener('click', (e) => {
    if (e.target === resultModal) {
        closeModal();
    }
});

function init() {
    initStorage();
    renderPrizesList();
    drawWheel();
}

init();