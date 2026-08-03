import { test, expect } from '../../../helpers/fixtures/api';
import { USER_EMAIL, API_URL } from '../../../helpers/auth/types';

test.describe('Auth @api', () => {

  test('JWT token should carry the correct user identity @smoke', ({ api }) => {
    expect(api.tokens.jwtToken).toBeTruthy();
    expect(api.tokens.refreshToken).toBeTruthy();
    expect(api.tokens.username).toBeTruthy();
    const payload = JSON.parse(Buffer.from(api.tokens.jwtToken.split('.')[1], 'base64').toString());
    expect(payload.email).toBe(USER_EMAIL.toLowerCase());
    // JWT should not be expired
    if (payload.exp) {
      expect(payload.exp * 1000, 'JWT must not be expired').toBeGreaterThan(Date.now());
    }
  });

  test('should reject wrong password (negative)', async ({ request }) => {
    const h = { 'Content-Type': 'application/json', apikey: '-1:-1:-1' };
    const r1 = await request.get(`${API_URL}/user-management/users/user-realm?username=${encodeURIComponent(USER_EMAIL)}`, { headers: h });
    expect(r1.ok()).toBe(true);
    const r3 = await request.post(`${API_URL}/users/signin`, {
      headers: h,
      data: { username: USER_EMAIL, password: 'WrongPassword123!' },
    });
    expect(r3.status()).toBe(403);
  });

  test('should reject expired or garbage JWT (negative)', async ({ api }) => {
    const r1 = await api.context.get('/api/v1/users/plain-sub-users', { headers: { Authorization: 'Bearer garbage-token' } });
    expect(r1.status()).toBe(401);
    const expiredJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiZXhwIjoxNTAwMDAwMDAwfQ.fake';
    const r2 = await api.context.get('/api/v1/users/plain-sub-users', { headers: { Authorization: `Bearer ${expiredJwt}` } });
    expect(r2.status()).toBe(401);
  });
});
