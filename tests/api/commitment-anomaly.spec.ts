import { test, expect } from '@playwright/test';
import { createAuthenticatedContext } from '../../helpers/auth';
import { UmbrellaApiClient } from '../../helpers/api-client';

test.describe('API Advanced FinOps @api', () => {
  let api: UmbrellaApiClient;

  test.beforeAll(async () => {
    const { context, tokens } = await createAuthenticatedContext();
    api = new UmbrellaApiClient(context, tokens);
  });

  // ── Commitment Dashboard (FinOps commitments) ───────────────

  test('should fetch commitment dashboard with valid KPIs', async () => {
    const startDate = `${new Date().getFullYear()}-01-01`;
    const endDate = new Date().toISOString().split('T')[0];

    const dashboard = await api.getCommitmentDashboard({
      periodGranLevel: 'month',
      startDate,
      endDate,
      'filters[service]': 'ec2',
    });

    expect(dashboard).toBeDefined();
    expect(typeof dashboard).toBe('object');

    // FinOps: commitment dashboard should have KPI data
    // Structure may include savings, utilization, waste metrics
    const keys = Object.keys(dashboard);
    expect(keys.length).toBeGreaterThan(0);
  });

  // ── Anomaly Detection list ─────────────────────────────────

  test('should fetch anomaly detection list with valid structure', async () => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const anomalies = await api.getAnomalyDetectionList({
      startDate,
      endDate,
      isPpApplied: 'false',
    });

    expect(Array.isArray(anomalies)).toBeTruthy();

    // FinOps: each anomaly should have cost impact and status
    for (const anomaly of anomalies) {
      expect(typeof anomaly).toBe('object');

      // Validate common anomaly fields when present
      if (anomaly.serviceName !== undefined) {
        expect(typeof anomaly.serviceName).toBe('string');
      }
      if (anomaly.costImpact !== undefined) {
        expect(typeof anomaly.costImpact).toBe('number');
      }
      if (anomaly.status !== undefined) {
        expect(typeof anomaly.status).toBe('string');
      }
      if (anomaly.dailyCost !== undefined) {
        expect(typeof anomaly.dailyCost).toBe('number');
      }
    }
  });

  test('should fetch anomaly alert rules list', async () => {
    const rules = await api.getAnomalyAlertRules();
    expect(Array.isArray(rules)).toBeTruthy();

    // FinOps: alert rules define anomaly detection thresholds
    for (const rule of rules) {
      expect(typeof rule).toBe('object');
      if (rule.name !== undefined) {
        expect(typeof rule.name).toBe('string');
      }
    }
  });

  // ── Recommendations list (detailed) ─────────────────────────

  test('should fetch recommendations list with valid items', async () => {
    const recs = await api.getRecommendationsList();
    expect(recs).toBeDefined();
    expect(typeof recs).toBe('object');

    // FinOps: recommendations should have savings potential
    if (recs.page !== undefined) {
      const items = recs.page as Array<Record<string, unknown>>;
      expect(Array.isArray(items)).toBeTruthy();

      for (const item of items) {
        expect(typeof item).toBe('object');
        if (item.annualSavings !== undefined) {
          expect(typeof item.annualSavings).toBe('number');
        }
        if (item.recommendationType !== undefined) {
          expect(typeof item.recommendationType).toBe('string');
        }
        if (item.status !== undefined) {
          expect(typeof item.status).toBe('string');
        }
      }
    }
  });

  // ── Tag Governance coverage ─────────────────────────────────

  test('should fetch tag governance coverage data', async () => {
    const coverage = await api.getTagGovernanceCoverage();
    expect(coverage).toBeDefined();
    expect(typeof coverage).toBe('object');

    // FinOps: tag coverage is a key cost allocation metric
    const keys = Object.keys(coverage);
    expect(keys.length).toBeGreaterThan(0);
  });

  test('should fetch tag governance resources', async () => {
    const resources = await api.getTagGovernanceResources({
      pageNumber: '1',
      pageSize: '10',
    });
    expect(resources).toBeDefined();
    expect(typeof resources).toBe('object');

    // FinOps: resources should have cost and tag data
    if (resources.page !== undefined) {
      const items = resources.page as Array<Record<string, unknown>>;
      expect(Array.isArray(items)).toBeTruthy();
    }
  });

  // ── Cost Alert Rules ──────────────────────────────────────

  test('should fetch cost alert rules', async () => {
    const rules = await api.getCostAlertRules();
    expect(rules).toBeDefined();
    expect(typeof rules).toBe('object');
  });

  // ── Partner Billing Summary ─────────────────────────────────

  test('should fetch partner billing summary', async () => {
    const summary = await api.getBillingSummary({
      fromMonth: '5',
      fromYear: '2026',
      toMonth: '5',
      toYear: '2026',
      pageNumber: '1',
      pageSize: '10',
    });
    expect(summary).toBeDefined();
    expect(typeof summary).toBe('object');

    // FinOps: billing summary should have paginated results
    if (summary.page !== undefined) {
      const items = summary.page as Array<Record<string, unknown>>;
      expect(Array.isArray(items)).toBeTruthy();
    }
  });
});
