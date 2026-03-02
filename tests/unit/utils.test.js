import { describe, expect, it } from 'vitest';
import { clamp, squaredDistance, rectIntersects, getBounds, toRadians } from '../../utils.js';

describe('utils', () => {
    describe('squaredDistance', () => {
        it('calculates squared distance correctly', () => {
            expect(squaredDistance(0, 0, 3, 4)).toBe(25); // 3² + 4² = 25
            expect(squaredDistance(1, 1, 1, 1)).toBe(0);
            expect(squaredDistance(-2, -2, 2, 2)).toBe(32); // 4² + 4² = 32
        });
    });

    describe('clamp', () => {
        it('clamps values within range', () => {
            expect(clamp(5, 0, 10)).toBe(5);
            expect(clamp(-5, 0, 10)).toBe(0);
            expect(clamp(15, 0, 10)).toBe(10);
        });
    });

    describe('rectIntersects', () => {
        it('detects rectangle intersection', () => {
            const r1 = { x: 0, y: 0, width: 10, height: 10 };
            const r2 = { x: 5, y: 5, width: 10, height: 10 };
            const r3 = { x: 20, y: 20, width: 10, height: 10 };
            
            expect(rectIntersects(r1, r2)).toBe(true);
            expect(rectIntersects(r1, r3)).toBe(false);
        });
    });

    describe('getBounds', () => {
        it('creates bounding box from center point', () => {
            const bounds = getBounds(100, 100, 20, 1.0);
            expect(bounds.x).toBe(90);
            expect(bounds.y).toBe(90);
            expect(bounds.width).toBe(20);
            expect(bounds.height).toBe(20);
        });

        it('scales bounding box correctly', () => {
            const bounds = getBounds(100, 100, 20, 0.5);
            expect(bounds.x).toBe(95);
            expect(bounds.y).toBe(95);
            expect(bounds.width).toBe(10);
            expect(bounds.height).toBe(10);
        });
    });

    describe('toRadians', () => {
        it('converts degrees to radians', () => {
            expect(toRadians(0)).toBe(0);
            expect(toRadians(180)).toBeCloseTo(Math.PI);
            expect(toRadians(90)).toBeCloseTo(Math.PI / 2);
        });
    });
});
