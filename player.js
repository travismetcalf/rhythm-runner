// ============================================================================
// player.js — Player entity with physics, collision, rendering
// ============================================================================

import {
    PLAYER_SIZE,
    PLAYER_START_X,
    PLAYER_MODE,
    PLAYER_ROTATION_SPEED,
    JUMP_VELOCITY,
    GROUND_Y,
    COLORS,
    COLLISION_THRESHOLD,
} from './config.js';
import { applyGravity, checkGroundCollision } from './physics.js';
import { getBounds, toRadians } from './utils.js';

/**
 * Player entity representing the controllable character.
 * Supports multiple modes (CUBE, SHIP, BALL) with different physics behaviors.
 */
export class Player {
    /**
     * Create a new player instance starting at ground level.
     */
    constructor() {
        this.x = PLAYER_START_X;
        this.y = GROUND_Y - PLAYER_SIZE / 2; // start on ground
        this.velocity = { x: 0, y: 0 };
        this.size = PLAYER_SIZE;
        this.mode = PLAYER_MODE.CUBE;

        this.isGrounded = true;
        this.isDead = false;
        this.rotation = 0; // degrees
        this.gravityDir = 1; // 1 = normal, -1 = flipped (ball mode)

        // Input state
        this.jumpPressed = false;
        this.jumpHeld = false;
    }

    update(dt) {
        if (this.isDead) return;

        // Apply physics
        if (this.mode === PLAYER_MODE.CUBE) {
            this._updateCubeMode(dt);
        } else if (this.mode === PLAYER_MODE.SHIP) {
            this._updateShipMode(dt);
        } else if (this.mode === PLAYER_MODE.BALL) {
            this._updateBallMode(dt);
        }

        // Update rotation (visual only)
        if (this.isGrounded && this.mode === PLAYER_MODE.CUBE) {
            this.rotation += PLAYER_ROTATION_SPEED * dt;
            this.rotation %= 360;
        }

        // Reset jump press flag
        this.jumpPressed = false;
    }

    _updateCubeMode(dt) {
        applyGravity(this.velocity, dt);
        
        // Apply velocity to position
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;

        // Ground collision
        if (checkGroundCollision(this.y, this.size)) {
            this.y = GROUND_Y - this.size / 2;
            this.velocity.y = 0;
            this.isGrounded = true;
            this.rotation = Math.round(this.rotation / 90) * 90; // snap to 90° increments
        } else {
            this.isGrounded = false;
        }

        // Jump
        if (this.jumpPressed && this.isGrounded) {
            this.velocity.y = JUMP_VELOCITY;
            this.isGrounded = false;
        }
    }

    _updateShipMode(dt) {
        // Ship: hold to fly up, release to fall
        const thrust = this.jumpHeld ? -800 : 600; // upward vs downward acceleration
        this.velocity.y += thrust * dt;
        this.velocity.y = Math.max(-600, Math.min(600, this.velocity.y));
        this.y += this.velocity.y * dt;

        // Bounds checking
        if (this.y < this.size / 2) {
            this.y = this.size / 2;
            this.velocity.y = 0;
        }
        if (checkGroundCollision(this.y, this.size)) {
            this.y = GROUND_Y - this.size / 2;
            this.velocity.y = 0;
        }
    }

    _updateBallMode(dt) {
        // Ball: gravity flips direction on each jump press
        if (this.jumpPressed && this.isGrounded) {
            this.gravityDir *= -1;
            this.isGrounded = false;
        }

        applyGravity(this.velocity, dt, this.gravityDir);
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;

        // Ground collision (normal gravity)
        if (this.gravityDir > 0 && checkGroundCollision(this.y, this.size)) {
            this.y = GROUND_Y - this.size / 2;
            this.velocity.y = 0;
            this.isGrounded = true;
        }
        // Ceiling collision (flipped gravity)
        else if (this.gravityDir < 0 && this.y - this.size / 2 <= 0) {
            this.y = this.size / 2;
            this.velocity.y = 0;
            this.isGrounded = true;
        }
        else {
            this.isGrounded = false;
        }

        // Continuous rotation
        this.rotation += PLAYER_ROTATION_SPEED * this.gravityDir * dt;
        this.rotation %= 360;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(toRadians(this.rotation));

        if (this.mode === PLAYER_MODE.CUBE) {
            this._drawCube(ctx);
        } else if (this.mode === PLAYER_MODE.SHIP) {
            this._drawShip(ctx);
        } else {
            this._drawBall(ctx);
        }

        ctx.restore();

        // Debug: draw hitbox
        // const bounds = this.getBounds();
        // ctx.strokeStyle = 'red';
        // ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }

    _drawCube(ctx) {
        const half = this.size / 2;
        ctx.fillStyle = COLORS.PLAYER;
        ctx.fillRect(-half, -half, this.size, this.size);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(-half, -half, this.size, this.size);
    }

    _drawShip(ctx) {
        ctx.fillStyle = COLORS.PLAYER;
        ctx.beginPath();
        ctx.moveTo(this.size / 2, 0); // nose
        ctx.lineTo(-this.size / 2, -this.size / 3); // top wing
        ctx.lineTo(-this.size / 3, 0); // center
        ctx.lineTo(-this.size / 2, this.size / 3); // bottom wing
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    _drawBall(ctx) {
        ctx.fillStyle = COLORS.PLAYER;
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /** Get collision bounds */
    getBounds() {
        return getBounds(this.x, this.y, this.size, COLLISION_THRESHOLD);
    }

    /** Handle jump input press */
    onJumpPress() {
        this.jumpPressed = true;
        this.jumpHeld = true;
    }

    /** Handle jump input release */
    onJumpRelease() {
        this.jumpHeld = false;
    }

    /** Super jump from orb (stronger than normal jump) */
    superJump() {
        this.velocity.y = JUMP_VELOCITY * 1.5;
        this.isGrounded = false;
    }

    /** Switch player mode (from portal) */
    setMode(modeName) {
        const mode = PLAYER_MODE[modeName];
        if (mode) this.mode = mode;
    }

    /** Kill player (collision with obstacle) */
    die() {
        this.isDead = true;
        this.velocity = { x: 0, y: 0 };
    }

    /** Reset to starting position */
    reset() {
        this.x = PLAYER_START_X;
        this.y = GROUND_Y - this.size / 2;
        this.velocity = { x: 0, y: 0 };
        this.isGrounded = true;
        this.isDead = false;
        this.rotation = 0;
        this.mode = PLAYER_MODE.CUBE;
        this.gravityDir = 1;
        this.jumpPressed = false;
        this.jumpHeld = false;
    }
}
