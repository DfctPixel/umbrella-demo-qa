import { test, expect, APIResponse } from '@playwright/test';
import { readJson, readText } from '../../helpers/clients/response';

/**
 * Build a minimal APIResponse double. Only the members used by
 * helpers/clients/response.ts are exercised; `json()` is intentionally
 * unimplemented so a test cannot accidentally rely on Playwright's parser
 * instead of the guard's `text()` + `JSON.parse` path.
 */
function mockResponse(options: { status?: number; contentType?: string | null; body?: string } = {}): APIResponse {
  const status = options.status ?? 200;
  const body = options.body ?? '';
  const headers: Record<string, string> = {};
  if (options.contentType !== null && options.contentType !== undefined) {
    headers['content-type'] = options.contentType;
  }
  return {
    url: () => 'http://api.test/api/v1/mock',
    ok: () => status >= 200 && status < 300,
    status: () => status,
    headers: () => headers,
    body: async () => Buffer.from(body),
    text: async () => body,
    json: async () => {
      throw new Error('mock json() must not be used; the guard parses text()');
    },
  } as unknown as APIResponse;
}

test.describe('Response guard @unit', () => {

  test('readJson accepts application/json; charset=utf-8 and returns the parsed payload', async () => {
    const response = mockResponse({
      contentType: 'application/json; charset=utf-8',
      body: '{"ok":true,"count":3}',
    });
    await expect(readJson<{ ok: boolean; count: number }>(response, 'GET /mock')).resolves.toEqual({ ok: true, count: 3 });
  });

  test('readJson accepts a bare application/json content type', async () => {
    const response = mockResponse({ contentType: 'application/json', body: '[1,2]' });
    await expect(readJson<number[]>(response, 'GET /mock')).resolves.toEqual([1, 2]);
  });

  test('readJson rejects non-2xx responses with endpoint and status in the message', async () => {
    const response = mockResponse({ status: 500, contentType: 'application/json', body: '{"error":"boom"}' });
    await expect(readJson(response, 'POST /mock')).rejects.toThrow(/POST \/mock returned HTTP 500/);
  });

  test('readJson rejects a 200 response with a non-JSON content type', async () => {
    const response = mockResponse({ contentType: 'text/html', body: '<html>login page</html>' });
    await expect(readJson(response, 'GET /mock')).rejects.toThrow(/unexpected content-type text\/html/);
  });

  test('readJson rejects a 200 response with a missing content type', async () => {
    const response = mockResponse({ contentType: null, body: '{"ok":true}' });
    await expect(readJson(response, 'GET /mock')).rejects.toThrow(/unexpected content-type missing/);
  });

  test('readJson rejects malformed JSON bodies', async () => {
    const response = mockResponse({ contentType: 'application/json', body: '{not json' });
    await expect(readJson(response, 'GET /mock')).rejects.toThrow(/invalid JSON/);
  });

  test('readJson rejects an empty body as invalid JSON', async () => {
    const response = mockResponse({ contentType: 'application/json', body: '' });
    await expect(readJson(response, 'GET /mock')).rejects.toThrow(/invalid JSON/);
  });

  test('readJson never calls response.json() — parsing goes through text()', async () => {
    const response = mockResponse({ contentType: 'application/json', body: '{"a":1}' });
    await expect(readJson(response, 'GET /mock')).resolves.toEqual({ a: 1 });
  });

  test('readText returns the body of a successful response', async () => {
    const response = mockResponse({ contentType: 'text/plain', body: '42' });
    await expect(readText(response, 'GET /mock')).resolves.toBe('42');
  });

  test('readText rejects non-2xx responses with endpoint and status in the message', async () => {
    const response = mockResponse({ status: 404, contentType: 'text/plain', body: 'not found' });
    await expect(readText(response, 'GET /mock')).rejects.toThrow(/GET \/mock returned HTTP 404/);
  });
});
