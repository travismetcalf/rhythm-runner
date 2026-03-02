// ============================================================================
// main.js — Application bootstrap and UI orchestration
// ============================================================================

import { Game } from './game.js';
import { STATE } from './config.js';
import { toggleMute } from './audio.js';
import { getLevelById } from './levelData.js';

// === DOM Elements ===
const canvas = document.getElementById('game-canvas');
const attemptEl = document.getElementById('attempt-value');
const progressEl = document.getElementById('progress-value');
const levelNameEl = document.getElementById('level-name');
const menuOverlay = document.getElementById('menu-overlay');
const playBtn = document.getElementById('play-btn');
const editorBtn = document.getElementById('editor-btn');
const muteBtn = document.getElementById('mute-btn');

// === Game Instance ===
const game = new Game(canvas, {
    onHudUpdate: (data) => {
        attemptEl.textContent = data.attempt;
        progressEl.textContent = Math.floor(data.progress);
        levelNameEl.textContent = data.levelName;
    },
    onStateChange: (state) => {
        if (state === STATE.MENU) {
            menuOverlay.classList.remove('hidden');
        } else {
            menuOverlay.classList.add('hidden');
        }
    },
    onGameEnd: (result) => {
        console.log('Game ended:', result);
        // TODO: Show completion/death modals later
    },
});

// === UI Event Handlers ===
playBtn.addEventListener('click', () => {
    const levelData = getLevelById('level1');
    game.startPlaying(levelData);
});

editorBtn.addEventListener('click', () => {
    game.setState(STATE.EDITOR);
    document.getElementById('editor-panel').classList.remove('hidden');
});

muteBtn.addEventListener('click', () => {
    const muted = toggleMute();
    muteBtn.textContent = muted ? '🔇 Sound Off' : '🔊 Sound On';
});

// === Keyboard Shortcuts ===
window.addEventListener('keydown', (e) => {
    // Ignore if typing in input
    const activeTag = document.activeElement?.tagName;
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

    if (e.key === 'm' || e.key === 'M') {
        const muted = toggleMute();
        muteBtn.textContent = muted ? '🔇 Sound Off' : '🔊 Sound On';
    } else if (e.key === 'r' || e.key === 'R') {
        if (game.state === STATE.PLAYING || game.state === STATE.DEAD) {
            game.restart();
        }
    } else if (e.key === 'Escape') {
        if (game.state === STATE.PLAYING) {
            game.setState(STATE.PAUSED);
        } else if (game.state === STATE.PAUSED) {
            game.setState(STATE.PLAYING);
        }
    }
});

// === Initialize ===
game.run();

// === Debug Hooks for Testing ===
if (typeof window !== 'undefined') {
    window.__RHYTHM_DEBUG__ = {
        start: () => game.startPlaying(getLevelById('level1')),
        setAttempt: (n) => game.setAttemptForTests(n),
        forceGameOver: () => game.forceGameOverForTests(),
        getState: () => game.state,
        restart: () => game.restart(),
    };
}

