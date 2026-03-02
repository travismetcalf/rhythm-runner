import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Obstacle, Spike, Block, Platform, Orb, Portal, createObstacle } from '../../obstacles.js';
import { OBSTACLE_TYPE } from '../../config.js';

describe('obstacles', () => {
    describe('Obstacle base class', () => {
        let obstacle;

        beforeEach(() => {
            obstacle = new Obstacle(100, 200, OBSTACLE_TYPE.BLOCK, { width: 30, height: 30 });
        });

        it('initializes with correct properties', () => {
            expect(obstacle.x).toBe(100);
            expect(obstacle.y).toBe(200);
            expect(obstacle.type).toBe(OBSTACLE_TYPE.BLOCK);
            expect(obstacle.width).toBe(30);
            expect(obstacle.height).toBe(30);
        });

        it('returns correct bounds', () => {
            const bounds = obstacle.getBounds();
            expect(bounds.x).toBe(100);
            expect(bounds.y).toBe(200);
            expect(bounds.width).toBe(30);
            expect(bounds.height).toBe(30);
        });

        it('is deadly by default', () => {
            expect(obstacle.isDeadly()).toBe(true);
        });

        it('detects collision with player bounds', () => {
            const playerBounds = { x: 110, y: 210, width: 20, height: 20 };
            expect(obstacle.collidesWith(playerBounds)).toBe(true);
        });

        it('detects no collision when player is far away', () => {
            const playerBounds = { x: 500, y: 500, width: 20, height: 20 };
            expect(obstacle.collidesWith(playerBounds)).toBe(false);
        });
    });

    describe('Spike', () => {
        it('creates spike with correct type', () => {
            const spike = new Spike(100, 200);
            expect(spike.type).toBe(OBSTACLE_TYPE.SPIKE);
            expect(spike.isDeadly()).toBe(true);
        });
    });

    describe('Block', () => {
        it('creates block with correct type', () => {
            const block = new Block(100, 200);
            expect(block.type).toBe(OBSTACLE_TYPE.BLOCK);
            expect(block.isDeadly()).toBe(true);
        });
    });

    describe('Platform', () => {
        it('creates platform with correct type', () => {
            const platform = new Platform(100, 200);
            expect(platform.type).toBe(OBSTACLE_TYPE.PLATFORM);
        });

        it('is not deadly', () => {
            const platform = new Platform(100, 200);
            expect(platform.isDeadly()).toBe(false);
        });

        it('has default width of 3 grid units', () => {
            const platform = new Platform(100, 200);
            expect(platform.width).toBeGreaterThan(30); // More than single grid
        });
    });

    describe('Orb', () => {
        it('creates orb with correct type', () => {
            const orb = new Orb(100, 200);
            expect(orb.type).toBe(OBSTACLE_TYPE.ORB);
        });

        it('is not deadly', () => {
            const orb = new Orb(100, 200);
            expect(orb.isDeadly()).toBe(false);
        });

        it('has radius property', () => {
            const orb = new Orb(100, 200);
            expect(orb.radius).toBeGreaterThan(0);
        });

        it('updates pulse phase over time', () => {
            const orb = new Orb(100, 200);
            const initialPhase = orb.pulsePhase;
            orb.update(0.1, 0);
            expect(orb.pulsePhase).toBeGreaterThan(initialPhase);
        });
    });

    describe('Portal', () => {
        it('creates portal with correct type', () => {
            const portal = new Portal(100, 200);
            expect(portal.type).toBe(OBSTACLE_TYPE.PORTAL);
        });

        it('is not deadly', () => {
            const portal = new Portal(100, 200);
            expect(portal.isDeadly()).toBe(false);
        });

        it('has target mode property', () => {
            const portal = new Portal(100, 200, { targetMode: 'SHIP' });
            expect(portal.targetMode).toBe('SHIP');
        });
    });

    describe('createObstacle factory', () => {
        it('creates spike from data', () => {
            const data = { type: OBSTACLE_TYPE.SPIKE, x: 100, y: 200, props: {} };
            const obstacle = createObstacle(data);
            expect(obstacle).toBeInstanceOf(Spike);
        });

        it('creates block from data', () => {
            const data = { type: OBSTACLE_TYPE.BLOCK, x: 100, y: 200, props: {} };
            const obstacle = createObstacle(data);
            expect(obstacle).toBeInstanceOf(Block);
        });

        it('creates platform from data', () => {
            const data = { type: OBSTACLE_TYPE.PLATFORM, x: 100, y: 200, props: {} };
            const obstacle = createObstacle(data);
            expect(obstacle).toBeInstanceOf(Platform);
        });

        it('creates orb from data', () => {
            const data = { type: OBSTACLE_TYPE.ORB, x: 100, y: 200, props: {} };
            const obstacle = createObstacle(data);
            expect(obstacle).toBeInstanceOf(Orb);
        });

        it('creates portal from data', () => {
            const data = { type: OBSTACLE_TYPE.PORTAL, x: 100, y: 200, props: {} };
            const obstacle = createObstacle(data);
            expect(obstacle).toBeInstanceOf(Portal);
        });

        it('returns base Obstacle for unknown type', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const data = { type: 'UNKNOWN', x: 100, y: 200, props: {} };
            const obstacle = createObstacle(data);
            expect(obstacle).toBeInstanceOf(Obstacle);
            warnSpy.mockRestore();
        });
    });
});
