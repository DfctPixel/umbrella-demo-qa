import { APIRequestContext } from '@playwright/test';
import { readJson } from './response';

export class AuthClient {
  constructor(
    public readonly context: APIRequestContext,
  ) {}

  async signinWithToken(): Promise<Record<string, unknown>> {
    const r = await this.context.post('/api/v1/users/signin-with-token', {
      data: { selectedRole: null },
    });
    return readJson<Record<string, unknown>>(r, 'POST /api/v1/users/signin-with-token');
  }
}
