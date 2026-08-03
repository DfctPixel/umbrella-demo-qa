import { test, expect } from '../../../helpers/fixtures/api';
import { ANONYMOUS_APIKEY } from '../../../helpers/auth/apikey';

/**
 * Endpoint-specific request builders matching the real browser/API contract.
 *
 * plain-sub-users requires the anonymous apikey header (the authenticated
 * scoped apikey is rejected with 400).  CAUI uses periodGranLevel/costType
 * instead of the obsolete granularity/metrics shape.
 */
const YEAR = new Date().getFullYear();
const TODAY = new Date().toISOString().split('T')[0];

function requestPlainSubUsers(ctx: import('@playwright/test').APIRequestContext) {
  return ctx.get('/api/v1/users/plain-sub-users', {
    headers: { apikey: ANONYMOUS_APIKEY },
  });
}

function requestServiceNames(ctx: import('@playwright/test').APIRequestContext) {
  return ctx.get('/api/v1/invoices/service-names/distinct');
}

function requestDimensionsConfig(ctx: import('@playwright/test').APIRequestContext) {
  return ctx.get('/api/v1/invoices/dimensions-config', { params: { isPpApplied: 'false' } });
}

function requestAnomalyStats(ctx: import('@playwright/test').APIRequestContext) {
  return ctx.get('/api/v1/anomaly-detection/anomalies/stats', { params: { isPpApplied: 'false' } });
}

function requestDashboards(ctx: import('@playwright/test').APIRequestContext) {
  return ctx.get('/api/v1/usage/custom-dashboard/dashboards');
}

function requestNotifications(ctx: import('@playwright/test').APIRequestContext) {
  return ctx.get('/api/v1/users/notifications');
}

const GET_BUILDERS: Array<{ name: string; call: (ctx: import('@playwright/test').APIRequestContext) => Promise<import('@playwright/test').APIResponse> }> = [
  { name: 'plain-sub-users', call: requestPlainSubUsers },
  { name: 'service-names/distinct', call: requestServiceNames },
  { name: 'dimensions-config', call: requestDimensionsConfig },
  { name: 'anomaly-stats', call: requestAnomalyStats },
  { name: 'custom-dashboard/dashboards', call: requestDashboards },
  { name: 'notifications', call: requestNotifications },
];

function cauiPayload(granularity: 'day' | 'month'): Record<string, unknown> {
  return {
    periodGranLevel: granularity,
    startDate: `${YEAR}-01-01`,
    endDate: TODAY,
    costType: 'total',
    groupBy: ['service'],
  };
}

test.describe('API Contract Tests @api @contract', () => {

  test('Content-Type: GET endpoints should return application/json @smoke', async ({ api }) => {
    test.setTimeout(30000);
    for (const ep of GET_BUILDERS) {
      const r = await ep.call(api.context);
      expect(r.ok(), `${ep.name} should return 200 (got ${r.status()})`).toBe(true);
      const ct = r.headers()['content-type'];
      expect(ct, `${ep.name} Content-Type`).toBeDefined();
      expect(ct.toLowerCase(), `${ep.name} should return json`).toContain('application/json');
    }
  });

  test('Response time: plain-sub-users should respond within 5 seconds @performance', async ({ api }) => {
    test.setTimeout(15000);
    const start = performance.now();
    const r = await requestPlainSubUsers(api.context);
    const elapsed = performance.now() - start;
    expect(r.ok(), `plain-sub-users should return 200 (got ${r.status()})`).toBe(true);
    expect(elapsed).toBeLessThan(5000);
  });

  test('Response time: POST invoices/caui (monthly) should respond within 15 seconds @performance', async ({ api }) => {
    test.setTimeout(30000);
    const start = performance.now();
    const r = await api.context.post('/api/v1/invoices/caui', { data: cauiPayload('month') });
    const elapsed = performance.now() - start;
    expect(r.ok(), `caui should return 200 (got ${r.status()})`).toBe(true);
    expect(elapsed).toBeLessThan(15000);
  });

  test('No sensitive data leakage: responses should not contain password or token fields', async ({ api }) => {
    test.setTimeout(30000);
    for (const ep of GET_BUILDERS) {
      const r = await ep.call(api.context);
      expect(r.ok(), `${ep.name} should return 200 (got ${r.status()})`).toBe(true);
      const body = await r.json();
      const text = JSON.stringify(body).toLowerCase();
      expect(text, `${ep.name} must not leak password`).not.toContain('"password"');
      expect(text, `${ep.name} must not leak token`).not.toContain('"token"');
    }
  });

  test('Concurrent requests: 5 parallel GETs to different endpoints should all return 200', async ({ api }) => {
    test.setTimeout(30000);
    const responses = await Promise.all(GET_BUILDERS.map(ep => ep.call(api.context)));
    for (let i = 0; i < responses.length; i++) {
      expect(responses[i].status(), `${GET_BUILDERS[i].name} should return 200`).toBe(200);
    }
  });

  test('Status code consistency: authenticated GETs should return 200, not 302 or 304', async ({ api }) => {
    test.setTimeout(30000);
    for (const ep of GET_BUILDERS) {
      const r = await ep.call(api.context);
      expect(r.status(), `${ep.name} should return 200`).toBe(200);
    }
  });

  test('Response body size: large responses (CAUI daily) should be under 5MB @performance', async ({ api }) => {
    test.setTimeout(60000);
    const r = await api.context.post('/api/v1/invoices/caui', { data: cauiPayload('day') });
    expect(r.ok(), `caui daily should return 200 (got ${r.status()})`).toBe(true);
    const body = await r.body();
    const sizeMB = body.length / (1024 * 1024);
    expect(sizeMB).toBeLessThan(5);
  });
});
