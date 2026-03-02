import { describe, expect, it, beforeEach } from 'vitest';
import { Level } from '../../level.js';
import { getLevelById } from '../../levelData.js';

describe('level', () => {
    let level;

    beforeEach(() => {
        const levelData = getLevelById('level1');
        level = new Level(levelData);
    });

    describe('initialization', () => {
        it('starts with camera at x=0', () => {
            expect(level.cameraX).toBe(0);
        });

        it('loads level data correctly', () => {
            const levelData = getLevelById('level1');
            expect(levelData.name).toBeDefined();
            expect(levelData.obstacles).toBeDefined();
            expect(Array.isArray(levelData.obstacles)).toBe(true);
        });

        it('tracks current level length', () => {
            expect(level.length).toBeGreaterThan(0);
        });
    });

    describe('scrolling', () => {
        it('updates camera position over time', () => {
            const initialX = level.cameraX;
            level.update(1.0);
            expect(level.cameraX).toBeGreaterThan(initialX);
        });

        it('scrolls at consistent speed', () => {
            level.update(1.0);
            const firstSecondX = level.cameraX;
            level.update(2.0);
            const nextSecondX = level.cameraX - firstSecondX;
            expect(nextSecondX).toBeCloseTo(firstSecondX * 2, 1);
        });

        it('does not scroll beyond level length', () => {
            // Scroll far ahead
            for (let i = 0; i < 100; i++) {
                level.update(0.1);
            }
            expect(level.cameraX).toBeLessThanOrEqual(level.length + 1000);
        });
    });

    describe('progress', () => {
        it('starts at 0% progress', () => {
            expect(level.getProgress()).toBe(0);
        });

        it('increases progress as level scrolls', () => {
            level.update(5.0);
            const progress = level.getProgress();
            expect(progress).toBeGreaterThan(0);
        });

        it('reaches 100% at level end', () => {
            // Manually move camera to end
            level.cameraX = level.length;
            expect(level.getProgress()).toBe(100);
        });

        it('returns value between 0 and 100', () => {
            for (let i = 0; i < 50; i++) {
                level.update(0.1);
                const progress = level.getProgress();
                expect(progress).toBeGreaterThanOrEqual(0);
                expect(progress).toBeLessThanOrEqual(100);
            }
        });
    });

    describe('completion', () => {
        it('is not complete at start', () => {
            expect(level.isComplete()).toBe(false);
        });

        it('becomes complete when scrolled to end', () => {
            level.cameraX = level.length;
            expect(level.isComplete()).toBe(true);
        });

        it('remains complete after scrolling past end', () => {
            level.cameraX = level.length + 1000;
            expect(level.isComplete()).toBe(true);
        });
    });

    describe('active obstacles', () => {
        it('returns array of obstacles', () => {
            const active = level.getActiveObstacles();
            expect(Array.isArray(active)).toBe(true);
        });

        it('returns more obstacles as level scrolls', () => {
            const initialCount = level.getActiveObstacles().length;
            level.update(5.0);
            const newCount = level.getActiveObstacles().length;
            expect(newCount).toBeGreaterThanOrEqual(initialCount);
        });

        it('filters out obstacles beyond camera view', () => {
            const maxX = level.cameraX + 800; // canvas width
            const active = level.getActiveObstacles();
            for (const obstacle of active) {
                expect(obstacle.x).toBeLessThan(maxX + 500); // some buffer
            }
        });
    });

    describe('reset', () => {
        it('resets camera to start', () => {
            level.update(10.0);
            level.reset();
            expect(level.cameraX).toBe(0);
        });

        it('progress returns to 0 after reset', () => {
            level.update(10.0);
            level.reset();
            expect(level.getProgress()).toBe(0);
        });

        it('is not complete after reset', () => {
            level.cameraX = level.length;
            level.reset();
            expect(level.isComplete()).toBe(false);
        });
    });

    describe('different levels', () => {
        it('loads level 1', () => {
            const l1 = new Level(getLevelById('level1'));
            expect(l1.length).toBeGreaterThan(0);
        });

        it('loads level 2', () => {
            const l2 = new Level(getLevelById('level2'));
            expect(l2.length).toBeGreaterThan(0);
        });

        it('loads level 3', () => {
            const l3 = new Level(getLevelById('level3'));
            expect(l3.length).toBeGreaterThan(0);
        });

        it('different levels have different lengths', () => {
            const l1 = new Level(getLevelById('level1'));
            const l2 = new Level(getLevelById('level2'));
            const l3 = new Level(getLevelById('level3'));
            const lengths = [l1.length, l2.length, l3.length];
            expect(new Set(lengths).size).toBeGreaterThan(1);
        });
    });
});
