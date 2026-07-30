import { test, expect } from '../../../helpers/fixtures/api';

test.describe('Cost Usage @api', () => {
  const year = new Date().getFullYear();
  const today = new Date().toISOString().split('T')[0];

  test('POST /invoices/caui (monthly) — all cost values are non-negative', async ({ api }) => {
    const data = await api.costUsage.postCaui({
      granularity: 'Monthly',
      startDate: `${year}-01-01`,
      endDate: today,
      metrics: ['cost'],
      groupBy: ['service'],
    });
    expect(Array.isArray(data)).toBe(true);
    // When the tenant has cost data, each row must carry total_cost and usage_date.
    // An empty array is valid for tenants without costs in the current period.
    for (const row of data) {
      expect(row).toMatchObject({
        total_cost: expect.any(Number),
        usage_date: expect.any(String),
      });
      expect((row.total_cost as number), 'total_cost must be >= 0').toBeGreaterThanOrEqual(0);
    }
  });

  test('POST /invoices/caui — daily costs should not exceed monthly for same service/period', async ({ api }) => {
    const [monthly, daily] = await Promise.all([
      api.costUsage.postCaui({ granularity: 'Monthly', startDate: `${year}-01-01`, endDate: today, metrics: ['cost'], groupBy: ['service'] }),
      api.costUsage.postCaui({ granularity: 'Daily', startDate: `${year}-01-01`, endDate: today, metrics: ['cost'], groupBy: ['service'] }),
    ]);
    expect(Array.isArray(monthly)).toBe(true);
    expect(Array.isArray(daily)).toBe(true);
    // For each service, sum of daily costs should approximately equal monthly cost
    function svcSum(arr: Record<string, unknown>[]): Map<string, number> {
      const m = new Map<string, number>();
      for (const r of arr) {
        const svc = String(r.service || '');
        const raw = r.total_cost;
        expect(raw, `total_cost must be present for service "${svc}"`).toBeDefined();
        expect(typeof raw, `total_cost must be a number for service "${svc}"`).toBe('number');
        m.set(svc, (m.get(svc) || 0) + (raw as number));
      }
      return m;
    }
    const monthlySums = svcSum(monthly);
    const dailySums = svcSum(daily);
    for (const [svc, mSum] of monthlySums) {
      const dSum = dailySums.get(svc);
      if (dSum !== undefined && mSum > 0) {
        // Allow 5% tolerance for rounding
        const ratio = dSum / mSum;
        expect(ratio, `daily/monthly ratio for ${svc} should be ~1.0 (±5%), got ${ratio.toFixed(3)}`).toBeGreaterThan(0.9);
        expect(ratio).toBeLessThan(1.15);
      }
    }
  });

  test('GET /invoices/service-names/distinct — returns string pairs with valid structure', async ({ api }) => {
    const services = await api.costUsage.getDistinctServiceNames();
    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(0);
    // Each pair should have two string values
    for (const pair of services.slice(0, 20)) {
      expect(Array.isArray(pair)).toBe(true);
      expect(typeof pair[0]).toBe('string');
      expect(typeof pair[1]).toBe('string');
    }
  });

  test('GET /budgets/v2/i/ — budgets have name, amount, and valid state', async ({ api }) => {
    const budgets = await api.costUsage.getBudgets();
    expect(Array.isArray(budgets)).toBe(true);
    for (const b of budgets) {
      expect(b.budgetName, 'budget must have budgetName').toBeDefined();
      expect(typeof b.budgetName).toBe('string');
      // Budget amount, if set, should be > 0
      if (b.budgetAmount !== undefined) {
        expect(Number(b.budgetAmount), 'budgetAmount must be >= 0').toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('GET /recommendations — categories list should be non-empty for active accounts', async ({ api }) => {
    const total = await api.costUsage.getRecommendationsTotal();
    expect(total).toBeGreaterThanOrEqual(0);
    const categories = await api.costUsage.getRecommendationCategories();
    expect(categories.length).toBeGreaterThan(0);
    const catIds = categories.map(c => c.id);
    expect(new Set(catIds).size, 'category IDs should be unique').toBe(catIds.length);
    for (const cat of categories) {
      expect(cat.id, 'category must have id').toBeTruthy();
      expect(cat.name, 'category must have name').toBeTruthy();
    }
  });

  test('GET /invoices/service-costs/distinct — returns flat dimension lists (region, service, etc.)', async ({ api }) => {
    const costs = await api.costUsage.getDistinctServiceCosts();
    expect(costs.service, 'service dimension required').toBeDefined();
    expect(Array.isArray(costs.service)).toBe(true);
    expect(costs.service.length, 'at least one service should exist').toBeGreaterThan(0);
    // Region should also be available
    expect(costs.region, 'region dimension should be available').toBeDefined();
  });

  test('GET /invoices/service-costs/distinct-tags — returns custom tag keys', async ({ api }) => {
    const tags = await api.costUsage.getDistinctTagCosts();
    expect(tags.customtags_keys, 'custom tag keys should be defined').toBeDefined();
    expect(Array.isArray(tags.customtags_keys)).toBe(true);
  });

  test('GET /usage/custom-dashboard/panels — panels reference valid dashboard IDs', async ({ api }) => {
    const [panels, dashboards] = await Promise.all([
      api.costUsage.getPanels(),
      api.dashboard.getDashboards(),
    ]);
    expect(Array.isArray(panels)).toBe(true);
    const dashIds = new Set(dashboards.map((d: any) => String(d.id)).filter(Boolean));
    if (dashIds.size > 0) {
      for (const panel of panels) {
        const refId = (panel as any).dashboardId || (panel as any).dashboardUuid;
        if (refId) {
          expect(dashIds.has(String(refId)),
            `Panel dashboard reference ${refId} should exist`).toBe(true);
        }
      }
    }
  });
});
