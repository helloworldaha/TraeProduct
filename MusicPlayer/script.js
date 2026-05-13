const audio = document.getElementById('audio');
const cover = document.getElementById('cover');
const coverWrapper = document.querySelector('.cover-wrapper');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const modeBtn = document.getElementById('modeBtn');
const listBtn = document.getElementById('listBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeBtn = document.getElementById('volumeBtn');
const volumePercent = document.getElementById('volumePercent');
const modeText = document.getElementById('modeText');
const playlist = document.getElementById('playlist');
const playlistContainer = document.getElementById('playlistContainer');
const songCount = document.getElementById('songCount');

let isPlaylistVisible = true;

const playModes = ['sequence', 'single', 'loop', 'random'];
const playModeNames = {
    'sequence': '顺序播放',
    'single': '单曲循环',
    'loop': '列表循环',
    'random': '随机播放'
};

let currentSongIndex = 0;
let currentPlayMode = 'sequence';
let isPlaying = false;
let previousVolume = 70;

function initPlayer() {
    loadFromLocalStorage();
    renderPlaylist();
    updateVolumeUI();
    updateModeUI();
    loadSong(currentSongIndex);
    setupEventListeners();
}

function loadFromLocalStorage() {
    const savedVolume = localStorage.getItem('musicPlayer_volume');
    const savedMode = localStorage.getItem('musicPlayer_playMode');
    const savedSongIndex = localStorage.getItem('musicPlayer_currentSong');
    const savedProgress = localStorage.getItem('musicPlayer_progress');

    if (savedVolume !== null) {
        previousVolume = parseInt(savedVolume);
        volumeSlider.value = savedVolume;
    }

    if (savedMode !== null && playModes.includes(savedMode)) {
        currentPlayMode = savedMode;
    }

    if (savedSongIndex !== null) {
        const index = parseInt(savedSongIndex);
        if (index >= 0 && index < songs.length) {
            currentSongIndex = index;
        }
    }

    audio.volume = volumeSlider.value / 100;
}

function saveToLocalStorage() {
    localStorage.setItem('musicPlayer_volume', volumeSlider.value);
    localStorage.setItem('musicPlayer_playMode', currentPlayMode);
    localStorage.setItem('musicPlayer_currentSong', currentSongIndex);
    localStorage.setItem('musicPlayer_progress', audio.currentTime);
}

function renderPlaylist() {
    playlist.innerHTML = '';
    songCount.textContent = `${songs.length} 首`;

    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = `playlist-item ${index === currentSongIndex ? 'active' : ''}`;
        item.dataset.index = index;

        item.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="playlist-item-cover" style="background-image: url('${song.cover}')">
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
            <div class="playlist-item-duration">${song.duration}</div>
        `;

        item.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(index);
            playMusic();
        });

        playlist.appendChild(item);
    });
}

function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    cover.src = song.cover;
    coverWrapper.style.backgroundImage = `url(${song.cover})`;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;

    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
        item.classList.toggle('playing', i === index && isPlaying);
    });

    saveToLocalStorage();
}

function playMusic() {
    audio.play()
        .then(() => {
            isPlaying = true;
            playBtn.classList.add('playing');
            coverWrapper.classList.add('playing');
            updatePlaylistPlayingState();
        })
        .catch(err => {
            console.log('播放失败:', err);
        });
}

function pauseMusic() {
    audio.pause();
    isPlaying = false;
    playBtn.classList.remove('playing');
    coverWrapper.classList.remove('playing');
    updatePlaylistPlayingState();
}

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function nextSong() {
    switch (currentPlayMode) {
        case 'random':
            currentSongIndex = Math.floor(Math.random() * songs.length);
            break;
        case 'single':
            audio.currentTime = 0;
            playMusic();
            return;
        default:
            currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    loadSong(currentSongIndex);
    playMusic();
}

function prevSong() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
    } else {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
    }
    playMusic();
}

function updateProgress() {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    saveToLocalStorage();
}

function setProgress(e) {
    const rect = progressBar.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const percent = (clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
}

function changeVolume() {
    audio.volume = volumeSlider.value / 100;
    updateVolumeUI();
    saveToLocalStorage();
}

function updateVolumeUI() {
    const volume = parseInt(volumeSlider.value);
    volumePercent.textContent = `${volume}%`;

    const volumeHigh = volumeBtn.querySelector('.volume-high');
    const volumeLow = volumeBtn.querySelector('.volume-low');
    const volumeMute = volumeBtn.querySelector('.volume-mute');

    volumeHigh.style.display = 'none';
    volumeLow.style.display = 'none';
    volumeMute.style.display = 'none';

    if (volume === 0) {
        volumeMute.style.display = 'block';
    } else if (volume < 50) {
        volumeLow.style.display = 'block';
    } else {
        volumeHigh.style.display = 'block';
    }
}

function toggleMute() {
    if (audio.volume > 0) {
        previousVolume = volumeSlider.value;
        volumeSlider.value = 0;
        audio.volume = 0;
    } else {
        volumeSlider.value = previousVolume;
        audio.volume = previousVolume / 100;
    }
    updateVolumeUI();
    saveToLocalStorage();
}

function switchPlayMode() {
    const currentIndex = playModes.indexOf(currentPlayMode);
    const nextIndex = (currentIndex + 1) % playModes.length;
    currentPlayMode = playModes[nextIndex];
    updateModeUI();
    saveToLocalStorage();
}

function updateModeUI() {
    modeText.textContent = playModeNames[currentPlayMode];
}

function updatePlaylistPlayingState() {
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('playing', i === currentSongIndex && isPlaying);
    });
}

function togglePlaylist() {
    isPlaylistVisible = !isPlaylistVisible;
    if (isPlaylistVisible) {
        playlistContainer.classList.remove('hidden');
    } else {
        playlistContainer.classList.add('hidden');
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function handleSongEnd() {
    switch (currentPlayMode) {
        case 'sequence':
            if (currentSongIndex < songs.length - 1) {
                nextSong();
            } else {
                pauseMusic();
            }
            break;
        case 'single':
            audio.currentTime = 0;
            playMusic();
            break;
        case 'loop':
        case 'random':
            nextSong();
            break;
    }
}

function setupEventListeners() {
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    modeBtn.addEventListener('click', switchPlayMode);
    listBtn.addEventListener('click', togglePlaylist);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audio.duration);
    });
    audio.addEventListener('ended', handleSongEnd);

    progressBar.addEventListener('click', setProgress);

    let isDragging = false;
    progressBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        setProgress(e);
    });
    progressBar.addEventListener('touchstart', (e) => {
        isDragging = true;
        setProgress(e);
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) setProgress(e);
    });
    document.addEventListener('touchmove', (e) => {
        if (isDragging) setProgress(e);
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    volumeSlider.addEventListener('input', changeVolume);
    volumeBtn.addEventListener('click', toggleMute);

    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowLeft':
                audio.currentTime = Math.max(0, audio.currentTime - 5);
                break;
            case 'ArrowRight':
                audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
                break;
            case 'ArrowUp':
                volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 5);
                changeVolume();
                break;
            case 'ArrowDown':
                volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 5);
                changeVolume();
                break;
        }
    });
}

initPlayer();
