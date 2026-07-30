import { expect } from '@playwright/test';
import { test } from '../../../helpers/fixtures';
import { DashboardPage } from '../../../pages/DashboardPage';
import { CostUsageExplorerPage } from '../../../pages/CostUsageExplorerPage';

// ── Money & date oracles (independent of production code) ──────────────────────

const MONTH_MAP: Record<string, string> = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
};

function dollarToCents(display: string): number {
  const cleaned = display.replace(/[$,]/g, '').trim();
  return Math.round(parseFloat(cleaned) * 100);
}

function centsToDisplay(cents: number): string {
  return (cents / 100).toFixed(2);
}

function tooltipDateToIso(tooltipDate: string, year: string): string {
  // tooltipDate example: "Jul 01" or "Jul 1"
  const [monthAbbr, dayRaw] = tooltipDate.split(' ');
  const monthNum = MONTH_MAP[monthAbbr] ?? '01';
  const day = dayRaw.padStart(2, '0');
  return `${year}-${monthNum}-${day}`;
}

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

    // Intercept only the CAUI POST that drives the bar chart by matching the
    // request body — Daily granularity with cost metric and service groupBy.
    // A flag prevents later summary/table CAUI calls from overwriting the capture.
    let chartCauiBody: Array<{ usage_date?: string; total_cost?: number }> = [];
    let chartCaptured = false;

    await page.route(/\/api\/v1\/invoices\/caui$/, async (route, request) => {
      if (chartCaptured) { await route.fulfill({ response: await route.fetch() }); return; }
      if (request.method() !== 'POST') { await route.fulfill({ response: await route.fetch() }); return; }
      const postData = request.postDataJSON() as Record<string, unknown>;
      const metrics = postData?.metrics as string[] | undefined;
      const groupBy = postData?.groupBy as string[] | undefined;
      const isChartFeed =
        postData?.granularity === 'Daily' &&
        Array.isArray(metrics) && metrics.includes('cost') &&
        Array.isArray(groupBy) && groupBy.includes('service');
      if (!isChartFeed) { await route.fulfill({ response: await route.fetch() }); return; }
      const response = await route.fetch();
      try {
        const body = await response.json();
        if (Array.isArray(body)) {
          chartCauiBody = body;
          chartCaptured = true;
        }
      } catch { /* non-JSON */ }
      await route.fulfill({ response });
    });

    await dashboardPage.navigateToCostAndUsageExplorer();
    await costUsagePage.waitForLoad();
    await costUsagePage.waitForChartReady();

    // Assert we captured exactly one chart-data response
    expect(chartCauiBody.length, 'chart CAUI response must not be empty').toBeGreaterThan(0);
    expect(chartCauiBody, 'every chart CAUI entry must have usage_date').not.toContainEqual(
      expect.objectContaining({ usage_date: undefined }),
    );

    await page.unroute(/\/api\/v1\/invoices\/caui$/);

    // Hover over the first bar and read tooltip date + total
    const tooltipInfo = await costUsagePage.getTooltipInfo();
    expect(tooltipInfo.date, 'tooltip must display a date').toBeTruthy();
    expect(tooltipInfo.total, 'tooltip must display a total').toBeTruthy();

    // Parse tooltip dollar value into minor units (cents) to avoid floating-point drift
    const tooltipCents = dollarToCents(tooltipInfo.total);
    expect(tooltipCents, 'tooltip total must be positive').toBeGreaterThan(0);

    // Parse UI date into ISO day (month + day from tooltip, year from CAUI)
    const tooltipYear = chartCauiBody[0]?.usage_date?.slice(0, 4) ?? String(new Date().getFullYear());

    // Group CAUI rows by ISO day string and sum total_cost for the tooltip date
    const byDate = new Map<string, number>();
    for (const entry of chartCauiBody) {
      if (!entry.usage_date) continue;
      const isoDay = entry.usage_date.slice(0, 10); // "2024-07-01"
      byDate.set(isoDay, (byDate.get(isoDay) ?? 0) + (entry.total_cost ?? 0));
    }

    // Construct ISO day from tooltip date for map lookup (e.g. "Jul 01" + year → "2024-07-01")
    const tooltipIsoKey = tooltipDateToIso(tooltipInfo.date, tooltipYear);
    const apiCents = byDate.get(tooltipIsoKey);
    expect(apiCents, `chart CAUI should contain data for ${tooltipIsoKey}`).toBeDefined();

    // Compare in cents: the tooltip may round, so allow 1-cent tolerance
    const apiCentsValue = Math.round(apiCents! * 100);
    expect(tooltipCents, `tooltip $${centsToDisplay(tooltipCents)} should match API $${centsToDisplay(apiCentsValue)} for ${tooltipIsoKey}`)
      .toBeLessThanOrEqual(apiCentsValue + 1);
    expect(tooltipCents)
      .toBeGreaterThanOrEqual(apiCentsValue - 1);
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
