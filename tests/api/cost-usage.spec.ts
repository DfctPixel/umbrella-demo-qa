import { test, expect } from '@playwright/test';
import { createAuthenticatedContext } from '../../helpers/auth';
import { UmbrellaApiClient } from '../../helpers/api-client';

test.describe('API Cost & Usage @api', () => {
  let api: UmbrellaApiClient;

  test.beforeAll(async () => {
    const { context, tokens } = await createAuthenticatedContext();
    api = new UmbrellaApiClient(context, tokens);
  });

  // ── Service data ────────────────────────────────────────────

  test('should fetch distinct service names', async () => {
    const services = await api.getDistinctServiceNames();
    expect(services).toBeDefined();
    expect(typeof services).toBe('object');

    // FinOps: service list is a core cost-allocation primitive
    if (services.services && services.services.length > 0) {
      expect(services.services[0].serviceName).toBeDefined();
      expect(typeof services.services[0].serviceName).toBe('string');
    }
  });

  test('should fetch distinct service costs', async () => {
    const costs = await api.getDistinctServiceCosts();
    expect(costs).toBeDefined();
    expect(typeof costs).toBe('object');

    // FinOps: every service should have an associated cost
    if (costs.services && costs.services.length > 0) {
      for (const svc of costs.services) {
        expect(svc.serviceName).toBeDefined();
        expect(typeof svc.serviceName).toBe('string');
        if (svc.cost !== undefined) {
          expect(typeof svc.cost).toBe('number');
          // A non-negative cost is a reasonable FinOps sanity check
          expect(svc.cost).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  // ── Cost queries with multi-granularity ─────────────────────

  test('should post CAUI query (monthly granularity) and return cost data', async () => {
    const body = {
      granularity: 'Monthly',
      startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      metrics: ['cost'],
      groupBy: ['service'],
    };
    const data = await api.postCaui(body);
    expect(data).toBeDefined();

    // FinOps: totalCost should be a non-negative number when present
    if (data.totalCost !== undefined) {
      expect(typeof data.totalCost).toBe('number');
      expect(data.totalCost).toBeGreaterThanOrEqual(0);
    }
  });

  test('should post CAUI query (daily granularity) and return cost data', async () => {
    const body = {
      granularity: 'Daily',
      startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      metrics: ['cost'],
      groupBy: ['service'],
    };
    const data = await api.postCaui(body);
    expect(data).toBeDefined();

    if (data.totalCost !== undefined) {
      expect(typeof data.totalCost).toBe('number');
      expect(data.totalCost).toBeGreaterThanOrEqual(0);
    }
  });

  // ── Cue views ───────────────────────────────────────────────

  test('should fetch cue views', async () => {
    const views = await api.getCueViews();
    expect(views).toBeDefined();

    // FinOps: a cue view with no views might be valid, but if present validate it
    if (views.views && views.views.length > 0) {
      expect(views.views[0].id).toBeDefined();
      expect(views.views[0].name).toBeDefined();
    }
  });

  // ── Recommendations ─────────────────────────────────────────

  test('should fetch recommendations heatmap', async () => {
    const heatmap = await api.getRecommendationsHeatmap();
    expect(heatmap).toBeDefined();
    // FinOps: recommendations drive cost optimization
  });

  // ── Anomaly detection ───────────────────────────────────────

  test('should fetch anomaly stats', async () => {
    const stats = await api.getAnomalyStats();
    expect(stats).toBeDefined();

    // FinOps: anomaly count should be non-negative
    if (stats.total !== undefined) {
      expect(typeof stats.total).toBe('number');
      expect(stats.total).toBeGreaterThanOrEqual(0);
    }
    if (stats.open !== undefined) {
      expect(typeof stats.open).toBe('number');
      expect(stats.open).toBeGreaterThanOrEqual(0);
    }
  });

  // ── Budgets (FinOps core) ───────────────────────────────────

  test('should fetch budgets list', async () => {
    const budgets = await api.getBudgets();
    expect(budgets).toBeDefined();

    // FinOps: validate budget structure
    if (budgets.budgets && budgets.budgets.length > 0) {
      for (const budget of budgets.budgets) {
        expect(budget.id).toBeDefined();
        expect(budget.name).toBeDefined();
      }
    }
  });

  // ── Commitments (FinOps core) ───────────────────────────────

  test('should fetch commitment utilization summary', async () => {
    const summary = await api.getCommitmentSummary({
      granularity: 'Monthly',
      startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    });
    expect(summary).toBeDefined();

    // FinOps: utilization is a critical commitment-tracking metric
    if (summary.utilization !== undefined) {
      // Utilization is typically a percentage (0-100) or fractional (0-1)
      expect(typeof summary.utilization === 'number').toBeTruthy();
    }
  });

  // ── Dashboards ──────────────────────────────────────────────

  test('should fetch default dashboard', async () => {
    const dashboard = await api.getDefaultDashboard();
    expect(dashboard).toBeDefined();

    if (dashboard.id) {
      expect(typeof dashboard.id).toBe('string');
    }
    if (dashboard.name) {
      expect(typeof dashboard.name).toBe('string');
    }
  });

  test('should fetch dashboards list', async () => {
    const dashboards = await api.getDashboards();
    expect(dashboards).toBeDefined();
    expect(Array.isArray(dashboards)).toBeTruthy();

    // FinOps: validate dashboard structure
    for (const db of dashboards) {
      expect(db).toBeDefined();
      if (db.id) {
        expect(typeof db.id).toBe('string');
      }
      if (db.name) {
        expect(typeof db.name).toBe('string');
      }
    }
  });
});
