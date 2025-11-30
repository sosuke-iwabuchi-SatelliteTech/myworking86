import { test, expect } from '@playwright/test';

test('history flow: check if game record is saved and displayed', async ({ page }) => {
  await page.goto('/');

  // Ensure we are logged in
  const registrationHeading = page.getByRole('heading', { name: 'はじめまして！' });
  if (await registrationHeading.isVisible()) {
    await page.getByLabel('ニックネーム').fill('歴史太郎');
    await page.getByLabel('がくねん').selectOption('3');
    await page.getByRole('button', { name: 'はじめる！' }).click();
  }

  // 1. Play a quick game to generate history
  // Select Grade 1
  await page.getByRole('button', { name: '1ねんせい' }).click();
  // Select Unit
  await page.getByRole('button', { name: 'たしざん・ひきざん' }).click();

  // Answer first question
  const firstAnswerBtn = page.locator('button.answer-btn-hover').first();
  await expect(firstAnswerBtn).toBeVisible({ timeout: 10000 });
  await firstAnswerBtn.click();

  // NOTE: We don't need to finish the whole quiz to save history?
  // Usually history is saved on completion.
  // So we must finish the quiz.

  for (let i = 0; i < 9; i++) {
     await expect(firstAnswerBtn).toBeVisible();
     await firstAnswerBtn.click();
     await page.waitForTimeout(200); // Speed run
  }

  // Wait for result screen
  await expect(page.locator('text=けっかはっぴょう！')).toBeVisible({ timeout: 15000 });

  // 2. Go to Top
  await page.getByRole('button', { name: 'さいしょにもどる' }).click();

  // 3. Open History
  // Wait for the history button to be enabled
  const historyButton = page.getByRole('button', { name: '履歴を見る' });
  await expect(historyButton).toBeEnabled();
  await historyButton.click();

  // 4. Verify History Record
  // We expect at least one record.
  // The record usually shows date, score, etc.
  // We can check for the presence of the unit name "たしざん・ひきざん" or "1ねんせい"

  // History screen usually lists items.
  // Let's check for the text "たしざん・ひきざん" inside the history list container.

  // Wait for history screen title
  await expect(page.locator('text=これまでのせいせき')).toBeVisible();

  // Check for the record using data-testid
  const historyItems = page.getByTestId('history-item');
  await expect(historyItems.first()).toBeVisible();

  // Find the specific item containing the unit name
  const targetItem = historyItems.filter({ hasText: 'たしざん・ひきざん' }).first();
  await expect(targetItem).toBeVisible();

  // Check score is present in that item
  await expect(targetItem).toContainText('点');
});
