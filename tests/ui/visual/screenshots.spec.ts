import { expect } from '@playwright/test';
import { test } from '../../../helpers/fixtures';
import { DashboardPage } from '../../../pages/DashboardPage';
import { CostUsageExplorerPage } from '../../../pages/CostUsageExplorerPage';
import { CommitmentDashboardPage } from '../../../pages/CommitmentDashboardPage';

test.describe('Visual Regression @visual', () => {
  test('dashboard KPI cards match baseline', async ({ authenticatedPage: page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardLoad();

    // Scope to the MTD cost heading's section container instead of #root,
    // which captures the full page including sensitive account/user data.
    const kpiHeading = dashboardPage.mtdCost;
    await expect(kpiHeading).toBeVisible();

    // Walk up to the KPI card container (parent of the heading's parent card).
    // This avoids capturing sidebar, top nav, tables, and user identifiers.
    const kpiCard = kpiHeading.locator('..');
    await expect(kpiCard).toHaveScreenshot('dashboard-kpis.png', {
      mask: [
        kpiCard.locator('*').getByText(/^\$/),
        kpiCard.locator('*').getByText(/%/),
      ],
      threshold: 0.05,
    });
  });

  test('cost-usage chart renders without error', async ({ authenticatedPage: page }) => {
    const costUsagePage = new CostUsageExplorerPage(page);
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();
    await costUsagePage.waitForChartReady();

    await expect(costUsagePage.chartSvg).toBeVisible();

    await expect(costUsagePage.chartSvg).toHaveScreenshot('cost-usage-chart.png', {
      mask: [
        costUsagePage.chartTooltip,
        page.locator('.recharts-xAxis .recharts-cartesian-axis-tick-value'),
        page.locator('.recharts-yAxis .recharts-cartesian-axis-tick-value'),
      ],
      threshold: 0.05,
    });
  });

  test('commitment dashboard table renders', async ({ authenticatedPage: page }) => {
    const commitmentPage = new CommitmentDashboardPage(page);

    await commitmentPage.navigateTo();
    await commitmentPage.waitForLoad();

    const sectionHeading = page.getByText('Top 10 Unutilized Commitment');
    await expect(sectionHeading).toBeVisible({ timeout: 10_000 });

    const section = sectionHeading.locator('..').locator('..');
    await expect(section).toHaveScreenshot('commitment-unutilized-section.png', {
      mask: [
        section.locator('td').getByText(/%/),
        section.locator('td').getByText(/20\d{2}/),
      ],
      threshold: 0.05,
    });
  });
});
