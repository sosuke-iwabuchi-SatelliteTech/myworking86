import { test, expect } from '@playwright/test';

test.describe('Admin Trade History', () => {
    // Shared variables
    let senderId: string;
    let receiverId: string;
    let tradeId: string;
    let senderName: string;
    let receiverName: string;

    test.beforeAll(async ({ browser }) => {
        // Setup data using a temporary context
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('/');
        await page.waitForFunction(() => !!(window as any).axios);

        // 1. Create Users via API
        // Helper to create user
        const createUser = async (name: string, grade: number) => {
            // Using ID generation compatible with the app (UUID)
            const id = crypto.randomUUID();
            await page.evaluate(async (data) => {
                try {
                    const res = await (window as any).axios.post('/api/user', {
                        id: data.id,
                        name: data.name,
                        grade: data.grade,
                        password: 'password',
                        password_confirmation: 'password'
                    });
                    console.log('User Created:', res.data);
                } catch (e: any) {
                    console.error('Create User Failed:', e.response?.data || e.message);
                    throw new Error('Create User Failed: ' + JSON.stringify(e.response?.data || e.message));
                }
            }, { id, name, grade });
            return id;
        };

        const timestamp = Date.now();
        senderName = `Sender_${timestamp}`;
        receiverName = `Receiver_${timestamp}`;

        senderId = await createUser(senderName, 4);
        receiverId = await createUser(receiverName, 3);

        // 2. Login as Sender to create Trade
        // We act as Sender to create a trade request
        await page.evaluate(async (data) => {
            try {
                await (window as any).axios.post('/api/user/login', { id: data.id, name: data.senderName });
            } catch (e: any) {
                console.error('Login Failed:', e.response?.data || e.message);
                throw e;
            }
        }, { id: senderId, senderName });

        // Wait a bit for session/auth state to stabilize on server
        await page.waitForTimeout(1000);

        // 3. Create Trade via API
        // First give prizes
        await page.evaluate(async () => {
            try {
                await (window as any).axios.post('/api/user/prizes', { prize_id: 'ur-a-1', rarity: 'UR' }); // Offer
            } catch (e: any) {
                console.error('Give Prize Failed:', e.response?.data || e.message);
                throw e;
            }
        });

        // We need to get the UserPrize ID?
        // Actually the trade creation API usually takes UserPrize IDs. 
        // Let's check TradeController... but for simplicy let's use the UI flow OR just direct API if we know the structure.
        // We need the user_prize_id.
        // Let's just use the `TradeRequest` model factory pattern if possible, but we are in browser.

        // Let's try to just fetch the user prizes to get an ID
        const prizeId = await page.evaluate(async () => {
            try {
                const res = await (window as any).axios.get('/api/user/prizes/tradable');
                // Resource collection usually returns { data: [...] }
                const items = res.data.data || res.data;
                console.log('Tradable Prizes:', items);
                return items[0]?.id;
            } catch (e: any) {
                console.error('Get Prizes Failed:', e.response?.data || e.message);
                throw e;
            }
        });

        if (!prizeId) {
            console.error('Failed to get prize for sender (Prize list is empty or undefined)');
            // Do not throw immediately to see logs? No, should throw.
            throw new Error('Failed to get prize for sender');
        }

        // Create Trade
        // POST /api/trades
        /*
           target_id: receiverId
           items: [ { id: prizeId, type: 'offer' } ] (Verify payload structure)
           message: "Test Trade"
        */
        await page.evaluate(async (data) => {
            try {
                const res = await (window as any).axios.post('/api/trades', {
                    receiver_id: data.receiverId,
                    offered_user_prize_ids: [data.prizeId],
                    message: "E2E Test Message"
                });
                return res.data;
            } catch (e: any) {
                console.error('Create Trade Failed:', e.response?.data || e.message);
                throw new Error('Create Trade Failed: ' + JSON.stringify(e.response?.data));
            }
        }, { receiverId, prizeId });

        await context.close();
    });

    test('Admin can view, search, and sort trade history', async ({ page }) => {
        // 1. Login as Admin
        // Assuming /login page exists for email/password login
        await page.goto('/login');
        await page.getByLabel('Email').fill('admin@aa.com');
        await page.getByLabel('Password').fill('testuser');
        await page.getByRole('button', { name: 'Log in' }).click();

        // Verify Admin Dashboard or redirect
        await expect(page).toHaveURL(/\/admin\/dashboard/);

        // 2. Navigate to Trade History
        await page.goto('/admin/trades');
        await expect(page.getByRole('heading', { name: 'Trade History' })).toBeVisible();

        // 3. Verify List View (TC03, TC04)
        // Check for table headers
        await expect(page.getByRole('columnheader', { name: 'Date' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Sender' })).toBeVisible();

        // Check for the trade we created
        const row = page.getByRole('row').filter({ hasText: senderName });

        // Debug: Log table content
        const tableText = await page.locator('table').innerText();
        console.log('Table Content:', tableText);

        if (await page.getByText('No trades found').isVisible()) {
            console.error('List is empty. Trade was not created or not fetched.');
        }

        await expect(row).toBeVisible();
        await expect(row).toContainText(receiverName);
        await expect(row).toContainText('pending'); // Status

        // 4. Search Functionality (TC06, TC07)
        await page.getByRole('button', { name: 'Search Filters' }).click();

        const senderInput = page.getByPlaceholder('Search by sender name...');
        await expect(senderInput).toBeVisible();

        // Filter by Sender Name
        await senderInput.fill(senderName);
        await page.getByRole('button', { name: 'Apply Filters' }).click();

        // Verify result
        // Wait for table to update (checking row is visible again)
        await expect(page.getByRole('row').filter({ hasText: senderName })).toBeVisible();
        await expect(page.getByRole('row').filter({ hasText: receiverName })).toBeVisible();

        // Filter by Wrong Name
        await senderInput.fill('NonExistentUser');
        await page.getByRole('button', { name: 'Apply Filters' }).click();
        await expect(page.getByText(senderName)).not.toBeVisible();
        await expect(page.getByText('No trades found')).toBeVisible();

        // Clear Search (TC09)
        await page.getByRole('button', { name: 'Clear' }).click();
        await expect(page.getByText(senderName)).toBeVisible();

        // 5. Detail View (TC12, TC13)
        // Click Details button
        await page.getByRole('button', { name: 'Details' }).first().click();

        // Verify Detail Page
        await expect(page.getByRole('heading', { name: 'Trade Details' })).toBeVisible();
        // Debug Detail Page
        await expect(page.getByText(senderName, { exact: false }).first()).toBeVisible();
        await expect(page.getByText('E2E Test Message', { exact: false })).toBeVisible();

        // Verify Items
        await expect(page.getByText(`Offered by ${senderName}`)).toBeVisible();

        // 6. Navigation Back (TC15)
        await page.getByRole('button', { name: 'Back to List' }).click();
        await expect(page).toHaveURL(/\/admin\/trades/);
    });
});
