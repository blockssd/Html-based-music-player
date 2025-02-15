const audioPlayer = document.getElementById('audioPlayer');
const folderInput = document.getElementById('folderInput');
const playlist = document.getElementById('playlist');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentSongDisplay = document.getElementById('currentSong');
const searchInput = document.getElementById('searchInput');
const locateBtn = document.getElementById('locateBtn');
const searchBtn = document.getElementById('searchBtn');

let musicFiles = [];
let currentTrackIndex = -1;
let backgroundImages = ['image/temp.jpg', 'image/temp1.jpg'];
let currentBackgroundIndex = 0;

folderInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    musicFiles = files.filter(file => file.type.startsWith('audio/'));
    if(musicFiles.length === 0) {
        alert('未找到音频文件');
        return;
    }
    renderPlaylist();
});

function renderPlaylist(filteredFiles = musicFiles) {
    playlist.innerHTML = filteredFiles
        .map((file, index) => `
            <div class="playlist-item ${index === currentTrackIndex ? 'current-song' : ''}"
                 data-index="${musicFiles.indexOf(file)}"
                 onclick="playTrack(${musicFiles.indexOf(file)})">
                ${file.name}
            </div>
        `)
        .join('');
}

function loadTrack(index) {
    if(index < 0 || index >= musicFiles.length) return;

    const file = musicFiles[index];
    const url = URL.createObjectURL(file);
    audioPlayer.src = url;
    audioPlayer.play();
    currentSongDisplay.textContent = `当前播放：${file.name}`;
    currentTrackIndex = index;
    renderPlaylist();
}

window.playTrack = function(index) {
    loadTrack(index);
}

playPauseBtn.addEventListener('click', () => {
    if(audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.textContent = '暂停';
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = '播放';
    }
});

nextBtn.addEventListener('click', () => {
    const nextIndex = (currentTrackIndex + 1) % musicFiles.length;
    loadTrack(nextIndex);
});

prevBtn.addEventListener('click', () => {
    const prevIndex = (currentTrackIndex - 1 + musicFiles.length) % musicFiles.length;
    loadTrack(prevIndex);
});

audioPlayer.addEventListener('ended', () => {
    nextBtn.click();
});

playPauseBtn.textContent = '播放';

function filterPlaylist() {
    const query = searchInput.value.toLowerCase();
    const filteredFiles = musicFiles.filter(file => file.name.toLowerCase().includes(query));
    renderPlaylist(filteredFiles);
}

searchBtn.addEventListener('click', () => {
    filterPlaylist();
});

locateBtn.addEventListener('click', () => {
    if (currentTrackIndex !== -1) {
        const currentSongElement = document.querySelector(`.playlist-item[data-index="${currentTrackIndex}"]`);
        if (currentSongElement) {
            currentSongElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

const playerContainer = document.querySelector('.player-container');
playerContainer.addEventListener('mouseenter', () => playerContainer.classList.remove('collapsed'));
playerContainer.addEventListener('mouseleave', () => playerContainer.classList.add('collapsed'));

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const offsetX = (x / width) * 50 - 25;
    const offsetY = (y / height) * 50 - 38;

    document.body.style.backgroundPosition = `${50 + offsetX}% ${50 + offsetY}%`;
});