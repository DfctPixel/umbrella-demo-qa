import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly nextButton: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByPlaceholder('sam@company.com');
    this.passwordInput = page.getByPlaceholder('8 Characters minimum');
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.forgotPasswordLink = page.getByRole('button', { name: 'Forgot password' });
  }

  async goto(): Promise<void> {
    await this.navigate('/log_in');
  }

  async fillEmail(email: string): Promise<void> {
    await this.fillVisible(this.emailInput, email);
  }

  async clickNext(): Promise<void> {
    await this.clickVisible(this.nextButton);
  }

  async fillPassword(password: string): Promise<void> {
    await this.fillVisible(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.clickVisible(this.loginButton);
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.clickNext();
    await this.fillPassword(password);
    await this.clickLogin();
  }
}
