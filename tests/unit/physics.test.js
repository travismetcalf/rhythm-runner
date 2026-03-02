import { describe, expect, it } from 'vitest';
import { applyGravity, applyVelocity, checkGroundCollision, resolveGroundCollision, checkCeilingCollision, resolveCeilingCollision } from '../../physics.js';
import { GRAVITY, TERMINAL_VELOCITY, GROUND_Y } from '../../config.js';

describe('physics', () => {
    describe('applyGravity', () => {
        it('applies gravity to velocity', () => {
            const velocity = { x: 0, y: 0 };
            applyGravity(velocity, 1.0);
            
            expect(velocity.y).toBe(GRAVITY);
        });

        it('clamps velocity to terminal velocity', () => {
            const velocity = { x: 0, y: 30 };
            applyGravity(velocity, 1.0);
            
            expect(velocity.y).toBeLessThanOrEqual(TERMINAL_VELOCITY);
        });

        it('applies gravity scale factor', () => {
            const velocity = { x: 0, y: 0 };
            applyGravity(velocity, 1.0, 2.0);
            
            expect(velocity.y).toBe(GRAVITY * 2);
        });
    });

    describe('applyVelocity', () => {
        it('updates position based on velocity', () => {
            const position = { x: 0, y: 0 };
            const velocity = { x: 10, y: 5 };
            
            applyVelocity(position, velocity, 1.0);
            
            expect(position.x).toBe(10);
            expect(position.y).toBe(5);
        });

        it('scales by delta time', () => {
            const position = { x: 0, y: 0 };
            const velocity = { x: 10, y: 10 };
            
            applyVelocity(position, velocity, 0.5);
            
            expect(position.x).toBe(5);
            expect(position.y).toBe(5);
        });
    });

    describe('checkGroundCollision', () => {
        it('detects when entity is on ground', () => {
            const size = 30;
            const yOnGround = GROUND_Y - size / 2;
            
            expect(checkGroundCollision(yOnGround, size)).toBe(true);
        });

        it('detects when entity is above ground', () => {
            const size = 30;
            const yAboveGround = GROUND_Y - 100;
            
            expect(checkGroundCollision(yAboveGround, size)).toBe(false);
        });
    });

    describe('resolveGroundCollision', () => {
        it('snaps entity to ground level', () => {
            const position = { y: GROUND_Y };
            const size = 30;
            
            resolveGroundCollision(position, size);
            
            expect(position.y).toBe(GROUND_Y - size / 2);
        });
    });

    describe('checkCeilingCollision', () => {
        it('detects ceiling collision', () => {
            const size = 30;
            const yAtCeiling = size / 2;
            
            expect(checkCeilingCollision(yAtCeiling, size)).toBe(true);
        });

        it('no collision when below ceiling', () => {
            const size = 30;
            const yBelowCeiling = 100;
            
            expect(checkCeilingCollision(yBelowCeiling, size)).toBe(false);
        });
    });

    describe('resolveCeilingCollision', () => {
        it('snaps to ceiling and stops upward velocity', () => {
            const position = { y: 0 };
            const velocity = { y: -10 };
            const size = 30;
            
            resolveCeilingCollision(position, velocity, size);
            
            expect(position.y).toBe(size / 2);
            expect(velocity.y).toBe(0);
        });
    });
});
