import { request, APIRequestContext } from '@playwright/test';
import { API_URL, USER_EMAIL, USER_PASSWORD, AuthTokens, AuthenticationError } from './types';

function commonHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    apikey: '-1:-1:-1',
  };
}

export async function authenticate(): Promise<{ tokens: AuthTokens; requestContext: APIRequestContext }> {
  const headers = commonHeaders();
  const realmRes = await fetch(`${API_URL}/user-management/users/user-realm?username=${encodeURIComponent(USER_EMAIL)}`, { headers });
  if (!realmRes.ok) throw new AuthenticationError(`Realm check failed: ${realmRes.status}`, 'realm', realmRes.status);
  const ssoRes = await fetch(`${API_URL}/users/sso`, { method: 'POST', headers, body: JSON.stringify({ username: USER_EMAIL }) });
  if (!ssoRes.ok) throw new AuthenticationError(`SSO failed: ${ssoRes.status}`, 'sso', ssoRes.status);
  const signinRes = await fetch(`${API_URL}/users/signin`, { method: 'POST', headers, body: JSON.stringify({ username: USER_EMAIL, password: USER_PASSWORD }) });
  if (!signinRes.ok) throw new AuthenticationError(`Sign-in failed: ${signinRes.status}`, 'signin', signinRes.status);
  const tokens: AuthTokens = await signinRes.json();
  const context = await request.newContext({ baseURL: API_URL, extraHTTPHeaders: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokens.jwtToken}` } });
  return { tokens, requestContext: context };
}

export async function createAuthenticatedContext(): Promise<{ context: APIRequestContext; tokens: AuthTokens }> {
  const { tokens, requestContext } = await authenticate();
  return { context: requestContext, tokens };
}
