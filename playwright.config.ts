import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: 'tests/Frontend/e2e',
    timeout: 30 * 1000,
    expect: {
        timeout: 5000
    },
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 2,
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
        command: 'php artisan migrate:fresh --env=testing --seed --force && php artisan serve --env=testing --port=8081 --no-reload',
        url: 'http://127.0.0.1:8081',
        reuseExistingServer: !process.env.CI,
        stdout: 'ignore',
        stderr: 'ignore',
    },
});
