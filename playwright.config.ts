import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 10,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: process.env.BASE_URL || 'https://dev.umbrellacost.dev',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Setup project: authenticates via API, injects tokens into browser,
    // and saves storageState.json. UI projects depend on it to start
    // pre-authenticated without relaunching the login flow per worker.
    {
      name: 'setup',
      testMatch: '**/setup/**/*.setup.ts',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    // API project: pure APIRequestContext — no browser, no Chromium overhead.
    // Worker cap prevents test-induced throttling on the shared QA tenant.
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      workers: 4,
    },
    // UI projects depend on setup for pre-authenticated storage state.
    {
      name: 'ui',
      testMatch: 'tests/ui/journeys/**',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        storageState: 'storageState.json',
      },
    },
    {
      name: 'ui-exports',
      testMatch: 'tests/ui/exports/**',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        storageState: 'storageState.json',
      },
    },
    // Visual regression project: masked screenshots of stable views.
    // Run separately with `npx playwright test --project=ui-visual --grep @visual`.
    {
      name: 'ui-visual',
      testMatch: 'tests/ui/visual/**',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        storageState: 'storageState.json',
      },
    },
    // Login smoke tests do NOT depend on setup — they exercise the login flow itself.
    {
      name: 'ui-login',
      testMatch: 'tests/ui/auth/**',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});
