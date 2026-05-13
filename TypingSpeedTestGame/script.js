let currentText = '';
let isGameActive = false;
let timer = null;
let timeLeft = 60;
let correctChars = 0;
let totalChars = 0;
let errorCount = 0;
let startTime = null;
let previousValues = { wpm: 0, cpm: 0, accuracy: 100, errors: 0, time: 60 };
const gameEventTarget = new EventTarget();

const sampleTextElement = document.getElementById('sampleText');
const inputArea = document.getElementById('inputArea');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const modal = document.getElementById('modal');
const playAgainBtn = document.getElementById('playAgainBtn');
const textDisplay = document.getElementById('textDisplay');

const wpmElement = document.getElementById('wpm');
const cpmElement = document.getElementById('cpm');
const accuracyElement = document.getElementById('accuracy');
const timeElement = document.getElementById('time');
const errorsElement = document.getElementById('errors');

const finalWpmElement = document.getElementById('finalWpm');
const finalAccuracyElement = document.getElementById('finalAccuracy');
const finalErrorsElement = document.getElementById('finalErrors');
const ratingElement = document.getElementById('rating');

function getRandomText() {
    return testTexts[Math.floor(Math.random() * testTexts.length)];
}

function renderTextWithHighlight() {
    const inputText = inputArea.value;
    let html = '';

    for (let i = 0; i < currentText.length; i++) {
        let charClass = 'char';

        if (i < inputText.length) {
            if (inputText[i] === currentText[i]) {
                charClass += ' correct';
            } else {
                charClass += ' incorrect';
            }
        } else if (i === inputText.length) {
            charClass += ' current';
        }

        html += `<span class="${charClass}">${currentText[i]}</span>`;
    }

    sampleTextElement.innerHTML = html;
}

function updateStats() {
    const inputText = inputArea.value;
    let correctCount = 0;
    let errorCountLocal = 0;
    let hasNewError = false;

    for (let i = 0; i < inputText.length; i++) {
        if (i < currentText.length) {
            if (inputText[i] === currentText[i]) {
                correctCount++;
            } else {
                errorCountLocal++;
                if (i >= totalChars) {
                    hasNewError = true;
                }
            }
        }
    }

    if (hasNewError) {
        gameEventTarget.dispatchEvent(new CustomEvent('comboBreak'));
    } else if (correctCount > correctChars) {
        gameEventTarget.dispatchEvent(new CustomEvent('comboIncrement'));
    }

    correctChars = correctCount;
    totalChars = inputText.length;
    errorCount = errorCountLocal;

    const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;
    const wpm = elapsedMinutes > 0 ? Math.round((correctChars / 5) / elapsedMinutes) : 0;
    const cpm = elapsedMinutes > 0 ? Math.round(correctChars / elapsedMinutes) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    updateValueWithAnimation(wpmElement, wpm, 'wpm');
    updateValueWithAnimation(cpmElement, cpm, 'cpm');
    updateValueWithAnimation(accuracyElement, `${accuracy}%`, 'accuracy');
    updateValueWithAnimation(errorsElement, errorCount, 'errors');
}

function updateValueWithAnimation(element, newValue, valueType) {
    if (element.textContent !== String(newValue)) {
        element.textContent = newValue;
        element.classList.add('number-change');
        setTimeout(() => {
            element.classList.remove('number-change');
        }, 300);
    }
    previousValues[valueType] = newValue;
}

