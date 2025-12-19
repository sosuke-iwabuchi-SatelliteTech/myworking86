import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: 'tests/Frontend/e2e',
    timeout: 30 * 1000,
    expect: {
        timeout: 5000
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://127.0.0.1:8081',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
            timeout: 120 * 1000,
        },
    ],
    webServer: {
        command: 'php artisan serve --env=testing --port=8081',
        url: 'http://127.0.0.1:8081',
        reuseExistingServer: !process.env.CI,
        stdout: 'pipe',
        stderr: 'pipe',
    },
});
