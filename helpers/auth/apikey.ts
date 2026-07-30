import { APIRequestContext } from '@playwright/test';
import { QA_ACCOUNT_KEY, QA_ACCOUNT_TYPE_ID, QA_DIVISION_ID, QA_CURRENCY, TenantCapability } from './types';

/** Unauthenticated fallback apikey for auth endpoints. */
export const ANONYMOUS_APIKEY = '-1:-1:-1';

interface PlainSubUserResponse {
  user_key?: string;
  accounts?: Array<{ accountKey: number; accountTypeId: number }>;
  root_user?: boolean;
  is_parent?: boolean;
}

/**
 * Format the apikey header from an already-resolved tenant capability.
 */
export function buildApikey(userKey: string, accountKey: number, accountTypeId: number): string {
  return `${userKey}:${accountKey}:${accountTypeId}`;
}

/**
 * Resolve the authenticated user's tenant capability from plain-sub-users.
 *
 * Prefers the live profile response. Falls back to QA_ACCOUNT_KEY /
 * QA_ACCOUNT_TYPE_ID env vars when the profile has no accounts[0].
 * Fails fast with a descriptive error when neither source is available.
 */
export async function resolveTenantCapability(jwt: string, ctx: APIRequestContext): Promise<TenantCapability> {
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

  const profileAccount = profile.accounts?.[0];
  const accountKey = profileAccount?.accountKey ?? QA_ACCOUNT_KEY;
  const accountTypeId = profileAccount?.accountTypeId ?? QA_ACCOUNT_TYPE_ID;

  if (accountKey == null || accountTypeId == null) {
    throw new Error(
      'Tenant capability unresolved: plain-sub-users returned no accounts[0] and ' +
      'QA_ACCOUNT_KEY / QA_ACCOUNT_TYPE_ID env vars are not set. ' +
      'Configure QA_ACCOUNT_KEY and QA_ACCOUNT_TYPE_ID in .env for this tenant.'
    );
  }

  return {
    userKey,
    accountKey,
    accountTypeId,
    divisionId: QA_DIVISION_ID || '0',
    currency: QA_CURRENCY || 'USD',
  };
}

function decodeJwtSub(jwt: string): string {
  const payload = jwt.split('.')[1];
  const json = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
  return JSON.parse(json).sub || '';
}