function startTimer() {
    startTime = Date.now();
    timer = setInterval(() => {
        timeLeft--;
        updateValueWithAnimation(timeElement, timeLeft, 'time');

        if (timeLeft <= 0) {
            endGame();
        }

        updateStats();
    }, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function startGame() {
    stopTimer();
    resetGame();

    currentText = getRandomText();
    renderTextWithHighlight();

    inputArea.disabled = false;
    inputArea.focus();
    inputArea.value = '';

    textDisplay.classList.add('focused');
    isGameActive = true;

    startBtn.disabled = true;
    resetBtn.disabled = false;

    timeLeft = 60;
    timeElement.textContent = timeLeft;

    gameEventTarget.dispatchEvent(new CustomEvent('gameStart'));

    startTimer();
}

function resetGame() {
    stopTimer();
    isGameActive = false;

    inputArea.disabled = true;
    inputArea.value = '';
    textDisplay.classList.remove('focused');

    correctChars = 0;
    totalChars = 0;
    errorCount = 0;
    startTime = null;
    timeLeft = 60;

    wpmElement.textContent = '0';
    cpmElement.textContent = '0';
    accuracyElement.textContent = '100%';
    timeElement.textContent = '60';
    errorsElement.textContent = '0';

    sampleTextElement.textContent = 'Click "Start Test" to begin...';

    startBtn.disabled = false;
    resetBtn.disabled = true;
}

function endGame() {
    stopTimer();
    isGameActive = false;

    inputArea.disabled = true;
    textDisplay.classList.remove('focused');

    const inputText = inputArea.value;
    let finalCorrect = 0;
    let finalErrors = 0;

    for (let i = 0; i < inputText.length; i++) {
        if (i < currentText.length) {
            if (inputText[i] === currentText[i]) {
                finalCorrect++;
            } else {
                finalErrors++;
            }
        }
    }

    const elapsedMinutes = 60 / 60;
    const finalWpm = Math.round((finalCorrect / 5) / elapsedMinutes);
    const finalAccuracy = inputText.length > 0 ? Math.round((finalCorrect / inputText.length) * 100) : 100;

    finalWpmElement.textContent = finalWpm;
    finalAccuracyElement.textContent = `${finalAccuracy}%`;
    finalErrorsElement.textContent = finalErrors;

    let rating;
    if (finalWpm < 30) {
        rating = 'Beginner';
    } else if (finalWpm < 60) {
        rating = 'Intermediate';
    } else if (finalWpm < 90) {
        rating = 'Advanced';
    } else {
        rating = 'Typing Master';
    }

    ratingElement.textContent = rating;

    gameEventTarget.dispatchEvent(new CustomEvent('gameEnd', {
        detail: {
            wpm: finalWpm,
            accuracy: finalAccuracy,
            rating
        }
    }));

    modal.classList.remove('hidden');
}

function scrollToCurrentChar() {
    const currentChar = document.querySelector('.char.current');
    if (currentChar) {
        currentChar.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

startBtn.addEventListener('click', startGame);

resetBtn.addEventListener('click', resetGame);

playAgainBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    startGame();
});

inputArea.addEventListener('input', (e) => {
    if (!isGameActive) return;

    renderTextWithHighlight();
    updateStats();
    scrollToCurrentChar();

    const inputText = inputArea.value;
    if (inputText.length >= currentText.length) {
        endGame();
    }
});

inputArea.addEventListener('keydown', (e) => {
    if (!isGameActive) return;

    if (e.key === 'Tab') {
        e.preventDefault();
    }
});

inputArea.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

inputArea.addEventListener('paste', (e) => {
    e.preventDefault();
});

inputArea.addEventListener('cut', (e) => {
    e.preventDefault();
});

inputArea.addEventListener('copy', (e) => {
    e.preventDefault();
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 'v' || e.key === 'V') {
            e.preventDefault();
        }
    }
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
        resetGame();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (typeof ComboSystem !== 'undefined') {
        ComboSystem.init(gameEventTarget);
        
        gameEventTarget.addEventListener('gameStart', () => {
            ComboSystem.reset();
        });
        
        gameEventTarget.addEventListener('comboIncrement', () => {
            ComboSystem.increment();
        });
        
        gameEventTarget.addEventListener('comboBreak', () => {
            ComboSystem.breakCombo();
        });
    }

    if (typeof LeaderboardSystem !== 'undefined') {
        LeaderboardSystem.init();
        
        gameEventTarget.addEventListener('gameEnd', (e) => {
            const { wpm, accuracy, rating } = e.detail;
            const maxCombo = ComboSystem ? ComboSystem.getMaxCombo() : 0;
            LeaderboardSystem.addRecord(wpm, accuracy, maxCombo, rating);
        });
    }
});
