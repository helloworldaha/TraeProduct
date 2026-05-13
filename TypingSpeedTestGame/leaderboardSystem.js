const LeaderboardSystem = (() => {
    const STORAGE_KEY = 'typingGameLeaderboard';
    const MAX_RECORDS = 10;
    let records = [];

    const init = () => {
        loadRecords();
        render();
        setupEventListeners();
    };

    const loadRecords = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            records = stored ? JSON.parse(stored) : [];
        } catch (e) {
            records = [];
        }
    };

    const saveRecords = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        } catch (e) {
            console.error('Failed to save leaderboard:', e);
        }
    };

    const addRecord = (wpm, accuracy, maxCombo, rating) => {
        const record = {
            wpm,
            accuracy,
            maxCombo,
            rating,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };

        records.push(record);
        records.sort((a, b) => b.wpm - a.wpm);
        records = records.slice(0, MAX_RECORDS);
        saveRecords();
        render();
    };

    const clearAll = () => {
        records = [];
        saveRecords();
        render();
    };

    const render = () => {
        const listElement = document.getElementById('leaderboardList');
        const emptyElement = document.getElementById('leaderboardEmpty');

        if (!listElement || !emptyElement) return;

        if (records.length === 0) {
            emptyElement.style.display = 'block';
            listElement.style.display = 'none';
            return;
        }

        emptyElement.style.display = 'none';
        listElement.style.display = 'block';

        listElement.innerHTML = records.map((record, index) => `
            <div class="leaderboard-item ${index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : ''}">
                <div class="leaderboard-rank">#${index + 1}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-wpm">${record.wpm} WPM</div>
                    <div class="leaderboard-details">
                        <span>Accuracy: ${record.accuracy}%</span>
                        <span>Max Combo: ${record.maxCombo}</span>
                    </div>
                </div>
                <div class="leaderboard-rating">${record.rating}</div>
            </div>
        `).join('');
    };

    const setupEventListeners = () => {
        const clearBtn = document.getElementById('clearLeaderboardBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearAll);
        }
    };

    return {
        init,
        addRecord,
        clearAll
    };
})();
