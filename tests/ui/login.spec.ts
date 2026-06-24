import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { USER_EMAIL, USER_PASSWORD } from '../../helpers/auth';

test.describe('UI Login Flow @ui', () => {
  test('should navigate to login page and display login form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Verify we're on the login page
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15_000 });
    await expect(loginPage.nextButton).toBeVisible();
  });

  test('should successfully log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(USER_EMAIL, USER_PASSWORD);

    // Wait for dashboard to load
    await dashboardPage.waitForDashboardLoad();
    await expect(page).toHaveURL(/\/dashboard/);

    // Verify key dashboard elements are present
    await expect(dashboardPage.mtdCost).toBeVisible({ timeout: 15_000 });
  });

  test('should show error with empty credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // The Next button should be disabled when email field is empty
    await expect(loginPage.nextButton).toBeDisabled();

    // Should remain on login page
    await expect(page).toHaveURL(/\/log_in/);
  });

  test('should show forgot password option on password step', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // First fill email and click Next to reach the password step
    await loginPage.fillEmail(USER_EMAIL);
    await loginPage.clickNext();

    // The Forgot password button should be visible on the password step
    await expect(loginPage.forgotPasswordLink).toBeVisible({ timeout: 10_000 });

    // Clicking the button should be possible and not cause an error
    await loginPage.forgotPasswordLink.click();
    await page.waitForTimeout(1000);

    // Verify we are still on the Umbrella domain (no navigation error)
    expect(page.url()).toContain('umbrellacost');
  });
});
