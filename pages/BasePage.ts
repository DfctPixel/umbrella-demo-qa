import { Page, Locator, expect } from '@playwright/test';

/**
 * Base class for all page objects.
 *
 * Provides shared utilities like navigation helpers, wait strategies,
 * common element interaction patterns, and fluent assertion methods.
 * Every page object focuses on its own domain concerns rather than
 * Playwright plumbing.
 */
export abstract class BasePage {
  constructor(public readonly page: Page) {}

  // ── Navigation ──────────────────────────────────────────────

  async navigate(url: string, options?: { timeout?: number }): Promise<this> {
    await this.page.goto(url, options);
    await this.waitForLoadState();
    return this;
  }

  async waitForLoadState(
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle',
    options?: { timeout?: number },
  ): Promise<this> {
    await this.page.waitForLoadState(state, options);
    return this;
  }

  async waitForUrl(
    pattern: RegExp | string,
    options?: { timeout?: number },
  ): Promise<this> {
    await this.page.waitForURL(pattern, options);
    return this;
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async reload(options?: { timeout?: number }): Promise<this> {
    await this.page.reload(options);
    await this.waitForLoadState();
    return this;
  }

  // ── Element utilities ───────────────────────────────────────

  async waitVisible(locator: Locator, timeout = 15_000): Promise<Locator> {
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
  }

  async clickVisible(locator: Locator, options?: { timeout?: number }): Promise<this> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout ?? 15_000 });
    await locator.click();
    return this;
  }

  async fillVisible(locator: Locator, text: string, options?: { timeout?: number }): Promise<this> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout ?? 15_000 });
    await locator.fill(text);
    return this;
  }

  async getTextContent(locator: Locator): Promise<string> {
    return (await locator.textContent()) || '';
  }

  // ── Fluent Assertions (returns this for chaining) ──────────

  async assertVisible(locator: Locator, msg?: string): Promise<this> {
    await expect(locator, msg).toBeVisible();
    return this;
  }

  async assertHasText(locator: Locator, text: string | RegExp, msg?: string): Promise<this> {
    await expect(locator, msg).toHaveText(text);
    return this;
  }

  async assertUrlContains(pattern: RegExp | string, msg?: string): Promise<this> {
    await expect(this.page, msg).toHaveURL(pattern);
    return this;
  }

  async assertDisabled(locator: Locator, msg?: string): Promise<this> {
    await expect(locator, msg).toBeDisabled();
    return this;
  }

  async assertCount(locator: Locator, expected: number, msg?: string): Promise<this> {
    await expect(locator, msg).toHaveCount(expected);
    return this;
  }
}
