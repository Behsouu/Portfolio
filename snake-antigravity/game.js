// --- DOM Elements ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const themeToggle = document.getElementById('theme-toggle');
const soundToggle = document.getElementById('sound-toggle');

const hud = document.getElementById('hud');
const currentScoreEl = document.getElementById('current-score');
const bestScoreEl = document.getElementById('best-score');
const pauseBtn = document.getElementById('pause-btn');

const overlays = {
    home: document.getElementById('overlay-home'),
    pause: document.getElementById('overlay-pause'),
    gameover: document.getElementById('overlay-gameover')
};

const startBtn = document.getElementById('start-btn');
const resumeBtn = document.getElementById('resume-btn');
const quitBtn = document.getElementById('quit-btn');
const restartBtn = document.getElementById('restart-btn');

const dBtns = {
    up: document.getElementById('btn-up'),
    down: document.getElementById('btn-down'),
    left: document.getElementById('btn-left'),
    right: document.getElementById('btn-right')
};

// --- Game Constants & State ---
const GRID_SIZE = 20; // 20x20 grid
let TILE_SIZE; // Calculated dynamically based on canvas width

let speeds = {
    slow: 150,
    normal: 100,
    fast: 70
};

let state = {
    snake: [],
    direction: { x: 0, y: 0 },
    nextDirection: { x: 0, y: 0 },
    apple: { x: 0, y: 0 },
    score: 0,
    bestScore: 0,
    status: 'home', // home, playing, paused, gameover
    speedKey: 'normal',
    wallsActive: true,
    lastTick: 0,
    animId: null
};

// --- Settings & Storage ---
let soundEnabled = true;
let audioCtx = null;

const THEME_KEY = 'snake-theme';
const SOUND_KEY = 'snake-sound';

// --- Initialization ---
function init() {
    loadPreferences();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Bind UI actions
    themeToggle.addEventListener('click', toggleTheme);
    soundToggle.addEventListener('click', toggleSound);

    startBtn.addEventListener('click', startGame);
    resumeBtn.addEventListener('click', togglePause);
    pauseBtn.addEventListener('click', togglePause);
    quitBtn.addEventListener('click', () => setOverlay('home'));
    restartBtn.addEventListener('click', startGame);

    // Bind Controls
    window.addEventListener('keydown', handleKeyInput);
    initTouchControls();

    // Initial draw (empty board)
    drawBackground();
}

function loadPreferences() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon();

    const savedSound = localStorage.getItem(SOUND_KEY);
    soundEnabled = savedSound ? savedSound === 'true' : true;
    updateSoundIcon();
}

// --- Audio System (Web Audio API - No assets required) ---
function playBeep(type) {
    if (!soundEnabled) return;

    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'eat') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'die') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }
}

// --- Canvas & Rendering ---
function resizeCanvas() {
    const container = document.querySelector('.canvas-container');
    const width = container.clientWidth;
    canvas.width = width;
    canvas.height = width; // Keep it square
    TILE_SIZE = width / GRID_SIZE;

    if (state.status === 'playing' || state.status === 'paused') {
        render();
    } else {
        drawBackground();
    }
}

function applyThemeColors() {
    const style = getComputedStyle(document.body);
    return {
        bg: style.getPropertyValue('--bg-color').trim(),
        head: style.getPropertyValue('--snake-head').trim(),
        body: style.getPropertyValue('--snake-body').trim(),
        apple: style.getPropertyValue('--apple-color').trim(),
        grid: style.getPropertyValue('--border-color').trim(),
    };
}

function drawBackground() {
    const c = applyThemeColors();
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw subtle grid
    ctx.strokeStyle = c.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        // Verticals
        ctx.moveTo(i * TILE_SIZE, 0);
        ctx.lineTo(i * TILE_SIZE, canvas.height);
        // Horizontals
        ctx.moveTo(0, i * TILE_SIZE);
        ctx.lineTo(canvas.width, i * TILE_SIZE);
        ctx.stroke();
    }
}

function render() {
    drawBackground();
    const c = applyThemeColors();

    // Draw Apple (Circle with small leaf effect)
    ctx.fillStyle = c.apple;
    ctx.beginPath();
    ctx.arc(
        state.apple.x * TILE_SIZE + TILE_SIZE / 2,
        state.apple.y * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE / 2.2, 0, Math.PI * 2
    );
    ctx.fill();

    // Draw Snake
    state.snake.forEach((segment, index) => {
        // Head is slightly different color
        ctx.fillStyle = index === 0 ? c.head : c.body;

        // Slight padding for segmentation visual
        const padding = 1.5;
        ctx.fillRect(
            segment.x * TILE_SIZE + padding,
            segment.y * TILE_SIZE + padding,
            TILE_SIZE - padding * 2,
            TILE_SIZE - padding * 2
        );
    });
}

// --- Game Logic ---
function startGame() {
    // Read Settings
    state.speedKey = document.querySelector('input[name="speed"]:checked').value;
    state.wallsActive = document.getElementById('walls-toggle').checked;

    loadBestScore();
    bestScoreEl.textContent = state.bestScore;

    // Reset Snake (Start at center, moving Right)
    state.snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    state.direction = { x: 1, y: 0 };
    state.nextDirection = { x: 1, y: 0 };
    state.score = 0;
    currentScoreEl.textContent = state.score;

    placeApple();

    setOverlay(null);
    state.status = 'playing';
    hud.classList.remove('hidden');

    if (state.animId) cancelAnimationFrame(state.animId);
    state.lastTick = performance.now();
    gameLoop(state.lastTick);
}

