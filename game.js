// ============================================================================
// game.js — Core game loop, state management, collision detection
// ============================================================================

import { STATE, CANVAS_WIDTH, CANVAS_HEIGHT, BG_COLOR } from './config.js';
import { Player } from './player.js';
import { Level } from './level.js';
import { input } from './input.js';
import { playJumpSound, playDeathSound, playLevelCompleteSound } from './audio.js';

export class Game {
    constructor(canvas, callbacks = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;

        // Callbacks for UI updates
        this.onHudUpdate = callbacks.onHudUpdate || (() => {});
        this.onStateChange = callbacks.onStateChange || (() => {});
        this.onGameEnd = callbacks.onGameEnd || (() => {});

        // Game state
        this.state = STATE.MENU;
        this.attempt = 1;
        this.progress = 0; // percentage 0-100
        this.currentLevel = null;

        // Entities (initialized later)
        this.player = null;
        this.level = null;

        // Animation frame tracking
        this._lastTime = 0;
        this._animFrameId = null;

        // Setup input listener
        input.onJump((event) => {
            if (this.state === STATE.PLAYING && this.player) {
                if (event.type === 'press') {
                    this.player.onJumpPress();
                    playJumpSound();
                } else if (event.type === 'release') {
                    this.player.onJumpRelease();
                }
            }
        });
    }

    /** Start game loop (mirroring pacman-game pattern) */
    run() {
        this._lastTime = performance.now();
        const loop = (timestamp) => {
            const dt = Math.min((timestamp - this._lastTime) / 1000, 0.05);
            this._lastTime = timestamp;
            this._update(dt);
            this._draw();
            this._animFrameId = requestAnimationFrame(loop);
        };
        this._animFrameId = requestAnimationFrame(loop);
    }

    /** Stop game loop */
    stop() {
        if (this._animFrameId) {
            cancelAnimationFrame(this._animFrameId);
            this._animFrameId = null;
        }
    }

    /** Update game logic */
    _update(dt) {
        if (this.state === STATE.PLAYING) {
            this._updatePlaying(dt);
        } else if (this.state === STATE.EDITOR) {
            this._updateEditor(dt);
        }
        // MENU, PAUSED, DEAD, COMPLETE have no update logic
    }

    /** Render everything */
    _draw() {
        // Clear canvas
        this.ctx.fillStyle = BG_COLOR;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (this.state === STATE.PLAYING || this.state === STATE.DEAD) {
            this._drawPlaying();
        } else if (this.state === STATE.EDITOR) {
            this._drawEditor();
        }
    }

    /** Update logic for PLAYING state */
    _updatePlaying(dt) {
        if (!this.player || !this.level) return;

        // Update level (scrolling, obstacles)
        this.level.update(dt);

        // Update player
        this.player.update(dt);

        // Check collisions
        this._checkCollisions();

        // Update progress
        this.progress = this.level.getProgress();
        this._emitHudUpdate();

        // Check win condition (return early so death can't also trigger on this frame)
        if (this.level.isComplete()) {
            this.setState(STATE.COMPLETE);
            playLevelCompleteSound();
            this.onGameEnd({ result: 'complete', attempts: this.attempt });
            return;
        }

        // Check death
        if (this.player.isDead && this.state !== STATE.DEAD) {
            this.setState(STATE.DEAD);
            playDeathSound();
            setTimeout(() => this.restart(), 1500); // auto-restart after 1.5s
        }
    }

    /** Draw logic for PLAYING state */
    _drawPlaying() {
        if (!this.level || !this.player) return;

        // Draw level (background, ground, obstacles)
        this.level.draw(this.ctx);

        // Draw player
        this.player.draw(this.ctx);

        // Draw death overlay
        if (this.state === STATE.DEAD) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /** Update logic for EDITOR state (implement later) */
    _updateEditor(dt) {
        // TODO: Implement in editor steps
    }

    /** Draw logic for EDITOR state (implement later) */
    _drawEditor() {
        // TODO: Implement in editor steps
    }

    /** Change game state with callbacks */
    setState(newState) {
        if (this.state === newState) return;
        this.state = newState;
        this.onStateChange(newState);
    }

    /** Public API for starting gameplay */
    startPlaying(levelData) {
        if (!levelData) {
            console.error('Game.startPlaying: levelData is required');
            return;
        }
        this.currentLevel = levelData;
        this.attempt = 1;
        this.progress = 0;
        this._initLevel();
        this.setState(STATE.PLAYING);
        this._emitHudUpdate();
    }

    /** Initialize level entities */
    _initLevel() {
        try {
            this.player = new Player();
            this.level = new Level(this.currentLevel);
        } catch (error) {
            console.error('Failed to initialize level:', error);
            this.setState(STATE.MENU);
        }
    }

    /** Check collision detection */
    _checkCollisions() {
        if (!this.player || !this.level) return;
        
        const playerBounds = this.player.getBounds();
        const obstacles = this.level.getActiveObstacles();

        for (const obstacle of obstacles) {
            if (obstacle && obstacle.collidesWith && obstacle.collidesWith(playerBounds)) {
                if (obstacle.isDeadly && obstacle.isDeadly()) {
                    this.player.die();
                    return;
                }
                // Handle non-deadly interactions (orbs, portals)
                // TODO: Implement power-up logic in future iterations
            }
        }
    }

    /** Restart current level */
    restart() {
        if (this.state !== STATE.DEAD) return;
        if (!this.player || !this.level) {
            console.warn('Cannot restart: entities not initialized');
            return;
        }
        this.attempt++;
        this.player.reset();
        this.level.reset();
        this.setState(STATE.PLAYING);
        this._emitHudUpdate();
    }

    /** Emit HUD update callback */
    _emitHudUpdate() {
        this.onHudUpdate({
            attempt: this.attempt,
            progress: this.progress,
            levelName: this.currentLevel?.name || '—',
        });
    }

    // === Debug/Test Hooks ===
    setAttemptForTests(value) {
        this.attempt = value;
        this._emitHudUpdate();
    }

    forceGameOverForTests() {
        this.setState(STATE.DEAD);
    }

    restartForTests() {
        this.restart();
    }
}
