import { expect } from '@playwright/test';
import { test } from '../../../helpers/fixtures';
import { DashboardPage } from '../../../pages/DashboardPage';
import { CostUsageExplorerPage } from '../../../pages/CostUsageExplorerPage';

test.describe('Cost & Usage Journey @ui', () => {
  test('should navigate to Cost & Usage Explorer from sidebar', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const costUsagePage = new CostUsageExplorerPage(page);
    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();
    await expect(page).toHaveURL(/cost-usage-explorer/);
  });

  test('should display search and filter controls', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const costUsagePage = new CostUsageExplorerPage(page);
    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();
    await expect(costUsagePage.searchInput).toBeVisible({ timeout: 10_000 });
    await expect(costUsagePage.totalCost).toBeVisible({ timeout: 10_000 });
  });

  test('should allow searching for a service', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const costUsagePage = new CostUsageExplorerPage(page);
    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();
    await costUsagePage.searchService('EC2');
    await expect(costUsagePage.searchInput).toHaveValue('EC2');
  });
});
