// @vitest-environment jsdom
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Game } from '../../game.js';
import { STATE } from '../../config.js';
import { getLevelById } from '../../levelData.js';

function createMockCanvas() {
    const canvas = document.createElement('canvas');
    const ctx = {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        globalAlpha: 1,
        fillRect: vi.fn(),
        strokeRect: vi.fn(),
        clearRect: vi.fn(),
        beginPath: vi.fn(),
        closePath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        createLinearGradient: vi.fn(() => ({
            addColorStop: vi.fn(),
        })),
    };
    canvas.getContext = vi.fn(() => ctx);
    return { canvas, ctx };
}

describe('game', () => {
    let game;
    let callbacks;

    beforeEach(() => {
        const { canvas } = createMockCanvas();
        callbacks = {
            onHudUpdate: vi.fn(),
            onStateChange: vi.fn(),
            onGameEnd: vi.fn(),
        };
        game = new Game(canvas, callbacks);
    });

    describe('initialization', () => {
        it('starts in MENU state', () => {
            expect(game.state).toBe(STATE.MENU);
        });

        it('starts with attempt 1', () => {
            expect(game.attempt).toBe(1);
        });

        it('starts with 0 progress', () => {
            expect(game.progress).toBe(0);
        });
    });

    describe('setState', () => {
        it('changes state and fires callback', () => {
            game.setState(STATE.PLAYING);
            expect(game.state).toBe(STATE.PLAYING);
            expect(callbacks.onStateChange).toHaveBeenCalledWith(STATE.PLAYING);
        });

        it('does not fire callback for same state', () => {
            game.setState(STATE.MENU);
            expect(callbacks.onStateChange).not.toHaveBeenCalled();
        });

        it('fires callback for same state when force=true', () => {
            game.setState(STATE.MENU, true);
            expect(callbacks.onStateChange).toHaveBeenCalledWith(STATE.MENU);
        });
    });

    describe('startPlaying', () => {
        it('transitions to PLAYING state', () => {
            const levelData = getLevelById('level1');
            game.startPlaying(levelData);
            expect(game.state).toBe(STATE.PLAYING);
        });

        it('rejects null levelData', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            game.startPlaying(null);
            expect(game.state).toBe(STATE.MENU);
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('initializes player and level', () => {
            game.startPlaying(getLevelById('level1'));
            expect(game.player).not.toBeNull();
            expect(game.level).not.toBeNull();
        });

        it('resets attempt counter to 1', () => {
            game.startPlaying(getLevelById('level1'));
            game.attempt = 5;
            game.startPlaying(getLevelById('level1'));
            expect(game.attempt).toBe(1);
        });

        it('fires HUD update', () => {
            game.startPlaying(getLevelById('level1'));
            expect(callbacks.onHudUpdate).toHaveBeenCalled();
        });
    });

    describe('playLevel', () => {
        it('works from COMPLETE state', () => {
            game.startPlaying(getLevelById('level1'));
            game.setState(STATE.COMPLETE);
            game.playLevel(getLevelById('level2'));
            expect(game.state).toBe(STATE.PLAYING);
            expect(game.currentLevel.id).toBe('level2');
        });

        it('works from PLAYING state', () => {
            game.startPlaying(getLevelById('level1'));
            game.playLevel(getLevelById('level2'));
            expect(game.state).toBe(STATE.PLAYING);
        });
    });

    describe('restart', () => {
        it('only works from DEAD state', () => {
            game.startPlaying(getLevelById('level1'));
            // state is PLAYING, not DEAD
            game.restart();
            expect(game.attempt).toBe(1); // unchanged
        });

        it('increments attempt counter', () => {
            game.startPlaying(getLevelById('level1'));
            game.setState(STATE.DEAD);
            game.restart();
            expect(game.attempt).toBe(2);
        });

        it('transitions back to PLAYING', () => {
            game.startPlaying(getLevelById('level1'));
            game.setState(STATE.DEAD);
            game.restart();
            expect(game.state).toBe(STATE.PLAYING);
        });
    });

    describe('collision detection', () => {
        it('kills player on deadly obstacle collision', () => {
            game.startPlaying(getLevelById('level1'));
            const spike = game.level.obstacles.find(o => o.isDeadly());
            if (spike) {
                game.player.x = spike.x;
                game.player.y = spike.y;
                // Force spike into active set
                game.level.activeObstacles = [spike];
                game._checkCollisions();
                expect(game.player.isDead).toBe(true);
            }
        });

        it('collects orb and triggers super jump', () => {
            game.startPlaying(getLevelById('level1'));
            const orb = game.level.obstacles.find(o => o.type === 'ORB');
            if (orb) {
                game.player.x = orb.x;
                game.player.y = orb.y;
                // Force orb into active set
                game.level.activeObstacles = [orb];
                game._checkCollisions();
                expect(orb.collected).toBe(true);
            }
        });
    });

    describe('debug hooks', () => {
        it('setAttemptForTests updates attempt', () => {
            game.setAttemptForTests(10);
            expect(game.attempt).toBe(10);
            expect(callbacks.onHudUpdate).toHaveBeenCalled();
        });

        it('forceGameOverForTests sets DEAD state', () => {
            game.forceGameOverForTests();
            expect(game.state).toBe(STATE.DEAD);
        });
    });
});
