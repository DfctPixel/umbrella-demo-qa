import { APIResponse } from '@playwright/test';

/**
 * Read a successful JSON response without allowing an HTML error page or a
 * silently accepted non-2xx response to masquerade as a valid API result.
 *
 * Client methods deliberately return the decoded payload rather than exposing
 * Playwright's response object. Keeping this guard in one place gives every
 * client the same status/content-type/parse diagnostics while avoiding raw
 * tenant data in errors and CI artifacts.
 */
export async function readJson<T>(response: APIResponse, endpoint: string): Promise<T> {
  const contentType = response.headers()['content-type'] ?? '';

  if (!response.ok()) {
    throw new Error(`API ${endpoint} returned HTTP ${response.status()} (content-type: ${contentType || 'missing'})`);
  }

  if (!/json/i.test(contentType)) {
    throw new Error(
      `API ${endpoint} returned HTTP ${response.status()} with unexpected content-type ${contentType || 'missing'}`,
    );
  }

  const body = await response.text();
  try {
    return JSON.parse(body) as T;
  } catch {
    throw new Error(`API ${endpoint} returned invalid JSON (HTTP ${response.status()})`);
  }
}

/** Read a successful text response while retaining the same status guard. */
export async function readText(response: APIResponse, endpoint: string): Promise<string> {
  if (!response.ok()) {
    throw new Error(`API ${endpoint} returned HTTP ${response.status()}`);
  }
  return response.text();
}
