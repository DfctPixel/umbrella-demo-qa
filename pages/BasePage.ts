import { Page, Locator, expect } from '@playwright/test';

/**
 * Base class for all page objects.
 *
 * Provides shared utilities like navigation helpers, wait strategies,
 * and common element interaction patterns.
 * Every page object focuses on its own domain concerns rather than
 * Playwright plumbing.
 */
export abstract class BasePage {
  constructor(public readonly page: Page) {}

  // ── Navigation ──────────────────────────────────────────────

  async navigate(url: string, options?: { timeout?: number }): Promise<void> {
    await this.page.goto(url, options);
    await this.waitForLoadState();
  }

  async waitForLoadState(
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle',
    options?: { timeout?: number },
  ): Promise<void> {
    await this.page.waitForLoadState(state, options);
  }

  // ── Element utilities ───────────────────────────────────────

  async clickVisible(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout ?? 15_000 });
    await locator.click();
  }

  async fillVisible(locator: Locator, text: string, options?: { timeout?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout ?? 15_000 });
    await locator.fill(text);
  }

  async getTextContent(locator: Locator): Promise<string> {
    return (await locator.textContent()) || '';
  }

  // ── Assertions ──────────────────────────────────────────────

  async assertUrlContains(pattern: RegExp | string, msg?: string): Promise<void> {
    await expect(this.page, msg).toHaveURL(pattern);
  }
}
