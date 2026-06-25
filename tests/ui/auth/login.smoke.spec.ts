import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { DashboardPage } from '../../../pages/DashboardPage';
import { USER_EMAIL, USER_PASSWORD } from '../../../helpers/auth/types';

test.describe('Login Smoke @ui', () => {
  test('login page renders', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15_000 });
    await expect(loginPage.nextButton).toBeVisible();
  });

  test('valid login redirects to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    await loginPage.goto();
    await loginPage.login(USER_EMAIL, USER_PASSWORD);
    await dashboardPage.waitForDashboardLoad();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(dashboardPage.mtdCost).toBeVisible({ timeout: 15_000 });
  });

  test('empty credentials shows disabled button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.nextButton).toBeDisabled();
    await expect(page).toHaveURL(/\/log_in/);
  });

  test('forgot password link visible on password step', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillEmail(USER_EMAIL);
    await loginPage.clickNext();
    await expect(loginPage.forgotPasswordLink).toBeVisible({ timeout: 10_000 });
  });
});
