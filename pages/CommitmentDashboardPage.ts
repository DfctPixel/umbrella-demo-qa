import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { DataTableComponent } from '../components/DataTable';
import { COMMITMENT_DASHBOARD_SELECTORS } from '../config/selectors';

export class CommitmentDashboardPage extends BasePage {
  readonly heading: Locator;
  readonly commitmentMenuItem: Locator;
  readonly commitmentDashboardItem: Locator;

  // Reusable DataTable components
  readonly topUnutilizedTable: DataTableComponent;
  readonly topExpiringTable: DataTableComponent;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator(COMMITMENT_DASHBOARD_SELECTORS.heading);
    // Sidebar uses unique CSS IDs — more robust than text-based locators
    this.commitmentMenuItem = page.locator('#sideBarItemButton-commitment');
    this.commitmentDashboardItem = page.locator('#innerSideBarItemButton-dashboard');

    // Use DataTable components scoped by section heading proximity
    // Tables are found by sibling relationship to their section heading
    this.topUnutilizedTable = new DataTableComponent(
      page.locator('text=Top 10 Unutilized Commitment').locator('..').locator('..').locator('table')
    );
    this.topExpiringTable = new DataTableComponent(
      page.locator('text=Top 10 Commitment Expiring Soon').locator('..').locator('..').locator('table')
    );
  }

  async navigateTo(): Promise<void> {
    await this.clickVisible(this.commitmentMenuItem);
    await this.commitmentDashboardItem.waitFor({ state: 'visible', timeout: 5_000 });
    await this.commitmentDashboardItem.click();
  }

  async waitForLoad(): Promise<void> {
    await this.heading.waitFor({ state: 'visible', timeout: 30_000 });
    await this.waitForLoadState('load');
  }
}
