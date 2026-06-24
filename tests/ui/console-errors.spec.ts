import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CostUsageExplorerPage } from '../../pages/CostUsageExplorerPage';
import { USER_EMAIL, USER_PASSWORD } from '../../helpers/auth';

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

  function getRelevantFailures(requests: string[]): string[] {
    return requests.filter(
      (request) => !request.includes('net::ERR_ABORTED')
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

    const relevantFailures = getRelevantFailures(failedRequests);

    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors.join('\n'));
    }
    if (relevantFailures.length > 0) {
      console.log('Relevant failed requests:', relevantFailures.join('\n'));
    }

    // Assert no errors or failed requests
    expect(consoleErrors).toHaveLength(0);
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

    const relevantFailures = getRelevantFailures(failedRequests);

    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors.join('\n'));
    }
    if (relevantFailures.length > 0) {
      console.log('Relevant failed requests:', relevantFailures.join('\n'));
    }

    // Assert no errors
    expect(consoleErrors).toHaveLength(0);
    expect(relevantFailures).toHaveLength(0);

    // Verify page loaded
    const totalCostText = await costUsagePage.getTotalCostValue();
    expect(totalCostText).toBeTruthy();
  });
});
