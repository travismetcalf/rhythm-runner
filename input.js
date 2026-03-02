// ============================================================================
// input.js — Centralized input handling (keyboard + mouse)
// ============================================================================

class InputManager {
    constructor() {
        this.jumpActive = false;
        this.listeners = []; // callbacks for jump events

        this._setupListeners();
    }

    _setupListeners() {
        // Jump on: Space, Up Arrow, Click
        const jumpKeys = [' ', 'ArrowUp', 'w', 'W'];

        window.addEventListener('keydown', (e) => {
            if (jumpKeys.includes(e.key)) {
                e.preventDefault();
                if (!this.jumpActive) {
                    this.jumpActive = true;
                    this._notifyJumpPress();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            if (jumpKeys.includes(e.key)) {
                e.preventDefault();
                this.jumpActive = false;
                this._notifyJumpRelease();
            }
        });

        window.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // left click
                this.jumpActive = true;
                this._notifyJumpPress();
            }
        });

        window.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                this.jumpActive = false;
                this._notifyJumpRelease();
            }
        });

        // Prevent context menu on right click
        window.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /** Register callback for jump events */
    onJump(callback) {
        this.listeners.push(callback);
    }

    _notifyJumpPress() {
        this.listeners.forEach(cb => cb({ type: 'press' }));
    }

    _notifyJumpRelease() {
        this.listeners.forEach(cb => cb({ type: 'release' }));
    }

    /** Check if jump is currently held */
    isJumpHeld() {
        return this.jumpActive;
    }
}

// Export singleton instance
export const input = new InputManager();
