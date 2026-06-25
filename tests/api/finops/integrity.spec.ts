import { test, expect } from '@playwright/test';
import { createAuthenticatedContext } from '../../../helpers/auth/auth-bootstrap';
import { CostUsageClient } from '../../../helpers/clients/cost-usage.client';
import { FinOpsClient } from '../../../helpers/clients/finops.client';

test.describe('Cross-Domain Invariants @api', () => {
  let cost: CostUsageClient;
  let finops: FinOpsClient;

  test.beforeAll(async () => {
    const { context, tokens } = await createAuthenticatedContext();
    cost = new CostUsageClient(context, tokens);
    finops = new FinOpsClient(context, tokens);
  });

  test('monthly CAUI total should roughly equal daily granularity', async () => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = `${new Date().getFullYear()}-01-01`;
    const monthly = await cost.postCaui({ granularity: 'Monthly', startDate, endDate, metrics: ['cost'], groupBy: ['service'] });
    const daily = await cost.postCaui({ granularity: 'Daily', startDate, endDate, metrics: ['cost'], groupBy: ['service'] });
    if (daily.totalCost && daily.totalCost > 0 && monthly.totalCost) {
      const ratio = monthly.totalCost / daily.totalCost;
      expect(Math.abs(1 - ratio)).toBeLessThan(0.01);
    }
  });

  test('anomaly daily cost should not exceed total cost impact', async () => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const anomalies = await finops.getAnomalyDetectionList({ startDate, endDate, isPpApplied: 'false' });
    for (const a of anomalies) {
      if (a.costImpact !== undefined && a.dailyCost !== undefined) {
        expect(a.dailyCost).toBeLessThanOrEqual((a.costImpact as number) * 1.1);
        expect(a.costImpact).toBeGreaterThanOrEqual(0);
        expect(a.dailyCost).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('recommendations should have non-negative savings', async () => {
    const recs = await cost.getRecommendationsList();
    const items = (recs.page || []) as Array<Record<string, unknown>>;
    for (const item of items) {
      if (item.annualSavings !== undefined) expect(item.annualSavings as number).toBeGreaterThanOrEqual(0);
      if (item.monthlySavings !== undefined) expect(item.monthlySavings as number).toBeGreaterThanOrEqual(0);
    }
  });

  test('service costs should sum to a reasonable total', async () => {
    const costs = await cost.getDistinctServiceCosts();
    if (costs.services && costs.services.length > 0) {
      const total = costs.services.reduce((s: number, svc: any) => s + (svc.cost || 0), 0);
      expect(total).toBeGreaterThan(0);
    }
  });

  test('anomaly stats should be non-negative', async () => {
    const s = await finops.getAnomalyStats();
    if (s.total !== undefined) expect(s.total).toBeGreaterThanOrEqual(0);
    if (s.open !== undefined) expect(s.open).toBeGreaterThanOrEqual(0);
  });
});
