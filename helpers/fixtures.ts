import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { USER_EMAIL, USER_PASSWORD } from './auth/types';

/**
 * Authenticated fixture: logs in once via UI and provides a page
 * that is already on the dashboard. Cuts repeated `LoginPage → login()
 * → DashboardPage.waitForDashboardLoad()` from every UI spec's beforeEach.
 */
export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USER_EMAIL, USER_PASSWORD);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardLoad();

    // Provide the authenticated page to the test
    await use(page);
  },
});

export { expect } from '@playwright/test';
