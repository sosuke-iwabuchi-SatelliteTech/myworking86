import { test, expect } from '@playwright/test';

test('Trade Flow E2E: Request -> Accept -> Celebration Modal', async ({ browser }) => {
    // 1. Setup User A (Receiver)
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    await pageA.goto('/');

    // Register User A
    const regA = pageA.getByRole('heading', { name: 'はじめまして！' });
    if (await regA.isVisible()) {
        await pageA.getByLabel('ニックネーム').fill('トレード承認者');
        await pageA.getByLabel('がくねん').selectOption('3');
        await pageA.getByRole('button', { name: 'はじめる！' }).click();
    }
    await expect(pageA.locator('text=さんすう')).toBeVisible();

    // Wait for session to be potentially established
    const tradeBtnA = pageA.getByRole('button', { name: '🤝 トレード' });
    await expect(tradeBtnA).toBeVisible({ timeout: 15000 });

    const userAId = await pageA.evaluate(() => localStorage.getItem('quiz_current_user_id'));
    if (!userAId) throw new Error("Could not find User A ID in localStorage");

    // MANUALLY ensure login for User A to avoid session issues
    await pageA.evaluate(async (data) => {
        // @ts-expect-error - window.axios is not typed in the test context
        await window.axios.post('/api/user/login', { id: data.id, name: data.name, grade: data.grade });
    }, { id: userAId, name: 'トレード承認者', grade: 3 });

    // Give User A a prize (ur-a-1: Dragon)
    await pageA.evaluate(async () => {
        // @ts-expect-error - window.axios is not typed in the test context
        await window.axios.post('/api/user/prizes', { prize_id: 'ur-a-1', rarity: 'UR' });
    });

    // 2. Setup User B (Sender)
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    await pageB.goto('/');

    // Register User B
    const regB = pageB.getByRole('heading', { name: 'はじめまして！' });
    if (await regB.isVisible()) {
        await pageB.getByLabel('ニックネーム').fill('トレード申請者');
        await pageB.getByLabel('がくねん').selectOption('4');
        await pageB.getByRole('button', { name: 'はじめる！' }).click();
    }
    await expect(pageB.locator('text=さんすう')).toBeVisible();

    const tradeBtnB = pageB.getByRole('button', { name: '🤝 トレード' });
    await expect(tradeBtnB).toBeVisible({ timeout: 15000 });

    const userBId = await pageB.evaluate(() => localStorage.getItem('quiz_current_user_id'));

    // MANUALLY ensure login for User B
    await pageB.evaluate(async (data) => {
        // @ts-expect-error - window.axios is not typed in the test context
        await window.axios.post('/api/user/login', { id: data.id, name: data.name, grade: data.grade });
    }, { id: userBId, name: 'トレード申請者', grade: 4 });

    // Give User B a prize (ur-a-2: Phoenix)
    await pageB.evaluate(async () => {
        // @ts-expect-error - window.axios is not typed in the test context
        await window.axios.post('/api/user/prizes', { prize_id: 'ur-a-2', rarity: 'UR' });
    });

    // 3. User B sends Trade Request to User A
    await pageB.goto(`/trades/create?target_id=${userAId}`);

    // Wait for prizes to load in the UI
    await expect(pageB.locator('text=ドラゴン')).toBeVisible({ timeout: 30000 });
    await expect(pageB.locator('text=フェニックス')).toBeVisible({ timeout: 30000 });

    const offerSection = pageB.locator('div:has-text("あげる けいひんを えらんでね")');
    await offerSection.locator('text=フェニックス').click();

    const requestSection = pageB.locator('div:has-text("あいてから もらうもの")');
    await requestSection.locator('text=ドラゴン').click();

    await pageB.locator('textarea').fill('E2E Test Trade Message');
    await pageB.getByRole('button', { name: 'おねがいする' }).click();

    await expect(pageB).toHaveURL(/\/trades/, { timeout: 30000 });

    // 4. User A accepts Trade Request
    await pageA.goto('/trades');

    // Find the request from User B and click "みる →"
    const tradeItem = pageA.locator('li').filter({ hasText: 'トレード申請者' });
    await expect(tradeItem).toBeVisible({ timeout: 30000 });
    await tradeItem.getByRole('link', { name: 'みる →' }).click();

    // Wait for page to load trade details
    await expect(pageA.locator('text=さんとの こうかん')).toBeVisible({ timeout: 30000 });

    // Click accept button
    const acceptBtn = pageA.getByRole('button', { name: 'こうかんする！' });
    await expect(acceptBtn).toBeVisible({ timeout: 30000 });

    // Handle confirmation dialog
    pageA.once('dialog', dialog => dialog.accept());
    await acceptBtn.click();

    // 5. Verification: Celebration Modal should appear
    await expect(pageA.locator('text=おめでとう！')).toBeVisible({ timeout: 30000 });
    await expect(pageA.locator('text=こうかんが せいりつ しました！')).toBeVisible();

    // Verify the existence of the animation container or any SVG in the modal
    const modal = pageA.locator('div:has-text("おめでとう！")');
    await expect(modal.locator('svg').first()).toBeVisible();

    // Close modal
    await pageA.getByRole('button', { name: 'OK!' }).click();
    await expect(pageA.locator('text=おめでとう！')).not.toBeVisible();

    // Cleanup
    await contextA.close();
    await contextB.close();
});
