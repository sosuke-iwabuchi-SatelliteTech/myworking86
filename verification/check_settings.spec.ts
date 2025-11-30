
import { chromium, expect } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to the app
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // Check if we are on Registration
    const registrationHeader = page.getByText('はじめまして！');
    if (await registrationHeader.isVisible()) {
        console.log("Registration screen detected.");
        await page.getByPlaceholder('なまえを入力してね').fill('TestUser');
        // Select '1' from dropdown
        await page.locator('select#grade').selectOption({ value: '1' });
        // Click Submit
        await page.getByRole('button', { name: 'はじめる！' }).click();
    } else {
        console.log("Assuming Welcome screen.");
    }

    // Now on Welcome Screen
    // Wait for "さんすう" text
    await expect(page.getByText('さんすう')).toBeVisible();

    // Click Settings (gear icon)
    // The button has aria-label="Settings"
    await page.getByLabel('Settings').click();

    // Now on Settings Screen
    await expect(page.getByRole('heading', { name: '設定' })).toBeVisible();

    // Verify version text
    // The text contains "version:"
    await expect(page.getByText(/version: v\d{8}-\d{4}/)).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'verification/settings_version.png' });
    console.log('Screenshot taken at verification/settings_version.png');

  } catch (e) {
    console.error(e);
    await page.screenshot({ path: 'verification/debug_error.png' });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
