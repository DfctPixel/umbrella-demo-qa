import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CommitmentDashboardPage } from '../../pages/CommitmentDashboardPage';
import { AnomalyDetectionPage } from '../../pages/AnomalyDetectionPage';
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

  test('should navigate to Commitment Dashboard and display charts', async ({ page }) => {
    const commitmentPage = new CommitmentDashboardPage(page);

    await commitmentPage.navigateTo();
    await commitmentPage.waitForLoad();

    await expect(page).toHaveURL(/commitment\/dashboard/);
    await expect(commitmentPage.heading).toBeVisible({ timeout: 15_000 });

    // Verify key chart sections are present
    const chartsVisible = await Promise.allSettled([
      expect(commitmentPage.monthlyUsageChart).toBeVisible({ timeout: 10_000 }).then(() => true).catch(() => false),
      expect(commitmentPage.topUnutilizedTable).toBeVisible({ timeout: 10_000 }).then(() => true).catch(() => false),
      expect(commitmentPage.topExpiringTable).toBeVisible({ timeout: 10_000 }).then(() => true).catch(() => false),
    ]);

    const visibleCount = chartsVisible.filter((r) => r.status === 'fulfilled' && r.value).length;
    expect(visibleCount).toBeGreaterThanOrEqual(2);
  });

  test('should display anomaly detection page with data', async ({ page }) => {
    const anomalyPage = new AnomalyDetectionPage(page);

    await anomalyPage.navigateTo();
    await anomalyPage.waitForLoad();

    await expect(anomalyPage.heading).toBeVisible({ timeout: 15_000 });
    await expect(anomalyPage.costAnomaliesTab).toBeVisible();

    // Anomaly data should be present (confirmed during exploration — real anomalies exist)
    const anomalyCount = await anomalyPage.getAnomalyCount();
    expect(anomalyCount).toBeGreaterThanOrEqual(1);
  });

  test('should show Budget page with Create Budget button disabled', async ({ page }) => {
    const budgetPage = new BudgetPage(page);

    await budgetPage.navigateTo();
    await budgetPage.waitForLoad();

    await expect(budgetPage.heading).toBeVisible({ timeout: 15_000 });
    await expect(budgetPage.currentBudgetsTab).toBeVisible();

    // Confirmed during exploration: "Create Budget" button is disabled for this user
    const isDisabled = await budgetPage.isCreateBudgetDisabled();
    expect(isDisabled).toBeTruthy();
  });
});