function loadBestScore() {
    const key = `snake-best-${state.speedKey}-${state.wallsActive ? 'walls' : 'nowalls'}`;
    state.bestScore = parseInt(localStorage.getItem(key)) || 0;
}

function saveBestScore() {
    const key = `snake-best-${state.speedKey}-${state.wallsActive ? 'walls' : 'nowalls'}`;
    if (state.score > state.bestScore) {
        state.bestScore = state.score;
        localStorage.setItem(key, state.bestScore);
        return true;
    }
    return false;
}

function placeApple() {
    let newApple;
    let collision = true;

    while (collision) {
        newApple = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        // Ensure apple is not on the snake
        collision = state.snake.some(segment => segment.x === newApple.x && segment.y === newApple.y);
    }
    state.apple = newApple;
}

function gameLoop(timestamp) {
    if (state.status !== 'playing') return;

    const interval = speeds[state.speedKey];
    const deltaTime = timestamp - state.lastTick;

    if (deltaTime >= interval) {
        update();
        render();
        state.lastTick = timestamp;
    }

    if (state.status === 'playing') {
        state.animId = requestAnimationFrame(gameLoop);
    }
}

function update() {
    state.direction = state.nextDirection;

    // Calculate new head position
    const head = state.snake[0];
    const newHead = {
        x: head.x + state.direction.x,
        y: head.y + state.direction.y
    };

    // Handle Walls
    if (state.wallsActive) {
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
            gameOver();
            return;
        }
    } else {
        // Wrap around
        if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
        if (newHead.x >= GRID_SIZE) newHead.x = 0;
        if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
        if (newHead.y >= GRID_SIZE) newHead.y = 0;
    }

    // Handle Self Collision
    if (state.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver();
        return;
    }

    // Move Snake
    state.snake.unshift(newHead);

    // Handle Apple
    if (newHead.x === state.apple.x && newHead.y === state.apple.y) {
        state.score += 10;
        currentScoreEl.textContent = state.score;
        playBeep('eat');
        placeApple();
    } else {
        // Remove tail if didn't eat
        state.snake.pop();
    }
}

function gameOver() {
    state.status = 'gameover';
    playBeep('die');

    const isNewRecord = saveBestScore();

    document.getElementById('go-score').textContent = state.score;
    const msg = document.getElementById('new-record-msg');

    if (isNewRecord && state.score > 0) {
        msg.classList.remove('hidden');
    } else {
        msg.classList.add('hidden');
    }

    setOverlay('gameover');
}

function togglePause() {
    if (state.status === 'playing') {
        state.status = 'paused';
        setOverlay('pause');
    } else if (state.status === 'paused') {
        state.status = 'playing';
        setOverlay(null);
        state.lastTick = performance.now();
        gameLoop(state.lastTick);
    }
}

// --- Input Handling ---
function changeDirection(keyX, keyY) {
    if (state.status !== 'playing') return;

    // Prevent reversing directly
    if (state.direction.x === -keyX && state.direction.y === -keyY) return;

    // Prevent registering multiple rapid keystrokes in one tick
    if (state.nextDirection.x !== state.direction.x || state.nextDirection.y !== state.direction.y) return;

    state.nextDirection = { x: keyX, y: keyY };
}

function handleKeyInput(e) {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            changeDirection(0, -1);
            e.preventDefault();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            changeDirection(0, 1);
            e.preventDefault();
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            changeDirection(-1, 0);
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            changeDirection(1, 0);
            e.preventDefault();
            break;
        case 'p':
        case 'P':
            togglePause();
            break;
        case 'r':
        case 'R':
            if (state.status === 'gameover') startGame();
            break;
    }
}

function initTouchControls() {
    // D-Pad buttons
    dBtns.up.addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection(0, -1); });
    dBtns.down.addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection(0, 1); });
    dBtns.left.addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection(-1, 0); });
    dBtns.right.addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection(1, 0); });

    // Swipe gestures on canvas
    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    canvas.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
    }, { passive: true });
}

function handleSwipe(startX, startY, endX, endY) {
    const diffX = endX - startX;
    const diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal
        if (Math.abs(diffX) > 30) {
            if (diffX > 0) changeDirection(1, 0);
            else changeDirection(-1, 0);
        }
    } else {
        // Vertical
        if (Math.abs(diffY) > 30) {
            if (diffY > 0) changeDirection(0, 1);
            else changeDirection(0, -1);
        }
    }
}

// --- UI Helpers ---
function setOverlay(type) {
    Object.values(overlays).forEach(o => o.classList.add('hidden'));

    if (type) {
        overlays[type].classList.remove('hidden');
        if (type === 'home') hud.classList.add('hidden');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    updateThemeIcon();

    // Redraw if not playing to update colors instantly
    if (state.status !== 'playing') drawBackground();
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    const theme = document.documentElement.getAttribute('data-theme');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem(SOUND_KEY, soundEnabled);
    updateSoundIcon();
}

function updateSoundIcon() {
    const icon = soundToggle.querySelector('i');
    icon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';

    // Init audio context on first interaction if enabling
    if (soundEnabled && !audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Boot
document.addEventListener('DOMContentLoaded', init);
