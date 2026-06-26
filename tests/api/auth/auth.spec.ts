import { test, expect, APIRequestContext } from '@playwright/test';
import { createAuthenticatedContext } from '../../../helpers/auth/auth-bootstrap';
import { AuthClient } from '../../../helpers/clients/auth.client';
import { USER_EMAIL, API_URL } from '../../../helpers/auth/types';

test.describe('Auth @api', () => {
  let context: APIRequestContext;
  let tokens: { jwtToken: string; refreshToken: string; username: string };
  let api: AuthClient;

  test.beforeAll(async () => {
    const ctx = await createAuthenticatedContext();
    context = ctx.context;
    tokens = ctx.tokens;
    api = new AuthClient(context);
  });

  test.afterAll(async () => {
    await context.dispose();
  });

  test('should successfully authenticate and receive JWT + refresh tokens', () => {
    expect(tokens.jwtToken).toBeTruthy();
    expect(tokens.refreshToken).toBeTruthy();
    expect(tokens.username).toBeTruthy();
    const payload = JSON.parse(Buffer.from(tokens.jwtToken.split('.')[1], 'base64').toString());
    expect(payload.email).toBe(USER_EMAIL.toLowerCase());
  });

  // Skipped: signin-with-token returns HTML (not JSON) when called from
  // Playwright APIRequestContext. Works in the browser but not via direct API.
  test.skip('should verify identity via signin-with-token', async () => {
    const whoami = await api.signinWithToken();
    expect(whoami.userName || whoami.userKey).toBeTruthy();
  });

  test('should reject wrong password (negative)', async ({ request }) => {
    const h = { 'Content-Type': 'application/json', apikey: '-1:-1:-1' };
    const r1 = await request.get(`${API_URL}/user-management/users/user-realm?username=${encodeURIComponent(USER_EMAIL)}`, { headers: h });
    expect(r1.ok()).toBe(true);
    // SSO always succeeds; signin is the gate
    const r3 = await request.post(`${API_URL}/users/signin`, {
      headers: h,
      data: { username: USER_EMAIL, password: 'WrongPassword123!' },
    });
    expect(r3.status()).toBe(403);
  });

  test('should reject expired or garbage JWT (negative)', async () => {
    const r1 = await context.get('/api/v1/users/plain-sub-users', { headers: { Authorization: 'Bearer garbage-token' } });
    expect(r1.status()).toBe(401);
    const expiredJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiZXhwIjoxNTAwMDAwMDAwfQ.fake';
    const r2 = await context.get('/api/v1/users/plain-sub-users', { headers: { Authorization: `Bearer ${expiredJwt}` } });
    expect(r2.status()).toBe(401);
  });
});
