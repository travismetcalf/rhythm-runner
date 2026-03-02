// ============================================================================
// level.js — Level data management, scrolling, obstacle spawning
// ============================================================================

import { BASE_SCROLL_SPEED, GROUND_Y, COLORS, CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { createObstacle } from './obstacles.js';

export class Level {
    constructor(levelData) {
        this.name = levelData.name;
        this.scrollSpeed = levelData.scrollSpeed || BASE_SCROLL_SPEED;
        this.length = levelData.length || 5000; // pixels
        this.bpm = levelData.bpm || 120;
        
        // Camera position (world X coordinate)
        this.cameraX = 0;
        
        // Create obstacles from data
        this.obstacles = (levelData.obstacles || []).map(data => createObstacle(data));
        
        // Track which obstacles are active (on screen or nearby)
        this.activeObstacles = [];
    }

    update(dt) {
        // Scroll camera
        this.cameraX += this.scrollSpeed * dt;
        
        // Update active obstacles (ones visible or just off-screen)
        this.activeObstacles = this.obstacles.filter(obs => {
            const onScreen = obs.x + obs.width > this.cameraX - 100 &&
                           obs.x < this.cameraX + CANVAS_WIDTH + 100;
            if (onScreen) {
                obs.update(dt, this.cameraX);
            }
            return onScreen;
        });
    }

    draw(ctx) {
        // Draw background
        this._drawBackground(ctx);
        
        // Draw ground
        this._drawGround(ctx);
        
        // Draw obstacles
        this.activeObstacles.forEach(obs => obs.draw(ctx, this.cameraX));
    }

    _drawBackground(ctx) {
        // Simple gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(1, '#1a1a2e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y);
    }

    _drawGround(ctx) {
        ctx.fillStyle = COLORS.GROUND;
        ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
        
        // Ground line
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, GROUND_Y);
        ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
        ctx.stroke();
    }

    /** Get progress percentage (0-100) */
    getProgress() {
        return Math.min(100, (this.cameraX / this.length) * 100);
    }

    /** Check if level is complete */
    isComplete() {
        return this.cameraX >= this.length;
    }

    /** Reset camera to start */
    reset() {
        this.cameraX = 0;
    }

    /** Get all active obstacles for collision checking */
    getActiveObstacles() {
        return this.activeObstacles;
    }
}
