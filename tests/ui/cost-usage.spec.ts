import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CostUsageExplorerPage } from '../../pages/CostUsageExplorerPage';
import { USER_EMAIL, USER_PASSWORD } from '../../helpers/auth';

test.describe('UI Cost & Usage Explorer @ui', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USER_EMAIL, USER_PASSWORD);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardLoad();
  });

  test('should navigate to Cost & Usage Explorer from sidebar', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const costUsagePage = new CostUsageExplorerPage(page);

    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();

    await expect(page).toHaveURL(/cost-usage-explorer/);
  });

  test('should display cost data in Cost & Usage Explorer', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const costUsagePage = new CostUsageExplorerPage(page);

    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();

    const totalCostText = await costUsagePage.getTotalCostValue();
    expect(totalCostText).toBeTruthy();
  });

  test('should allow searching for a service', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const costUsagePage = new CostUsageExplorerPage(page);

    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();

    // Type in the search box and verify the value was entered
    await costUsagePage.searchService('EC2');
    await expect(costUsagePage.searchInput).toHaveValue('EC2');
  });
});
