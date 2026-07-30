import { test as setup } from '@playwright/test';
import { authenticate } from '../../helpers/auth/auth-bootstrap';

const STORAGE_STATE = 'storageState.json';

setup('authenticate and save storage state', async ({ page }) => {
  const { tokens, requestContext, capability } = await authenticate();

  await requestContext.dispose();

  await page.goto('/log_in');

  await page.evaluate(({ jwt, refresh, userKey, accountKey, divisionId, email, currency }) => {
    const currencyKey = `processingCurrencyCode-${accountKey}`;

    localStorage.setItem('authToken', jwt);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('authUserKey', userKey);
    localStorage.setItem('dispUserKey', userKey);
    localStorage.setItem('currDispUserAccountKey', String(accountKey));
    localStorage.setItem('currDispUserDivisionId', divisionId);
    localStorage.setItem('username', email);
    localStorage.setItem(currencyKey, currency);
  }, {
    jwt: tokens.jwtToken,
    refresh: tokens.refreshToken,
    userKey: capability.userKey,
    accountKey: capability.accountKey,
    divisionId: capability.divisionId,
    email: process.env.USER_EMAIL || '',
    currency: capability.currency,
  });

  await page.goto('/dashboard');
  await page.getByRole('heading', { name: 'MTD cost', level: 5, exact: true }).waitFor({ state: 'visible', timeout: 30_000 });

  await page.context().storageState({ path: STORAGE_STATE });
  console.log(
    `✓ storageState.json saved (user=${capability.userKey}, account=${capability.accountKey}, division=${capability.divisionId}) — UI workers will start authenticated`,
  );
});
