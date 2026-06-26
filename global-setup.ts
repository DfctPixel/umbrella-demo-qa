/**
 * Global setup: authenticates via API once, seeds browser storage,
 * and saves a Playwright storageState.json that all UI workers reuse.
 *
 * This lets every parallel worker start pre-authenticated without
 * re-running the UI login flow.
 *
 * When running API-only tests (no browser installed), the browser
 * launch is skipped gracefully — storageState.json is not needed.
 */
import { chromium } from '@playwright/test';
import { authenticate } from './helpers/auth/auth-bootstrap';

async function globalSetup() {
  const { tokens } = await authenticate();

  // Skip browser launch if Chromium is not installed (API-only runs)
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      baseURL: process.env.BASE_URL || 'https://dev.umbrellacost.dev',
    });
    const page = await context.newPage();

    // Navigate to any page on the origin so localStorage is available
    await page.goto('/log_in');

    // Inject all auth state the SPA expects
    await page.evaluate(({ jwt, refresh, userKey, email }) => {
      const accountKey = '111111177';
      const divisionId = '0';
      const currencyKey = `processingCurrencyCode-${accountKey}`;

      localStorage.setItem('authToken', jwt);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('authUserKey', userKey);
      localStorage.setItem('dispUserKey', userKey);
      localStorage.setItem('currDispUserAccountKey', accountKey);
      localStorage.setItem('currDispUserDivisionId', divisionId);
      localStorage.setItem('username', email);
      localStorage.setItem(currencyKey, 'USD');
    }, {
      jwt: tokens.jwtToken,
      refresh: tokens.refreshToken,
      userKey: tokens.username, // The JWT sub claim, used as user key
      email: process.env.USER_EMAIL || '',
    });

    // Navigate to dashboard so the SPA bootstraps with the injected tokens
    await page.goto('/dashboard');

    // Wait for the dashboard to be ready (matches what LoginPage does)
    await page.getByText('MTD cost').waitFor({ state: 'visible', timeout: 30_000 });

    // Save full state — this captures localStorage + any cookies
    await context.storageState({ path: 'storageState.json' });
    console.log('✓ storageState.json saved — all workers will start authenticated');

    await browser.close();
  } catch (err) {
    console.log('⚠ Skipping storageState generation (browser not available — API-only run)');
  }
}

export default globalSetup;
