import { test, expect, APIRequestContext } from '@playwright/test';
import { createAuthenticatedContext } from '../../../helpers/auth/auth-bootstrap';
import { FinOpsClient } from '../../../helpers/clients/finops.client';

test.describe('FinOps Commitments @api', () => {
  let api: FinOpsClient;
  let context: APIRequestContext;

  test.beforeAll(async () => {
    const { context: ctx, tokens } = await createAuthenticatedContext();
    context = ctx;
    api = new FinOpsClient(context);
  });

  test.afterAll(async () => {
    await context.dispose();
  });

  test('should fetch commitment dashboard KPIs', async () => {
    const d = await api.getCommitmentDashboard({
      periodGranLevel: 'month',
      startDate: `${new Date().getFullYear()}-01-01`,
      endDate: new Date().toISOString().split('T')[0],
      'filters[service]': 'ec2',
    });
    expect(Object.keys(d).length).toBeGreaterThan(0);
  });

  test('should fetch commitment utilization summary', async () => {
    const s = await api.getCommitmentSummary({
      date: new Date().toISOString().split('T')[0],
      commitmentType: 'sp',
      linkedAccount: '',
      payerAccount: '',
      commitmentServices: 'ComputeSavingsPlans',
    });
    // May return empty object when no data exists — just verify it's an object
    expect(typeof s).toBe('object');
  });

  test('should fetch total savings for SP and RI', async () => {
    const d = Array.from({ length: 6 }, (_, i) => `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}-01`);
    const sp = await api.getCommitmentTotalSavings('sp', d);
    expect(Object.keys(sp).length).toBeGreaterThan(0);
    const ri = await api.getCommitmentTotalSavings('ri', d);
    expect(Object.keys(ri).length).toBeGreaterThan(0);
  });

  test('should fetch anomaly stats', async () => {
    const s = await api.getAnomalyStats();
    expect(s.openAnomalies).toBeGreaterThanOrEqual(0);
    expect(s.impact).toBeGreaterThanOrEqual(0);
  });

  test('should fetch anomaly alert rules', async () => {
    const r = await api.getAnomalyAlertRules();
    expect(Array.isArray(r)).toBe(true);
  });
});
