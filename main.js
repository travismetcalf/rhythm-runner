// ============================================================================
// main.js — Application bootstrap and UI orchestration
// ============================================================================

import { Game } from './game.js';
import { STATE } from './config.js';
import { toggleMute } from './audio.js';
import { getLevelById, getNextLevelId, getAllLevels } from './levelData.js';
import { saveScore, getBestScore } from './leaderboard.js';

// === DOM Elements ===
const canvas = document.getElementById('game-canvas');
const attemptEl = document.getElementById('attempt-value');
const progressEl = document.getElementById('progress-value');
const levelNameEl = document.getElementById('level-name');
const menuOverlay = document.getElementById('menu-overlay');
const completeOverlay = document.getElementById('complete-overlay');
const completeStats = document.getElementById('complete-stats');
const nextLevelBtn = document.getElementById('next-level-btn');
const replayBtn = document.getElementById('replay-btn');
const menuBtn = document.getElementById('menu-btn');
const levelSelectOverlay = document.getElementById('level-select-overlay');
const levelList = document.getElementById('level-list');
const levelSelectBack = document.getElementById('level-select-back');
const playBtn = document.getElementById('play-btn');
const editorBtn = document.getElementById('editor-btn');
const levelsBtn = document.getElementById('levels-btn');
const muteBtn = document.getElementById('mute-btn');

// Track which level is currently being played
let currentLevelId = 'level1';

// === Game Instance ===
const game = new Game(canvas, {
    onHudUpdate: (data) => {
        attemptEl.textContent = data.attempt;
        progressEl.textContent = Math.floor(data.progress);
        levelNameEl.textContent = data.levelName;
    },
    onStateChange: (state) => {
        menuOverlay.classList.add('hidden');
        completeOverlay.classList.add('hidden');
        levelSelectOverlay.classList.add('hidden');

        if (state === STATE.MENU) {
            menuOverlay.classList.remove('hidden');
        }
    },
    onGameEnd: (result) => {
        if (result.result === 'complete') {
            // Save score
            saveScore(currentLevelId, result.attempts);
            const best = getBestScore(currentLevelId);

            // Show complete overlay
            const nextId = getNextLevelId(currentLevelId);
            completeStats.textContent = `Attempts: ${result.attempts} | Best: ${best}`;
            nextLevelBtn.style.display = nextId ? '' : 'none';
            completeOverlay.classList.remove('hidden');
        }
    },
});

// === Level Complete Buttons ===
nextLevelBtn.addEventListener('click', () => {
    const nextId = getNextLevelId(currentLevelId);
    if (nextId) {
        currentLevelId = nextId;
        completeOverlay.classList.add('hidden');
        game.playLevel(getLevelById(nextId));
    }
});

replayBtn.addEventListener('click', () => {
    completeOverlay.classList.add('hidden');
    game.playLevel(getLevelById(currentLevelId));
});

menuBtn.addEventListener('click', () => {
    completeOverlay.classList.add('hidden');
    game.setState(STATE.MENU);
});

// === Level Select ===
levelsBtn.addEventListener('click', () => {
    menuOverlay.classList.add('hidden');
    showLevelSelect();
});

levelSelectBack.addEventListener('click', () => {
    levelSelectOverlay.classList.add('hidden');
    menuOverlay.classList.remove('hidden');
});

function showLevelSelect() {
    levelList.innerHTML = '';
    getAllLevels().forEach(({ id, name }) => {
        const btn = document.createElement('button');
        const best = getBestScore(id);
        btn.textContent = best ? `${name} (Best: ${best})` : name;
        btn.addEventListener('click', () => {
            currentLevelId = id;
            levelSelectOverlay.classList.add('hidden');
            game.startPlaying(getLevelById(id));
        });
        levelList.appendChild(btn);
    });
    levelSelectOverlay.classList.remove('hidden');
}

// === UI Event Handlers ===
playBtn.addEventListener('click', () => {
    currentLevelId = 'level1';
    game.startPlaying(getLevelById('level1'));
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

    if (e.key === ' ' || e.key === 'Enter') {
        if (game.state === STATE.MENU) {
            currentLevelId = 'level1';
            game.startPlaying(getLevelById('level1'));
        } else if (game.state === STATE.COMPLETE) {
            // Space/Enter advances to next level or replays
            const nextId = getNextLevelId(currentLevelId);
            if (nextId) {
                currentLevelId = nextId;
                completeOverlay.classList.add('hidden');
                game.playLevel(getLevelById(nextId));
            } else {
                completeOverlay.classList.add('hidden');
                game.playLevel(getLevelById(currentLevelId));
            }
        }
    } else if (e.key === 'm' || e.key === 'M') {
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
        } else if (game.state === STATE.COMPLETE) {
            completeOverlay.classList.add('hidden');
            game.setState(STATE.MENU);
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
        restart: () => { game.forceGameOverForTests(); game.restart(); },
    };
}
