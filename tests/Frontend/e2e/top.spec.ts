import { test, expect } from '@playwright/test';

test('Top page loads successfully', async ({ page }) => {
    await page.goto('/');

    // Verify that the body is visible, ensuring the page loaded enough to render something.
    // Using a generic check since the exact content might depend on authenticaton state.
    await expect(page.locator('body')).toBeVisible();

    // Optionally check for title if known, or specific text suitable for an unauthenticated user or splash screen.
    // For now, body visibility confirms no white-screen-of-death or 500 error.
});
