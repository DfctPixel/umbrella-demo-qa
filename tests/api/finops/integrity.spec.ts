import { test, expect, APIRequestContext } from '@playwright/test';
import { createAuthenticatedContext } from '../../../helpers/auth/auth-bootstrap';
import { CostUsageClient } from '../../../helpers/clients/cost-usage.client';
import { FinOpsClient } from '../../../helpers/clients/finops.client';

test.describe('Cross-Domain Invariants @api', () => {
  let cost: CostUsageClient;
  let finops: FinOpsClient;
  let context: APIRequestContext;

  test.beforeAll(async () => {
    const { context: ctx, tokens } = await createAuthenticatedContext();
    context = ctx;
    cost = new CostUsageClient(context);
    finops = new FinOpsClient(context);
  });

  test.afterAll(async () => {
    await context.dispose();
  });

  test('recommendations should have non-negative savings', async () => {
    const recs = await cost.getRecommendationsList();
    const items = recs.page || [];
    for (const item of items) {
      if (item.annualSavings !== undefined) expect(item.annualSavings as number).toBeGreaterThanOrEqual(0);
      if (item.monthlySavings !== undefined) expect(item.monthlySavings as number).toBeGreaterThanOrEqual(0);
    }
  });

  test('service costs should return dimension categories', async () => {
    const costs = await cost.getDistinctServiceCosts();
    expect(Array.isArray(costs.service)).toBe(true);
  });

  test('anomaly stats should be non-negative', async () => {
    const s = await finops.getAnomalyStats();
    expect(s.openAnomalies).toBeGreaterThanOrEqual(0);
    expect(s.impact).toBeGreaterThanOrEqual(0);
  });
});
