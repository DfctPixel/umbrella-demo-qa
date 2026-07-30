import { request, APIRequestContext } from '@playwright/test';
import { API_URL, USER_EMAIL, USER_PASSWORD, AuthTokens, TenantCapability, AuthenticationError } from './types';
import { buildApikey, resolveTenantCapability, ANONYMOUS_APIKEY } from './apikey';

export async function authenticate(): Promise<{
  tokens: AuthTokens;
  requestContext: APIRequestContext;
  capability: TenantCapability;
}> {
  const anon = await request.newContext({
    baseURL: new URL(API_URL).origin,
    extraHTTPHeaders: { 'Content-Type': 'application/json', apikey: ANONYMOUS_APIKEY },
  });

  try {
    const realmRes = await anon.get(`/api/v1/user-management/users/user-realm?username=${encodeURIComponent(USER_EMAIL)}`);
    if (!realmRes.ok()) throw new AuthenticationError(`Realm check failed: ${realmRes.status()}`, 'realm', realmRes.status());

    await anon.post('/api/v1/users/sso', { data: { username: USER_EMAIL } });

    const signinRes = await anon.post('/api/v1/users/signin', {
      data: { username: USER_EMAIL.toLowerCase(), password: USER_PASSWORD },
    });
    if (!signinRes.ok()) throw new AuthenticationError(`Sign-in failed: ${signinRes.status()}`, 'signin', signinRes.status());
    const tokens: AuthTokens = await signinRes.json();

    const signinCookie = (signinRes.headers()['set-cookie'] || '').split(';')[0];

    const stRes = await anon.post('/api/v1/users/signin-with-token', {
      headers: {
        authorization: tokens.jwtToken,
        apikey: ANONYMOUS_APIKEY,
        commonparams: '{"isPpApplied":false}',
      },
      data: { selectedRole: null },
    });
    const stCookie = stRes.ok() ? (stRes.headers()['set-cookie'] || '').split(';')[0] : '';

    const capability = await resolveTenantCapability(tokens.jwtToken, anon);
    const apikey = buildApikey(capability.userKey, capability.accountKey, capability.accountTypeId);
    const apiOrigin = new URL(API_URL).origin;

    const context = await request.newContext({
      baseURL: apiOrigin,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        authorization: tokens.jwtToken,
        apikey,
        commonparams: '{"isPpApplied":false}',
        'frontend-request': 'true',
        ...(stCookie || signinCookie ? { Cookie: stCookie || signinCookie } : {}),
      },
    });

    return { tokens, requestContext: context, capability };
  } finally {
    await anon.dispose();
  }
}

export async function createAuthenticatedContext(): Promise<{
  context: APIRequestContext;
  tokens: AuthTokens;
  capability: TenantCapability;
}> {
  const { tokens, requestContext, capability } = await authenticate();
  return { context: requestContext, tokens, capability };
}
