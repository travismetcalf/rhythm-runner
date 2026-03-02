import { describe, expect, it, beforeEach, vi } from 'vitest';
import { input } from '../../input.js';

describe('input', () => {
    beforeEach(() => {
        // Reset input state
        input.listeners = [];
    });

    describe('initialization', () => {
        it('is a singleton', () => {
            expect(input).toBeDefined();
            expect(input.onJump).toBeDefined();
        });

        it('starts with no callbacks', () => {
            expect(input.listeners).toBeDefined();
            expect(Array.isArray(input.listeners)).toBe(true);
        });
    });

    describe('onJump registration', () => {
        it('registers a callback', () => {
            const callback = vi.fn();
            input.onJump(callback);
            expect(input.listeners.length).toBeGreaterThan(0);
        });

        it('registers multiple callbacks', () => {
            const cb1 = vi.fn();
            const cb2 = vi.fn();
            input.onJump(cb1);
            input.onJump(cb2);
            expect(input.listeners.length).toBe(2);
        });

        it('accepts function as callback', () => {
            const callback = vi.fn();
            expect(() => input.onJump(callback)).not.toThrow();
        });
    });

    describe('keyboard input', () => {
        it('responds to Space key', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new KeyboardEvent('keydown', { key: ' ' });
            window.dispatchEvent(event);

            expect(callback).toHaveBeenCalled();
        });

        it('responds to ArrowUp key', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            window.dispatchEvent(event);

            expect(callback).toHaveBeenCalled();
        });

        it('responds to W key', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new KeyboardEvent('keydown', { key: 'w' });
            window.dispatchEvent(event);

            expect(callback).toHaveBeenCalled();
        });

        it('calls callbacks on keyup', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new KeyboardEvent('keyup', { key: ' ' });
            window.dispatchEvent(event);

            expect(callback).toHaveBeenCalled();
        });
    });

    describe('mouse input', () => {
        it('responds to mousedown', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new MouseEvent('mousedown', { button: 0 });
            window.dispatchEvent(event);

            expect(callback).toHaveBeenCalled();
        });
    });

    describe('event payload', () => {
        it('provides event type on press', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new KeyboardEvent('keydown', { key: ' ' });
            window.dispatchEvent(event);

            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'press' })
            );
        });

        it('provides event type on release', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new KeyboardEvent('keyup', { key: ' ' });
            window.dispatchEvent(event);

            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'release' })
            );
        });
    });

    describe('input debouncing', () => {
        it('fires press once while key is held', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new KeyboardEvent('keydown', { key: ' ' });
            window.dispatchEvent(event);
            window.dispatchEvent(event);

            expect(callback.mock.calls.length).toBe(1);
        });
    });

    describe('invalid input', () => {
        it('ignores non-jump keys', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new KeyboardEvent('keydown', { key: 'a' });
            window.dispatchEvent(event);

            // Should not be called for non-jump keys
            expect(callback).not.toHaveBeenCalled();
        });
    });
});
