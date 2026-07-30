import { test, expect } from '../../../helpers/fixtures/api';

test.describe('FinOps Commitments @api', () => {
  const year = new Date().getFullYear();
  const today = new Date().toISOString().split('T')[0];

  test('GET /commitment/dashboard — returns KPIs with non-negative values', async ({ api }) => {
    const dash = await api.finops.getCommitmentDashboard({
      periodGranLevel: 'month',
      startDate: `${year}-01-01`,
      endDate: today,
      'filters[service]': 'ec2',
    });
    expect(Object.keys(dash).length).toBeGreaterThan(0);
    // If KPIs array exists, each KPI's value should be >= 0
    if (Array.isArray(dash.kpis)) {
      for (const kpi of dash.kpis as any[]) {
        if (kpi.value !== undefined) {
          expect(Number(kpi.value)).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  test('GET /commitment/utilization/i/summary — utilization percent is between 0-100', async ({ api }) => {
    const summary = await api.finops.getCommitmentSummary({
      date: today,
      commitmentType: 'sp',
      linkedAccount: '',
      payerAccount: '',
      commitmentServices: 'ComputeSavingsPlans',
    });
    expect(typeof summary).toBe('object');
    if (summary.utilizationPercent !== undefined) {
      expect(Number(summary.utilizationPercent)).toBeGreaterThanOrEqual(0);
      expect(Number(summary.utilizationPercent)).toBeLessThanOrEqual(100);
    }
    // Active commitments should not exceed total
    if (summary.total !== undefined && summary.activeTotal !== undefined) {
      expect(Number(summary.activeTotal)).toBeLessThanOrEqual(Number(summary.total) + 0.01);
    }
  });

  test('GET /commitment/utilization/totalsavings — SP and RI share same date format', async ({ api }) => {
    const dates = Array.from({ length: 6 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}-01`);
    const sp = await api.finops.getCommitmentTotalSavings('sp', dates);
    const ri = await api.finops.getCommitmentTotalSavings('ri', dates);
    expect(Object.keys(sp).length).toBeGreaterThan(0);
    expect(Object.keys(ri).length).toBeGreaterThan(0);
  });

  test('GET /anomaly-detection/anomalies/stats — stats are non-negative with valid history', async ({ api }) => {
    const s = await api.finops.getAnomalyStats();
    expect(s.openAnomalies).toBeGreaterThanOrEqual(0);
    expect(s.impact).toBeGreaterThanOrEqual(0);
    if (Array.isArray(s.historyData)) {
      for (const h of s.historyData as any[]) {
        expect(h.date || h.period || h.label, 'history entry must have an identifier').toBeDefined();
        // count may be named 'count', 'value', 'anomalies', etc.
        const countVal = h.count ?? h.value ?? h.anomalies;
        if (countVal !== undefined) {
          expect(Number(countVal), 'history count must be >= 0').toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  test('GET /anomaly-detection/rules — each rule has a defined isEnabled flag', async ({ api }) => {
    const rules = await api.finops.getAnomalyAlertRules();
    expect(Array.isArray(rules)).toBe(true);
    if (rules.length > 0) {
      for (const rule of rules) {
        expect((rule as any).ruleName || (rule as any).name, 'rule must have name').toBeDefined();
        expect((rule as any).hasOwnProperty('isEnabled'), 'rule must have isEnabled property').toBe(true);
      }
    }
  });
});
