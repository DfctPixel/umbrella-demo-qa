import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AnomalyDetectionPage extends BasePage {
  readonly heading: Locator;
  readonly costAnomaliesTab: Locator;
  readonly newServicesTab: Locator;
  readonly anomalyList: Locator;
  readonly alertConfigurationButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /Anomaly Detection/i });
    this.costAnomaliesTab = page.getByRole('tab', { name: /Cost Anomalies/i });
    this.newServicesTab = page.getByRole('tab', { name: /New Services/i });
    this.anomalyList = page.locator('[role="rowgroup"]');
    this.alertConfigurationButton = page.getByText(/Alert configuration/i);
  }

  async navigateTo() {
    await this.navigate('/monitoring/anomaly-detection');
    await this.waitForUrl(/anomaly-detection/, { timeout: 15_000 });
  }

  async waitForLoad() {
    await this.heading.waitFor({ state: 'visible', timeout: 30_000 });
    await this.waitForLoadState('networkidle');
  }

  async getAnomalyCount(): Promise<number> {
    return this.anomalyList.getByRole('row').count();
  }
}
