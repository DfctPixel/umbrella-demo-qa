import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL: process.env.BASE_URL || 'https://dev.umbrellacost.dev',
    apiURL: process.env.API_URL || 'https://api.dev.umbrellacost.dev/api/v1',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        launchOptions: { headless: true },
      },
    },
    {
      name: 'ui',
      testMatch: '**/ui/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        launchOptions: { headless: true },
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});
