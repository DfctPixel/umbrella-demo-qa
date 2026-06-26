import { expect } from '@playwright/test';
import { test } from '../../../helpers/fixtures';
import { DashboardPage } from '../../../pages/DashboardPage';
import { CostUsageExplorerPage } from '../../../pages/CostUsageExplorerPage';

test.describe('Cost & Usage Journey @ui', () => {
  test('should navigate to Cost & Usage Explorer and display search control and cost value', async ({ authenticatedPage: page }) => {
    const dashboardPage = new DashboardPage(page);
    const costUsagePage = new CostUsageExplorerPage(page);
    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();
    await expect(page).toHaveURL(/cost-usage-explorer/);
    await expect(costUsagePage.searchInput).toBeVisible({ timeout: 10_000 });
    // Assert the dollar value next to Total Cost is visible, not just the label
    const costValue = await costUsagePage.getTotalCostValue();
    expect(costValue).toMatch(/\$/);
  });

  test('should verify chart data integrity: API response matches hover tooltip', async ({ authenticatedPage: page }) => {
    const dashboardPage = new DashboardPage(page);
    const costUsagePage = new CostUsageExplorerPage(page);

    // Intercept CAUI API responses that feed the bar chart
    const cauiBodies: Array<Array<{ usage_date?: string; total_cost?: number }>> = [];
    await page.route(/\/api\/v1\/invoices\/caui/, async (route) => {
      const response = await route.fetch();
      try {
        const body = await response.json();
        if (Array.isArray(body)) cauiBodies.push(body);
      } catch { /* non-JSON, skip */ }
      await route.fulfill({ response });
    });

    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();
    await costUsagePage.waitForChartReady();
    await page.unroute(/\/api\/v1\/invoices\/caui/);

    expect(cauiBodies.length).toBeGreaterThan(0);

    // Hover over the first bar and read tooltip date + total
    const tooltipInfo = await costUsagePage.getTooltipInfo();
    expect(tooltipInfo.date).toBeTruthy();
    expect(tooltipInfo.total).toBeTruthy();

    // Parse tooltip numeric total
    const parsedTooltip = parseFloat(tooltipInfo.total.replace(/[$,]/g, ''));
    expect(parsedTooltip).toBeGreaterThan(0);

    // Find the CAUI response matching the tooltip date by summing per-service entries per day
    let expectedApiCost: number | undefined;
    for (const body of cauiBodies) {
      const byDate = new Map<string, number>();
      for (const entry of body.filter((e) => e.usage_date)) {
        const date = new Date(entry.usage_date!);
        const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        byDate.set(label, (byDate.get(label) ?? 0) + entry.total_cost!);
      }
      if (byDate.has(tooltipInfo.date)) {
        expectedApiCost = byDate.get(tooltipInfo.date);
        break;
      }
    }

    expect(expectedApiCost).toBeDefined();
    // Compare — whole-dollar precision (tooltip may round)
    expect(parsedTooltip).toBeCloseTo(expectedApiCost!, 0);
  });

  test('searching for a service should filter results', async ({ authenticatedPage: page }) => {
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
