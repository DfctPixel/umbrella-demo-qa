import { test, expect } from '../../../helpers/fixtures/api';

test.describe('Cross-Domain Integration @api @integration', () => {
  const year = String(new Date().getFullYear());
  const today = new Date().toISOString().split('T')[0];

  test('User identity consistency: plain-sub-users user_key should match JWT sub', async ({ api }) => {
    test.setTimeout(30000);
    const payload = JSON.parse(Buffer.from(api.tokens.jwtToken.split('.')[1], 'base64').toString());
    const jwtSub = payload.sub;
    const user = await api.platform.getPlainSubUsers();
    expect(user.user_key).toBeDefined();
    expect(jwtSub).toBeDefined();
    expect(user.user_key).toBe(jwtSub);
  });

  test('Service name consistency: distinct service names should cover CAUI service values', async ({ api }) => {
    test.setTimeout(30000);
    const servicePairs = await api.costUsage.getDistinctServiceNames();
    const serviceNames = new Set(servicePairs.map(p => p[0]));
    const cauiData = await api.costUsage.postCaui({
      granularity: 'Monthly', startDate: `${year}-01-01`, endDate: today, metrics: ['cost'], groupBy: ['service'],
    });
    const cauiServices = new Set<string>();
    for (const row of cauiData) {
      if (typeof row.service === 'string' && row.service.length > 0) {
        cauiServices.add(row.service);
      }
    }
    for (const svc of cauiServices) {
      expect(serviceNames.has(svc), `CAUI service '${svc}' should be in service-names/distinct`).toBe(true);
    }
  });

  test('Budget-anomaly link: budget account IDs should reference known divisions', async ({ api }) => {
    test.setTimeout(30000);
    const budgets = await api.costUsage.getBudgets();
    if (budgets.length === 0) {
      test.info().annotations.push({ type: 'skip', description: 'No budgets available' });
      return;
    }
    const budgetRecord = budgets[0] as Record<string, unknown>;
    const budgetAccountId = budgetRecord.accountId || budgetRecord.linkedAccountId;
    const r = await api.context.get('/api/v1/divisions/i/', { params: { includeEmpty: 'true' } });
    const divisions = await r.json();
    const accMap = divisions.mapLinkedAccIdToDivisionName;
    if (budgetAccountId && typeof accMap === 'object' && accMap !== null) {
      const accIds = Object.keys(accMap);
      if (accIds.length > 0 && budgetAccountId) {
        expect(accIds).toContain(String(budgetAccountId));
      }
    }
  });

  test('Recommendation total integrity: /list/total should be >= list page count', async ({ api }) => {
    test.setTimeout(60000);
    const total = await api.costUsage.getRecommendationsTotal();
    const list = await api.recommendations.getRecommendationsList({ pageNumber: 1, pageSize: 100, sort: { property: 'annualSavings', direction: 'desc' } });
    const pageArray = (list.page as unknown[]) || [];
    expect(pageArray.length).toBeLessThanOrEqual(total);
    expect(total).toBeGreaterThanOrEqual(0);
  });

  test('Commitment dashboard → utilization summary: when KPIs show commitments, summary returns data', async ({ api }) => {
    test.setTimeout(30000);
    const dash = await api.finops.getCommitmentDashboard({ startDate: `${year}-01-01`, endDate: today });
    const kpis = (dash.kpis as Record<string, unknown>[]) || [];
    const hasCommitments = kpis.some(kpi => Number(kpi.value ?? 0) > 0);
    const summary = await api.finops.getCommitmentSummary({ date: today, commitmentType: 'sp', linkedAccount: '', payerAccount: '', commitmentServices: 'ComputeSavingsPlans' });
    if (hasCommitments) {
      expect(summary).toBeDefined();
      expect(summary).not.toEqual({});
    }
  });

  test('Notification config: user settings should align with notification list presence', async ({ api }) => {
    test.setTimeout(30000);
    const settings = await api.platform.getUserSettingsNotifications();
    const notifications = await api.platform.getUserNotifications();
    const rawData = (settings.userNotificationRawData as Record<string, unknown>[]) || [];
    if (rawData.length > 0 && rawData[0]?.enabled === false) return;
    expect(Array.isArray(notifications)).toBe(true);
  });

  test('Anomaly stats vs anomaly list: openAnomalies count should relate to list items', async ({ api }) => {
    test.setTimeout(30000);
    const stats = await api.finops.getAnomalyStats();
    const listResp = await api.monitoring.getAnomalyDetectionList({
      startDate: `${year}-01-01`, endDate: today, pageSize: '500', pageNumber: '0',
    });
    const openCount = stats.openAnomalies || 0;
    const anomalies = Array.isArray(listResp.anomalies) ? listResp.anomalies : [];
    if (openCount > 0) {
      expect(anomalies.length).toBeGreaterThanOrEqual(openCount * 0.5);
    }
  });

  test('Dimension config reuse: every dimension name works as a CAUI groupBy', async ({ api }) => {
    test.setTimeout(60000);
    const dc = await api.dashboard.getDimensionsConfig();
    const dimensions = (dc.dimensions as Record<string, unknown>[]) || [];
    const dimNames = dimensions.map(d => d.name as string).filter(Boolean);
    expect(dimNames.length).toBeGreaterThan(0);
    const validMetrics = ['cost', 'usage'];
    for (const dimName of dimNames.slice(0, 5)) {
      const r = await api.context.post('/api/v1/invoices/caui', {
        data: { granularity: 'Monthly', startDate: `${year}-01-01`, endDate: today, metrics: validMetrics, groupBy: [dimName] },
      });
      expect(r.ok(), `CAUI query with groupBy=${dimName} should succeed`).toBe(true);
      const data = await r.json();
      expect(Array.isArray(data)).toBe(true);
    }
  });

  test('Panel → dashboard link: every panel references an existing dashboard', async ({ api }) => {
    test.setTimeout(30000);
    const panels = await api.costUsage.getPanels();
    const dashboards = await api.dashboard.getDashboards();
    const dashIds = new Set<string>();
    for (const db of dashboards) {
      const id = (db as Record<string, unknown>).id;
      if (typeof id === 'string') dashIds.add(id);
    }
    for (const panel of panels) {
      const rec = panel as Record<string, unknown>;
      const dashUuid = rec.dashboardUuid || rec.dashboardId;
      if (dashUuid && typeof dashUuid === 'string' && dashUuid.length > 0 && dashIds.size > 0) {
        expect(dashIds.has(dashUuid), `Panel references dashboard ${dashUuid} which should exist`).toBe(true);
      }
    }
  });

  test('Vendor consistency: BYOD vendors list is stable between calls', async ({ api }) => {
    test.setTimeout(30000);
    const [v1, v2] = await Promise.all([
      api.dashboard.getByodVendors(),
      api.dashboard.getByodVendors(),
    ]);
    expect(v1.length).toBe(v2.length);
    for (let i = 0; i < v1.length; i++) {
      const a = v1[i] as Record<string, unknown>;
      const b = v2[i] as Record<string, unknown>;
      expect(a.name || a.id).toEqual(b.name || b.id);
    }
  });
});
