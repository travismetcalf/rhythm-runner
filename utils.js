// ============================================================================
// utils.js — Math and collision utility functions
// ============================================================================

/** Squared distance (avoids expensive sqrt) */
export function squaredDistance(x1, y1, x2, y2) {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2;
}

/** Clamp value between min and max */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/** Linear interpolation */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

/** Check AABB collision between two rectangles */
export function rectIntersects(r1, r2) {
    return !(r1.x + r1.width < r2.x ||
             r2.x + r2.width < r1.x ||
             r1.y + r1.height < r2.y ||
             r2.y + r2.height < r1.y);
}

/** Get bounding box for entity */
export function getBounds(x, y, size, scale = 1.0) {
    const halfSize = (size * scale) / 2;
    return {
        x: x - halfSize,
        y: y - halfSize,
        width: size * scale,
        height: size * scale,
    };
}

/** Convert degrees to radians */
export function toRadians(degrees) {
    return degrees * Math.PI / 180;
}
