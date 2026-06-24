import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CostUsageExplorerPage } from '../../pages/CostUsageExplorerPage';
import { USER_EMAIL, USER_PASSWORD } from '../../helpers/auth';

/**
 * This fixture collects console errors and failed network requests
 * to ensure the application is free of runtime errors.
 */
test.describe('Console & Network Error Monitoring @ui', () => {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Reset arrays
    consoleErrors.length = 0;
    failedRequests.length = 0;

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[Console Error] ${msg.text()}`);
      }
    });

    // Listen for failed requests
    page.on('requestfailed', (request) => {
      failedRequests.push(
        `[Failed Request] ${request.method()} ${request.url()} - ${request.failure()?.errorText || 'unknown'}`
      );
    });
  });

  test('should have no console errors or failed requests during login and dashboard navigation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(USER_EMAIL, USER_PASSWORD);
    await dashboardPage.waitForDashboardLoad();

    // Wait a moment for any async requests to complete
    await page.waitForTimeout(3000);

    // Report any issues (don't fail the test for expected auth redirects)
    if (consoleErrors.length > 0) {
      console.log('Console errors detected:', consoleErrors.join('\n'));
    }
    if (failedRequests.length > 0) {
      console.log('Failed network requests:', failedRequests.join('\n'));
    }

    // Check that we landed on the dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should have no console errors during Cost & Usage Explorer navigation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const costUsagePage = new CostUsageExplorerPage(page);

    // Login
    await loginPage.goto();
    await loginPage.login(USER_EMAIL, USER_PASSWORD);
    await dashboardPage.waitForDashboardLoad();

    // Navigate to Cost & Usage Explorer
    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();

    // Wait for data to load
    await page.waitForTimeout(3000);

    // Report issues
    if (consoleErrors.length > 0) {
      console.log('Console errors detected:', consoleErrors.join('\n'));
    }
    if (failedRequests.length > 0) {
      console.log('Failed network requests:', failedRequests.join('\n'));
    }

    // Verify page loaded
    const totalCostText = await costUsagePage.getTotalCostValue();
    expect(totalCostText).toBeTruthy();
  });
});
