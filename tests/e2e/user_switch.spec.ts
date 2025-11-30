import { test, expect } from '@playwright/test';

test('user registration, switch user, and delete user flow', async ({ page }) => {
  await page.goto('/');

  // 1. Initial Registration (if needed)
  // Check if we are on the registration screen (fresh start)
  const registrationHeading = page.getByRole('heading', { name: 'はじめまして！' });

  // If the registration screen is visible, complete registration for the first user
  if (await registrationHeading.isVisible()) {
    await page.getByLabel('ニックネーム').fill('テスト花子');
    await page.getByLabel('がくねん').selectOption('2');
    await page.getByRole('button', { name: 'はじめる！' }).click();
  } else {
    // If not on registration, we assume we might be on welcome screen with an existing user.
  }

  // Wait for Welcome Screen to appear (look for "さんすう" text)
  await expect(page.getByRole('heading', { name: /さんすう/ })).toBeVisible();

  // 2. Open User Switch Modal
  await page.getByLabel('ユーザーを切り替える').click();

  // 3. Create New User (User to be deleted)
  await page.getByRole('button', { name: 'あたらしくつくる' }).click();

  // Register second user
  await page.getByLabel('ニックネーム').fill('削除用太郎');
  await page.getByLabel('がくねん').selectOption('1');
  await page.getByRole('button', { name: 'はじめる！' }).click();

  // Verify we are logged in as the new user
  await expect(page.locator('text=削除用太郎さん')).toBeVisible();

  // 4. Create Third User (To delete the second user from)
  // We need to be logged in as someone else to see the delete button for '削除用太郎'
  await page.getByLabel('ユーザーを切り替える').click();
  await page.getByRole('button', { name: 'あたらしくつくる' }).click();

  await page.getByLabel('ニックネーム').fill('サード次郎');
  await page.getByLabel('がくねん').selectOption('3');
  await page.getByRole('button', { name: 'はじめる！' }).click();

  await expect(page.locator('text=サード次郎さん')).toBeVisible();

  // 5. Delete '削除用太郎'
  await page.getByLabel('ユーザーを切り替える').click();

  // Find the delete button for '削除用太郎'
  // Playwright locator inside locator:
  const targetUserButton = page.locator('button').filter({ hasText: '削除用太郎' });
  const targetDeleteButton = targetUserButton.locator('[title="ユーザーを削除"]');

  await targetDeleteButton.click();

  // 6. Confirm Deletion
  await expect(page.locator('text=本当にこのユーザーを削除しますか？')).toBeVisible();
  await page.getByRole('button', { name: '削除する' }).click();

  // 7. Verify Deletion
  // Should see success message
  await expect(page.locator('text=削除しました')).toBeVisible();

  // '削除用太郎' should no longer be in the list
  await expect(page.locator('button').filter({ hasText: '削除用太郎' })).not.toBeVisible();

  // Close modal
  await page.getByLabel('とじる').click();
});
