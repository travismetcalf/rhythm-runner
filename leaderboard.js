// ============================================================================
// leaderboard.js — localStorage-based score persistence
// ============================================================================

const STORAGE_KEY = 'rhythm-runner-scores';

function loadScores() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
}

function persistScores(scores) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch {
        // localStorage unavailable (private browsing, quota exceeded)
    }
}

export function saveScore(levelId, attempts) {
    const scores = loadScores();
    const prev = scores[levelId];
    if (!prev || attempts < prev) {
        scores[levelId] = attempts;
        persistScores(scores);
    }
}

export function getBestScore(levelId) {
    return loadScores()[levelId] || null;
}

export function getAllScores() {
    return loadScores();
}
