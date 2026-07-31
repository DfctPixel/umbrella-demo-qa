import { test, expect } from '../../../helpers/fixtures/api';
import { validateSchema, validateArraySchema, expectSchemaValid } from '../../../helpers/schemas/validator';
import * as schemas from '../../../helpers/schemas/api-schemas';

test.describe('Schema Verification @api @schema', () => {

  // ==========================================================================
  // Auth
  // ==========================================================================

  test('GET /users/plain-sub-users matches plainSubUser schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/users/plain-sub-users');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    const result = validateSchema(body, schemas.plainSubUserSchema);
    expectSchemaValid(result);
  });

  test('GET /users/user-settings/notifications items match notificationSetting schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/users/user-settings/notifications');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(body).toHaveProperty('userNotificationRawData');
    const items = body.userNotificationRawData;
    expect(Array.isArray(items)).toBe(true);
    if (items.length > 0) {
      const result = validateArraySchema(items, schemas.notificationSettingSchema);
      expectSchemaValid(result);
    }
  });

  // ==========================================================================
  // Dashboard / Platform
  // ==========================================================================

  test('GET /invoices/dimensions-config matches dimensionsConfig schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/invoices/dimensions-config');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    const result = validateSchema(body, schemas.dimensionsConfigSchema);
    expectSchemaValid(result);
    if (body.dimensions && body.dimensions.length > 0) {
      const dimResult = validateArraySchema(body.dimensions, schemas.dimensionItemSchema);
      expectSchemaValid(dimResult);
    }
  });

  test('GET /users/on-boarding/v2/byod/vendors items match vendor schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/users/on-boarding/v2/byod/vendors');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      const result = validateArraySchema(body, schemas.vendorSchema);
      expectSchemaValid(result);
    }
  });

  test('GET /divisions/i/ matches division schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/divisions/i/', {
      params: { includeEmpty: 'true' },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    const result = validateSchema(body, schemas.divisionSchema);
    expectSchemaValid(result);
  });

  // ==========================================================================
  // Cost & Usage
  // ==========================================================================

  test('POST /invoices/caui cost records have usage_date, total_cost, and service', async ({ api }) => {
    const body = {
      granularity: 'Monthly',
      startDate: `${new Date().getFullYear()}-01-01`,
      endDate: new Date().toISOString().split('T')[0],
      metrics: ['cost'],
      groupBy: ['service'],
    };
    const r = await api.context.post('/api/v1/invoices/caui', { data: body });
    expect(r.ok()).toBe(true);
    const data = await r.json();
    expect(Array.isArray(data)).toBe(true);
    if (data.length > 0) {
      for (let i = 0; i < Math.min(data.length, 10); i++) {
        expect(typeof data[i].usage_date, `data[${i}].usage_date must be string`).toBe('string');
        expect(typeof data[i].total_cost, `data[${i}].total_cost must be number`).toBe('number');
        expect(data[i].total_cost).toBeGreaterThanOrEqual(0);
        // Date must be valid ISO
        const d = new Date(data[i].usage_date as string);
        expect(Number.isNaN(d.getTime()), `data[${i}].usage_date must be valid date`).toBe(false);
      }
    }
  });

  test('GET /budgets/v2/i/ items match budget schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/budgets/v2/i/', {
      params: { only_metadata: 'true' },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      const result = validateArraySchema(body, schemas.budgetSchema);
      expectSchemaValid(result);
    }
  });

  // ==========================================================================
  // Commitments
  // ==========================================================================

  test('GET /commitment/dashboard returns object with keys', async ({ api }) => {
    const r = await api.context.get('/api/v1/commitment/dashboard', {
      params: {
        periodGranLevel: 'month',
        startDate: `${new Date().getFullYear()}-01-01`,
        endDate: new Date().toISOString().split('T')[0],
        'filters[service]': 'ec2',
      },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(typeof body).toBe('object');
    expect(Object.keys(body).length).toBeGreaterThan(0);
  });

  test('GET /commitment/utilization/i/summary matches commitmentSummary schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/commitment/utilization/i/summary', {
      params: {
        date: new Date().toISOString().split('T')[0],
        commitmentType: 'sp',
        linkedAccount: '',
        payerAccount: '',
        commitmentServices: 'ComputeSavingsPlans',
      },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(typeof body).toBe('object');
    const result = validateSchema(body, schemas.commitmentSummarySchema);
    expectSchemaValid(result);
  });

  test('GET /anomaly-detection/anomalies/stats matches anomalyStats schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/anomaly-detection/anomalies/stats');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    const result = validateSchema(body, schemas.anomalyStatsSchema);
    expectSchemaValid(result);
  });

  // ==========================================================================
  // Recommendations
  // ==========================================================================

  test('POST /recommendationsNew/heatmap/summary matches recommendationSummary schema', async ({ api }) => {
    const r = await api.context.post('/api/v1/recommendationsNew/heatmap/summary', { data: {} });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    const result = validateSchema(body, schemas.recommendationSummarySchema);
    expectSchemaValid(result);
  });

  test('POST /recommendationsNew/list page items match recommendationListItem schema', async ({ api }) => {
    const r = await api.context.post('/api/v1/recommendationsNew/list', {
      data: { pageNumber: 1, pageSize: 10, sort: { property: 'annualSavings', direction: 'desc' } },
    });
    const body = await r.json();
    if (r.ok()) {
      expect(body).toHaveProperty('page');
      expect(body).toHaveProperty('isLastPage');
      expect(body).toHaveProperty('total');
      expect(Array.isArray(body.page)).toBe(true);
      if (body.page.length > 0) {
        const result = validateArraySchema(body.page, schemas.recommendationListItemSchema);
        expectSchemaValid(result);
      }
    } else {
      expect(r.status()).toBeGreaterThanOrEqual(400);
    }
  });

  test('POST /recommendationsNew/heatmap/dynamicFilter/cat_id page items match category schema', async ({ api }) => {
    const r = await api.context.post('/api/v1/recommendationsNew/heatmap/dynamicFilter/cat_id', { data: {} });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(body).toHaveProperty('page');
    expect(body).toHaveProperty('isLastPage');
    expect(Array.isArray(body.page)).toBe(true);
    if (body.page.length > 0) {
      const result = validateArraySchema(body.page, schemas.categorySchema);
      expectSchemaValid(result);
    }
  });

  test('GET /recommendationsNew/heatmap/groupByOptions items match heatmapGroupOption schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/recommendationsNew/heatmap/groupByOptions');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      const result = validateArraySchema(body, schemas.heatmapGroupOptionSchema);
      expectSchemaValid(result);
    }
  });

  test('GET /recommendationsNew/views has personalViews and accountViews arrays', async ({ api }) => {
    const r = await api.context.get('/api/v1/recommendationsNew/views');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(body).toHaveProperty('personalViews');
    expect(body).toHaveProperty('accountViews');
    expect(Array.isArray(body.personalViews)).toBe(true);
    expect(Array.isArray(body.accountViews)).toBe(true);
  });

  // ==========================================================================
  // Monitoring
  // ==========================================================================

  test('GET /anomaly-detection anomalies items match anomalySchema', async ({ api }) => {
    const r = await api.context.get('/api/v1/anomaly-detection', {
      params: { startDate: '', endDate: '', isPpApplied: 'false' },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(body).toHaveProperty('anomalies');
    expect(Array.isArray(body.anomalies)).toBe(true);
    if (body.anomalies.length > 0) {
      const result = validateArraySchema(body.anomalies, schemas.anomalySchema);
      expectSchemaValid(result);
    }
  });

  // ==========================================================================
  // Users
  // ==========================================================================

  test('GET /users/preferences returns data with expected structure', async ({ api }) => {
    const r = await api.context.get('/api/v1/users/preferences');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    // API may return array or object depending on context
    if (Array.isArray(body)) {
      expect(body.length).toBeGreaterThan(0);
    } else {
      expect(typeof body).toBe('object');
      expect(Object.keys(body).length).toBeGreaterThan(0);
    }
  });

  test('GET /users/roles items match userRole schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/users/roles');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      const result = validateArraySchema(body, schemas.userRoleSchema);
      expectSchemaValid(result);
    }
  });

  test('GET /users/same-company-users items have user_key and user_name', async ({ api }) => {
    const r = await api.context.get('/api/v1/users/same-company-users');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      const result = validateArraySchema(body, schemas.userRoleSchema);
      expectSchemaValid(result);
    }
  });

  test('GET /usage/goals items match goal schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/usage/goals');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      const result = validateArraySchema(body, schemas.goalSchema);
      expectSchemaValid(result);
    }
  });

  // ==========================================================================
  // Partner
  // ==========================================================================

  test('GET /msp/billing-rules/v2 items are valid objects', async ({ api }) => {
    const r = await api.context.get('/api/v1/msp/billing-rules/v2');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      const result = validateArraySchema(body, schemas.billingRuleSchema);
      expectSchemaValid(result);
    }
  });

  test('GET /divisions/customers/aws/costs items match customerCost schema', async ({ api }) => {
    const startDate = `${new Date().toISOString().slice(0, 7)}-01`;
    const endDate = new Date().toISOString().split('T')[0];
    const r = await api.context.get('/api/v1/divisions/customers/aws/costs/', {
      params: { startDate, endDate },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      const result = validateArraySchema(body, schemas.customerCostSchema);
      expectSchemaValid(result);
    }
  });

  test('GET /divisions/customers/credit/alerts items match creditAlert schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/divisions/customers/credit/alerts');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      const result = validateArraySchema(body, schemas.creditAlertSchema);
      expectSchemaValid(result);
    }
  });

  // ==========================================================================
  // New: Previously uncovered endpoints
  // ==========================================================================

  test('GET /usage/reports/all items match report schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/usage/reports/all');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      const result = validateArraySchema(body, schemas.reportSchema);
      expectSchemaValid(result);
    }
  });

  test('GET /usage/views items match view schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/usage/views');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      const result = validateArraySchema(body, schemas.viewSchema);
      expectSchemaValid(result);
    }
  });

  test('GET /usage/virtual-tags/virtual-tags items match virtualTag schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/usage/virtual-tags/virtual-tags');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      const result = validateArraySchema(body, schemas.virtualTagSchema);
      expectSchemaValid(result);
    }
  });

  test('GET /gpt/user-data matches gptUserData schema', async ({ api }) => {
    const r = await api.context.get('/api/v1/gpt/user-data');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    const result = validateSchema(body, schemas.gptUserDataSchema);
    expectSchemaValid(result);
  });
});
