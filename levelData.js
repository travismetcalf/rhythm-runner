// ============================================================================
// levelData.js — Preset level definitions
// ============================================================================

import { OBSTACLE_TYPE, GROUND_Y, GRID_SIZE } from './config.js';

export const LEVELS = [
    {
        id: 'level1',
        name: 'First Steps',
        length: 3000,
        scrollSpeed: 250,
        bpm: 120,
        obstacles: [
            // Simple spike pattern
            { type: OBSTACLE_TYPE.SPIKE, x: 400, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.SPIKE, x: 500, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.SPIKE, x: 600, y: GROUND_Y - GRID_SIZE, props: {} },
            
            // Platform jump
            { type: OBSTACLE_TYPE.PLATFORM, x: 900, y: GROUND_Y - 100, props: { width: GRID_SIZE * 3 } },
            { type: OBSTACLE_TYPE.SPIKE, x: 1000, y: GROUND_Y - GRID_SIZE, props: {} },
            
            // Block obstacle
            { type: OBSTACLE_TYPE.BLOCK, x: 1400, y: GROUND_Y - GRID_SIZE * 2, props: { height: GRID_SIZE * 2 } },
            
            // Orb for high jump
            { type: OBSTACLE_TYPE.ORB, x: 1800, y: GROUND_Y - 50, props: {} },
            { type: OBSTACLE_TYPE.SPIKE, x: 1900, y: GROUND_Y - GRID_SIZE, props: {} },
            
            // Final spike gauntlet
            { type: OBSTACLE_TYPE.SPIKE, x: 2400, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.SPIKE, x: 2460, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.SPIKE, x: 2520, y: GROUND_Y - GRID_SIZE, props: {} },
        ],
    },
    {
        id: 'level2',
        name: 'Rising Tide',
        length: 4000,
        scrollSpeed: 300,
        bpm: 140,
        obstacles: [
            // More complex patterns
            { type: OBSTACLE_TYPE.SPIKE, x: 300, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.BLOCK, x: 600, y: GROUND_Y - GRID_SIZE * 3, props: { width: GRID_SIZE, height: GRID_SIZE * 3 } },
            { type: OBSTACLE_TYPE.SPIKE, x: 800, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.SPIKE, x: 850, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.PLATFORM, x: 1100, y: GROUND_Y - 150, props: { width: GRID_SIZE * 2 } },
            { type: OBSTACLE_TYPE.ORB, x: 1500, y: GROUND_Y - 80, props: {} },
            { type: OBSTACLE_TYPE.BLOCK, x: 1700, y: GROUND_Y - GRID_SIZE * 4, props: { width: GRID_SIZE, height: GRID_SIZE * 4 } },
            { type: OBSTACLE_TYPE.SPIKE, x: 2000, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.SPIKE, x: 2050, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.SPIKE, x: 2100, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.SPIKE, x: 3500, y: GROUND_Y - GRID_SIZE, props: {} },
        ],
    },
    {
        id: 'level3',
        name: 'Rhythm Zone',
        length: 5000,
        scrollSpeed: 350,
        bpm: 160,
        obstacles: [
            // Fast-paced rhythmic pattern
            { type: OBSTACLE_TYPE.SPIKE, x: 200, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.SPIKE, x: 400, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.SPIKE, x: 600, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.ORB, x: 750, y: GROUND_Y - 100, props: {} },
            { type: OBSTACLE_TYPE.BLOCK, x: 1000, y: GROUND_Y - GRID_SIZE * 3, props: { width: GRID_SIZE * 2, height: GRID_SIZE * 3 } },
            { type: OBSTACLE_TYPE.SPIKE, x: 1300, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.SPIKE, x: 1350, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.PLATFORM, x: 1600, y: GROUND_Y - 200, props: { width: GRID_SIZE * 4 } },
            { type: OBSTACLE_TYPE.SPIKE, x: 2000, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.SPIKE, x: 2100, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.SPIKE, x: 2200, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.ORB, x: 2500, y: GROUND_Y - 120, props: {} },
            { type: OBSTACLE_TYPE.SPIKE, x: 3000, y: GROUND_Y - GRID_SIZE, props: {} },
            { type: OBSTACLE_TYPE.BLOCK, x: 3500, y: GROUND_Y - GRID_SIZE * 5, props: { width: GRID_SIZE, height: GRID_SIZE * 5 } },
        ],
    },
];

export function getLevelById(id) {
    return LEVELS.find(level => level.id === id) || LEVELS[0];
}

export function getNextLevelId(currentId) {
    const idx = LEVELS.findIndex(l => l.id === currentId);
    if (idx === -1 || idx >= LEVELS.length - 1) return null;
    return LEVELS[idx + 1].id;
}

export function getAllLevels() {
    return LEVELS.map(l => ({ id: l.id, name: l.name }));
}
