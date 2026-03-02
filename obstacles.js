// ============================================================================
// obstacles.js — Obstacle entities (spikes, blocks, platforms, etc.)
// ============================================================================

import { OBSTACLE_TYPE, COLORS, GRID_SIZE } from './config.js';
import { rectIntersects } from './utils.js';

/** Base obstacle class */
export class Obstacle {
    constructor(x, y, type, props = {}) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.props = props; // custom properties per type
        this.width = props.width || GRID_SIZE;
        this.height = props.height || GRID_SIZE;
    }

    /** Update (most obstacles are static, but could animate) */
    update(dt, cameraX) {
        // Override in subclasses if needed
    }

    /** Draw obstacle (override in subclasses) */
    draw(ctx, cameraX) {
        // Default: draw bounding box
        ctx.fillStyle = COLORS.BLOCK;
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
    }

    /** Get collision bounds */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
    }

    /** Check collision with player */
    collidesWith(playerBounds) {
        return rectIntersects(this.getBounds(), playerBounds);
    }

    /** Is this obstacle deadly? */
    isDeadly() {
        return true; // default
    }
}

/** Spike obstacle (triangular, deadly) */
export class Spike extends Obstacle {
    constructor(x, y, props = {}) {
        super(x, y, OBSTACLE_TYPE.SPIKE, props);
        this.width = props.width || GRID_SIZE;
        this.height = props.height || GRID_SIZE;
    }

    draw(ctx, cameraX) {
        const screenX = this.x - cameraX;
        ctx.fillStyle = COLORS.SPIKE;
        ctx.beginPath();
        ctx.moveTo(screenX, this.y + this.height); // bottom left
        ctx.lineTo(screenX + this.width / 2, this.y); // top center
        ctx.lineTo(screenX + this.width, this.y + this.height); // bottom right
        ctx.closePath();
        ctx.fill();
    }
}

/** Block obstacle (rectangular, deadly) */
export class Block extends Obstacle {
    constructor(x, y, props = {}) {
        super(x, y, OBSTACLE_TYPE.BLOCK, props);
        this.width = props.width || GRID_SIZE;
        this.height = props.height || GRID_SIZE;
    }

    draw(ctx, cameraX) {
        const screenX = this.x - cameraX;
        ctx.fillStyle = COLORS.BLOCK;
        ctx.fillRect(screenX, this.y, this.width, this.height);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX, this.y, this.width, this.height);
    }
}

/** Platform obstacle (jumpable, not deadly) */
export class Platform extends Obstacle {
    constructor(x, y, props = {}) {
        super(x, y, OBSTACLE_TYPE.PLATFORM, props);
        this.width = props.width || GRID_SIZE * 3;
        this.height = props.height || 10;
    }

    draw(ctx, cameraX) {
        const screenX = this.x - cameraX;
        ctx.fillStyle = COLORS.PLATFORM;
        ctx.fillRect(screenX, this.y, this.width, this.height);
    }

    isDeadly() {
        return false; // platforms are safe
    }
}

/** Orb obstacle (jump pad, not deadly) */
export class Orb extends Obstacle {
    constructor(x, y, props = {}) {
        super(x, y, OBSTACLE_TYPE.ORB, props);
        this.radius = props.radius || 15;
        this.width = this.radius * 2;
        this.height = this.radius * 2;
        this.pulsePhase = 0;
    }

    update(dt, cameraX) {
        this.pulsePhase += dt * 5; // pulse animation
    }

    draw(ctx, cameraX) {
        const screenX = this.x - cameraX + this.radius;
        const screenY = this.y + this.radius;
        const scale = 1 + Math.sin(this.pulsePhase) * 0.1;
        ctx.fillStyle = COLORS.ORB;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    isDeadly() {
        return false;
    }
}

/** Portal obstacle (changes player mode) */
export class Portal extends Obstacle {
    constructor(x, y, props = {}) {
        super(x, y, OBSTACLE_TYPE.PORTAL, props);
        this.targetMode = props.targetMode || 'CUBE';
        this.width = props.width || GRID_SIZE;
        this.height = props.height || GRID_SIZE * 3;
    }

    draw(ctx, cameraX) {
        const screenX = this.x - cameraX;
        ctx.fillStyle = 'rgba(255, 0, 255, 0.5)';
        ctx.fillRect(screenX, this.y, this.width, this.height);
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 3;
        ctx.strokeRect(screenX, this.y, this.width, this.height);
    }

    isDeadly() {
        return false;
    }
}

/** Factory function to create obstacles from JSON data */
export function createObstacle(data) {
    switch (data.type) {
        case OBSTACLE_TYPE.SPIKE:
            return new Spike(data.x, data.y, data.props);
        case OBSTACLE_TYPE.BLOCK:
            return new Block(data.x, data.y, data.props);
        case OBSTACLE_TYPE.PLATFORM:
            return new Platform(data.x, data.y, data.props);
        case OBSTACLE_TYPE.ORB:
            return new Orb(data.x, data.y, data.props);
        case OBSTACLE_TYPE.PORTAL:
            return new Portal(data.x, data.y, data.props);
        default:
            console.warn('Unknown obstacle type:', data.type);
            return new Obstacle(data.x, data.y, data.type, data.props);
    }
}
