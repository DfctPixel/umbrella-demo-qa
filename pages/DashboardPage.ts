import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly mtdCost: Locator;

  // Sidebar navigation
  readonly costAndUsageMenuItem: Locator;
  readonly costAndUsageExplorerItem: Locator;

  constructor(page: Page) {
    super(page);
    this.mtdCost = page.getByText('MTD cost');

    // Sidebar uses unique CSS IDs — more robust than text-based locators
    this.costAndUsageMenuItem = page.locator('#sideBarItemButton-costAndUsage');
    this.costAndUsageExplorerItem = page.locator('#innerSideBarItemButton-costAndUsageExplorer');
  }

  async navigateToCostAndUsageExplorer(): Promise<void> {
    await this.clickVisible(this.costAndUsageMenuItem);
    await this.costAndUsageExplorerItem.waitFor({ state: 'visible', timeout: 5_000 });
    await this.costAndUsageExplorerItem.click();
  }

  async waitForDashboardLoad(): Promise<void> {
    await this.mtdCost.waitFor({ state: 'visible', timeout: 30_000 });
  }
}
