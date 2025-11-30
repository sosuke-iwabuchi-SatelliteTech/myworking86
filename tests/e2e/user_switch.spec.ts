import { test, expect } from '@playwright/test';

test('user registration and switch user flow', async ({ page }) => {
  await page.goto('/');

  // Check if we are on the registration screen (fresh start)
  const registrationHeading = page.getByRole('heading', { name: 'はじめまして！' });

  // If the registration screen is visible, complete registration
  // Note: In a fresh CI environment, this should always be true.
  if (await registrationHeading.isVisible()) {
    await page.getByLabel('ニックネーム').fill('テスト花子');
    await page.getByLabel('がくねん').selectOption('2');
    await page.getByRole('button', { name: 'はじめる！' }).click();
  }

  // Wait for Welcome Screen to appear (look for "さんすう" text)
  await expect(page.locator('text=さんすう')).toBeVisible();

  // Click Switch User Icon
  await page.getByLabel('ユーザーを切り替える').click();

  // Verify Modal is Open
  await expect(page.locator('text=ユーザーきりかえ')).toBeVisible();
});
