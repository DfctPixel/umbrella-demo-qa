import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CostUsageExplorerPage extends BasePage {
  readonly heading: Locator;
  readonly totalCostLabel: Locator;
  readonly totalCostValue: Locator;
  readonly searchInput: Locator;
  readonly serviceList: Locator;
  readonly filterCount: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /Cost & Usage Explorer/i });
    // .first() disambiguates from "% of Total Cost" and other "Total Cost" labels
    this.totalCostLabel = page.getByText('Total Cost').first();

    // The DOM uses h5 "Total Cost" label with a sibling element containing the dollar value
    this.totalCostValue = page.locator('h5:has-text("Total Cost")').locator('..').locator('*').nth(1);
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.serviceList = page.locator('[role="list"]');
    this.filterCount = page.getByText('Presented items');
  }

  async waitForLoad(): Promise<void> {
    await this.heading.waitFor({ state: 'visible', timeout: 30_000 });
    await this.totalCostLabel.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async getTotalCostValue(): Promise<string> {
    return this.getTextContent(this.totalCostValue);
  }

  async searchService(serviceName: string): Promise<void> {
    await this.fillVisible(this.searchInput, serviceName);
  }

  async getFilteredCount(): Promise<{ shown: number; total: number } | null> {
    const text = await this.getTextContent(this.filterCount);
    const match = text.match(/Presented items \((\d+)\/(\d+)\)/);
    return match ? { shown: parseInt(match[1], 10), total: parseInt(match[2], 10) } : null;
  }

  async getServiceCount(): Promise<number> {
    const text = await this.getTextContent(this.filterCount);
    const match = text.match(/(\d+)\/(\d+)/);
    return match ? parseInt(match[2], 10) : 0;
  }
}
