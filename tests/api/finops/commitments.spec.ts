import { test, expect } from '@playwright/test';
import { createAuthenticatedContext } from '../../../helpers/auth/auth-bootstrap';
import { FinOpsClient } from '../../../helpers/clients/finops.client';

test.describe('FinOps Commitments @api', () => {
  let api: FinOpsClient;
  test.beforeAll(async () => {
    const { context, tokens } = await createAuthenticatedContext();
    api = new FinOpsClient(context, tokens);
  });

  test('should fetch commitment dashboard KPIs', async () => {
    const d = await api.getCommitmentDashboard({ periodGranLevel: 'month', startDate: `${new Date().getFullYear()}-01-01`, endDate: new Date().toISOString().split('T')[0], 'filters[service]': 'ec2' });
    expect(Object.keys(d).length).toBeGreaterThan(0);
  });

  test('should fetch commitment utilization summary', async () => {
    const s = await api.getCommitmentSummary({ date: new Date().toISOString().split('T')[0], commitmentType: 'sp', linkedAccount: '', payerAccount: '', commitmentServices: 'ComputeSavingsPlans' });
    expect(s).toBeDefined();
  });

  test('should fetch total savings for SP and RI', async () => {
    const d = Array.from({ length: 6 }, (_, i) => `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}-01`);
    const sp = await api.getCommitmentTotalSavings('sp', d); expect(sp).toBeDefined();
    const ri = await api.getCommitmentTotalSavings('ri', d); expect(ri).toBeDefined();
  });

  test('should fetch anomaly stats', async () => {
    const s = await api.getAnomalyStats(); expect(s).toBeDefined();
    if (s.total !== undefined) expect(s.total).toBeGreaterThanOrEqual(0);
  });

  test('should fetch anomaly detection list', async () => {
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const list = await api.getAnomalyDetectionList({ startDate: start, endDate: end, isPpApplied: 'false' });
    expect(Array.isArray(list)).toBeTruthy();
  });

  test('should fetch anomaly alert rules', async () => {
    const r = await api.getAnomalyAlertRules(); expect(Array.isArray(r)).toBeTruthy();
  });

  test('should fetch tag governance coverage', async () => {
    const c = await api.getTagGovernanceCoverage(); expect(c).toBeDefined();
  });

  test('should fetch tag governance resources', async () => {
    const r = await api.getTagGovernanceResources({ pageNumber: '1', pageSize: '10' }); expect(r).toBeDefined();
  });

  test('should fetch cost alert rules', async () => {
    const r = await api.getCostAlertRules(); expect(r).toBeDefined();
  });

  test('should fetch partner billing summary', async () => {
    const s = await api.getBillingSummary({ fromMonth: '5', fromYear: '2026', toMonth: '5', toYear: '2026', pageNumber: '1', pageSize: '10' });
    expect(s).toBeDefined();
  });
});
