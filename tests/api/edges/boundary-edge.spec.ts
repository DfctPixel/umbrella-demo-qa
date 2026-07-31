import { test, expect } from '../../../helpers/fixtures/api';

test.describe('Boundary & Edge Cases @api @edge', () => {
  const currentYear = new Date().getFullYear();
  const today = new Date().toISOString().split('T')[0];

  // ─── 1. Date boundary tests for CAUI ────────────────────────────────────────

  test('CAUI — startDate = endDate (single-day range) should return valid array', async ({ api }) => {
    const r = await api.context.post('/api/v1/invoices/caui', {
      data: { granularity: 'Daily', startDate: today, endDate: today, metrics: ['cost'], groupBy: ['service'] },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('CAUI — far-past startDate (2020-01-01) should return valid or empty', async ({ api }) => {
    const r = await api.context.post('/api/v1/invoices/caui', {
      data: { granularity: 'Monthly', startDate: '2020-01-01', endDate: '2020-02-01', metrics: ['cost'], groupBy: ['service'] },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('CAUI — far-future endDate (2099-12-31) — contract TBD', async ({ api }) => {
    const r = await api.context.post('/api/v1/invoices/caui', {
      data: { granularity: 'Monthly', startDate: `${currentYear}-01-01`, endDate: '2099-12-31', metrics: ['cost'], groupBy: ['service'] },
    });
    // Contract not yet defined: the API owner must decide whether far-future dates
    // should succeed (200) or be rejected (4xx). Currently observed: 400.
    // Do not encode either result as the contract until the decision is made.
    if (r.ok()) {
      const body = await r.json();
      expect(Array.isArray(body)).toBe(true);
    } else {
      const text = await r.text();
      expect(text.length).toBeGreaterThan(0);
    }
  });

  test('CAUI — flipped dates (startDate > endDate) — contract TBD', async ({ api }) => {
    const r = await api.context.post('/api/v1/invoices/caui', {
      data: { granularity: 'Monthly', startDate: `${currentYear}-06-01`, endDate: `${currentYear}-01-01`, metrics: ['cost'], groupBy: ['service'] },
    });
    // Contract not yet defined: the API owner must decide whether reversed dates
    // should be rejected (4xx) or interpreted leniently (200). Currently observed: 200.
    if (r.ok()) {
      const body = await r.json();
      expect(Array.isArray(body)).toBe(true);
    } else {
      const text = await r.text();
      expect(text.length).toBeGreaterThan(0);
    }
  });

  // ─── 2. Date boundary tests for anomaly-detection ───────────────────────────

  test('Anomaly-detection — very wide date range (2 years) should return structured response', async ({ api }) => {
    const r = await api.context.get('/api/v1/anomaly-detection', {
      params: { startDate: `${currentYear - 1}-01-01`, endDate: `${currentYear}-12-31`, isPpApplied: 'false', pageNumber: '1', pageSize: '10' },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(body).toHaveProperty('anomalies');
    expect(Array.isArray(body.anomalies)).toBe(true);
  });

  test('Anomaly-detection — reversed dates should return 400', async ({ api }) => {
    const r = await api.context.get('/api/v1/anomaly-detection', {
      params: { startDate: `${currentYear}-06-01`, endDate: `${currentYear}-01-01`, isPpApplied: 'false' },
    });
    expect(r.status(), 'reversed anomaly date range should be rejected').toBe(400);
  });

  test('Anomaly-detection — missing date params entirely should return structured response', async ({ api }) => {
    const r = await api.context.get('/api/v1/anomaly-detection', {
      params: { isPpApplied: 'false', pageNumber: '1', pageSize: '10' },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(body).toHaveProperty('anomalies');
    expect(Array.isArray(body.anomalies)).toBe(true);
  });

  // ─── 3. Pagination boundary tests for recommendations/list ──────────────────

  test('Recommendations/list — pageNumber: 0 should return 400', async ({ api }) => {
    const r = await api.context.post('/api/v1/recommendationsNew/list', {
      data: { pageNumber: 0, pageSize: 10, sort: { property: 'annualSavings', direction: 'desc' } },
    });
    expect(r.status(), 'pageNumber 0 should be rejected (got ' + r.status() + ')').toBe(400);
  });

  test('Recommendations/list — pageSize: 0 should return 400', async ({ api }) => {
    const r = await api.context.post('/api/v1/recommendationsNew/list', {
      data: { pageNumber: 1, pageSize: 0, sort: { property: 'annualSavings', direction: 'desc' } },
    });
    expect(r.status(), 'pageSize 0 should be rejected (got ' + r.status() + ')').toBe(400);
  });

  test('Recommendations/list — pageSize: 1000 should succeed', {
    annotation: { type: 'issue', description: 'DEFECT-API-500-RECOMMENDATIONS' },
  }, async ({ api }) => {
    test.fail(true, 'DEFECT-API-500-RECOMMENDATIONS');
    const r = await api.context.post('/api/v1/recommendationsNew/list', {
      data: { pageNumber: 1, pageSize: 1000, sort: { property: 'annualSavings', direction: 'desc' } },
    });
    expect(r.ok(), `large pageSize should succeed (got ${r.status()})`).toBe(true);
    const body = await r.json();
    expect(body).toHaveProperty('page');
    expect(body).toHaveProperty('isLastPage');
    expect(Array.isArray(body.page)).toBe(true);
  });

  test('Recommendations/list — pageNumber: -1 (negative) should return 400', async ({ api }) => {
    const r = await api.context.post('/api/v1/recommendationsNew/list', {
      data: { pageNumber: -1, pageSize: 10, sort: { property: 'annualSavings', direction: 'desc' } },
    });
    expect(r.status(), 'negative pageNumber should be rejected (got ' + r.status() + ')').toBe(400);
  });

  // ─── 4. Pagination boundary tests for anomaly-detection ─────────────────────

  test('Anomaly-detection — isPageCount=true with no date range should return count', async ({ api }) => {
    const r = await api.context.get('/api/v1/anomaly-detection', {
      params: { isPpApplied: 'false', isPageCount: 'true' },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(body).toHaveProperty('count');
    expect(typeof body.count).toBe('number');
    expect(body.count).toBeGreaterThanOrEqual(0);
  });

  test('Anomaly-detection — isPageCount=false should return anomalies or count', async ({ api }) => {
    const r = await api.context.get('/api/v1/anomaly-detection', {
      params: { isPpApplied: 'false', isPageCount: 'false', pageNumber: '1', pageSize: '5' },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    if ('anomalies' in body) {
      expect(Array.isArray(body.anomalies)).toBe(true);
    } else if ('count' in body) {
      expect(typeof body.count).toBe('number');
      expect(body.count).toBeGreaterThanOrEqual(0);
    } else {
      throw new Error(`Expected anomalies or count but got: ${JSON.stringify(Object.keys(body))}`);
    }
  });

  // ─── 5. Empty/null param tests ──────────────────────────────────────────────

  test('Divisions — includeEmpty="" (empty string) should return structured object', async ({ api }) => {
    const r = await api.context.get('/api/v1/divisions/i/', { params: { includeEmpty: '' } });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(body).toHaveProperty('preparedRawDivisions');
    expect(body).toHaveProperty('mapLinkedAccIdToDivisionName');
  });

  test('Divisions — without includeEmpty param should return structured object', async ({ api }) => {
    const r = await api.context.get('/api/v1/divisions/i/');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(body).toHaveProperty('preparedRawDivisions');
    expect(body).toHaveProperty('mapLinkedAccIdToDivisionName');
  });

  test('Recommendations/list — missing sort field should succeed with default sort', async ({ api }) => {
    const r = await api.context.post('/api/v1/recommendationsNew/list', {
      data: { pageNumber: 1, pageSize: 10 },
    });
    expect(r.ok(), `missing sort should be accepted (got ${r.status()})`).toBe(true);
    const body = await r.json();
    expect(body).toHaveProperty('page');
    expect(Array.isArray(body.page)).toBe(true);
  });

  test('Recommendations/list — empty pageNumber should return 400', async ({ api }) => {
    const r = await api.context.post('/api/v1/recommendationsNew/list', {
      data: { pageSize: 10, sort: { property: 'annualSavings', direction: 'desc' } },
    });
    expect(r.status(), 'missing pageNumber should be rejected (got ' + r.status() + ')').toBe(400);
  });

  // ─── 6. Large payload / performance tests ───────────────────────────────────

  test('CAUI — daily granularity for full year should respond under 10s', async ({ api }) => {
    test.slow();
    test.setTimeout(30000);
    const start = Date.now();
    const r = await api.context.post('/api/v1/invoices/caui', {
      data: { granularity: 'Daily', startDate: `${currentYear}-01-01`, endDate: today, metrics: ['cost'], groupBy: ['service'] },
    });
    const elapsed = Date.now() - start;
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    expect(elapsed).toBeLessThan(10000);
  });

  test('CAUI — daily granularity with multiple groupBy fields should respond under 10s', async ({ api }) => {
    test.slow();
    test.setTimeout(30000);
    const start = Date.now();
    const r = await api.context.post('/api/v1/invoices/caui', {
      data: { granularity: 'Daily', startDate: `${currentYear}-01-01`, endDate: today, metrics: ['cost', 'usage'], groupBy: ['service', 'region'] },
    });
    const elapsed = Date.now() - start;
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    expect(elapsed).toBeLessThan(10000);
  });

  // ─── 7. Concurrency / timing tests ──────────────────────────────────────────

  test('Concurrency — 3 parallel requests to same GET endpoint should all return 200', async ({ api }) => {
    const promises = [1, 2, 3].map(() => api.context.get('/api/v1/channels'));
    const results = await Promise.all(promises);
    for (const r of results) {
      expect(r.ok()).toBe(true);
      const body = await r.json();
      expect(Array.isArray(body)).toBe(true);
    }
  });

  test('Idempotency — 2 identical POST requests return same total', {
    annotation: { type: 'issue', description: 'DEFECT-API-500-RECOMMENDATIONS' },
  }, async ({ api }) => {
    test.fail(true, 'DEFECT-API-500-RECOMMENDATIONS');
    const payload = { pageNumber: 1, pageSize: 5, sort: { property: 'annualSavings', direction: 'desc' } };
    const [r1, r2] = await Promise.all([
      api.context.post('/api/v1/recommendationsNew/list', { data: payload }),
      api.context.post('/api/v1/recommendationsNew/list', { data: payload }),
    ]);
    expect(r1.ok(), `first request must succeed (got ${r1.status()})`).toBe(true);
    expect(r2.ok(), `second request must succeed (got ${r2.status()})`).toBe(true);
    const b1 = await r1.json();
    const b2 = await r2.json();
    expect(b1).toHaveProperty('total');
    expect(b2).toHaveProperty('total');
    expect(b1.total).toBe(b2.total);
  });

  // ─── 8. Consistency / isolation tests ───────────────────────────────────────

  test('Plain-sub-users — repeated calls should return same user', async ({ api }) => {
    const r1 = await api.context.get('/api/v1/users/plain-sub-users');
    const r2 = await api.context.get('/api/v1/users/plain-sub-users');
    expect(r1.ok()).toBe(true);
    expect(r2.ok()).toBe(true);
    const user1 = await r1.json();
    const user2 = await r2.json();
    expect(user1.id).toBe(user2.id);
    expect(user1.user_key).toBe(user2.user_key);
  });

  test('Anomaly-detection page count — two calls within 5s should return consistent count', async ({ api }) => {
    const params = { isPpApplied: 'false', isPageCount: 'true' };
    const [r1, r2] = await Promise.all([
      api.context.get('/api/v1/anomaly-detection', { params }),
      api.context.get('/api/v1/anomaly-detection', { params }),
    ]);
    expect(r1.ok()).toBe(true);
    expect(r2.ok()).toBe(true);
    const b1 = await r1.json();
    const b2 = await r2.json();
    expect(b1).toHaveProperty('count');
    expect(b2).toHaveProperty('count');
    expect(b1.count).toBe(b2.count);
  });
});
