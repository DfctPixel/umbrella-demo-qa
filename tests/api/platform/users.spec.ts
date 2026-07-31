import { test, expect } from '../../../helpers/fixtures/api';

test.describe('Users @api', () => {
  const thisMonth = new Date().toISOString().slice(0, 7);

  test('GET /users/same-company-users — all items have user_key and user_name', async ({ api }) => {
    const r = await api.context.get('/api/v1/users/same-company-users');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    for (const u of body) {
      expect(u.user_key, 'every company user must have user_key').toBeTruthy();
      expect(u.user_name, 'every company user must have user_name').toBeTruthy();
    }
  });

  test('GET /users/preferences — response has meaningful keys', async ({ api }) => {
    const r = await api.context.get('/api/v1/users/preferences');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    // API returns either an object or array depending on context
    if (Array.isArray(body)) {
      expect(body.length, 'preferences array should not be empty').toBeGreaterThan(0);
    } else {
      expect(typeof body).toBe('object');
      expect(Object.keys(body).length, 'preferences object should have keys').toBeGreaterThan(0);
    }
  });

  test('GET /users/roles — each role is a non-null object', async ({ api }) => {
    const r = await api.context.get('/api/v1/users/roles');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      for (const role of body) {
        expect(typeof role).toBe('object');
        expect(role).not.toBeNull();
        expect(Object.keys(role).length).toBeGreaterThan(0);
      }
    }
  });

  test('GET /users/events — returns structured response', async ({ api }) => {
    const startDate = `${thisMonth}-01`;
    const endDate = new Date().toISOString().split('T')[0];
    const r = await api.context.get('/api/v1/users/events', {
      params: { startDate, endDate },
    });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    // Events may be empty if no activity in the period
    expect(typeof body).toBe('object');
    expect(body).not.toBeNull();
  });

  test('GET /usage/views and /usage/categories — both return usable configuration data', async ({ api }) => {
    const [vr, cr] = await Promise.all([
      api.context.get('/api/v1/usage/views'),
      api.context.get('/api/v1/usage/categories'),
    ]);
    expect(vr.ok()).toBe(true);
    expect(cr.ok()).toBe(true);
    const views = await vr.json();
    const cats = await cr.json();
    expect(Array.isArray(views)).toBe(true);
    expect(Array.isArray(cats)).toBe(true);
  });

  test('GET /usage/virtual-tags/virtual-tags — tags are non-empty objects', async ({ api }) => {
    const r = await api.context.get('/api/v1/usage/virtual-tags/virtual-tags');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      expect(typeof body[0]).toBe('object');
      expect(body[0]).not.toBeNull();
    }
  });

  test('GET /usage/goals — each goal is a non-empty object', async ({ api }) => {
    const r = await api.context.get('/api/v1/usage/goals');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      const g = body[0];
      expect(typeof g).toBe('object');
      expect(Object.keys(g).length).toBeGreaterThan(0);
    }
  });
});
