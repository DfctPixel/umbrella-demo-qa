import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CostUsageExplorerPage } from '../../pages/CostUsageExplorerPage';
import { USER_EMAIL, USER_PASSWORD } from '../../helpers/auth';

const CSP_ERROR_PATTERNS = [
  'google.com/rmkt',
  'google.com/ccm',
  'google.com.ua',
  'doubleclick.net',
  'Content Security Policy',
];

/**
 * Console & network error monitoring.
 *
 * Collects console errors and failed network requests across page navigations
 * to ensure the application is free of runtime errors.
 */
test.describe('Console & Network Error Monitoring @ui', () => {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors.length = 0;
    failedRequests.length = 0;

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[Console Error] ${msg.text()}`);
      }
    });

    page.on('requestfailed', (request) => {
      failedRequests.push(
        `[Failed Request] ${request.method()} ${request.url()} - ${request.failure()?.errorText || 'unknown'}`
      );
    });
  });

  function isCspRelated(message: string): boolean {
    return CSP_ERROR_PATTERNS.some((pattern) => message.includes(pattern));
  }

  function getRelevantErrors(errors: string[]): string[] {
    return errors.filter((error) => !isCspRelated(error));
  }

  function getRelevantFailures(requests: string[]): string[] {
    return requests.filter(
      (request) => !isCspRelated(request) && !request.includes('net::ERR_ABORTED')
    );
  }

  test('should have no console errors or failed requests during login and dashboard navigation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(USER_EMAIL, USER_PASSWORD);
    await dashboardPage.waitForDashboardLoad();

    // Wait for network to settle (all async requests complete)
    await page.waitForLoadState('networkidle');

    const relevantErrors = getRelevantErrors(consoleErrors);
    const relevantFailures = getRelevantFailures(failedRequests);

    if (relevantErrors.length > 0) {
      console.log('Relevant console errors:', relevantErrors.join('\n'));
    }
    if (relevantFailures.length > 0) {
      console.log('Relevant failed requests:', relevantFailures.join('\n'));
    }

    // Assert no relevant errors (CSP violations from analytics are expected)
    expect(relevantErrors).toHaveLength(0);
    expect(relevantFailures).toHaveLength(0);

    // Check that we landed on the dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should have no console errors during Cost & Usage Explorer navigation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const costUsagePage = new CostUsageExplorerPage(page);

    await loginPage.goto();
    await loginPage.login(USER_EMAIL, USER_PASSWORD);
    await dashboardPage.waitForDashboardLoad();

    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();

    // Wait for network to settle
    await page.waitForLoadState('networkidle');

    const relevantErrors = getRelevantErrors(consoleErrors);
    const relevantFailures = getRelevantFailures(failedRequests);

    if (relevantErrors.length > 0) {
      console.log('Relevant console errors:', relevantErrors.join('\n'));
    }
    if (relevantFailures.length > 0) {
      console.log('Relevant failed requests:', relevantFailures.join('\n'));
    }

    // Assert no relevant errors (CSP violations from analytics are expected)
    expect(relevantErrors).toHaveLength(0);
    expect(relevantFailures).toHaveLength(0);

    // Verify page loaded
    const totalCostText = await costUsagePage.getTotalCostValue();
    expect(totalCostText).toBeTruthy();
  });
});
