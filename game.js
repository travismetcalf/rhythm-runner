// ============================================================================
// game.js — Core game loop, state management, collision detection
// ============================================================================

import { STATE, CANVAS_WIDTH, CANVAS_HEIGHT, BG_COLOR, OBSTACLE_TYPE } from './config.js';
import { Player } from './player.js';
import { Level } from './level.js';
import { input } from './input.js';
import { playJumpSound, playDeathSound, playLevelCompleteSound, playOrbSound, playPortalSound } from './audio.js';
import { ParticleSystem } from './particles.js';

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

        // Particle effects
        this.particles = new ParticleSystem();

        // Animation frame tracking
        this._lastTime = 0;
        this._animFrameId = null;

        // Setup input listener
        input.onJump((event) => {
            if (this.state === STATE.PLAYING && this.player) {
                if (event.type === 'press') {
                    this.player.onJumpPress();
                    playJumpSound();
                    if (this.player.isGrounded) {
                        this.particles.emitJump(this.player.x, this.player.y + this.player.size / 2);
                    }
                } else if (event.type === 'release') {
                    this.player.onJumpRelease();
                }
            }
        });
    }

    /** Start game loop */
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
        } else if (this.state === STATE.DEAD || this.state === STATE.COMPLETE) {
            this.particles.update(dt);
        }
    }

    /** Render everything */
    _draw() {
        this.ctx.fillStyle = BG_COLOR;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (this.state === STATE.PLAYING || this.state === STATE.DEAD || this.state === STATE.COMPLETE) {
            this._drawPlaying();
        } else if (this.state === STATE.EDITOR) {
            this._drawEditor();
        }
    }

    /** Update logic for PLAYING state */
    _updatePlaying(dt) {
        if (!this.player || !this.level) return;

        this.level.update(dt);
        this.player.update(dt);
        this._checkCollisions();
        this.particles.update(dt);

        this.progress = this.level.getProgress();
        this._emitHudUpdate();

        // Check win condition (return early so death can't also trigger on this frame)
        if (this.level.isComplete()) {
            this.setState(STATE.COMPLETE);
            playLevelCompleteSound();
            this.particles.emitComplete(CANVAS_WIDTH, CANVAS_HEIGHT);
            this.onGameEnd({ result: 'complete', attempts: this.attempt });
            return;
        }

        // Check death
        if (this.player.isDead && this.state !== STATE.DEAD) {
            this.setState(STATE.DEAD);
            playDeathSound();
            this.particles.emitDeath(this.player.x, this.player.y);
            setTimeout(() => this.restart(), 1500);
        }
    }

    /** Draw logic for PLAYING state */
    _drawPlaying() {
        if (!this.level || !this.player) return;

        this.level.draw(this.ctx);
        this.player.draw(this.ctx);
        this.particles.draw(this.ctx);

        if (this.state === STATE.DEAD) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    _updateEditor(dt) {
        // TODO: Implement in editor steps
    }

    _drawEditor() {
        // TODO: Implement in editor steps
    }

    /** Change game state with callback notification */
    setState(newState, force = false) {
        if (!force && this.state === newState) return;
        this.state = newState;
        this.onStateChange(newState);
    }

    /** Start playing a level (resets attempt counter) */
    startPlaying(levelData) {
        if (!levelData) {
            console.error('Game.startPlaying: levelData is required');
            return;
        }
        this.currentLevel = levelData;
        this.attempt = 1;
        this.progress = 0;
        this._initLevel();
        this.setState(STATE.PLAYING, true);
        this._emitHudUpdate();
    }

    /** Play a level from any state (used for level advancement) */
    playLevel(levelData) {
        this.startPlaying(levelData);
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

    /** Check all obstacle collisions against player */
    _checkCollisions() {
        if (!this.player || !this.level) return;

        const playerBounds = this.player.getBounds();
        const obstacles = this.level.getActiveObstacles();

        for (const obstacle of obstacles) {
            if (obstacle && obstacle.collidesWith && obstacle.collidesWith(playerBounds)) {
                if (this._handleObstacleCollision(obstacle)) return;
            }
        }
    }

    /** Handle a single obstacle collision. Returns true if player died. */
    _handleObstacleCollision(obstacle) {
        if (obstacle.isDeadly && obstacle.isDeadly()) {
            this.player.die();
            return true;
        }

        if (obstacle.type === OBSTACLE_TYPE.ORB && !obstacle.collected) {
            obstacle.collected = true;
            this.player.superJump();
            playOrbSound();
            this.particles.emitOrb(obstacle.x, obstacle.y);
        }

        if (obstacle.type === OBSTACLE_TYPE.PORTAL && !obstacle.used) {
            obstacle.used = true;
            this.player.setMode(obstacle.targetMode);
            playPortalSound();
        }

        return false;
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
