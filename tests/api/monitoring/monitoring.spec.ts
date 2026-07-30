import { test, expect } from '../../../helpers/fixtures/api';

test.describe('Monitoring @api', () => {

  test('GET /anomaly-detection — returns anomalies with valid structure', async ({ api }) => {
    const r = await api.context.get('/api/v1/anomaly-detection', {
      params: { startDate: '', endDate: '', isPpApplied: 'false' },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(body.anomalies, 'anomalies array required').toBeDefined();
    expect(Array.isArray(body.anomalies)).toBe(true);
    if (body.anomalies.length > 0) {
      const a = body.anomalies[0];
      expect(a.id || a.anomalyId, 'anomaly must have id').toBeDefined();
      expect(a.service, 'anomaly must reference a service').toBeDefined();
      expect(a.costImpact, 'anomaly costImpact required').toBeGreaterThanOrEqual(0);
    }
  });

  test('GET /anomaly-detection?isPageCount=true — count is consistent with list length', async ({ api }) => {
    const [countR, listR] = await Promise.all([
      api.context.get('/api/v1/anomaly-detection', {
        params: { startDate: '', endDate: '', isPpApplied: 'false', isPageCount: 'true' },
      }),
      api.context.get('/api/v1/anomaly-detection', {
        params: { startDate: '', endDate: '', isPpApplied: 'false', pageNumber: '0', pageSize: '500' },
      }),
    ]);
    expect(countR.ok()).toBe(true);
    expect(listR.ok()).toBe(true);
    const countBody = await countR.json();
    const listBody = await listR.json();
    expect(typeof countBody.count).toBe('number');
    expect(countBody.count).toBeGreaterThanOrEqual(0);
    const listLen = Array.isArray(listBody.anomalies) ? listBody.anomalies.length : 0;
    // Page count should be >= the items returned in a single page
    expect(countBody.count).toBeGreaterThanOrEqual(listLen);
  });

  test('GET /anomaly-detection?alerted=true — all returned anomalies have isAlerted set', async ({ api }) => {
    const r = await api.context.get('/api/v1/anomaly-detection', {
      params: { alerted: 'true', startDate: '', endDate: '', isPpApplied: 'false' },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body.anomalies)).toBe(true);
    for (const a of body.anomalies) {
      expect(a.isAlerted, 'every alerted=true anomaly must have isAlerted=true').toBe(true);
    }
  });

  test('GET /anomaly-detection/rules — each rule has name and defined state', async ({ api }) => {
    const r = await api.context.get('/api/v1/anomaly-detection/rules');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      for (const rule of body) {
        expect(rule.ruleName || rule.name, 'rule must have a name').toBeDefined();
        expect(rule).toHaveProperty('isEnabled');
      }
    }
  });

  test('GET /channels and /workflow/available-workflow-channels — channels are non-empty objects', async ({ api }) => {
    const [cr, wr] = await Promise.all([
      api.context.get('/api/v1/channels'),
      api.context.get('/api/v1/workflow/available-workflow-channels'),
    ]);
    expect(cr.ok()).toBe(true);
    expect(wr.ok()).toBe(true);
    const channels = await cr.json();
    const workflow = await wr.json();
    expect(Array.isArray(channels)).toBe(true);
    expect(Array.isArray(workflow)).toBe(true);
    // Every channel should have at minimum an id
    for (const ch of channels) {
      expect(ch.id || ch.name, 'channel must have id or name').toBeDefined();
    }
  });

  test('GET /usage/alerts — each alert should have an id', async ({ api }) => {
    const r = await api.context.get('/api/v1/usage/alerts');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      expect(body[0].id || body[0].alertId, 'alert must have an id').toBeDefined();
    }
  });
});
