// ============================================================================
// audio.js — Audio playback, procedural sound effects, mute management
// ============================================================================

let audioCtx = null;
let muted = false;

/**
 * Lazily initialize Web Audio API context.
 * The AudioContext must be resumed after a user gesture (click, tap).
 * @returns {AudioContext|null} The audio context instance, or null if unsupported
 */
function getCtx() {
    if (!audioCtx) {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtxClass) return null;
        audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

/**
 * Play a simple tone using a synthesized oscillator.
 * Automatically envelopes the tone to avoid clicks.
 * @param {number} frequency - Frequency in Hz (e.g., 440 = A4, 523 = C5)
 * @param {number} duration - Duration in seconds
 * @param {string} [type='square'] - Oscillator type: 'sine', 'square', 'sawtooth', 'triangle'
 * @param {number} [volume=0.15] - Volume from 0 to 1
 */
function playTone(frequency, duration, type = 'square', volume = 0.15) {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
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

/**
 * Play a frequency sweep (pitch slide).
 * Useful for ascending/descending effects.
 * @param {number} startFreq - Starting frequency in Hz
 * @param {number} endFreq - Ending frequency in Hz
 * @param {number} duration - Duration in seconds
 * @param {string} [type='sawtooth'] - Oscillator type
 * @param {number} [volume=0.12] - Volume from 0 to 1
 */
function playSweep(startFreq, endFreq, duration, type = 'sawtooth', volume = 0.12) {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
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

/**
 * Play jump sound effect.
 * High-pitched beep that's satisfying for successful jumps.
 */
export function playJumpSound() {
    playTone(523, 0.1, 'square', 0.1); // C5 note
}

/**
 * Play death sound effect.
 * Descending pitch sweep suggesting failure.
 */
export function playDeathSound() {
    playSweep(440, 55, 0.5, 'sawtooth', 0.15); // A4 to A1 (falling)
}

/**
 * Play level complete sound effect.
 * Ascending arpeggio suggesting victory.
 */
export function playLevelCompleteSound() {
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6 (ascending)
    notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.2, 'sine', 0.12), i * 150);
    });
}

/**
 * Play orb power-up sound effect.
 * High-pitched sine wave.
 */
export function playOrbSound() {
    playTone(880, 0.15, 'sine', 0.1); // A5 note
}

/**
 * Play portal teleport sound effect.
 * Wide frequency sweep suggesting teleportation.
 */
export function playPortalSound() {
    playSweep(200, 800, 0.3, 'triangle', 0.1);
}

/**
 * Play subtle beat pulse for music-synced gameplay.
 * Low frequency provides tactile feedback.
 */
export function playBeatPulse() {
    playTone(110, 0.05, 'sine', 0.05); // subtle bass pulse
}

// === Mute Control ===

/**
 * Toggle audio mute state on/off.
 * @returns {boolean} New mute state (true = muted)
 */
export function toggleMute() {
    muted = !muted;
    return muted;
}

/**
 * Check if audio is currently muted.
 * @returns {boolean} True if muted, false if playing
 */
export function isMuted() {
    return muted;
}

/**
 * Set mute state explicitly.
 * @param {boolean} value - True to mute, false to unmute
 */
export function setMuted(value) {
    muted = value;
}
