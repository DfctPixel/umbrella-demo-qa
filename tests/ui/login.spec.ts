import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { USER_EMAIL, USER_PASSWORD } from '../../helpers/auth';

test.describe('UI Login Flow @ui', () => {
  // Login tests DON'T use the authenticated fixture — they test the login flow itself
  test('should navigate to login page and display login form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.emailInput).toBeVisible({ timeout: 15_000 });
    await expect(loginPage.nextButton).toBeVisible();
  });

  test('should successfully log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(USER_EMAIL, USER_PASSWORD);

    await dashboardPage.waitForDashboardLoad();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(dashboardPage.mtdCost).toBeVisible({ timeout: 15_000 });
  });

  test('should show error with empty credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.nextButton).toBeDisabled();
    await expect(page).toHaveURL(/\/log_in/);
  });

  test('should show forgot password option on password step', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.fillEmail(USER_EMAIL);
    await loginPage.clickNext();

    await expect(loginPage.forgotPasswordLink).toBeVisible({ timeout: 10_000 });
    await loginPage.forgotPasswordLink.click();

    // Verify the click didn't cause an error — still on the domain
    expect(page.url()).toContain('umbrellacost');
  });
});
