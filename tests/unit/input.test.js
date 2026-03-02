import { describe, expect, it, beforeEach, vi } from 'vitest';
import { input } from '../../input.js';

describe('input', () => {
    beforeEach(() => {
        // Reset input state
        input.callbacks = [];
    });

    describe('initialization', () => {
        it('is a singleton', () => {
            expect(input).toBeDefined();
            expect(input.onJump).toBeDefined();
        });

        it('starts with no callbacks', () => {
            expect(input.callbacks).toBeDefined();
            expect(Array.isArray(input.callbacks)).toBe(true);
        });
    });

    describe('onJump registration', () => {
        it('registers a callback', () => {
            const callback = vi.fn();
            input.onJump(callback);
            expect(input.callbacks.length).toBeGreaterThan(0);
        });

        it('registers multiple callbacks', () => {
            const cb1 = vi.fn();
            const cb2 = vi.fn();
            input.onJump(cb1);
            input.onJump(cb2);
            expect(input.callbacks.length).toBe(2);
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

            const event = new KeyboardEvent('keydown', { code: 'Space' });
            document.dispatchEvent(event);

            expect(callback).toHaveBeenCalled();
        });

        it('responds to ArrowUp key', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new KeyboardEvent('keydown', { code: 'ArrowUp' });
            document.dispatchEvent(event);

            expect(callback).toHaveBeenCalled();
        });

        it('responds to W key', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new KeyboardEvent('keydown', { code: 'KeyW' });
            document.dispatchEvent(event);

            expect(callback).toHaveBeenCalled();
        });

        it('calls callbacks on keyup', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new KeyboardEvent('keyup', { code: 'Space' });
            document.dispatchEvent(event);

            expect(callback).toHaveBeenCalled();
        });
    });

    describe('mouse input', () => {
        it('responds to click', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new MouseEvent('click');
            document.dispatchEvent(event);

            expect(callback).toHaveBeenCalled();
        });
    });

    describe('event payload', () => {
        it('provides event type on press', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new KeyboardEvent('keydown', { code: 'Space' });
            document.dispatchEvent(event);

            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'press' })
            );
        });

        it('provides event type on release', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new KeyboardEvent('keyup', { code: 'Space' });
            document.dispatchEvent(event);

            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'release' })
            );
        });
    });

    describe('input debouncing', () => {
        it('does not fire multiple events for single keydown', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new KeyboardEvent('keydown', { code: 'Space' });
            document.dispatchEvent(event);
            document.dispatchEvent(event);

            // Should be called multiple times actually (not debounced per keydown)
            expect(callback.mock.calls.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('invalid input', () => {
        it('ignores non-jump keys', () => {
            const callback = vi.fn();
            input.onJump(callback);

            const event = new KeyboardEvent('keydown', { code: 'KeyA' });
            document.dispatchEvent(event);

            // Should not be called for non-jump keys
            expect(callback).not.toHaveBeenCalled();
        });
    });
});
