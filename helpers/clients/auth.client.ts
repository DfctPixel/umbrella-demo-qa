import { APIRequestContext } from '@playwright/test';

export class AuthClient {
  constructor(
    public readonly context: APIRequestContext,
  ) {}

  async signinWithToken(): Promise<Record<string, unknown>> {
    const r = await this.context.post('/api/v1/users/signin-with-token', {
      data: { selectedRole: null },
    });
    return r.json();
  }
}
