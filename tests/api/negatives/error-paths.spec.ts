import { test, expect } from '../../../helpers/fixtures/api';
import { API_URL } from '../../../helpers/auth/types';
import { ANONYMOUS_APIKEY } from '../../../helpers/auth/apikey';

test.describe('Negative & Error Paths @api @negative', () => {

  // ─── Auth rejections (anonymous context via Playwright `request` fixture) ───

  test('GET /users/plain-sub-users with no authorization header → 401', async ({ request }) => {
    const r = await request.get(`${API_URL}/users/plain-sub-users`, {
      headers: { apikey: ANONYMOUS_APIKEY, 'Content-Type': 'application/json' },
    });
    expect(r.status()).toBe(401);
  });

  test('GET /users/plain-sub-users with empty authorization → 401', async ({ request }) => {
    const r = await request.get(`${API_URL}/users/plain-sub-users`, {
      headers: { authorization: '', apikey: ANONYMOUS_APIKEY, 'Content-Type': 'application/json' },
    });
    expect(r.status()).toBe(401);
  });

  test('GET /users/plain-sub-users with malformed authorization → 401', async ({ request }) => {
    const r = await request.get(`${API_URL}/users/plain-sub-users`, {
      headers: { authorization: 'no-prefix-token', apikey: ANONYMOUS_APIKEY, 'Content-Type': 'application/json' },
    });
    expect(r.status()).toBe(401);
  });

  test('GET /users/plain-sub-users with invalid apikey → 401', async ({ request, api }) => {
    const r = await request.get(`${API_URL}/users/plain-sub-users`, {
      headers: { authorization: api.tokens.jwtToken, apikey: 'invalid:key:0', 'Content-Type': 'application/json' },
    });
    expect(r.status()).toBe(401);
  });

  test('GET /users/plain-sub-users with valid JWT but wrong apikey → 401', async ({ request, api }) => {
    const r = await request.get(`${API_URL}/users/plain-sub-users`, {
      headers: { authorization: api.tokens.jwtToken, apikey: '999999:999999:99', 'Content-Type': 'application/json' },
    });
    expect(r.status(), 'invalid apikey is treated as failed authentication').toBe(401);
  });

  test('tampered JWT (modified payload) → 401', async ({ request, api }) => {
    const parts = api.tokens.jwtToken.split('.');
    const tamperedPayload = parts[1].slice(0, -1) + (parts[1].slice(-1) === 'A' ? 'B' : 'A');
    const tamperedJwt = `${parts[0]}.${tamperedPayload}.${parts[2]}`;
    const r = await request.get(`${API_URL}/users/plain-sub-users`, {
      headers: { authorization: tamperedJwt, apikey: ANONYMOUS_APIKEY, 'Content-Type': 'application/json' },
    });
    expect(r.status()).toBe(401);
  });

  test('fake signature JWT → 401', async ({ request, api }) => {
    const parts = api.tokens.jwtToken.split('.');
    const fakeSig = 'x'.repeat(Math.max(parts[2]?.length || 43, 1));
    const fakeJwt = `${parts[0]}.${parts[1]}.${fakeSig}`;
    const r = await request.get(`${API_URL}/users/plain-sub-users`, {
      headers: { authorization: fakeJwt, apikey: ANONYMOUS_APIKEY, 'Content-Type': 'application/json' },
    });
    expect(r.status()).toBe(401);
  });

  test('non-existent account apikey → 401', async ({ request, api }) => {
    const r = await request.get(`${API_URL}/users/plain-sub-users`, {
      headers: { authorization: api.tokens.jwtToken, apikey: '0:0:0', 'Content-Type': 'application/json' },
    });
    expect(r.status()).toBe(401);
  });

  test('error responses return structured JSON with meaningful fields', async ({ request }) => {
    const r = await request.get(`${API_URL}/users/plain-sub-users`, {
      headers: { apikey: ANONYMOUS_APIKEY },
    });
    expect(r.status()).toBe(401);
    const ct = r.headers()['content-type'] || '';
    expect(ct).toContain('json');
    const body = await r.json();
    const hasErrorField = body.message || body.error || body.statusCode || body.code;
    expect(hasErrorField).toBeTruthy();
  });

  // ─── Authenticated negative tests (use shared fixture) ──────────────────────

  test('GET /anomaly-detection with invalid startDate — returns 400', async ({ api }) => {
    const r = await api.context.get('/api/v1/anomaly-detection', { params: { startDate: 'not-a-date' } });
    expect(r.status()).toBe(400);
  });

  test('GET non-existent API path → 404 (SPA returns HTML error page)', async ({ api }) => {
    const r = await api.context.get('/api/v1/non-existent-endpoint-xyz');
    expect(r.status()).toBe(404);
    const ct = r.headers()['content-type'] || '';
    expect(ct).toBeTruthy();
  });

  test('GET with path traversal → 404', async ({ api }) => {
    const r = await api.context.get('/api/v1/../../../etc/passwd');
    expect(r.status()).toBe(404);
  });

  test('rapid requests — all consistently succeed or all consistently rate-limited', async ({ api }) => {
    const results = await Promise.all(
      Array.from({ length: 5 }, () =>
        api.context.get('/api/v1/users/plain-sub-users'),
      ),
    );
    const statuses = results.map(r => r.status());
    for (const s of statuses) {
      expect(s, `response must not be a server error (got ${s})`).toBeLessThan(500);
    }
    const unique = [...new Set(statuses)];
    expect(unique.length, `all rapid responses should return the same status; got [${unique.join(', ')}]`).toBe(1);
  });

});
