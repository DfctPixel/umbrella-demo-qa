import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly nextButton: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;

  constructor(public readonly page: Page) {
    this.emailInput = page.locator('[placeholder="sam@company.com"]');
    this.passwordInput = page.locator('[placeholder="8 Characters minimum"]');
    this.nextButton = page.locator('button:has-text("Next")');
    this.loginButton = page.locator('button:has-text("Login")');
    this.forgotPasswordLink = page.locator('button:has-text("Forgot password")');
    this.registerLink = page.locator('a:has-text("Register")');
  }

  async goto() {
    await this.page.goto('/log_in');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.clickNext();
    await this.fillPassword(password);
    await this.clickLogin();
  }
}
