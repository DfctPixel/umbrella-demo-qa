import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CostUsageExplorerPage extends BasePage {
  readonly heading: Locator;
  readonly totalCostLabel: Locator;
  readonly totalCostValue: Locator;
  readonly searchInput: Locator;
  readonly serviceList: Locator;
  readonly filterCount: Locator;
  readonly chartSvg: Locator;
  readonly chartBar: Locator;
  readonly chartTooltip: Locator;

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

    // Bar chart (Recharts) — waits for the chart to render
    this.chartSvg = page.locator('svg').filter({ has: page.locator('.recharts-bar') }).first();
    this.chartBar = page.locator('.recharts-bar-rectangle path').first();
    this.chartTooltip = page.locator('.recharts-tooltip-wrapper');
  }

  async waitForLoad(): Promise<void> {
    await this.heading.waitFor({ state: 'visible', timeout: 30_000 });
    await this.totalCostLabel.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async waitForChartReady(): Promise<void> {
    await this.chartSvg.waitFor({ state: 'visible', timeout: 30_000 });
    await this.chartBar.waitFor({ state: 'visible', timeout: 15_000 });
  }

  async hoverOverBar(): Promise<void> {
    await this.chartBar.hover();
  }

  async getTooltipInfo(): Promise<{ date: string; total: string }> {
    await this.hoverOverBar();
    // Recharts tooltip becomes visible on hover with a short delay
    await this.chartTooltip.waitFor({ state: 'visible', timeout: 5_000 });
    // Tooltip format: "Date: May 31\nTotal: $ 5,422.09"
    // textContent() concatenates all text without newlines, e.g.:
    // "Date: May 31Total: $ 5,422.09Percent of Total: 39%Amazon Redshift: $ 2,136.16"
    const text = await this.chartTooltip.textContent();
    const dateMatch = text?.match(/Date:\s*(\w+\s+\d+)/);   // "May 31"
    const totalMatch = text?.match(/Total:\s*\$?\s*([\d,.\-]+)/); // "$ 5,422.09"
    return {
      date: dateMatch ? dateMatch[1].trim() : '',
      total: totalMatch ? totalMatch[1].trim() : '',
    };
  }

  /** @deprecated Use getTooltipInfo() instead. */
  async getTooltipTotal(): Promise<string> {
    const info = await this.getTooltipInfo();
    return info.total;
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
