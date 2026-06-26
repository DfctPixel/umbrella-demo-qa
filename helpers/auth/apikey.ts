import { APIRequestContext } from '@playwright/test';

/** Unauthenticated fallback apikey for auth endpoints. */
export const ANONYMOUS_APIKEY = '-1:-1:-1';

/** Default account values used when plain-sub-users returns a minimal profile. */
const DEFAULT_ACCOUNT_KEY = 111111177;
const DEFAULT_ACCOUNT_TYPE_ID = 0;

interface PlainSubUserResponse {
  user_key?: string;
  accounts?: Array<{ accountKey: number; accountTypeId: number }>;
  root_user?: boolean;
  is_parent?: boolean;
}

/**
 * Build the authenticated apikey header value.
 *
 * Calls GET /users/plain-sub-users with the raw JWT (no "Bearer " prefix)
 * to get user_key and account details, then falls back to defaults if
 * the API returns a minimal parent-user profile.
 */
export async function buildApikey(jwt: string, ctx: APIRequestContext): Promise<string> {
  const r = await ctx.get('/api/v1/users/plain-sub-users', {
    headers: {
      authorization: jwt,
      apikey: ANONYMOUS_APIKEY,
      commonparams: '{"isPpApplied":false}',
      'frontend-request': 'true',
    },
  });
  if (!r.ok()) throw new Error(`plain-sub-users failed: ${r.status()}`);
  const profile: PlainSubUserResponse = await r.json();

  const userKey = profile.user_key || decodeJwtSub(jwt);
  const accountKey = profile.accounts?.[0]?.accountKey || DEFAULT_ACCOUNT_KEY;
  const accountTypeId = profile.accounts?.[0]?.accountTypeId ?? DEFAULT_ACCOUNT_TYPE_ID;

  return `${userKey}:${accountKey}:${accountTypeId}`;
}

function decodeJwtSub(jwt: string): string {
  const payload = jwt.split('.')[1];
  const json = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
  return JSON.parse(json).sub || '';
}
