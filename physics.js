// ============================================================================
// physics.js — Physics calculations for player movement
// ============================================================================

import { GRAVITY, TERMINAL_VELOCITY, GROUND_Y } from './config.js';
import { clamp } from './utils.js';

/** Apply gravity to entity velocity */
export function applyGravity(velocity, dt, gravityScale = 1.0) {
    velocity.y += GRAVITY * gravityScale * dt;
    velocity.y = clamp(velocity.y, -TERMINAL_VELOCITY, TERMINAL_VELOCITY);
}

/** Update position based on velocity */
export function applyVelocity(position, velocity, dt) {
    position.x += velocity.x * dt;
    position.y += velocity.y * dt;
}

/** Check if entity is on ground */
export function checkGroundCollision(y, size) {
    return y + size / 2 >= GROUND_Y;
}

/** Resolve ground collision (snap to ground) */
export function resolveGroundCollision(position, size) {
    position.y = GROUND_Y - size / 2;
}

/** Check if entity is hitting ceiling */
export function checkCeilingCollision(y, size) {
    return y - size / 2 <= 0;
}

/** Resolve ceiling collision */
export function resolveCeilingCollision(position, velocity, size) {
    position.y = size / 2;
    velocity.y = 0; // stop upward movement
}
