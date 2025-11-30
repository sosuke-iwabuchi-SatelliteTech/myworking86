import { test, expect } from '@playwright/test';

test('quiz flow: select level, answer questions, and check result', async ({ page }) => {
  await page.goto('/');

  // Ensure we are logged in (handle registration if needed)
  const registrationHeading = page.getByRole('heading', { name: 'はじめまして！' });
  if (await registrationHeading.isVisible()) {
    await page.getByLabel('ニックネーム').fill('クイズ太郎');
    await page.getByLabel('がくねん').selectOption('1');
    await page.getByRole('button', { name: 'はじめる！' }).click();
  }

  // 1. Select Grade and Unit
  // Select Grade 1 (1ねんせい)
  await page.getByRole('button', { name: '1ねんせい' }).click();

  // Select "Addition/Subtraction" (たしざん・ひきざん)
  await page.getByRole('button', { name: 'たしざん・ひきざん' }).click();

  // 2. Play Quiz
  // Wait for quiz screen
  // The quiz screen has a timer (initially countdown)
  // We need to wait for the actual question or options to appear.
  // The countdown is 3 seconds.

  // Wait for the first answer button to be visible.
  // Using a class selector or role for answer choices.
  // The answers are usually buttons with numbers.
  const firstAnswerBtn = page.locator('button.answer-btn-hover').first();
  await expect(firstAnswerBtn).toBeVisible({ timeout: 10000 });

  // Answer all questions (10 questions for grade-1-calc)
  // We just click the first available answer button repeatedly to finish the quiz quickly.
  // We don't care about the score for this flow test, just that it completes.
  for (let i = 0; i < 10; i++) {
    // Wait for buttons to be enabled/clickable
    await expect(firstAnswerBtn).toBeVisible();

    // There is a small delay after answering before the next question appears.
    // We click the first button.
    await firstAnswerBtn.click();

    // Wait for some state change if necessary, but Playwright auto-waits for clickability.
    // However, after the last question, clicking will trigger the result screen.
    if (i < 9) {
       // Optional: wait for the question text to update or just wait a bit
       // But clicking rapidly might work if the app blocks interaction during transition.
       // The app uses `isCorrect` state to show feedback, blocking input.
       // The feedback overlay lasts for ~1-2 seconds?
       // We should wait for the feedback to disappear or the next question to be ready.
       // The answer buttons are unmounted or disabled during feedback?
       // Let's rely on the existence of the button.
       await page.waitForTimeout(500); // Small stability wait
    }
  }

  // 3. Verify Result Screen
  await expect(page.locator('text=けっかはっぴょう！')).toBeVisible({ timeout: 10000 });

  // Check that score is displayed
  await expect(page.locator('text=点')).toBeVisible();

  // 4. Return to Top
  await page.getByRole('button', { name: 'さいしょにもどる' }).click();

  // Verify we are back at Welcome Screen
  await expect(page.locator('text=さんすう')).toBeVisible();
});
