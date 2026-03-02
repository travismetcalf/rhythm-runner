# Contributing to Rhythm Runner

Thank you for your interest in contributing! This document outlines the process and guidelines.

## 🚦 CI/CD Requirements

**All code changes MUST pass automated tests before being merged.** Our GitHub Actions pipeline enforces this requirement.

### Before Submitting a Pull Request

1. **Run tests locally:**
   ```bash
   npm test                # Unit tests
   npm run test:e2e        # E2E tests
   ```

2. **Ensure coverage meets threshold (60%):**
   ```bash
   npm test -- --coverage
   ```

3. **Check for errors:**
   - No TypeScript/JavaScript syntax errors
   - All imports resolve correctly
   - No console errors when running the game

## 📋 Pull Request Process

1. **Fork the repository** and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the existing code style:
   - Modular ES6 structure
   - Class-based entities with `update(dt)` and `draw(ctx)` methods
   - JSDoc comments on functions
   - File header comments explaining purpose

3. **Add tests** for new functionality:
   - Unit tests in `tests/unit/` for pure logic
   - E2E tests in `tests/` for user workflows

4. **Run the full test suite:**
   ```bash
   npm test
   npm run test:e2e
   ```

5. **Commit with descriptive messages:**
   ```bash
   git commit -m "feat: Add ship mode with thrust physics"
   ```

6. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Fill out the PR template** with:
   - Description of changes
   - Type of change
   - Testing performed
   - Screenshots (if UI changes)

## ✅ Automated Checks

When you submit a PR, GitHub Actions will automatically:

1. **Run unit tests** on Node.js 18.x and 20.x
2. **Run E2E tests** with Playwright
3. **Check code quality** and syntax
4. **Verify coverage** meets 60% threshold
5. **Generate test reports**

**Your PR can only be merged if all checks pass (✅).**

## 🐛 Reporting Bugs

1. Check if the bug is already reported in Issues
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS information
   - Screenshots if applicable

## 💡 Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and use case
3. Provide examples or mockups if possible

## 📚 Code Style

- **ES6 modules**: Use `import`/`export`
- **Constants**: Extract magic numbers to `config.js`
- **Naming**: 
  - Classes: `PascalCase`
  - Functions/variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Private methods: `_prefixWithUnderscore()`
- **Comments**: JSDoc for public APIs, inline for complex logic
- **File headers**: Include purpose description

## 🎯 Areas for Contribution

- **Level editor** implementation
- **Additional levels** in `levelData.js`
- **Ship and ball modes** in `player.js`
- **Particle effects** system
- **Music synchronization** with beat detection
- **Mobile touch controls**
- **Leaderboard** with localStorage
- **Improved obstacle types**
- **Theme system** for visual customization
- **Better test coverage**

## 🔍 Testing Guidelines

### Unit Tests
- Test pure functions (utils, physics, level data)
- Mock dependencies (localStorage, AudioContext)
- Aim for >80% coverage on critical modules

### E2E Tests
- Test user workflows (start game, die, restart)
- Verify UI updates correctly
- Use `window.__RHYTHM_DEBUG__` for test helpers
- Test cross-browser compatibility

## 📞 Getting Help

- Open a discussion in GitHub Discussions
- Comment on existing issues
- Ask questions in your PR

## 🙏 Thank You

Every contribution, no matter how small, makes this project better!
