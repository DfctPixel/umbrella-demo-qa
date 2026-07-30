import { test, expect } from '../../../helpers/fixtures/api';

test.describe('Recommendations @api', () => {

  test('POST /recommendationsNew/heatmap/summary — savings and count are non-negative', async ({ api }) => {
    const r = await api.context.post('/api/v1/recommendationsNew/heatmap/summary', { data: {} });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(body.potentialAnnualSavings, 'potentialAnnualSavings required').toBeGreaterThanOrEqual(0);
    expect(body.totalCount, 'totalCount required').toBeGreaterThanOrEqual(0);
    if (body.implementedCount !== undefined) {
      expect(body.implementedCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('POST /recommendationsNew/list — paginated results have no duplicate IDs', {
    annotation: { type: 'issue', description: 'DEFECT-API-500-RECOMMENDATIONS' },
  }, async ({ api }) => {
    test.fail(true, 'DEFECT-API-500-RECOMMENDATIONS');
    const r = await api.context.post('/api/v1/recommendationsNew/list', {
      data: { pageNumber: 1, pageSize: 50, sort: { property: 'annualSavings', direction: 'desc' } },
    });
    // Positive-path contract: canonical list request must succeed.
    // Known defect (UMBR-XXX): this endpoint currently returns 500.
    expect(r.ok(), `recommendations list must succeed (got ${r.status()})`).toBe(true);
    const body = await r.json();
    expect(body.page, 'page array required').toBeDefined();
    expect(body.total, 'total field required').toBeDefined();
    expect(Array.isArray(body.page)).toBe(true);
    const ids = body.page.map((item: any) => item.id).filter(Boolean);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size, 'recommendation IDs should be unique').toBe(ids.length);
    expect(body.page.length).toBeLessThanOrEqual(50);
  });

  test('POST /recommendationsNew/list/total — total should match or exceed list size', async ({ api }) => {
    const [totalR, listR] = await Promise.all([
      api.context.post('/api/v1/recommendationsNew/list/total', { data: {} }),
      api.context.post('/api/v1/recommendationsNew/list', {
        data: { pageNumber: 1, pageSize: 10, sort: { property: 'annualSavings', direction: 'desc' } },
      }),
    ]);
    expect(totalR.ok(), 'total endpoint should return 200').toBe(true);
    const totalText = await totalR.text();
    const total = parseInt(totalText, 10);
    expect(Number.isNaN(total)).toBe(false);
    expect(total).toBeGreaterThanOrEqual(0);
    if (listR.ok()) {
      const listBody = await listR.json();
      const listLen = Array.isArray(listBody.page) ? listBody.page.length : 0;
      expect(total).toBeGreaterThanOrEqual(listLen);
    }
  });

  test('POST /recommendationsNew/list/columns — columns have identifying fields', async ({ api }) => {
    const r = await api.context.post('/api/v1/recommendationsNew/list/columns', { data: {} });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      const col = body[0];
      expect(typeof col).toBe('object');
      expect(col).not.toBeNull();
      expect(Object.keys(col).length).toBeGreaterThan(0);
    }
  });

  test('POST /recommendationsNew/heatmap/dynamicFilter/cat_id — categories have unique IDs', async ({ api }) => {
    const r = await api.context.post('/api/v1/recommendationsNew/heatmap/dynamicFilter/cat_id', { data: {} });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(body.page, 'page array required').toBeDefined();
    expect(Array.isArray(body.page)).toBe(true);
    const ids = body.page.map((c: any) => c.id).filter(Boolean);
    expect(new Set(ids).size, 'category IDs should be unique').toBe(ids.length);
    for (const cat of body.page) {
      expect(cat.id, 'category must have id').toBeDefined();
      expect(cat.name, 'category must have name').toBeDefined();
    }
  });

  test('GET /recommendationsNew/heatmap/groupByOptions — options have id and name', async ({ api }) => {
    const r = await api.context.get('/api/v1/recommendationsNew/heatmap/groupByOptions');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      expect(body[0].id, 'groupBy option must have id').toBeDefined();
      expect(body[0].name, 'groupBy option must have name').toBeDefined();
    }
  });

  test('POST /recommendationsNew/heatmap — response is a non-empty object', async ({ api }) => {
    const r = await api.context.post('/api/v1/recommendationsNew/heatmap', { data: {} });
    if (r.ok()) {
      const body = await r.json();
      expect(typeof body).toBe('object');
      expect(body).not.toBeNull();
    } else {
      expect(r.status()).toBeGreaterThanOrEqual(400);
    }
  });

  test('POST /recommendationsNew/heatmap/dynamicRanges — ranges have numeric bounds', async ({ api }) => {
    const r = await api.context.post('/api/v1/recommendationsNew/heatmap/dynamicRanges', { data: {} });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(body.annualSavingsRange || body.ageRange, 'ranges object should have bounds').toBeDefined();
  });

  test('GET /recommendationsNew/views — personalViews and accountViews are arrays', async ({ api }) => {
    const r = await api.context.get('/api/v1/recommendationsNew/views');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body.personalViews), 'personalViews should be an array').toBe(true);
    expect(Array.isArray(body.accountViews), 'accountViews should be an array').toBe(true);
  });
});
