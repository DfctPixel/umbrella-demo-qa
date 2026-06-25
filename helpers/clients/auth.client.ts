import { APIRequestContext, expect } from '@playwright/test';
import { AuthTokens } from '../auth/types';

export interface SigninWithTokenResponse { userName?: string; userKey?: string; email?: string; }

export class AuthClient {
  constructor(public readonly context: APIRequestContext, public readonly tokens: AuthTokens) {}
  async getPlainSubUsers(): Promise<Record<string, unknown>> { const r = await this.context.get('/users/plain-sub-users'); expect(r.ok()).toBeTruthy(); return r.json(); }
  async signinWithToken(): Promise<SigninWithTokenResponse> { const r = await this.context.post('/users/signin-with-token', { data: { selectedRole: null }, headers: { Authorization: `Bearer ${this.tokens.jwtToken}` } }); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getNotificationSettings(): Promise<Record<string, unknown>> { const r = await this.context.get('/users/user-settings/notifications'); expect(r.ok()).toBeTruthy(); return r.json(); }
}
