import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CostUsageExplorerPage } from '../../pages/CostUsageExplorerPage';
import { USER_EMAIL, USER_PASSWORD } from '../../helpers/auth';

test.describe('UI Cost & Usage Explorer @ui', () => {
  test.beforeEach(async ({ page }) => {
    // Log in before each test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USER_EMAIL, USER_PASSWORD);

    // Wait for dashboard
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardLoad();
  });

  test('should navigate to Cost & Usage Explorer from sidebar', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const costUsagePage = new CostUsageExplorerPage(page);

    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();

    // Verify we're on the Cost & Usage Explorer page
    await expect(page).toHaveURL(/cost-usage-explorer/);
  });

  test('should display cost data in Cost & Usage Explorer', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const costUsagePage = new CostUsageExplorerPage(page);

    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();

    // Verify key elements are visible
    const totalCostText = await costUsagePage.getTotalCostValue();
    expect(totalCostText).toBeTruthy();
  });

  test('should allow searching for a service', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const costUsagePage = new CostUsageExplorerPage(page);

    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();

    // Type in the search box
    await costUsagePage.searchService('EC2');
    await page.waitForTimeout(1000);

    // Verify the search input has the value
    const searchValue = await costUsagePage.searchInput.inputValue();
    expect(searchValue.toLowerCase()).toContain('ec2');
  });
});
