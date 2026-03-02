import { test, expect } from '@playwright/test';

test.describe('Rhythm Runner E2E Tests', () => {
    test('loads core UI and game canvas', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('heading', { name: 'RHYTHM RUNNER' })).toBeVisible();
        await expect(page.locator('#attempt-value')).toHaveText('1');
        
        const canvas = page.locator('#game-canvas');
        await expect(canvas).toBeVisible();
        await expect(canvas).toHaveJSProperty('width', 800);
        await expect(canvas).toHaveJSProperty('height', 600);
    });

    test('starts game on play button click', async ({ page }) => {
        await page.goto('/');
        
        const menuOverlay = page.locator('#menu-overlay');
        await expect(menuOverlay).toBeVisible();
        
        await page.click('#play-btn');
        
        await expect(menuOverlay).toBeHidden();
        await expect(page.locator('#level-name')).toHaveText('First Steps');
    });

    test('can use debug hooks to start game', async ({ page }) => {
        await page.goto('/');

        await page.evaluate(() => window.__RHYTHM_DEBUG__.start());
        
        await expect(page.locator('#level-name')).toHaveText('First Steps');
        await expect(page.locator('#attempt-value')).toHaveText('1');
    });

    test('progress increases during gameplay', async ({ page }) => {
        await page.goto('/');
        
        await page.evaluate(() => window.__RHYTHM_DEBUG__.start());
        
        // Wait for progress to increase
        await expect
            .poll(async () => {
                const progress = await page.locator('#progress-value').innerText();
                return parseInt(progress);
            }, { timeout: 5000 })
            .toBeGreaterThan(0);
    });

    test('mute button toggles sound', async ({ page }) => {
        await page.goto('/');
        
        const muteBtn = page.locator('#mute-btn');
        await expect(muteBtn).toHaveText('🔊 Sound On');
        
        await muteBtn.click();
        await expect(muteBtn).toHaveText('🔇 Sound Off');
        
        await muteBtn.click();
        await expect(muteBtn).toHaveText('🔊 Sound On');
    });

    test('keyboard shortcut M toggles mute', async ({ page }) => {
        await page.goto('/');
        
        const muteBtn = page.locator('#mute-btn');
        await expect(muteBtn).toHaveText('🔊 Sound On');
        
        await page.keyboard.press('m');
        await expect(muteBtn).toHaveText('🔇 Sound Off');
    });

    test('attempt counter increments on restart', async ({ page }) => {
        await page.goto('/');
        
        await page.evaluate(() => window.__RHYTHM_DEBUG__.start());
        await expect(page.locator('#attempt-value')).toHaveText('1');
        
        await page.evaluate(() => window.__RHYTHM_DEBUG__.restart());
        await expect(page.locator('#attempt-value')).toHaveText('2');
    });

    test('debug hooks work correctly', async ({ page }) => {
        await page.goto('/');
        
        const debug = await page.evaluate(() => {
            return {
                hasStart: typeof window.__RHYTHM_DEBUG__.start === 'function',
                hasRestart: typeof window.__RHYTHM_DEBUG__.restart === 'function',
                hasGetState: typeof window.__RHYTHM_DEBUG__.getState === 'function',
                hasForceGameOver: typeof window.__RHYTHM_DEBUG__.forceGameOver === 'function',
            };
        });
        
        expect(debug.hasStart).toBe(true);
        expect(debug.hasRestart).toBe(true);
        expect(debug.hasGetState).toBe(true);
        expect(debug.hasForceGameOver).toBe(true);
    });

    test('game state changes correctly', async ({ page }) => {
        await page.goto('/');
        
        let state = await page.evaluate(() => window.__RHYTHM_DEBUG__.getState());
        expect(state).toBe('MENU');
        
        await page.evaluate(() => window.__RHYTHM_DEBUG__.start());
        
        state = await page.evaluate(() => window.__RHYTHM_DEBUG__.getState());
        expect(state).toBe('PLAYING');
    });

    test('HUD displays correct initial values', async ({ page }) => {
        await page.goto('/');
        
        await expect(page.locator('#attempt-value')).toHaveText('1');
        await expect(page.locator('#progress-value')).toHaveText('0');
        await expect(page.locator('#level-name')).toHaveText('—');
    });

    test('controls text is visible in footer', async ({ page }) => {
        await page.goto('/');
        
        const footer = page.locator('footer p');
        await expect(footer).toBeVisible();
        await expect(footer).toContainText('SPACE/CLICK to jump');
        await expect(footer).toContainText('R to restart');
    });
});
