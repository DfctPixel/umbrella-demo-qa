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
 * Thrown when any step in the multi-stage authentication flow fails.
 */
export class AuthenticationError extends Error {
  constructor(
    message: string,
    public readonly step: string,
    public readonly status?: number,
    public readonly responseBody?: string,
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Build the shared headers required by the Umbrella API.
 */
function commonHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    apikey: '-1:-1:-1',
  };
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
  const headers = commonHeaders();

  // Step 1: Realm check (GET)
  const realmRes = await fetch(
    `${API_URL}/user-management/users/user-realm?username=${encodeURIComponent(USER_EMAIL)}`,
    { headers },
  );

  if (!realmRes.ok) {
    throw new AuthenticationError(
      `Realm check failed: ${realmRes.status} ${await realmRes.text()}`,
      'realm',
      realmRes.status,
    );
  }

  // Step 2: SSO check – browser sends ONLY username, no password
  const ssoRes = await fetch(`${API_URL}/users/sso`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ username: USER_EMAIL }),
  });

  if (!ssoRes.ok) {
    throw new AuthenticationError(
      `SSO step failed: ${ssoRes.status} ${await ssoRes.text()}`,
      'sso',
      ssoRes.status,
    );
  }

  // Step 3: Sign in with email + password to get JWT
  const signinRes = await fetch(`${API_URL}/users/signin`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ username: USER_EMAIL, password: USER_PASSWORD }),
  });

  if (!signinRes.ok) {
    throw new AuthenticationError(
      `Sign-in failed: ${signinRes.status} ${await signinRes.text()}`,
      'signin',
      signinRes.status,
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
 * Authenticate and return both the API request context and tokens.
 *
 * This is a thin convenience wrapper around `authenticate()` that reuses
 * the context created there rather than creating a second one.
 */
export async function createAuthenticatedContext(): Promise<{
  context: APIRequestContext;
  tokens: AuthTokens;
}> {
  const { tokens, requestContext } = await authenticate();
  return { context: requestContext, tokens };
}

export { API_URL, BASE_URL, USER_EMAIL, USER_PASSWORD };
