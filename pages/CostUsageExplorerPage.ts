import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CostUsageExplorerPage extends BasePage {
  readonly heading: Locator;
  readonly totalCost: Locator;
  readonly groupByService: Locator;
  readonly groupByDate: Locator;
  readonly breadcrumb: Locator;
  readonly amortizedButton: Locator;
  readonly searchInput: Locator;
  readonly serviceList: Locator;
  readonly filterCount: Locator;
  readonly applyButton: Locator;
  readonly showK8sBreakdown: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /Cost & Usage Explorer/i });
    this.totalCost = page.getByText('Total Cost');
    this.groupByService = page.getByText('Group By:');
    this.groupByDate = page.getByText('By:');
    this.breadcrumb = page.locator('nav[aria-label="breadcrumb"]');
    this.amortizedButton = page.getByRole('button', { name: 'Amortized' });
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.serviceList = page.locator('[role="list"]');
    this.filterCount = page.getByText('Presented items');
    this.applyButton = page.getByRole('button', { name: 'Apply' });
    this.showK8sBreakdown = page.getByText('Show K8S Breakdown');
  }

  async waitForLoad() {
    await this.waitForUrl(/cost-usage-explorer/, { timeout: 30_000 });
    await this.totalCost.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async getTotalCostValue(): Promise<string> {
    return this.getTextContent(this.totalCost);
  }

  async searchService(serviceName: string) {
    await this.fillVisible(this.searchInput, serviceName);
  }

  async selectFirstService() {
    const firstItem = this.serviceList
      .getByRole('listitem')
      .first()
      .getByRole('button')
      .first();
    await this.clickVisible(firstItem);
  }

  async getServiceCount(): Promise<number> {
    const text = await this.getTextContent(this.filterCount);
    const match = text.match(/(\d+)\/(\d+)/);
    return match ? parseInt(match[2], 10) : 0;
  }
}
