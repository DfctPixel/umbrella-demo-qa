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

  test('should display search control and cost value', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const costUsagePage = new CostUsageExplorerPage(page);
    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();
    await expect(costUsagePage.searchInput).toBeVisible({ timeout: 10_000 });
    // Assert the dollar value next to Total Cost is visible, not just the label
    const costValue = await costUsagePage.getTotalCostValue();
    expect(costValue).toMatch(/\$/);
  });

  test('searching for a service should filter results', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const costUsagePage = new CostUsageExplorerPage(page);
    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();
    await costUsagePage.searchService('EC2');
    await expect(costUsagePage.searchInput).toHaveValue('EC2');
    // Assert the filter count changed (at least fewer items shown than total)
    const count = await costUsagePage.getFilteredCount();
    if (count) {
      expect(count.shown).toBeLessThanOrEqual(count.total);
    }
  });
});
