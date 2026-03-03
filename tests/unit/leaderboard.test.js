// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from 'vitest';
import { saveScore, getBestScore, getAllScores } from '../../leaderboard.js';

describe('leaderboard', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('saveScore', () => {
        it('saves a score for a level', () => {
            saveScore('level1', 3);
            expect(getBestScore('level1')).toBe(3);
        });

        it('only keeps the lower attempt count', () => {
            saveScore('level1', 5);
            saveScore('level1', 3);
            expect(getBestScore('level1')).toBe(3);
        });

        it('does not overwrite with a higher attempt count', () => {
            saveScore('level1', 3);
            saveScore('level1', 7);
            expect(getBestScore('level1')).toBe(3);
        });

        it('tracks scores for multiple levels independently', () => {
            saveScore('level1', 2);
            saveScore('level2', 5);
            expect(getBestScore('level1')).toBe(2);
            expect(getBestScore('level2')).toBe(5);
        });
    });

    describe('getBestScore', () => {
        it('returns null for unknown level', () => {
            expect(getBestScore('nonexistent')).toBeNull();
        });

        it('returns saved score', () => {
            saveScore('level1', 4);
            expect(getBestScore('level1')).toBe(4);
        });
    });

    describe('getAllScores', () => {
        it('returns empty object when no scores saved', () => {
            expect(getAllScores()).toEqual({});
        });

        it('returns all saved scores', () => {
            saveScore('level1', 2);
            saveScore('level2', 4);
            const scores = getAllScores();
            expect(scores.level1).toBe(2);
            expect(scores.level2).toBe(4);
        });
    });

    describe('error resilience', () => {
        it('handles corrupt localStorage data', () => {
            localStorage.setItem('rhythm-runner-scores', 'not valid json');
            expect(getBestScore('level1')).toBeNull();
        });

        it('saves correctly after corrupt data', () => {
            localStorage.setItem('rhythm-runner-scores', '{bad');
            saveScore('level1', 3);
            expect(getBestScore('level1')).toBe(3);
        });
    });
});
