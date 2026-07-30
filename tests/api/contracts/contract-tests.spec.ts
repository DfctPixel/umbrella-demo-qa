import { test, expect } from '../../../helpers/fixtures/api';

test.describe('API Contract Tests @api @contract', () => {

  test('Content-Type: GET endpoints should return application/json', async ({ api }) => {
    test.setTimeout(30000);
    const endpoints = [
      '/api/v1/users/plain-sub-users',
      '/api/v1/invoices/service-names/distinct',
      '/api/v1/invoices/dimensions-config',
      '/api/v1/anomaly-detection/anomalies/stats',
    ];
    for (const ep of endpoints) {
      const r = await api.context.get(ep);
      expect(r.ok(), `${ep} should return 200`).toBe(true);
      const ct = r.headers()['content-type'];
      expect(ct, `${ep} Content-Type`).toBeDefined();
      expect(ct.toLowerCase(), `${ep} should return json`).toContain('application/json');
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
    const r = await api.context.post('/api/v1/invoices/caui', {
      data: { granularity: 'Monthly', startDate: `${new Date().getFullYear()}-01-01`, endDate: new Date().toISOString().split('T')[0], metrics: ['cost'], groupBy: ['service'] },
    });
    const elapsed = performance.now() - start;
    expect(r.ok()).toBe(true);
    expect(elapsed).toBeLessThan(15000);
  });

  test('No sensitive data leakage: responses should not contain password or token fields', async ({ api }) => {
    test.setTimeout(30000);
    const endpoints = [
      '/api/v1/users/plain-sub-users',
      '/api/v1/users/notifications',
      '/api/v1/usage/custom-dashboard/dashboards',
    ];
    for (const ep of endpoints) {
      const r = await api.context.get(ep);
      expect(r.ok(), `${ep} should return 200`).toBe(true);
      const body = await r.json();
      const text = JSON.stringify(body).toLowerCase();
      expect(text, `${ep} must not leak password`).not.toContain('"password"');
      expect(text, `${ep} must not leak token`).not.toContain('"token"');
    }
  });

  test('Concurrent requests: 5 parallel GETs to different endpoints should all return 200', async ({ api }) => {
    test.setTimeout(30000);
    const endpoints = [
      '/api/v1/users/plain-sub-users',
      '/api/v1/invoices/service-names/distinct',
      '/api/v1/invoices/dimensions-config',
      '/api/v1/anomaly-detection/anomalies/stats',
      '/api/v1/usage/custom-dashboard/dashboards',
    ];
    const responses = await Promise.all(endpoints.map(ep => api.context.get(ep)));
    for (let i = 0; i < responses.length; i++) {
      expect(responses[i].status(), `${endpoints[i]} should return 200`).toBe(200);
    }
  });

  test('Status code consistency: authenticated GETs should return 200, not 302 or 304', async ({ api }) => {
    test.setTimeout(30000);
    const endpoints = [
      '/api/v1/users/plain-sub-users',
      '/api/v1/invoices/dimensions-config',
      '/api/v1/anomaly-detection/anomalies/stats',
      '/api/v1/usage/custom-dashboard/dashboards',
    ];
    for (const ep of endpoints) {
      const r = await api.context.get(ep);
      expect(r.status(), `${ep} should return 200`).toBe(200);
    }
  });

  test('Response body size: large responses (CAUI daily) should be under 5MB @performance', async ({ api }) => {
    test.setTimeout(60000);
    const r = await api.context.post('/api/v1/invoices/caui', {
      data: { granularity: 'Daily', startDate: `${new Date().getFullYear()}-01-01`, endDate: new Date().toISOString().split('T')[0], metrics: ['cost', 'usage'], groupBy: ['service'] },
    });
    expect(r.ok()).toBe(true);
    const body = await r.body();
    const sizeMB = body.length / (1024 * 1024);
    expect(sizeMB).toBeLessThan(5);
  });
});
