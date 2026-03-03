// ============================================================================
// particles.js — Lightweight particle effects system
// ============================================================================

class Particle {
    constructor(x, y, vx, vy, color, life, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = size;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vy += 400 * dt; // gravity on particles
        this.life -= dt;
    }

    draw(ctx) {
        const alpha = Math.max(0, this.life / this.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        ctx.globalAlpha = 1;
    }

    get dead() {
        return this.life <= 0;
    }
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(dt);
            if (this.particles[i].dead) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        for (const p of this.particles) {
            p.draw(ctx);
        }
    }

    /** Emit a radial burst of particles */
    _burst(x, y, count, colors, speedMin, speedMax, lifeMin, lifeMax, sizeMin, sizeMax, angleMin = 0, angleMax = Math.PI * 2) {
        for (let i = 0; i < count; i++) {
            const angle = angleMin + Math.random() * (angleMax - angleMin);
            const speed = speedMin + Math.random() * (speedMax - speedMin);
            this.particles.push(new Particle(
                x, y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                colors[Math.floor(Math.random() * colors.length)],
                lifeMin + Math.random() * (lifeMax - lifeMin),
                sizeMin + Math.random() * (sizeMax - sizeMin)
            ));
        }
    }

    /** Burst of particles on player death */
    emitDeath(x, y) {
        this._burst(x, y, 20, ['#ff0000', '#ff4444', '#ff8800', '#ffff00'], 100, 400, 0.5, 1.0, 3, 7);
    }

    /** Small burst on jump */
    emitJump(x, y) {
        this._burst(x, y + 10, 6, ['#00ffff', '#00ccff', '#ffffff'], 50, 200, 0.2, 0.5, 2, 5,
            Math.PI / 2 - 0.6, Math.PI / 2 + 0.6);
    }

    /** Victory sparkle effect */
    emitComplete(canvasWidth, canvasHeight) {
        const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ffffff'];
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * canvasWidth;
            const y = Math.random() * canvasHeight * 0.5;
            this.particles.push(new Particle(
                x, y,
                (Math.random() - 0.5) * 200,
                -50 + Math.random() * 100,
                colors[Math.floor(Math.random() * colors.length)],
                0.8 + Math.random() * 1.2,
                3 + Math.random() * 5
            ));
        }
    }

    /** Orb collection sparkle */
    emitOrb(x, y) {
        this._burst(x, y, 10, ['#00ff00', '#88ff88', '#ffffff'], 80, 280, 0.3, 0.7, 2, 5);
    }
}
