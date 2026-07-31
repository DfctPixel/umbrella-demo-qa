import { Page, TestInfo, test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { LoginPage } from '../../../pages/LoginPage';
import { DashboardPage } from '../../../pages/DashboardPage';
import { USER_EMAIL, USER_PASSWORD } from '../../../helpers/auth/types';

const CONNECTIVITY_FLAKE_LOG = path.resolve('test-results', 'connectivity-flakes.json');
const CONNECTIVITY_ERROR_PATTERN =
  /net::(ERR_SOCKET_NOT_CONNECTED|ERR_CONNECTION|ERR_NAME_NOT_RESOLVED|ERR_INTERNET|ERR_PROXY|ERR_NETWORK|ERR_ADDRESS_UNREACHABLE|ERR_EMPTY_RESPONSE)/;

/**
 * Connectivity failures (e.g. ERR_SOCKET_NOT_CONNECTED) are infrastructure
 * flakes, not product failures. Each occurrence is recorded in
 * test-results/connectivity-flakes.json and annotated on the test so a rising
 * failure rate stays visible in reports instead of being hidden by the retry.
 */
function recordConnectivityFlake(testInfo: TestInfo, error: string): void {
  const entry = { timestamp: new Date().toISOString(), test: testInfo.title, error: error.split('\n')[0] };
  let log: unknown[] = [];
  try {
    log = JSON.parse(fs.readFileSync(CONNECTIVITY_FLAKE_LOG, 'utf-8'));
  } catch {
    // First occurrence — start a new log.
  }
  log.push(entry);
  fs.mkdirSync(path.dirname(CONNECTIVITY_FLAKE_LOG), { recursive: true });
  fs.writeFileSync(CONNECTIVITY_FLAKE_LOG, JSON.stringify(log, null, 2));
  testInfo.annotations.push({ type: 'infra', description: `connectivity flake: ${entry.error}` });
}

async function gotoWithConnectivityRetry(page: Page, url: string, testInfo: TestInfo): Promise<void> {
  try {
    await page.goto(url);
  } catch (error) {
    const message = String(error);
    if (!CONNECTIVITY_ERROR_PATTERN.test(message)) throw error;
    recordConnectivityFlake(testInfo, message);
    await page.goto(url);
  }
  await page.waitForLoadState('networkidle');
}

test.describe('Login Smoke @ui', () => {

  test('valid login redirects to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    await gotoWithConnectivityRetry(page, '/log_in', test.info());
    await loginPage.login(USER_EMAIL, USER_PASSWORD);
    await dashboardPage.waitForDashboardLoad();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(dashboardPage.mtdCost).toBeVisible({ timeout: 15_000 });
  });

  test('forgot password link visible on password step', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await gotoWithConnectivityRetry(page, '/log_in', test.info());
    await loginPage.fillEmail(USER_EMAIL);

    await expect(loginPage.nextButton, 'Next button should be enabled after filling email').toBeEnabled();
    await loginPage.clickNext();

    await expect(loginPage.passwordInput, 'password input must be visible (transition to password step)').toBeVisible({ timeout: 10_000 });
    await expect(loginPage.forgotPasswordLink).toBeVisible({ timeout: 10_000 });
  });
});
