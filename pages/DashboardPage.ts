import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly mtdCost: Locator;
  readonly previousMonthCost: Locator;
  readonly forecastingCard: Locator;
  readonly annualSavings: Locator;
  readonly recommendations: Locator;
  readonly sidebar: Locator;

  // Sidebar navigation
  readonly costAndUsageMenuItem: Locator;
  readonly costAndUsageExplorerItem: Locator;

  constructor(public readonly page: Page) {
    this.mtdCost = page.locator('text=MTD cost');
    this.previousMonthCost = page.locator('text=Previous Month Total Cost');
    this.forecastingCard = page.locator('text=Forecasted Monthly Cost');
    this.annualSavings = page.locator('text=Annual Potential Savings');
    this.recommendations = page.locator('text=New Recommendations');
    this.sidebar = page.locator('nav');

    this.costAndUsageMenuItem = page.locator('#sideBarItemButton-costAndUsage');
    this.costAndUsageExplorerItem = page.locator(
      '#innerSideBarItemButton-costAndUsageExplorer'
    );
  }

  async navigateToCostAndUsageExplorer() {
    await this.costAndUsageMenuItem.click();
    await this.page.waitForTimeout(500);
    await this.costAndUsageExplorerItem.click();
    await this.page.waitForURL(/cost-usage-explorer/);
  }

  async waitForDashboardLoad() {
    await this.page.waitForSelector('text=MTD cost', { timeout: 30_000 });
  }
}
