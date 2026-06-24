import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly mtdCost: Locator;
  readonly previousMonthCost: Locator;
  readonly forecastingCard: Locator;
  readonly annualSavings: Locator;
  readonly recommendations: Locator;
  readonly sidebar: Locator;

  // Sidebar navigation
  readonly costAndUsageMenuItem: Locator;
  readonly costAndUsageExplorerItem: Locator;

  constructor(page: Page) {
    super(page);
    this.mtdCost = page.getByText('MTD cost');
    this.previousMonthCost = page.getByText('Previous Month Total Cost');
    this.forecastingCard = page.getByText('Forecasted Monthly Cost');
    this.annualSavings = page.getByText('Annual Potential Savings');
    this.recommendations = page.getByText('New Recommendations');
    this.sidebar = page.locator('nav');

    this.costAndUsageMenuItem = page.locator('#sideBarItemButton-costAndUsage');
    this.costAndUsageExplorerItem = page.locator(
      '#innerSideBarItemButton-costAndUsageExplorer'
    );
  }

  async navigateToCostAndUsageExplorer() {
    await this.clickVisible(this.costAndUsageMenuItem);
    // Wait for the submenu item to become visible after the expand animation
    await this.costAndUsageExplorerItem.waitFor({ state: 'visible', timeout: 5_000 });
    await this.clickVisible(this.costAndUsageExplorerItem);
    await this.waitForUrl(/cost-usage-explorer/, { timeout: 15_000 });
  }

  async waitForDashboardLoad() {
    await this.mtdCost.waitFor({ state: 'visible', timeout: 30_000 });
  }
}
