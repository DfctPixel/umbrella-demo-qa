import { Page, Locator } from '@playwright/test';

/**
 * Base class for all page objects.
 *
 * Provides shared utilities like navigation helpers, wait strategies,
 * and common element interaction patterns so that each page object
 * focuses on its own domain concerns rather than Playwright plumbing.
 */
export abstract class BasePage {
  constructor(public readonly page: Page) {}

  // ── Navigation ──────────────────────────────────────────────

  /**
   * Navigate to a relative or absolute URL and wait for the page to be fully loaded.
   */
  async navigate(url: string, options?: { timeout?: number }): Promise<void> {
    await this.page.goto(url, options);
    await this.waitForLoadState();
  }

  /**
   * Wait for the given navigation / lifecycle state.
   */
  async waitForLoadState(
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle',
    options?: { timeout?: number },
  ): Promise<void> {
    await this.page.waitForLoadState(state, options);
  }

  /**
   * Wait until the page URL matches the given regex or string.
   */
  async waitForUrl(
    pattern: RegExp | string,
    options?: { timeout?: number },
  ): Promise<void> {
    await this.page.waitForURL(pattern, options);
  }

  /**
   * Return the current page URL.
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Reload the current page and wait for it to settle.
   */
  async reload(options?: { timeout?: number }): Promise<void> {
    await this.page.reload(options);
    await this.waitForLoadState();
  }

  // ── Element utilities ───────────────────────────────────────

  /**
   * Wait for a locator to be visible and return it (useful for chaining).
   */
  async waitVisible(
    locator: Locator,
    timeout = 15_000,
  ): Promise<Locator> {
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
  }

  /**
   * Click an element after waiting for it to be visible.
   */
  async clickVisible(
    locator: Locator,
    options?: { timeout?: number },
  ): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout ?? 15_000 });
    await locator.click();
  }

  /**
   * Fill a text input after waiting for it to be visible.
   */
  async fillVisible(
    locator: Locator,
    text: string,
    options?: { timeout?: number },
  ): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout ?? 15_000 });
    await locator.fill(text);
  }

  /**
   * Get the visible text content of an element.
   */
  async getTextContent(locator: Locator): Promise<string> {
    return (await locator.textContent()) || '';
  }
}
