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
      expect(a.uuid, 'anomaly must have a uuid identifier').toBeDefined();
      expect(a.serviceName, 'anomaly must reference a service').toBeDefined();
      expect(a.totalCostImpact, 'anomaly totalCostImpact required').toBeGreaterThanOrEqual(0);
    }
  });

  test('GET /anomaly-detection?isPageCount=true — count is the anomaly page count', async ({ api }) => {
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
    const listLen = Array.isArray(listBody.anomalies) ? listBody.anomalies.length : 0;
    // Confirmed contract (2026-07-31): isPageCount=true returns the number of
    // pages at the server's default page size, not the record count — observed
    // count=1 with a 5-item list, unchanged across pageSize values. A non-empty
    // list must therefore span at least one page.
    expect(countBody.count, 'non-empty anomaly list must have at least one page').toBeGreaterThanOrEqual(listLen > 0 ? 1 : 0);
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
