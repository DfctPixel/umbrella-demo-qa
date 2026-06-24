import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { BudgetPage } from '../../pages/BudgetPage';
import { USER_EMAIL, USER_PASSWORD } from '../../helpers/auth';

test.describe('UI Advanced Features @ui', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USER_EMAIL, USER_PASSWORD);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardLoad();
  });

  // Budget disabled state has no API equivalent — kept as UI test.
  // Commitment Dashboard and Anomaly Detection data are validated
  // via faster API tests (commitment-anomaly.spec.ts).
  test('should show Budget page with Create Budget button disabled', async ({ page }) => {
    const budgetPage = new BudgetPage(page);

    await budgetPage.navigateTo();
    await budgetPage.waitForLoad();

    await expect(budgetPage.heading).toBeVisible({ timeout: 15_000 });
    await expect(budgetPage.currentBudgetsTab).toBeVisible();

    const isDisabled = await budgetPage.isCreateBudgetDisabled();
    expect(isDisabled).toBeTruthy();
  });
});
