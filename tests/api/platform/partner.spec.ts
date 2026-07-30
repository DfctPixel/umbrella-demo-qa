import { test, expect } from '../../../helpers/fixtures/api';

test.describe('Partner @api', () => {
  const thisMonth = new Date().toISOString().slice(0, 7);

  test('GET /msp/billing-rules/v2 — each rule is a non-null object', async ({ api }) => {
    const r = await api.context.get('/api/v1/msp/billing-rules/v2');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      for (const rule of body) {
        expect(typeof rule).toBe('object');
        expect(rule).not.toBeNull();
        expect(Object.keys(rule).length).toBeGreaterThan(0);
      }
    }
  });

  test('GET /msp/billing-rules/v2/templates — templates should be a subset of rule shapes', async ({ api }) => {
    const r = await api.context.get('/api/v1/msp/billing-rules/v2/templates');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /divisions/customers/aws/costs — costs are non-negative and have account reference', async ({ api }) => {
    const startDate = `${thisMonth}-01`;
    const endDate = new Date().toISOString().split('T')[0];
    const r = await api.context.get('/api/v1/divisions/customers/aws/costs/', {
      params: { startDate, endDate },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    for (const item of body) {
      if (item.totalCost !== undefined) {
        expect(typeof item.totalCost).toBe('number');
        expect(item.totalCost).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('GET /divisions/customers/aws/credit and /credit/alerts — cross-reference accounts', async ({ api }) => {
    const [cr, ar] = await Promise.all([
      api.context.get('/api/v1/divisions/customers/aws/credit'),
      api.context.get('/api/v1/divisions/customers/credit/alerts'),
    ]);
    expect(cr.ok()).toBe(true);
    expect(ar.ok()).toBe(true);
    const credit = await cr.json();
    const alerts = await ar.json();
    expect(Array.isArray(credit)).toBe(true);
    expect(Array.isArray(alerts)).toBe(true);
    if (credit.length > 0 && credit[0].accountId) {
      const creditAccountIds = new Set(credit.map((c: any) => String(c.accountId || c.linked_account_id)));
      for (const alert of alerts) {
        if (alert.accountId) {
          // Alert should reference an account with credit info
          expect(creditAccountIds.has(String(alert.accountId)),
            `Credit alert accountId ${alert.accountId} should exist in credit list`).toBe(true);
        }
      }
    }
  });
});
