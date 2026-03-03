import { describe, expect, it, beforeEach } from 'vitest';
import { ParticleSystem } from '../../particles.js';

describe('particles', () => {
    let system;

    beforeEach(() => {
        system = new ParticleSystem();
    });

    describe('initialization', () => {
        it('starts with no particles', () => {
            expect(system.particles.length).toBe(0);
        });
    });

    describe('emitDeath', () => {
        it('adds particles', () => {
            system.emitDeath(100, 200);
            expect(system.particles.length).toBe(20);
        });
    });

    describe('emitJump', () => {
        it('adds particles', () => {
            system.emitJump(100, 200);
            expect(system.particles.length).toBe(6);
        });
    });

    describe('emitComplete', () => {
        it('adds particles', () => {
            system.emitComplete(800, 600);
            expect(system.particles.length).toBe(40);
        });
    });

    describe('emitOrb', () => {
        it('adds particles', () => {
            system.emitOrb(100, 200);
            expect(system.particles.length).toBe(10);
        });
    });

    describe('update', () => {
        it('ages and removes dead particles', () => {
            system.emitJump(100, 200);
            const initial = system.particles.length;
            expect(initial).toBeGreaterThan(0);

            // Update past max particle life
            system.update(5.0);
            expect(system.particles.length).toBe(0);
        });

        it('moves particles over time', () => {
            system.emitDeath(100, 200);
            const p = system.particles[0];
            const startX = p.x;
            const startY = p.y;
            system.update(0.1);
            expect(p.x !== startX || p.y !== startY).toBe(true);
        });
    });

    describe('draw', () => {
        it('does not throw with mock context', () => {
            const mockCtx = {
                globalAlpha: 1,
                fillStyle: '',
                fillRect: () => {},
            };
            system.emitDeath(100, 200);
            expect(() => system.draw(mockCtx)).not.toThrow();
        });
    });

    describe('particle lifecycle', () => {
        it('particle reports dead after life expires', () => {
            system.emitJump(100, 200);
            const p = system.particles[0];
            expect(p.dead).toBe(false);
            // Force life to zero
            p.life = 0;
            expect(p.dead).toBe(true);
        });

        it('particle life decreases with updates', () => {
            system.emitDeath(100, 200);
            const p = system.particles[0];
            const initialLife = p.life;
            system.update(0.1);
            expect(p.life).toBeLessThan(initialLife);
        });
    });
});
