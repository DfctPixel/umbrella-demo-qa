import { test as base, Page } from '@playwright/test';

/**
 * Authenticated fixture: provides a page that is already on the dashboard.
 *
 * Works in two modes:
 * 1. With `storageState` (journeys & exports) — navigates to dashboard,
 *    injects sessionStorage (not saved by storageState), and waits for load.
 * 2. Without `storageState` (login smoke tests) — falls back to UI login.
 */
export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to establish origin for storage APIs
    await page.goto('/log_in');

    // Inject sessionStorage (storageState only saves localStorage + cookies)
    await page.evaluate(() => {
      const keys = ['dispUserKey', 'authUserKey', 'currDispUserAccountKey', 'currDispUserDivisionId'];
      for (const key of keys) {
        const val = localStorage.getItem(key);
        if (val) sessionStorage.setItem(key, val);
      }
      const accountKey = localStorage.getItem('currDispUserAccountKey');
      if (accountKey) {
        const currencyKey = `processingCurrencyCode-${accountKey}`;
        const val = localStorage.getItem(currencyKey);
        if (val) sessionStorage.setItem(currencyKey, val);
      }
    });

    // Navigate to dashboard and wait for it to be ready
    await page.goto('/dashboard');
    await page.getByText('MTD cost', { exact: true }).waitFor({ state: 'visible', timeout: 30_000 });

    await use(page);
  },
});

export { expect } from '@playwright/test';
