import { Page, Locator } from '@playwright/test';

export class CostUsageExplorerPage {
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

  constructor(public readonly page: Page) {
    this.heading = page.locator('heading:has-text("Cost & Usage Explorer")');
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
    await this.page.waitForURL(/cost-usage-explorer/, { timeout: 30_000 });
    await this.totalCost.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async getTotalCostValue(): Promise<string> {
    const text = await this.totalCost.textContent();
    return text || '';
  }

  async searchService(serviceName: string) {
    await this.searchInput.fill(serviceName);
  }

  async selectFirstService() {
    const firstItem = this.serviceList
      .getByRole('listitem')
      .first()
      .getByRole('button')
      .first();
    await firstItem.click();
  }

  async getServiceCount(): Promise<number> {
    const text = (await this.filterCount.textContent()) || '';
    const match = text.match(/(\d+)\/(\d+)/);
    return match ? parseInt(match[2], 10) : 0;
  }
}
