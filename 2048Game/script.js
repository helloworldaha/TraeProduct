$(document).ready(function() {
    const GRID_SIZE = 4;
    const GAME_STATES = {
        IDLE: 'idle',
        PLAYING: 'playing',
        PAUSED: 'paused',
        WON: 'won',
        LOST: 'lost'
    };

    let board = [];
    let score = 0;
    let bestScore = 0;
    let moves = 0;
    let gameState = GAME_STATES.IDLE;
    let timerInterval = null;
    let startTime = null;
    let elapsedTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let isProcessing = false;

    function initGame() {
        bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        $('#best-score').text(bestScore);
        createBoard();
        bindEvents();
        updateGameStatus('点击"开始游戏"按钮开始');
    }

    function createBoard() {
        const $gridContainer = $('#grid-container');
        $gridContainer.empty();

        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            $gridContainer.append('<div class="grid-cell"></div>');
        }

        board = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            board[i] = [];
            for (let j = 0; j < GRID_SIZE; j++) {
                board[i][j] = { value: 0, merged: false };
            }
        }
    }

    function startGame() {
        resetGame();
        gameState = GAME_STATES.PLAYING;
        generateTile();
        generateTile();
        renderBoard();
        startTimer();
        updateGameStatus('游戏进行中，使用方向键或WASD移动');
        hideMessage();
    }

    function resetGame() {
        board = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            board[i] = [];
            for (let j = 0; j < GRID_SIZE; j++) {
                board[i][j] = { value: 0, merged: false };
            }
        }

        score = 0;
        moves = 0;
        elapsedTime = 0;

        updateScore();
        updateMoves();
        updateTimeDisplay();
        stopTimer();
    }

    function restartGame() {
        if (gameState === GAME_STATES.IDLE) {
            startGame();
        } else {
            startGame();
        }
    }

    function generateTile() {
        const emptyCells = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (board[i][j].value === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[randomCell.row][randomCell.col] = {
                value: Math.random() < 0.9 ? 2 : 4,
                merged: false,
                isNew: true
            };
        }
    }

    function renderBoard() {
        $('.tile').remove();

        const $gridContainer = $('#grid-container');
        const gridWidth = $gridContainer.width();
        const gap = parseInt($gridContainer.css('gap')) || 12;
        const cellSize = (gridWidth - (GRID_SIZE - 1) * gap) / GRID_SIZE;

        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const tile = board[i][j];
                if (tile.value > 0) {
                    const $tile = $('<div class="tile"></div>');
                    $tile.text(tile.value);

                    let tileClass = 'tile-' + tile.value;
                    if (tile.value > 2048) {
                        tileClass = 'tile-super';
                    }
                    $tile.addClass(tileClass);

                    if (tile.isNew) {
                        $tile.addClass('tile-new');
                        board[i][j].isNew = false;
                    }
                    if (tile.merged) {
                        $tile.addClass('tile-merged');
                        board[i][j].merged = false;
                    }

                    const left = j * (cellSize + gap);
                    const top = i * (cellSize + gap);
                    $tile.css({
                        width: cellSize + 'px',
                        height: cellSize + 'px',
                        left: left + 'px',
                        top: top + 'px',
                        lineHeight: cellSize + 'px'
                    });

                    $gridContainer.append($tile);
                }
            }
        }
    }

    function moveLeft() {
        let moved = false;
        for (let i = 0; i < GRID_SIZE; i++) {
            let row = board[i].map(tile => ({ ...tile }));
            let newRow = row.filter(tile => tile.value !== 0);

            for (let j = 0; j < newRow.length - 1; j++) {
                if (newRow[j].value === newRow[j + 1].value && !newRow[j].merged && !newRow[j + 1].merged) {
                    newRow[j].value *= 2;
                    newRow[j].merged = true;
                    score += newRow[j].value;
                    newRow.splice(j + 1, 1);
                }
            }

            while (newRow.length < GRID_SIZE) {
                newRow.push({ value: 0, merged: false });
            }

            for (let j = 0; j < GRID_SIZE; j++) {
                if (board[i][j].value !== newRow[j].value || board[i][j].merged !== newRow[j].merged) {
                    moved = true;
                }
                board[i][j] = newRow[j];
            }
        }
        return moved;
    }

    function moveRight() {
        let moved = false;
        for (let i = 0; i < GRID_SIZE; i++) {
            let row = board[i].map(tile => ({ ...tile }));
            let newRow = row.filter(tile => tile.value !== 0);

            for (let j = newRow.length - 1; j > 0; j--) {
                if (newRow[j].value === newRow[j - 1].value && !newRow[j].merged && !newRow[j - 1].merged) {
                    newRow[j].value *= 2;
                    newRow[j].merged = true;
                    score += newRow[j].value;
                    newRow.splice(j - 1, 1);
                    j--;
                }
            }

            while (newRow.length < GRID_SIZE) {
                newRow.unshift({ value: 0, merged: false });
            }

            for (let j = 0; j < GRID_SIZE; j++) {
                if (board[i][j].value !== newRow[j].value || board[i][j].merged !== newRow[j].merged) {
                    moved = true;
                }
                board[i][j] = newRow[j];
            }
        }
        return moved;
    }

    function moveUp() {
        let moved = false;
        for (let j = 0; j < GRID_SIZE; j++) {
            let column = [];
            for (let i = 0; i < GRID_SIZE; i++) {
                column.push({ ...board[i][j] });
            }

            let newColumn = column.filter(tile => tile.value !== 0);

            for (let i = 0; i < newColumn.length - 1; i++) {
                if (newColumn[i].value === newColumn[i + 1].value && !newColumn[i].merged && !newColumn[i + 1].merged) {
                    newColumn[i].value *= 2;
                    newColumn[i].merged = true;
                    score += newColumn[i].value;
                    newColumn.splice(i + 1, 1);
                }
            }

            while (newColumn.length < GRID_SIZE) {
                newColumn.push({ value: 0, merged: false });
            }

            for (let i = 0; i < GRID_SIZE; i++) {
                if (board[i][j].value !== newColumn[i].value || board[i][j].merged !== newColumn[i].merged) {
                    moved = true;
                }
                board[i][j] = newColumn[i];
            }
        }
        return moved;
    }

    function moveDown() {
        let moved = false;
        for (let j = 0; j < GRID_SIZE; j++) {
            let column = [];
            for (let i = 0; i < GRID_SIZE; i++) {
                column.push({ ...board[i][j] });
            }

            let newColumn = column.filter(tile => tile.value !== 0);

            for (let i = newColumn.length - 1; i > 0; i--) {
                if (newColumn[i].value === newColumn[i - 1].value && !newColumn[i].merged && !newColumn[i - 1].merged) {
                    newColumn[i].value *= 2;
                    newColumn[i].merged = true;
                    score += newColumn[i].value;
                    newColumn.splice(i - 1, 1);
                    i--;
                }
            }

            while (newColumn.length < GRID_SIZE) {
                newColumn.unshift({ value: 0, merged: false });
            }

            for (let i = 0; i < GRID_SIZE; i++) {
                if (board[i][j].value !== newColumn[i].value || board[i][j].merged !== newColumn[i].merged) {
                    moved = true;
                }
                board[i][j] = newColumn[i];
            }
        }
        return moved;
    }

    function handleMove(direction) {
        if (gameState !== GAME_STATES.PLAYING || isProcessing) {
            return;
        }

        isProcessing = true;
        let moved = false;

        switch (direction) {
            case 'left':
                moved = moveLeft();
                break;
            case 'right':
                moved = moveRight();
                break;
            case 'up':
                moved = moveUp();
                break;
            case 'down':
                moved = moveDown();
                break;
        }

        if (moved) {
            moves++;
            generateTile();
            renderBoard();
            updateScore();
            updateMoves();

            setTimeout(() => {
                if (checkWin()) {
                    gameState = GAME_STATES.WON;
                    stopTimer();
                    showMessage('胜利！', '恭喜你达到了2048！', '继续游戏');
                    updateGameStatus('恭喜你赢了！可以继续挑战更高分');
                } else if (checkGameOver()) {
                    gameState = GAME_STATES.LOST;
                    stopTimer();
                    showMessage('游戏结束', '没有可移动的方块了', '重新开始');
                    updateGameStatus('游戏结束，点击重新开始再来一局');
                }
                isProcessing = false;
            }, 150);
        } else {
            isProcessing = false;
        }
    }

    function checkWin() {
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (board[i][j].value >= 2048) {
                    return true;
                }
            }
        }
        return false;
    }

    function checkGameOver() {
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (board[i][j].value === 0) {
                    return false;
                }
                if (j < GRID_SIZE - 1 && board[i][j].value === board[i][j + 1].value) {
                    return false;
                }
                if (i < GRID_SIZE - 1 && board[i][j].value === board[i + 1][j].value) {
                    return false;
                }
            }
        }
        return true;
    }

    function updateScore() {
        $('#score').text(score).addClass('score-animate');
        setTimeout(() => {
            $('#score').removeClass('score-animate');
        }, 300);

        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
            $('#best-score').text(bestScore).addClass('score-animate');
            setTimeout(() => {
                $('#best-score').removeClass('score-animate');
            }, 300);
        }
    }

    function updateMoves() {
        $('#moves').text(moves);
    }

    function startTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTime, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function updateTime() {
        elapsedTime = Date.now() - startTime;
        updateTimeDisplay();
    }

    function updateTimeDisplay() {
        const totalSeconds = Math.floor(elapsedTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeString = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
        $('#time').text(timeString);
    }

    function updateGameStatus(text) {
        $('#game-status').text(text);
    }

    function showMessage(title, text, buttonText) {
        const $message = $('#game-message');
        $('#message-title').text(title);
        $('#message-text').text(text);
        $('#message-btn').text(buttonText);

        $message.removeClass('win lose');
        if (title === '胜利！') {
            $message.addClass('win');
        } else if (title === '游戏结束') {
            $message.addClass('lose');
        }

        $message.addClass('show');
    }

    function hideMessage() {
        $('#game-message').removeClass('show');
    }

    function handleMessageButton() {
        if (gameState === GAME_STATES.WON) {
            gameState = GAME_STATES.PLAYING;
            startTimer();
            hideMessage();
            updateGameStatus('继续挑战更高分数！');
        } else if (gameState === GAME_STATES.LOST) {
            restartGame();
        }
    }

    function bindEvents() {
        $(document).keydown(function(e) {
            if (gameState !== GAME_STATES.PLAYING) return;

            switch (e.which) {
                case 37:
                case 65:
                    e.preventDefault();
                    handleMove('left');
                    break;
                case 38:
                case 87:
                    e.preventDefault();
                    handleMove('up');
                    break;
                case 39:
                case 68:
                    e.preventDefault();
                    handleMove('right');
                    break;
                case 40:
                case 83:
                    e.preventDefault();
                    handleMove('down');
                    break;
            }
        });

        const $gameContainer = $('.game-container')[0];

        $gameContainer.addEventListener('touchstart', function(e) {
            if (gameState !== GAME_STATES.PLAYING) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        $gameContainer.addEventListener('touchend', function(e) {
            if (gameState !== GAME_STATES.PLAYING) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            const minSwipeDistance = 30;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX > 0) {
                        handleMove('right');
                    } else {
                        handleMove('left');
                    }
                }
            } else {
                if (Math.abs(deltaY) > minSwipeDistance) {
                    if (deltaY > 0) {
                        handleMove('down');
                    } else {
                        handleMove('up');
                    }
                }
            }
        }, { passive: true });

        $('#start-btn').click(startGame);
        $('#restart-btn').click(restartGame);
        $('#message-btn').click(handleMessageButton);

        $(window).resize(function() {
            if (gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.PAUSED ||
                gameState === GAME_STATES.WON || gameState === GAME_STATES.LOST) {
                renderBoard();
            }
        });
    }

    initGame();
});