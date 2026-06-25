import { test, expect } from '@playwright/test';
import {
  authenticate,
  createAuthenticatedContext,
  API_URL,
  USER_EMAIL,
  USER_PASSWORD,
} from '../../helpers/auth';
import { UmbrellaApiClient } from '../../helpers/api-client';

test.describe('API Authentication @api', () => {
  test('should successfully authenticate and receive JWT + refresh tokens', async () => {
    const { tokens } = await authenticate();

    expect(tokens).toBeDefined();
    expect(tokens.jwtToken).toBeDefined();
    expect(tokens.jwtToken).toBeTruthy();
    expect(tokens.refreshToken).toBeDefined();
    expect(tokens.refreshToken).toBeTruthy();
    expect(tokens.username).toBeDefined();
    expect(tokens.username.length).toBeGreaterThan(0);

    // Decode the JWT to verify it contains the user's email
    const payload = JSON.parse(
      Buffer.from(tokens.jwtToken.split('.')[1], 'base64').toString()
    );
    expect(payload.email).toBe(USER_EMAIL.toLowerCase());
    expect(payload.email_verified).toBe(true);
  });

  test('should verify identity via signin-with-token', async () => {
    const { context, tokens } = await createAuthenticatedContext();
    const api = new UmbrellaApiClient(context, tokens);

    // Use the typed API client method instead of raw fetch
    const whoami = await api.signinWithToken();
    expect(whoami).toBeDefined();
    expect(
      whoami.hasOwnProperty('userName') || whoami.hasOwnProperty('userKey')
    ).toBeTruthy();
  });

  test('should reject signin with wrong password (negative)', async () => {
    // Use native fetch since Playwright's APIRequestContext
    // has issues with the custom 'apikey' header
    const commonHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      apikey: '-1:-1:-1',
    };

    // Step 1: Realm check
    const realmRes = await fetch(
      `${API_URL}/user-management/users/user-realm?username=${encodeURIComponent(USER_EMAIL)}`,
      { headers: commonHeaders }
    );
    expect(realmRes.ok).toBeTruthy();

    // Step 2: SSO check with wrong password
    await fetch(`${API_URL}/users/sso`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({ username: USER_EMAIL, password: 'WrongPassword123!' }),
    });

    // Step 3: Sign in with wrong password should fail
    const signinRes = await fetch(`${API_URL}/users/signin`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({ username: USER_EMAIL, password: 'WrongPassword123!' }),
    });

    expect(signinRes.ok).toBeFalsy();
    expect(signinRes.status === 401 || signinRes.status === 403).toBeTruthy();
  });

  test('should access protected endpoints with valid JWT', async () => {
    const { context, tokens } = await createAuthenticatedContext();
    const api = new UmbrellaApiClient(context, tokens);

    // Try a few protected endpoints to ensure auth works
    const subUsers = await api.getPlainSubUsers();
    expect(subUsers).toBeDefined();

    const notifications = await api.getNotificationSettings();
    expect(notifications).toBeDefined();
  });

  test('should reject expired or garbage JWT (negative)', async () => {
    const { context } = await createAuthenticatedContext();

    // Test with an obviously garbage token
    const garbageRes = await context.get('/users/plain-sub-users', {
      headers: { Authorization: 'Bearer garbage-token-that-will-fail' },
    });
    expect(garbageRes.ok()).toBeFalsy();
    expect(garbageRes.status()).toBe(401);

    // Test with an expired-style JWT (valid structure, invalid signature/claims)
    const expiredJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiZXhwIjoxNTAwMDAwMDAwfQ.fake-signature';
    const expiredRes = await context.get('/users/plain-sub-users', {
      headers: { Authorization: `Bearer ${expiredJwt}` },
    });
    expect(expiredRes.ok()).toBeFalsy();
    expect(expiredRes.status()).toBe(401);
  });
});
