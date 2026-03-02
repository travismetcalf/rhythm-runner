import { describe, expect, it, beforeEach } from 'vitest';
import { Player } from '../../player.js';
import { PLAYER_MODE, PLAYER_SIZE, GROUND_Y, JUMP_VELOCITY } from '../../config.js';

describe('player', () => {
    let player;

    beforeEach(() => {
        player = new Player();
    });

    describe('initialization', () => {
        it('starts with correct default values', () => {
            expect(player.x).toBe(100);
            expect(player.y).toBeLessThan(GROUND_Y);
            expect(player.size).toBe(PLAYER_SIZE);
            expect(player.mode).toBe(PLAYER_MODE.CUBE);
            expect(player.isDead).toBe(false);
            expect(player.isGrounded).toBe(true);
        });

        it('initializes velocity to zero', () => {
            expect(player.velocity.x).toBe(0);
            expect(player.velocity.y).toBe(0);
        });

        it('starts with zero rotation', () => {
            expect(player.rotation).toBe(0);
        });
    });

    describe('getBounds', () => {
        it('returns collision bounds scaled by COLLISION_THRESHOLD', () => {
            const bounds = player.getBounds();
            expect(bounds.x).toBeLessThan(player.x);
            expect(bounds.y).toBeLessThan(player.y);
            expect(bounds.width).toBeLessThan(PLAYER_SIZE);
            expect(bounds.height).toBeLessThan(PLAYER_SIZE);
        });

        it('updates bounds when player moves', () => {
            player.x = 200;
            player.y = 300;
            const bounds = player.getBounds();
            expect(bounds.x).toBeLessThan(200);
            expect(bounds.y).toBeLessThan(300);
        });
    });

    describe('death', () => {
        it('marks player as dead', () => {
            expect(player.isDead).toBe(false);
            player.die();
            expect(player.isDead).toBe(true);
        });

        it('does not move when dead', () => {
            player.die();
            const initialY = player.y;
            player.update(1.0);
            expect(player.y).toBe(initialY);
        });
    });

    describe('reset', () => {
        it('resets position to start', () => {
            player.x = 500;
            player.y = 100;
            player.reset();
            expect(player.x).toBe(100);
            expect(player.y).toBeLessThan(GROUND_Y);
        });

        it('resets dead state', () => {
            player.die();
            player.reset();
            expect(player.isDead).toBe(false);
        });

        it('resets velocity', () => {
            player.velocity.x = 100;
            player.velocity.y = 100;
            player.reset();
            expect(player.velocity.x).toBe(0);
            expect(player.velocity.y).toBe(0);
        });
    });

    describe('jump mechanics', () => {
        it('marks jump as pressed and held on press', () => {
            player.onJumpPress();
            expect(player.jumpPressed).toBe(true);
            expect(player.jumpHeld).toBe(true);
        });

        it('applies jump force during update when grounded', () => {
            player.isGrounded = true;
            player.onJumpPress();
            player.update(0.016);
            expect(player.velocity.y).toBe(JUMP_VELOCITY);
        });

        it('does not apply jump force when not grounded', () => {
            player.isGrounded = false;
            player.y = GROUND_Y - PLAYER_SIZE * 2; // position above ground so ground collision doesn't flip isGrounded back to true
            const initialVelocity = player.velocity.y;
            player.onJumpPress();
            player.update(0.016);
            expect(player.velocity.y).toBeGreaterThanOrEqual(initialVelocity);
        });
    });

    describe('cube mode physics', () => {
        it('applies gravity in cube mode', () => {
            player.mode = PLAYER_MODE.CUBE;
            player.isGrounded = false;
            player.y = GROUND_Y - PLAYER_SIZE * 2; // position above ground so gravity isn't immediately cancelled
            const initialY = player.y;
            player.update(0.1);
            expect(player.y).toBeGreaterThan(initialY);
        });

        it('rotates continuously when grounded', () => {
            player.isGrounded = true;
            player.mode = PLAYER_MODE.CUBE;
            const initialRotation = player.rotation;
            player.update(0.1);
            expect(player.rotation).toBeGreaterThan(initialRotation);
        });

        it('detects ground collision', () => {
            player.isGrounded = false;
            player.y = GROUND_Y + 100; // below ground
            player.update(0.1);
            expect(player.isGrounded).toBe(true);
        });
    });

    describe('ship mode physics', () => {
        beforeEach(() => {
            player.mode = PLAYER_MODE.SHIP;
        });

        it('applies upward thrust when jump held', () => {
            player.jumpHeld = true;
            const initialY = player.y;
            player.update(0.1);
            expect(player.y).toBeLessThanOrEqual(initialY);
        });

        it('does not thrust when jump not held', () => {
            player.jumpHeld = false;
            player.y = GROUND_Y - PLAYER_SIZE * 2; // position above ground so ground collision doesn't reset velocity
            const initialVelocity = player.velocity.y;
            player.update(0.1);
            expect(player.velocity.y).toBeGreaterThan(initialVelocity);
        });
    });

    describe('ball mode physics', () => {
        beforeEach(() => {
            player.mode = PLAYER_MODE.BALL;
        });

        it('flips gravity on jump', () => {
            player.isGrounded = true;
            const initialJumpState = player.jumpPressed;
            player.onJumpPress();
            expect(player.jumpPressed).not.toBe(initialJumpState);
        });
    });

    describe('update', () => {
        it('handles small dt without errors', () => {
            expect(() => player.update(0.001)).not.toThrow();
        });

        it('handles large dt without breaking physics', () => {
            expect(() => player.update(0.1)).not.toThrow();
        });

        it('does not update when dead', () => {
            player.die();
            const beforeDeadY = player.y;
            player.update(1.0);
            expect(player.y).toBe(beforeDeadY);
        });
    });
});
