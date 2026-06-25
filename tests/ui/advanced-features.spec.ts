import { expect } from '@playwright/test';
import { test } from '../../helpers/fixtures';
import { BudgetPage } from '../../pages/BudgetPage';
import { AnomalyDetectionPage } from '../../pages/AnomalyDetectionPage';

test.describe('UI Advanced Features @ui', () => {
  // Uses authenticated fixture — no login boilerplate needed

  // Budget disabled state has no API equivalent — kept as UI test
  test('should show Budget page with Create Budget button disabled', async ({ page }) => {
    const budgetPage = new BudgetPage(page);

    await budgetPage.navigateTo();
    await budgetPage.waitForLoad();

    await expect(budgetPage.heading).toBeVisible({ timeout: 15_000 });
    await expect(budgetPage.currentBudgetsTab).toBeVisible();

    const isDisabled = await budgetPage.isCreateBudgetDisabled();
    expect(isDisabled).toBeTruthy();
  });

  // AnomalyDetectionPage was built but orphaned — wire it into a smoke test
  // Anomaly Detection data is validated via faster API tests (commitment-anomaly.spec.ts).
  // This UI test verifies the page renders correctly with navigation and key elements.
  test('should navigate to Anomaly Detection and display page structure', async ({ page }) => {
    const anomalyPage = new AnomalyDetectionPage(page);

    await anomalyPage.navigateTo();
    await anomalyPage.waitForLoad();

    await expect(anomalyPage.heading).toBeVisible({ timeout: 15_000 });
    await expect(anomalyPage.costAnomaliesTab).toBeVisible();
    await expect(anomalyPage.newServicesTab).toBeVisible();
  });
});
