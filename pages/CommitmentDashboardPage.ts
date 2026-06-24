import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CommitmentDashboardPage extends BasePage {
  readonly heading: Locator;
  readonly commitmentMenuItem: Locator;
  readonly commitmentDashboardItem: Locator;
  readonly monthlyUsageChart: Locator;
  readonly totalHoursChart: Locator;
  readonly savingsWasteChart: Locator;
  readonly topUnutilizedTable: Locator;
  readonly topExpiringTable: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /Commitment Dashboard/i });
    this.commitmentMenuItem = page.locator('#sideBarItemButton-commitment');
    this.commitmentDashboardItem = page.locator('#innerSideBarItemButton-commitmentDashboard');
    this.monthlyUsageChart = page.getByText('Monthly Usage By Pricing Method');
    this.totalHoursChart = page.getByText('Total Hours Distribution');
    this.savingsWasteChart = page.getByText('Commitment Savings & Waste');
    this.topUnutilizedTable = page.getByText('Top 10 Unutilized Commitment');
    this.topExpiringTable = page.getByText('Top 10 Commitment Expiring Soon');
  }

  async navigateTo() {
    await this.clickVisible(this.commitmentMenuItem);
    await this.commitmentDashboardItem.waitFor({ state: 'visible', timeout: 5_000 });
    await this.clickVisible(this.commitmentDashboardItem);
    await this.waitForUrl(/commitment\/dashboard/, { timeout: 15_000 });
  }

  async waitForLoad() {
    await this.heading.waitFor({ state: 'visible', timeout: 30_000 });
    await this.waitForLoadState('networkidle');
  }
}
