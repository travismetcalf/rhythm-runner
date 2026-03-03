import { describe, expect, it } from 'vitest';
import { LEVELS, getLevelById, getNextLevelId, getAllLevels } from '../../levelData.js';

describe('levelData', () => {
    describe('LEVELS', () => {
        it('contains at least 3 levels', () => {
            expect(LEVELS.length).toBeGreaterThanOrEqual(3);
        });

        it('all levels have required properties', () => {
            LEVELS.forEach(level => {
                expect(level).toHaveProperty('id');
                expect(level).toHaveProperty('name');
                expect(level).toHaveProperty('length');
                expect(level).toHaveProperty('scrollSpeed');
                expect(level).toHaveProperty('bpm');
                expect(level).toHaveProperty('obstacles');
                expect(Array.isArray(level.obstacles)).toBe(true);
            });
        });

        it('levels have increasing difficulty', () => {
            expect(LEVELS[1].scrollSpeed).toBeGreaterThan(LEVELS[0].scrollSpeed);
            expect(LEVELS[2].scrollSpeed).toBeGreaterThan(LEVELS[1].scrollSpeed);
        });
    });

    describe('getLevelById', () => {
        it('returns correct level by id', () => {
            const level = getLevelById('level1');
            expect(level.id).toBe('level1');
            expect(level.name).toBe('First Steps');
        });

        it('returns first level for unknown id', () => {
            const level = getLevelById('nonexistent');
            expect(level).toBe(LEVELS[0]);
        });

        it('returns first level for undefined', () => {
            const level = getLevelById();
            expect(level).toBe(LEVELS[0]);
        });
    });

    describe('getNextLevelId', () => {
        it('returns next level id', () => {
            expect(getNextLevelId('level1')).toBe('level2');
            expect(getNextLevelId('level2')).toBe('level3');
        });

        it('returns null for last level', () => {
            expect(getNextLevelId('level3')).toBeNull();
        });

        it('returns null for unknown id', () => {
            expect(getNextLevelId('nonexistent')).toBeNull();
        });
    });

    describe('getAllLevels', () => {
        it('returns metadata for all levels', () => {
            const levels = getAllLevels();
            expect(levels.length).toBe(LEVELS.length);
            levels.forEach(l => {
                expect(l).toHaveProperty('id');
                expect(l).toHaveProperty('name');
            });
        });

        it('does not expose full level data', () => {
            const levels = getAllLevels();
            levels.forEach(l => {
                expect(l).not.toHaveProperty('obstacles');
                expect(l).not.toHaveProperty('scrollSpeed');
            });
        });
    });
});
