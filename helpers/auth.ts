import { request, APIRequestContext } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://dev.umbrellacost.dev';
const API_URL = process.env.API_URL || 'https://api.dev.umbrellacost.dev/api/v1';
const USER_EMAIL = process.env.USER_EMAIL || '';
const USER_PASSWORD = process.env.USER_PASSWORD || '';

export interface AuthTokens {
  jwtToken: string;
  refreshToken: string;
  username: string;
}

/**
 * Authenticate via the API sign-in endpoint and return JWT + refresh tokens.
 *
 * Uses Node.js native fetch() for the sign-in calls instead of Playwright's
 * APIRequestContext. This is necessary because Playwright's APIRequestContext
 * strips or mishandles the custom 'apikey' header on certain Node.js versions,
 * resulting in 401 "unauthorized" errors even when extraHTTPHeaders is set.
 *
 * The login flow (observed via browser DevTools):
 *   1. GET /user-management/users/user-realm?username=... (realm check)
 *   2. POST /users/sso              body: {"username":"..."} (SSO check, username ONLY)
 *   3. POST /users/signin           body: {"username":"...","password":"..."} (get JWT)
 *
 * After signin, a Playwright APIRequestContext is created with the JWT Bearer
 * token for use in subsequent API test calls.
 */
export async function authenticate(): Promise<{
  tokens: AuthTokens;
  requestContext: APIRequestContext;
}> {
  const commonHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: '-1:-1:-1',
  };

  // Step 1: Realm check (GET)
  const realmRes = await fetch(
    `${API_URL}/user-management/users/user-realm?username=${encodeURIComponent(USER_EMAIL)}`,
    { headers: commonHeaders }
  );
  await realmRes.json(); // discard body, just need to make the call

  // Step 2: SSO check – browser sends ONLY username, no password
  await fetch(`${API_URL}/users/sso`, {
    method: 'POST',
    headers: commonHeaders,
    body: JSON.stringify({ username: USER_EMAIL }),
  });

  // Step 3: Sign in with email + password to get JWT
  const signinRes = await fetch(`${API_URL}/users/signin`, {
    method: 'POST',
    headers: commonHeaders,
    body: JSON.stringify({ username: USER_EMAIL, password: USER_PASSWORD }),
  });

  if (!signinRes.ok) {
    throw new Error(
      `Authentication failed: ${signinRes.status} ${await signinRes.text()}`
    );
  }

  const tokens: AuthTokens = await signinRes.json();

  // Create a Playwright APIRequestContext with the JWT for test API calls
  const context = await request.newContext({
    baseURL: API_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.jwtToken}`,
    },
  });

  return { tokens, requestContext: context };
}

/**
 * Create an authenticated API request context with JWT Bearer token.
 * Subsequent calls via this context will use the Bearer token.
 */
export async function createAuthenticatedContext(): Promise<{
  context: APIRequestContext;
  tokens: AuthTokens;
}> {
  const { tokens } = await authenticate();
  const context = await request.newContext({
    baseURL: API_URL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.jwtToken}`,
    },
  });
  return { context, tokens };
}

export { API_URL, BASE_URL, USER_EMAIL, USER_PASSWORD };
