// ============================================================================
// audio.js — Audio playback, procedural sound effects, mute management
// ============================================================================

let audioCtx = null;
let muted = false;

/** Lazily initialize AudioContext (must happen after user gesture) */
function getCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

/** Play simple tone (oscillator-based) */
function playTone(frequency, duration, type = 'square', volume = 0.15) {
    if (muted) return;
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
}

/** Play frequency sweep */
function playSweep(startFreq, endFreq, duration, type = 'sawtooth', volume = 0.12) {
    if (muted) return;
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(endFreq, ctx.currentTime + duration);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
}

// === Exported Sound Effects ===

export function playJumpSound() {
    playTone(523, 0.1, 'square', 0.1); // C5 note
}

export function playDeathSound() {
    playSweep(440, 55, 0.5, 'sawtooth', 0.15); // A4 to A1 (falling)
}

export function playLevelCompleteSound() {
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6 (ascending)
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.2, 'sine', 0.12), i * 150);
    });
}

export function playOrbSound() {
    playTone(880, 0.15, 'sine', 0.1); // A5 note
}

export function playPortalSound() {
    playSweep(200, 800, 0.3, 'triangle', 0.1);
}

export function playBeatPulse() {
    playTone(110, 0.05, 'sine', 0.05); // subtle bass pulse
}

// === Mute Control ===

export function toggleMute() {
    muted = !muted;
    return muted;
}

export function isMuted() {
    return muted;
}

export function setMuted(value) {
    muted = value;
}
