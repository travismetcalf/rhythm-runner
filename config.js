// ============================================================================
// config.js — Centralized configuration for all game systems
// ============================================================================

// === Canvas & Rendering ===
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const BG_COLOR = '#1a1a2e';

// === Physics ===
export const GRAVITY = 30; // pixels per second squared
export const JUMP_VELOCITY = -15; // pixels per second (negative = up)
export const TERMINAL_VELOCITY = 25; // max fall speed
export const GROUND_Y = 500; // ground level (pixels from top)

// === Player ===
export const PLAYER_SIZE = 30; // cube size in pixels
export const PLAYER_START_X = 100; // fixed X position
export const PLAYER_ROTATION_SPEED = 360; // degrees per second when grounded

// === Level Scrolling ===
export const BASE_SCROLL_SPEED = 300; // pixels per second
export const SCROLL_SPEED_MULTIPLIER = 1.0; // adjusted by difficulty

// === Collision ===
export const COLLISION_THRESHOLD = 0.8; // multiplier for hitbox (0.8 = 80% of sprite)

// === Game States ===
export const STATE = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    DEAD: 'DEAD',
    COMPLETE: 'COMPLETE',
    EDITOR: 'EDITOR',
};

// === Player Modes (power-ups) ===
export const PLAYER_MODE = {
    CUBE: 'CUBE',    // default: normal jumping
    SHIP: 'SHIP',    // hold to fly up
    BALL: 'BALL',    // gravity flips on jump
};

// === Obstacle Types ===
export const OBSTACLE_TYPE = {
    SPIKE: 'SPIKE',
    BLOCK: 'BLOCK',
    PLATFORM: 'PLATFORM',
    ORB: 'ORB',
    PORTAL: 'PORTAL',
};

// === Colors ===
export const COLORS = {
    PLAYER: '#00ffff',
    SPIKE: '#ff0000',
    BLOCK: '#ffffff',
    PLATFORM: '#ffff00',
    ORB: '#00ff00',
    GROUND: '#333333',
    GRID: '#444444',
};

// === Editor ===
export const GRID_SIZE = 30; // snap grid in pixels
export const EDITOR_PALETTE_WIDTH = 150; // sidebar width
