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

  test('should fetch distinct service costs with non-negative values', async () => {
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

  // ── Anomaly detection ───────────────────────────────────────

  test('should fetch anomaly stats with non-negative counts', async () => {
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

  test('should fetch budgets list with valid structure', async () => {
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
      date: new Date().toISOString().split('T')[0],
      commitmentType: 'sp',
      linkedAccount: '',
      payerAccount: '',
      commitmentServices: 'ComputeSavingsPlans',
    });
    expect(summary).toBeDefined();

    // FinOps: utilization is a critical commitment-tracking metric
    if (summary.utilization !== undefined) {
      expect(typeof summary.utilization === 'number').toBeTruthy();
    }
  });

  test('should fetch commitment total savings for Savings Plans and RIs', async () => {
    const currentYear = new Date().getFullYear();
    const dates = Array.from({ length: 6 }, (_, i) =>
      `${currentYear}-${String(i + 1).padStart(2, '0')}-01`
    );

    // SP (Savings Plans) — validates YTD savings from commitments
    const spSavings = await api.getCommitmentTotalSavings('sp', dates);
    expect(spSavings).toBeDefined();
    if (spSavings.totalCommitment !== undefined) {
      expect(typeof spSavings.totalCommitment).toBe('number');
      expect(spSavings.totalCommitment).toBeGreaterThanOrEqual(0);
    }

    // RI (Reserved Instances)
    const riSavings = await api.getCommitmentTotalSavings('ri', dates);
    expect(riSavings).toBeDefined();
    if (riSavings.totalCommitment !== undefined) {
      expect(typeof riSavings.totalCommitment).toBe('number');
      expect(riSavings.totalCommitment).toBeGreaterThanOrEqual(0);
    }
  });

  // ── Recommendations (FinOps optimization) ───────────────────

  test('should fetch recommendations total count, categories, and non-negative savings', async () => {
    // Total count — validates the dashboard "New Recommendations" widget data
    const total = await api.getRecommendationsTotal();
    expect(typeof total).toBe('number');
    expect(total).toBeGreaterThanOrEqual(0);

    // Categories — validates recommendation types are properly organized
    const categories = await api.getRecommendationCategories();
    expect(Array.isArray(categories)).toBeTruthy();
    for (const cat of categories) {
      expect(cat.id).toBeDefined();
      expect(typeof cat.id).toBe('string');
      expect(cat.name).toBeDefined();
      expect(typeof cat.name).toBe('string');
    }

    // Also validate that recommendation savings are non-negative
    // (catches negative-savings bugs like the $-6,133 found during exploration)
    const recs = await api.getRecommendationsList();
    if (recs.page !== undefined) {
      const items = recs.page as Array<Record<string, unknown>>;
      for (const item of items) {
        if (item.annualSavings !== undefined) {
          expect(typeof item.annualSavings).toBe('number');
          // Savings should never be negative — negative savings is a bug
          expect(item.annualSavings).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  // ── K8s cost data (FinOps containers) ───────────────────────

  test('should fetch K8s cost data with non-negative values', async () => {
    const k8s = await api.getDistinctK8sCosts();
    expect(k8s).toBeDefined();

    // FinOps: K8s workloads should have cost visibility
    if (k8s.services && k8s.services.length > 0) {
      for (const svc of k8s.services) {
        expect(svc.serviceName).toBeDefined();
        expect(typeof svc.serviceName).toBe('string');
        if (svc.cost !== undefined) {
          expect(typeof svc.cost).toBe('number');
          expect(svc.cost).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  // ── Custom dashboard panels (FinOps reporting) ──────────────

  test('should fetch custom dashboard panels with valid structure', async () => {
    const panels = await api.getPanels();
    expect(Array.isArray(panels)).toBeTruthy();

    // FinOps: each panel represents a visualization or KPI widget
    for (const panel of panels) {
      expect(panel.uuid).toBeDefined();
      expect(typeof panel.uuid).toBe('string');
      expect(panel.name).toBeDefined();
      expect(typeof panel.name).toBe('string');
      if (panel.type !== undefined) {
        expect(typeof panel.type).toBe('string');
      }
      if (panel.route !== undefined) {
        expect(typeof panel.route).toBe('string');
      }
    }
  });
});
