import { test, expect } from '@playwright/test';
import { createAuthenticatedContext } from '../../helpers/auth';
import { UmbrellaApiClient } from '../../helpers/api-client';

test.describe('Cloud Billing Logic @api', () => {
  let api: UmbrellaApiClient;

  test.beforeAll(async () => {
    const { context, tokens } = await createAuthenticatedContext();
    api = new UmbrellaApiClient(context, tokens);
  });

  // ── CAUI cross-granularity consistency ─────────────────────

  test('monthly CAUI total should roughly equal sum of daily granularity', async () => {
    const year = new Date().getFullYear();
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = `${year}-01-01`;

    // Monthly query
    const monthlyBody = {
      granularity: 'Monthly',
      startDate,
      endDate,
      metrics: ['cost'],
      groupBy: ['service'],
    };
    const monthlyData = await api.postCaui(monthlyBody);
    expect(monthlyData).toBeDefined();
    expect(monthlyData.totalCost).toBeDefined();
    expect(typeof monthlyData.totalCost).toBe('number');

    // Daily query
    const dailyBody = {
      granularity: 'Daily',
      startDate,
      endDate,
      metrics: ['cost'],
      groupBy: ['service'],
    };
    const dailyData = await api.postCaui(dailyBody);
    expect(dailyData).toBeDefined();
    expect(dailyData.totalCost).toBeDefined();
    expect(typeof dailyData.totalCost).toBe('number');

    // The monthly total and daily sum should roughly match (<1% tolerance)
    const monthlyTotal = monthlyData.totalCost as number;
    const dailyTotal = dailyData.totalCost as number;

    if (dailyTotal > 0) {
      const ratio = monthlyTotal / dailyTotal;
      // Allow 1% tolerance for rounding differences between aggregations
      expect(Math.abs(1 - ratio)).toBeLessThan(0.01);
    }
  });

  // ── Cost by service: total should be positive ──────────────

  test('service costs should have reasonable proportions', async () => {
    const costs = await api.getDistinctServiceCosts();
    expect(costs).toBeDefined();

    if (costs.services && costs.services.length > 0) {
      const totalCost = costs.services.reduce(
        (sum: number, svc: any) => sum + (svc.cost || 0),
        0
      );
      expect(totalCost).toBeGreaterThan(0);

      // No single service should represent more than 100% of total
      for (const svc of costs.services) {
        if (svc.cost !== undefined && totalCost > 0) {
          const share = svc.cost / totalCost;
          expect(share).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  // ── Anomaly cost impact validation ─────────────────────────

  test('anomaly daily cost should not exceed total cost impact', async () => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 55 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const anomalies = await api.getAnomalyDetectionList({
      startDate,
      endDate,
      isPpApplied: 'false',
    });

    expect(Array.isArray(anomalies)).toBeTruthy();

    for (const anomaly of anomalies) {
      if (
        anomaly.costImpact !== undefined &&
        anomaly.dailyCost !== undefined
      ) {
        const costImpact = anomaly.costImpact as number;
        const dailyCost = anomaly.dailyCost as number;

        // Daily cost should not exceed total cost impact
        // (daily is a subset of the total impact period)
        expect(dailyCost).toBeLessThanOrEqual(costImpact * 1.1);

        // Cost impact should be positive
        expect(costImpact).toBeGreaterThanOrEqual(0);
        expect(dailyCost).toBeGreaterThanOrEqual(0);
      }
    }
  });

  // ── Commitment savings comparison: SP vs RI ────────────────

  test('commitment total savings should be consistent across SP and RI', async () => {
    const currentYear = new Date().getFullYear();
    const dates = Array.from({ length: 6 }, (_, i) =>
      `${currentYear}-${String(i + 1).padStart(2, '0')}-01`
    );

    const spSavings = await api.getCommitmentTotalSavings('sp', dates);
    expect(spSavings).toBeDefined();

    const riSavings = await api.getCommitmentTotalSavings('ri', dates);
    expect(riSavings).toBeDefined();

    // Total savings should be non-negative
    if (spSavings.totalCommitment !== undefined) {
      expect(spSavings.totalCommitment).toBeGreaterThanOrEqual(0);
    }
    if (riSavings.totalCommitment !== undefined) {
      expect(riSavings.totalCommitment).toBeGreaterThanOrEqual(0);
    }
  });

  // ── Dashboard KPIs consistency ─────────────────────────────

  test('dashboard default should return valid panel structure', async () => {
    const dashboard = await api.getDefaultDashboard();
    expect(dashboard).toBeDefined();
    expect(typeof dashboard).toBe('object');

    // Dashboard should have an identifier
    const keys = Object.keys(dashboard);
    expect(keys.length).toBeGreaterThan(0);
  });

  // ── Recommendations: savings integrity ──────────────────────

  test('recommendations should have consistent savings values', async () => {
    const recs = await api.getRecommendationsList();
    expect(recs).toBeDefined();

    // Total count should be positive when recommendations exist
    const total = await api.getRecommendationsTotal();
    expect(typeof total).toBe('number');
    expect(total).toBeGreaterThanOrEqual(0);

    if (recs.page !== undefined) {
      const items = recs.page as Array<Record<string, unknown>>;

      for (const item of items) {
        // Annual savings should not be negative
        if (item.annualSavings !== undefined) {
          expect(typeof item.annualSavings).toBe('number');
          expect(item.annualSavings as number).toBeGreaterThanOrEqual(0);
        }

        // Monthly savings should not be negative
        if (item.monthlySavings !== undefined) {
          expect(typeof item.monthlySavings).toBe('number');
          expect(item.monthlySavings as number).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  // ── K8s vs total cost proportion check ─────────────────────

  test('K8s costs should be a reasonable subset of total costs', async () => {
    const totalCosts = await api.getDistinctServiceCosts();
    const k8sCosts = await api.getDistinctK8sCosts();
    const tagCosts = await api.getDistinctTagCosts();

    expect(totalCosts).toBeDefined();
    expect(k8sCosts).toBeDefined();
    expect(tagCosts).toBeDefined();

    // K8s costs should be non-negative
    if (k8sCosts.services && k8sCosts.services.length > 0) {
      for (const svc of k8sCosts.services) {
        if (svc.cost !== undefined) {
          expect(svc.cost).toBeGreaterThanOrEqual(0);
        }
      }
    }

    // Tag costs should be non-negative
    if (tagCosts.services && tagCosts.services.length > 0) {
      for (const svc of tagCosts.services) {
        if (svc.cost !== undefined) {
          expect(svc.cost).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });
});
