import { test, expect } from '@playwright/test';
import { authenticate, createAuthenticatedContext } from '../../../helpers/auth/auth-bootstrap';
import { AuthClient } from '../../../helpers/clients/auth.client';
import { USER_EMAIL, API_URL } from '../../../helpers/auth/types';

test.describe('Auth @api', () => {
  test('should successfully authenticate and receive JWT + refresh tokens', async () => {
    const { tokens } = await authenticate();
    expect(tokens).toBeDefined();
    expect(tokens.jwtToken).toBeTruthy();
    expect(tokens.refreshToken).toBeTruthy();
    expect(tokens.username.length).toBeGreaterThan(0);
    const payload = JSON.parse(Buffer.from(tokens.jwtToken.split('.')[1], 'base64').toString());
    expect(payload.email).toBe(USER_EMAIL.toLowerCase());
  });

  test('should verify identity via signin-with-token', async () => {
    const { context, tokens } = await createAuthenticatedContext();
    const api = new AuthClient(context, tokens);
    const whoami = await api.signinWithToken();
    expect(whoami).toBeDefined();
    expect(whoami.hasOwnProperty('userName') || whoami.hasOwnProperty('userKey')).toBeTruthy();
  });

  test('should reject wrong password (negative)', async () => {
    const h = { 'Content-Type': 'application/json', apikey: '-1:-1:-1' };
    const r1 = await fetch(`${API_URL}/user-management/users/user-realm?username=${encodeURIComponent(USER_EMAIL)}`, { headers: h });
    expect(r1.ok).toBeTruthy();
    await fetch(`${API_URL}/users/sso`, { method: 'POST', headers: h, body: JSON.stringify({ username: USER_EMAIL, password: 'WrongPassword123!' }) });
    const r3 = await fetch(`${API_URL}/users/signin`, { method: 'POST', headers: h, body: JSON.stringify({ username: USER_EMAIL, password: 'WrongPassword123!' }) });
    expect(r3.ok).toBeFalsy();
  });

  test('should reject expired or garbage JWT (negative)', async () => {
    const { context } = await createAuthenticatedContext();
    const r1 = await context.get('/users/plain-sub-users', { headers: { Authorization: 'Bearer garbage-token' } });
    expect(r1.ok()).toBeFalsy();
    expect(r1.status()).toBe(401);
    const expiredJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiZXhwIjoxNTAwMDAwMDAwfQ.fake';
    const r2 = await context.get('/users/plain-sub-users', { headers: { Authorization: `Bearer ${expiredJwt}` } });
    expect(r2.ok()).toBeFalsy();
    expect(r2.status()).toBe(401);
  });
});
