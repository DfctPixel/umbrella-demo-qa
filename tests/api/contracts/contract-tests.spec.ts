import { test, expect } from '../../../helpers/fixtures/api';

interface RequestSpec {
  url: string;
  method: 'get' | 'post';
  params?: Record<string, string>;
  data?: Record<string, unknown>;
}

function fetch(r: RequestSpec, ctx: import('@playwright/test').APIRequestContext) {
  if (r.method === 'post') {
    return ctx.post(r.url, { params: r.params, data: r.data });
  }
  return ctx.get(r.url, { params: r.params });
}

/** Endpoints that return structured data without additional query parameters. */
const STATELESS_ENDPOINTS: RequestSpec[] = [
  { url: '/api/v1/users/plain-sub-users', method: 'get' },
  { url: '/api/v1/invoices/service-names/distinct', method: 'get' },
  { url: '/api/v1/invoices/dimensions-config', method: 'get', params: { isPpApplied: 'false' } },
  { url: '/api/v1/anomaly-detection/anomalies/stats', method: 'get', params: { isPpApplied: 'false' } },
  { url: '/api/v1/usage/custom-dashboard/dashboards', method: 'get' },
  { url: '/api/v1/users/notifications', method: 'get' },
];

const CAUI_MONTHLY_PAYLOAD = {
  granularity: 'Monthly' as const,
  startDate: `${new Date().getFullYear()}-01-01`,
  endDate: new Date().toISOString().split('T')[0],
  metrics: ['cost'] as string[],
  groupBy: ['service'] as string[],
};

test.describe('API Contract Tests @api @contract', () => {

  test('Content-Type: GET endpoints should return application/json', async ({ api }) => {
    test.setTimeout(30000);
    for (const ep of STATELESS_ENDPOINTS) {
      const r = await fetch(ep, api.context);
      expect(r.ok(), `${ep.url} should return 200`).toBe(true);
      const ct = r.headers()['content-type'];
      expect(ct, `${ep.url} Content-Type`).toBeDefined();
      expect(ct.toLowerCase(), `${ep.url} should return json`).toContain('application/json');
    }
  });

  test('Response time: plain-sub-users should respond within 5 seconds @performance', async ({ api }) => {
    test.setTimeout(15000);
    const start = performance.now();
    const r = await api.context.get('/api/v1/users/plain-sub-users');
    const elapsed = performance.now() - start;
    expect(r.ok()).toBe(true);
    expect(elapsed).toBeLessThan(5000);
  });

  test('Response time: POST invoices/caui (monthly) should respond within 15 seconds @performance', async ({ api }) => {
    test.setTimeout(30000);
    const start = performance.now();
    const r = await api.context.post('/api/v1/invoices/caui', { data: CAUI_MONTHLY_PAYLOAD });
    const elapsed = performance.now() - start;
    expect(r.ok()).toBe(true);
    expect(elapsed).toBeLessThan(15000);
  });

  test('No sensitive data leakage: responses should not contain password or token fields', async ({ api }) => {
    test.setTimeout(30000);
    for (const ep of STATELESS_ENDPOINTS) {
      const r = await fetch(ep, api.context);
      expect(r.ok(), `${ep.url} should return 200`).toBe(true);
      const body = await r.json();
      const text = JSON.stringify(body).toLowerCase();
      expect(text, `${ep.url} must not leak password`).not.toContain('"password"');
      expect(text, `${ep.url} must not leak token`).not.toContain('"token"');
    }
  });

  test('Concurrent requests: 5 parallel GETs to different endpoints should all return 200', async ({ api }) => {
    test.setTimeout(30000);
    const responses = await Promise.all(STATELESS_ENDPOINTS.map(ep => fetch(ep, api.context)));
    for (let i = 0; i < responses.length; i++) {
      expect(responses[i].status(), `${STATELESS_ENDPOINTS[i].url} should return 200`).toBe(200);
    }
  });

  test('Status code consistency: authenticated GETs should return 200, not 302 or 304', async ({ api }) => {
    test.setTimeout(30000);
    for (const ep of STATELESS_ENDPOINTS) {
      const r = await fetch(ep, api.context);
      expect(r.status(), `${ep.url} should return 200`).toBe(200);
    }
  });

  test('Response body size: large responses (CAUI daily) should be under 5MB @performance', async ({ api }) => {
    test.setTimeout(60000);
    const r = await api.context.post('/api/v1/invoices/caui', {
      data: {
        granularity: 'Daily',
        startDate: `${new Date().getFullYear()}-01-01`,
        endDate: new Date().toISOString().split('T')[0],
        metrics: ['cost', 'usage'],
        groupBy: ['service'],
      },
    });
    expect(r.ok()).toBe(true);
    const body = await r.body();
    const sizeMB = body.length / (1024 * 1024);
    expect(sizeMB).toBeLessThan(5);
  });
});
