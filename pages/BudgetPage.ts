import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BudgetPage extends BasePage {
  readonly heading: Locator;
  readonly createBudgetButton: Locator;
  readonly currentBudgetsTab: Locator;
  readonly budgetSummaryTab: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /Budget/i });
    this.createBudgetButton = page.getByRole('button', { name: /Create Budget/i });
    this.currentBudgetsTab = page.getByRole('tab', { name: /Current Budgets/i });
    this.budgetSummaryTab = page.getByRole('tab', { name: /Budget Summary/i });
  }

  async navigateTo() {
    await this.navigate('/monitoring/budget');
    await this.waitForUrl(/budget/, { timeout: 15_000 });
  }

  async waitForLoad() {
    await this.heading.waitFor({ state: 'visible', timeout: 30_000 });
    await this.waitForLoadState('networkidle');
  }

  async isCreateBudgetDisabled(): Promise<boolean> {
    return await this.createBudgetButton.isDisabled();
  }
}
