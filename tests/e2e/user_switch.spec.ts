import { test, expect } from '@playwright/test';

test('user registration and switch user flow', async ({ page }) => {
  await page.goto('/');

  // 1. Initial Registration (if needed)
  // Check if we are on the registration screen (fresh start)
  const registrationHeading = page.getByRole('heading', { name: 'はじめまして！' });

  // If the registration screen is visible, complete registration for the first user
  if (await registrationHeading.isVisible()) {
    await page.getByLabel('ニックネーム').fill('テスト花子');
    await page.getByLabel('がくねん').selectOption('2');
    await page.getByRole('button', { name: 'はじめる！' }).click();
  }

  // Wait for Welcome Screen to appear (look for "さんすう" text)
  await expect(page.locator('text=さんすう')).toBeVisible();

  // Verify first user's name is displayed
  await expect(page.locator('text=テスト花子さん')).toBeVisible();

  // 2. Open User Switch Modal
  await page.getByLabel('ユーザーを切り替える').click();

  // Verify Modal is Open
  await expect(page.locator('text=ユーザーきりかえ')).toBeVisible();

  // 3. Create New User
  await page.getByRole('button', { name: 'あたらしくつくる' }).click();

  // Verify we are back on registration screen
  await expect(page.getByRole('heading', { name: 'はじめまして！' })).toBeVisible();

  // Register second user
  await page.getByLabel('ニックネーム').fill('テスト太郎');
  await page.getByLabel('がくねん').selectOption('1');
  await page.getByRole('button', { name: 'はじめる！' }).click();

  // 4. Verify User Switch
  // Should automatically be on Welcome Screen as the new user
  await expect(page.locator('text=さんすう')).toBeVisible();
  await expect(page.locator('text=テスト太郎さん')).toBeVisible();

  // 5. Switch back to first user
  await page.getByLabel('ユーザーを切り替える').click();

  // Click on the first user (Test Hanako)
  // We look for a button that contains the text "テスト花子"
  await page.locator('button').filter({ hasText: 'テスト花子' }).click();

  // Verify we are back to Test Hanako
  await expect(page.locator('text=テスト花子さん')).toBeVisible();
});
