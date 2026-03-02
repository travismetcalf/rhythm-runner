// ============================================================================
// physics.js — Physics calculations for player movement
// ============================================================================

import { GRAVITY, TERMINAL_VELOCITY, GROUND_Y } from './config.js';
import { clamp } from './utils.js';

/**
 * Apply gravitational acceleration to an entity's velocity.
 * Clamps velocity to TERMINAL_VELOCITY to prevent unlimited acceleration.
 * @param {Object} velocity - Velocity object {x, y} (mutated)
 * @param {number} dt - Delta time in seconds
 * @param {number} [gravityScale=1.0] - Multiplier for gravity strength (e.g., 2.0 = 2x gravity)
 */
export function applyGravity(velocity, dt, gravityScale = 1.0) {
    velocity.y += GRAVITY * gravityScale * dt;
    velocity.y = clamp(velocity.y, -TERMINAL_VELOCITY, TERMINAL_VELOCITY);
}

/**
 * Update position based on velocity and delta time.
 * @param {Object} position - Position object {x, y} (mutated)
 * @param {Object} velocity - Velocity object {x, y} in pixels/second
 * @param {number} dt - Delta time in seconds
 */
export function applyVelocity(position, velocity, dt) {
    position.x += velocity.x * dt;
    position.y += velocity.y * dt;
}

/**
 * Check if an entity is on the ground (within ground collision threshold).
 * @param {number} y - Entity's center Y coordinate
 * @param {number} size - Entity's size (half-extents)
 * @returns {boolean} True if entity is on or below ground
 */
export function checkGroundCollision(y, size) {
    return y + size / 2 >= GROUND_Y;
}

/**
 * Resolve ground collision by snapping entity to ground level.
 * Should be called after applyGravity when checkGroundCollision returns true.
 * @param {Object} position - Position object {x, y} (mutated)
 * @param {number} size - Entity's size (half-extents)
 */
export function resolveGroundCollision(position, size) {
    position.y = GROUND_Y - size / 2;
}

/**
 * Check if an entity is hitting the ceiling (top of screen).
 * @param {number} y - Entity's center Y coordinate
 * @param {number} size - Entity's size (half-extents)
 * @returns {boolean} True if entity is at or above ceiling
 */
export function checkCeilingCollision(y, size) {
    return y - size / 2 <= 0;
}

/**
 * Resolve ceiling collision by snapping entity to ceiling and stopping upward velocity.
 * @param {Object} position - Position object {x, y} (mutated)
 * @param {Object} velocity - Velocity object {x, y} (mutated)
 * @param {number} size - Entity's size (half-extents)
 */
export function resolveCeilingCollision(position, velocity, size) {
    position.y = size / 2;
    velocity.y = 0; // stop upward movement
}
