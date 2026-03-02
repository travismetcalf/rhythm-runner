// ============================================================================
// utils.js — Math and collision utility functions
// ============================================================================

/**
 * Calculate squared distance between two points (avoids expensive sqrt).
 * Useful for comparisons and optimizations where actual distance is not needed.
 * @param {number} x1 - X coordinate of first point
 * @param {number} y1 - Y coordinate of first point
 * @param {number} x2 - X coordinate of second point
 * @param {number} y2 - Y coordinate of second point
 * @returns {number} Squared distance
 */
export function squaredDistance(x1, y1, x2, y2) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}

/**
 * Clamp a value to be within the specified range [min, max].
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values.
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0 to 1, where 0=a and 1=b)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Check if two axis-aligned bounding boxes (AABBs) intersect.
 * @param {Object} r1 - Rectangle 1 with {x, y, width, height}
 * @param {Object} r2 - Rectangle 2 with {x, y, width, height}
 * @returns {boolean} True if rectangles overlap
 */
export function rectIntersects(r1, r2) {
    return !(r1.x + r1.width < r2.x ||
             r2.x + r2.width < r1.x ||
             r1.y + r1.height < r2.y ||
             r2.y + r2.height < r1.y);
}

/**
 * Calculate bounding box for a square entity.
 * Useful for collision detection with scaled hitboxes.
 * @param {number} x - Center X coordinate
 * @param {number} y - Center Y coordinate
 * @param {number} size - Unscaled size (width/height)
 * @param {number} [scale=1.0] - Scale factor for hitbox (0-1 for smaller, >1 for larger)
 * @returns {Object} Bounding box {x, y, width, height}
 */
export function getBounds(x, y, size, scale = 1.0) {
    const halfSize = (size * scale) / 2;
    return {
        x: x - halfSize,
        y: y - halfSize,
        width: size * scale,
        height: size * scale,
    };
}

/**
 * Convert degrees to radians.
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export function toRadians(degrees) {
    return degrees * Math.PI / 180;
}
