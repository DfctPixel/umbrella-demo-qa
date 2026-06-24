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
    this.totalCost = page.locator('text=Total Cost');
    this.groupByService = page.locator('text=Group By:');
    this.groupByDate = page.locator('text=By:');
    this.breadcrumb = page.locator('nav[aria-label="breadcrumb"]');
    this.amortizedButton = page.locator('button:has-text("Amortized")');
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.serviceList = page.locator('ul[role="list"]');
    this.filterCount = page.locator('text=Presented items');
    this.applyButton = page.locator('button:has-text("Apply")');
    this.showK8sBreakdown = page.locator('text=Show K8S Breakdown');
  }

  async waitForLoad() {
    await this.page.waitForURL(/cost-usage-explorer/, { timeout: 30_000 });
    await this.page.waitForSelector('text=Total Cost', { timeout: 30_000 });
  }

  async getTotalCostValue(): Promise<string> {
    const text = await this.totalCost.textContent();
    return text || '';
  }

  async searchService(serviceName: string) {
    await this.searchInput.fill(serviceName);
  }

  async selectFirstService() {
    const firstCheckbox = this.serviceList
      .locator('listitem')
      .first()
      .locator('button')
      .first();
    await firstCheckbox.click();
  }

  async getServiceCount(): Promise<number> {
    const text = (await this.filterCount.textContent()) || '';
    const match = text.match(/(\d+)\/(\d+)/);
    return match ? parseInt(match[2], 10) : 0;
  }
}
