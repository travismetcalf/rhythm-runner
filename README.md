# Rhythm Runner

![CI/CD Pipeline](https://github.com/travismetcalf/rhythm-runner/workflows/CI%2FCD%20Pipeline/badge.svg)
![Test Coverage](https://github.com/travismetcalf/rhythm-runner/workflows/Test%20Coverage/badge.svg)
![Deploy Pages](https://github.com/travismetcalf/rhythm-runner/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

A Geometry Dash-inspired rhythm platformer built with vanilla JavaScript, Canvas 2D, and Web Audio API.

## 🎮 Play Now

**[Play Rhythm Runner](https://travismetcalf.github.io/rhythm-runner/)**

## Features

- **Physics-based gameplay**: Gravity, jumping, and collision detection
- **Multiple player modes**: Cube (jump), Ship (hold to fly), Ball (gravity flip)
- **Multiple obstacle types**: Spikes, blocks, platforms, orbs, and portals
- **Power-ups**: Orbs grant super jump; portals switch player mode
- **Three preset levels**: Progressive difficulty with level progression
- **Level select**: Choose any level, with best-score tracking
- **Leaderboard**: Best attempts saved to localStorage per level
- **Particle effects**: Death explosion, jump dust, level-complete sparkles, orb collection
- **Audio system**: Procedural sound effects using Web Audio API
- **Mobile support**: Touch controls for phones and tablets
- **Retro aesthetics**: Press Start 2P font and neon color scheme
- **Auto-restart**: Seamless retry on death
- **Progress tracking**: Real-time attempt counter and progress percentage

## Controls

- **SPACE / UP ARROW / W / CLICK / TAP**: Jump
- **R**: Restart level
- **ESC**: Pause / resume
- **M**: Mute/unmute audio

## How to Play

1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge)
2. Click "Play" to start the first level
3. Navigate obstacles by jumping at the right time
4. Reach the end of the level to complete it
5. Try to complete it in as few attempts as possible!

## Development

### Project Structure

```
rhythm-runner/
├── index.html          # Main HTML structure
├── styles.css          # Retro game styling
├── main.js            # Bootstrap and UI orchestration
├── game.js            # Core game loop and state management
├── config.js          # Centralized constants
├── player.js          # Player entity with physics
├── level.js           # Level scrolling and rendering
├── levelData.js       # Preset level definitions
├── obstacles.js       # Obstacle types (spike, block, etc.)
├── input.js           # Input handling singleton
├── audio.js           # Web Audio API sound effects
├── physics.js         # Physics calculations
├── utils.js           # Math and collision utilities
├── particles.js       # Particle effects system
├── leaderboard.js     # localStorage score persistence
└── tests/             # Unit and E2E tests
```

### Running Tests

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Run unit tests with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e

# Serve for testing
npm run serve:test
```

### Test Suite

The codebase includes comprehensive unit and end-to-end tests:

**Unit Tests** (10 files, 156 tests)
- `utils.test.js`: squaredDistance, clamp, lerp, rectIntersects, getBounds, toRadians
- `physics.test.js`: applyGravity, applyVelocity, ground/ceiling collision
- `levelData.test.js`: Level data validation, getLevelById, getNextLevelId, getAllLevels
- `obstacles.test.js`: All 5 obstacle types + factory pattern
- `player.test.js`: Initialization, physics modes (CUBE/SHIP/BALL), jump, superJump, setMode
- `input.test.js`: Keyboard (Space, ArrowUp, W) and mouse input events
- `game.test.js`: State management, startPlaying, restart, collision detection, debug hooks
- `leaderboard.test.js`: Score persistence, best-score tracking, error resilience
- `particles.test.js`: Particle emission, lifecycle, update/draw

**End-to-End Tests** (1 file, 11 test scenarios)
- Canvas initialization (800×600 render target)
- Game state transitions (MENU → PLAYING → COMPLETE/DEAD)
- Player movement and physics
- Collision detection with obstacles
- Debug hooks (`__RHYTHM_DEBUG__.*`)
- HUD rendering (attempt counter, progress bar)
- Audio system (mute/unmute toggle)

**Code Quality**
- Comprehensive JSDoc documentation for all public functions
- Input validation and error handling in core systems
- Null-safety checks in collision detection
- Console warnings for invalid states

### CI/CD Pipeline

This project uses **GitHub Actions** for automated testing and deployment:

#### Workflows

**1. CI/CD Pipeline** ([.github/workflows/ci.yml](.github/workflows/ci.yml))
- Runs on every push and pull request to `main` or `develop`
- Tests on Node.js 18.x and 20.x
- **Automated checks:**
  - ✅ Unit tests (Vitest)
  - ✅ E2E tests (Playwright)
  - ✅ Code quality/syntax validation
  - ✅ Cross-platform compatibility
- **Branch Protection:** All tests must pass before merge is allowed
- **Production Deployment:** Only deploys if all checks pass on `main` branch

**2. Test Coverage** ([.github/workflows/test-coverage.yml](.github/workflows/test-coverage.yml))
- Generates coverage reports
- Enforces 60% minimum coverage threshold
- Uploads coverage artifacts for review

#### Branch Protection Rules

To enable full protection on GitHub:
1. Go to **Settings > Branches**
2. Add rule for `main` branch:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Required checks:
     - `Run Tests (18.x)`
     - `Run Tests (20.x)`
     - `Code Quality`
     - `Required Status Check`
   - ✅ Require pull request reviews before merging
   - ✅ Dismiss stale pull request approvals when new commits are pushed

This ensures **no code reaches production without passing all tests**.

### Architecture

- **Modular ES6**: Each file has a single responsibility
- **Class-based entities**: Player, Level, Obstacle classes with `update(dt)` and `draw(ctx)` methods
- **Delta time**: Frame-rate independent physics
- **State machine**: MENU → PLAYING → DEAD/COMPLETE
- **Singleton pattern**: InputManager for centralized input handling
- **Zero dependencies**: Pure vanilla JavaScript (dev dependencies for testing only)

## Debug Console

Open browser console and use `window.__RHYTHM_DEBUG__`:

```javascript
__RHYTHM_DEBUG__.start()        // Start level 1
__RHYTHM_DEBUG__.restart()      // Restart current level
__RHYTHM_DEBUG__.setAttempt(5)  // Set attempt counter
__RHYTHM_DEBUG__.forceGameOver() // Force death state
__RHYTHM_DEBUG__.getState()     // Get current state
```

## Future Enhancements

- [ ] Level editor with JSON export/import
- [x] More player modes (ship, ball)
- [x] Power-ups and collectibles
- [ ] Music/rhythm synchronization with beat detection
- [x] Visual themes and particle effects
- [x] Leaderboard with localStorage persistence
- [x] Mobile touch controls
- [ ] Additional levels

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+ (limited Web Audio support)

## License

MIT

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a PR.

**Important:** All PRs must pass automated tests (unit + E2E) before merge. See our [CI/CD Pipeline](.github/workflows/ci.yml) for details.
