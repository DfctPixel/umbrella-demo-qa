import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : 2,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  globalSetup: './global-setup.ts',
  use: {
    baseURL: process.env.BASE_URL || 'https://dev.umbrellacost.dev',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'], browserName: 'chromium', launchOptions: { headless: true } },
    },
    {
      name: 'ui',
      testMatch: 'tests/ui/journeys/**',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        launchOptions: { headless: true },
        viewport: { width: 1920, height: 1080 },
        storageState: 'storageState.json',
      },
    },
    {
      name: 'ui-exports',
      testMatch: 'tests/ui/exports/**',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        launchOptions: { headless: true },
        viewport: { width: 1920, height: 1080 },
        storageState: 'storageState.json',
      },
    },
    {
      name: 'ui-login',
      testMatch: 'tests/ui/auth/**',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        launchOptions: { headless: true },
        viewport: { width: 1920, height: 1080 },
        // No storageState — login smoke tests need a clean browser
      },
    },
  ],
});
