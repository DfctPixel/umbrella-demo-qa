import { expect } from '@playwright/test';
import { test } from '../../../helpers/fixtures';
import { CommitmentDashboardPage } from '../../../pages/CommitmentDashboardPage';

function normalizeValue(val: string): string {
  return val.replace(/\s+/g, ' ').trim();
}

test.describe('Commitment CSV Export @ui', () => {
  test('export Top Unutilized table to CSV matching UI data', async ({ authenticatedPage: page }) => {
    const commitmentPage = new CommitmentDashboardPage(page);
    await commitmentPage.navigateTo();
    await commitmentPage.waitForLoad();
    await commitmentPage.assertUrlContains(/commitment\/dashboard/);

    const table = commitmentPage.topUnutilizedTable;
    await table.waitForData();
    const uiRows = await table.readRows();
    expect(uiRows.length).toBeGreaterThanOrEqual(1);

    const sectionHeading = page.getByText('Top 10 Unutilized Commitment');
    const exportSection = sectionHeading.locator('..').locator('..');
    const exportButton = exportSection.getByRole('button', { name: /Export as CSV/i });

    const csvRows = await table.exportToCsv(exportButton, page, 'export.csv');
    expect(csvRows.length).toBeGreaterThanOrEqual(1);

    const keyColumns = ['Linked Account', 'Commitment', 'Expiration Date', 'Utilization Percent'];
    for (let i = 0; i < Math.min(uiRows.length, csvRows.length); i++) {
      for (const col of keyColumns) {
        if (uiRows[i][col] && csvRows[i][col]) {
          expect(normalizeValue(uiRows[i][col])).toContain(normalizeValue(csvRows[i][col]));
        }
      }
    }
  });

  test('export Top Expiring table to CSV matching UI data', async ({ authenticatedPage: page }) => {

    const commitmentPage = new CommitmentDashboardPage(page);
    await commitmentPage.navigateTo();
    await commitmentPage.waitForLoad();
    await commitmentPage.assertUrlContains(/commitment\/dashboard/);

    const table = commitmentPage.topExpiringTable;
    await table.waitForData();
    const uiRows = await table.readRows();
    expect(uiRows.length).toBeGreaterThanOrEqual(1);

    const sectionHeading = page.getByText('Top 10 Commitment Expiring Soon');
    const exportSection = sectionHeading.locator('..').locator('..');
    const exportButton = exportSection.getByRole('button', { name: /Export as CSV/i });

    const csvRows = await table.exportToCsv(exportButton, page, 'export-expiring.csv');
    expect(csvRows.length).toBeGreaterThanOrEqual(1);

    const keyColumns = ['Linked Account', 'Commitment', 'Expiration Date', 'Utilization Percent'];
    for (let i = 0; i < Math.min(uiRows.length, csvRows.length); i++) {
      for (const col of keyColumns) {
        if (uiRows[i][col] && csvRows[i][col]) {
          expect(normalizeValue(uiRows[i][col])).toContain(normalizeValue(csvRows[i][col]));
        }
      }
    }
  });
});
