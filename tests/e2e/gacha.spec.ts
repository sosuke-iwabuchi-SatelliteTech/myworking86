import { test, expect } from '@playwright/test';
import { USER_PROFILE_STORAGE_KEY } from '../../src/constants';

test.describe('Gacha Screen', () => {
  test.beforeEach(async ({ page }) => {
    // Setup a user profile so we start at WelcomeScreen
    await page.addInitScript(() => {
        window.localStorage.setItem('quiz_user_profile', JSON.stringify({
            id: 'test-user',
            nickname: 'TestUser',
            grade: 1
        }));
        window.localStorage.setItem('quiz_users', JSON.stringify([{
            id: 'test-user',
            nickname: 'TestUser',
            grade: 1
        }]));
        window.localStorage.setItem('quiz_current_user_id', 'test-user');
    });
    await page.goto('/');
  });

  test('should navigate to Gacha screen and perform a pull', async ({ page }) => {
    // Check if we are on Welcome Screen
    await expect(page.getByText('TestUserさん')).toBeVisible();

    // Click on the Gacha button
    const gachaButton = page.getByRole('button', { name: 'ガチャへ' });
    await expect(gachaButton).toBeVisible();
    await gachaButton.click();

    // Check if we are on Gacha Screen
    await expect(page.getByText('どうぶつガチャ')).toBeVisible();
    await expect(page.getByText('ボタンをおしてガチャをまわそう！')).toBeVisible();

    // Pull Gacha
    const pullButton = page.getByRole('button', { name: 'ガチャをまわす' });
    await expect(pullButton).toBeVisible();
    await pullButton.click();

    // Verify loading state
    await expect(page.getByText('......')).toBeVisible();
    // Wait for result (animation is 2 seconds)
    await page.waitForTimeout(2500);

    // Verify result is shown
    // We expect one of the rarity texts to be visible (UR, SR, R, UC, C)
    // Since it's random, we check if the reset button appears, which indicates success
    const resetButton = page.getByRole('button', { name: 'もういちど' });
    await expect(resetButton).toBeVisible();

    // Verify at least one rarity badge is visible
    const rarities = ['UR', 'SR', 'R', 'UC', 'C'];
    const rarityRegex = new RegExp(rarities.join('|'));
    await expect(page.locator('.text-4xl')).toHaveText(rarityRegex);

    // Reset
    await resetButton.click();
    await expect(pullButton).toBeVisible();

    // Go Back
    await page.getByRole('button', { name: 'もどる' }).click();
    await expect(page.getByText('TestUserさん')).toBeVisible();
  });
});
