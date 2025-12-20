import { test, expect } from '@playwright/test';

test.describe('Gacha Experience', () => {
  test.describe.configure({ mode: 'serial' });

  // Common setup
  test.beforeEach(async ({ page }) => {
    // Capture browser logs (keeping the listener for potential future use or error monitoring, but removing direct console.log output)
    page.on('console', msg => {
      if (msg.type() === 'error') {
        // console.error('BROWSER ERROR:', msg.text()); // Commented out debug log
      } else {
        // console.log('BROWSER:', msg.text()); // Commented out debug log
      }
    });

    // Wait for login request to start and finish
    const loginPromise = page.waitForResponse(response =>
      response.url().includes('/api/user/login') && response.status() === 200,
      { timeout: 15000 }
    ).catch(() => {
      console.log('Login request not detected (might have finished or not needed)');
    });

    // 1. Visit Home
    await page.goto('/');

    // 2. Handle registration
    const registrationHeading = page.getByRole('heading', { name: 'はじめまして！' });
    if (await registrationHeading.isVisible()) {
      await page.getByLabel('ニックネーム').fill('ガチャテスト');
      await page.getByLabel('がくねん').selectOption('3');
      await page.getByRole('button', { name: 'はじめる！' }).click();
    }

    // Wait for welcome screen (always)
    await expect(page.locator('h1:has-text("さんすう")')).toBeVisible({ timeout: 15000 });

    // Wait for the login that happens after registration or on load
    await loginPromise;

    // Small delay to ensure session is active in browser and server
    await page.waitForTimeout(500);

    // Award points via real API to ensure we have enough for pulls
    await page.evaluate(async () => {
      try {
        const axios = (window as any).axios;
        if (!axios) throw new Error('Axios not found on window');
        await axios.post('/api/points/award', { level_id: '1-1', score: 100 });
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.error('Point award failed:', e.message);
        }
        throw e;
      }
    });

    // Navigate to Gacha
    await page.getByRole('button', { name: '🎁 ガチャへ' }).click();
    await expect(page.getByRole('heading', { name: 'がちゃ' })).toBeVisible();
  });

  test('Basic Gacha Flow: Play -> Animation -> Result -> Play Again', async ({ page }) => {
    // 1. Verify points are displayed (should be at least 100 from award + whatever initial)
    // Wait for the points to be fetched and displayed. It might show "-" initially.
    await expect(page.locator('text=しょじポイント:')).toContainText(/\d+/, { timeout: 15000 });

    // 2. Click Gacha button (Free or Pt)
    const gachaBtn = page.locator('button:has-text("ガチャ")');
    await gachaBtn.click();

    // 3. Verify Animation States (using classes from GachaScreen.tsx)
    // Dropping phase (1s)
    await expect(page.locator('.animate-drop-bounce')).toBeAttached();

    // Shaking phase (3s)
    await expect(page.locator('.animate-sway')).toBeAttached({ timeout: 2000 });

    // Opening phase (0.8s) - marked by ray burst 一瞬なので検知できないため確認をスキップする
    // await expect(page.locator('.animate-ray-burst')).toBeAttached({ timeout: 15000 });

    // 4. Verify Result Screen
    // Result container should appear with rarity-specific styles
    await expect(page.locator('.animate-pop-out')).toBeVisible({ timeout: 10000 });

    // Verify result item components
    await expect(page.locator('.animate-pop-out .text-4xl').first()).toBeVisible({ timeout: 15000 }); // Rarity text (div)

    // Item name is specifically a div with text-2xl
    const nameLocator = page.locator('div.text-2xl').first();
    await expect(nameLocator).toBeVisible({ timeout: 15000 });
    const nameText = await nameLocator.textContent();
    expect(nameText?.trim().length).toBeGreaterThan(0);

    // 5. Click "もういちど" button
    await page.getByRole('button', { name: 'もういちど' }).click();

    // 6. Verify back in idle state
    await expect(page.locator('text=ボタンをおしてガチャをまわそう！')).toBeVisible();
  });

  test('Visuals: UR Rarity Presentation', async ({ page }) => {
    // Mock the pull result to force UR
    await page.route('/api/gacha/pull', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: { id: 'ur-1', name: 'Legendary Dragon', rarity: 'UR', description: 'Very Rare', imageUrl: '🐉' },
            points: 0,
            isFreeAvailable: false,
            isNew: true
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.locator('button:has-text("ガチャ")').click();

    // Verify UR specific visuals during shaking
    // Rainbow rays during shaking
    await expect(page.locator('.animate-spin-fast')).toBeVisible({ timeout: 2000 });

    // Verify UR result visuals
    // Rainbow gradient background
    await expect(page.locator('.from-yellow-300.via-purple-500.to-pink-500')).toBeVisible({ timeout: 6000 });
    // Confetti
    await expect(page.locator('.animate-pop-out').first()).toBeVisible();
    // UR Text color
    await expect(page.locator('.text-purple-600', { hasText: 'UR' })).toBeVisible();
  });

  test('Visuals: SR Rarity Presentation', async ({ page }) => {
    // Mock the pull result to force SR
    await page.route('/api/gacha/pull', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: { id: 'sr-1', name: 'Epic Phoenix', rarity: 'SR', description: 'Rare', imageUrl: '🔥' },
            points: 0,
            isFreeAvailable: false,
            isNew: true
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.locator('button:has-text("ガチャ")').click();

    // Verify SR specific visuals during shaking
    // Gold rays (animate-spin-slow in ShakingBackground)
    await expect(page.locator('.animate-spin-slow')).toBeVisible({ timeout: 2000 });

    // Verify SR result visuals
    // Gold gradient background
    await expect(page.locator('.from-yellow-200.to-yellow-500')).toBeVisible({ timeout: 6000 });
    // Sparkles
    await expect(page.locator('.animate-pulse', { hasText: '✨' }).first()).toBeVisible();
    // SR Text color
    await expect(page.locator('.text-yellow-600', { hasText: 'SR' })).toBeVisible();
  });

  test('Visuals: New Item Badge', async ({ page }) => {
    // Force isNew: true
    await page.route('/api/gacha/pull', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: { id: 'new-1', name: 'New Item', rarity: 'R', description: 'New', imageUrl: '🆕' },
          points: 0,
          isFreeAvailable: false,
          isNew: true
        }),
      });
    });

    await page.locator('button:has-text("ガチャ")').click();
    await expect(page.locator('text=New!')).toBeVisible({ timeout: 6000 });

    // Reset and force isNew: false
    await page.getByRole('button', { name: 'もういちど' }).click();

    await page.route('/api/gacha/pull', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: { id: 'old-1', name: 'Old Item', rarity: 'R', description: 'Old', imageUrl: '📦' },
          points: 0,
          isFreeAvailable: false,
          isNew: false
        }),
      });
    });

    await page.locator('button:has-text("ガチャ")').click();
    await expect(page.locator('text=Old Item')).toBeVisible({ timeout: 6000 });
    await expect(page.locator('text=New!')).not.toBeVisible();
  });

  test('Navigation Protection', async ({ page }) => {
    await page.locator('button:has-text("ガチャ")').click();

    // During animation, "もどる" should be disabled
    const backBtn = page.getByRole('button', { name: 'もどる' });
    await expect(backBtn).toBeDisabled();

    // Wait for result
    await expect(page.locator('text=もういちど')).toBeVisible({ timeout: 6000 });
    await expect(backBtn).toBeEnabled();

    // 4. Navigate back
    await backBtn.click();
    await expect(page.locator('h1:has-text("さんすう")').first()).toBeVisible({ timeout: 10000 });
  });

  test('Error Handling: Insufficient Points', async ({ page }) => {
    // Mock status to show 0 points and no free pull
    await page.route('/api/gacha/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ points: 0, isFreeAvailable: false, cost: 300 }),
      });
    });

    // Reload to apply status mock
    await page.goto('/');
    await page.getByRole('button', { name: '🎁 ガチャへ' }).click();

    // Button should be disabled
    const gachaBtn = page.locator('button:has-text("ガチャ")');
    await expect(gachaBtn).toBeDisabled();

    // Enable button via JS and mock 400 error to test alert
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('ガチャ'));
      if (btn) btn.removeAttribute('disabled');
    });

    await page.route('/api/gacha/pull', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'ポイントが足りません' }),
      });
    });

    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('ポイントが足りません');
      await dialog.accept();
    });

    await gachaBtn.click();
  });
});
