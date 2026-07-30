import { expect } from '@playwright/test';
import { test } from '../../../helpers/fixtures';
import { CommitmentDashboardPage } from '../../../pages/CommitmentDashboardPage';

test.describe('Commitment CSV Export @ui', () => {

  const REQUIRED_HEADERS = ['Linked Account', 'Commitment', 'Expiration Date', 'Utilization Percent'];

  function pct(s: string): number {
    return parseFloat(s.replace(/[^0-9.]/g, ''));
  }

  function normalize(s: string): string {
    return s.replace(/\s+/g, ' ').trim();
  }

  async function verifyExport(
    page: import('@playwright/test').Page,
    commitmentPage: CommitmentDashboardPage,
    tableType: 'unutilized' | 'expiring',
  ) {
    const table = tableType === 'unutilized' ? commitmentPage.topUnutilizedTable : commitmentPage.topExpiringTable;
    const sectionHeadingText = tableType === 'unutilized' ? 'Top 10 Unutilized Commitment' : 'Top 10 Commitment Expiring Soon';

    await table.waitForData();
    const uiRows = await table.readRows();
    expect(uiRows.length, `UI table must have at least one row`).toBeGreaterThanOrEqual(1);

    const sectionHeading = page.getByText(sectionHeadingText);
    const exportSection = sectionHeading.locator('..').locator('..');
    const exportButton = exportSection.getByRole('button', { name: /Export as CSV/i });

    const csvRows = await table.exportToCsv(exportButton, page, `export-${tableType}.csv`);

    // CSV must have the same number of data rows as the UI table
    expect(csvRows.length, 'CSV row count must match UI row count').toBe(uiRows.length);

    // All required headers must be present in CSV output
    for (const header of REQUIRED_HEADERS) {
      expect(Object.keys(csvRows[0]), `CSV must contain required header: ${header}`).toContain(header);
    }

    // Match rows by composite key "Linked Account + Commitment + Expiration Date"
    const uiByKey = new Map<string, Record<string, string>>();
    for (const row of uiRows) {
      const key = `${normalize(row['Linked Account'] || '')}::${normalize(row['Commitment'] || '')}::${normalize(row['Expiration Date'] || '')}`;
      if (key !== '::::') uiByKey.set(key, row);
    }

    for (const csvRow of csvRows) {
      const key = `${normalize(csvRow['Linked Account'] || '')}::${normalize(csvRow['Commitment'] || '')}::${normalize(csvRow['Expiration Date'] || '')}`;
      expect(key, 'CSV row must have Linked Account, Commitment, and Expiration Date').not.toBe('::::');

      const uiRow = uiByKey.get(key);
      expect(uiRow, `CSV row "${key}" must have a matching UI row`).toBeDefined();

      // Text fields: exact normalized match
      expect(normalize(csvRow['Commitment']), `Commitment mismatch for ${key}`).toBe(normalize(uiRow!['Commitment'] || ''));
      expect(normalize(csvRow['Expiration Date']), `Expiration Date mismatch for ${key}`).toBe(normalize(uiRow!['Expiration Date'] || ''));

      // Financial field: Utilization Percent parsed as number
      const csvPct = pct(csvRow['Utilization Percent'] || '');
      const uiPct = pct(uiRow!['Utilization Percent'] || '');
      expect(Math.abs(csvPct - uiPct), `Utilization Percent mismatch for ${key}: CSV=${csvPct}% UI=${uiPct}%`).toBeLessThanOrEqual(0.5);
    }
  }

  test('export Top Unutilized table to CSV matching UI data', async ({ authenticatedPage: page }) => {
    const commitmentPage = new CommitmentDashboardPage(page);
    await commitmentPage.navigateTo();
    await commitmentPage.waitForLoad();
    await commitmentPage.assertUrlContains(/commitment\/dashboard/);
    await verifyExport(page, commitmentPage, 'unutilized');
  });

  test('export Top Expiring table to CSV matching UI data', async ({ authenticatedPage: page }) => {
    const commitmentPage = new CommitmentDashboardPage(page);
    await commitmentPage.navigateTo();
    await commitmentPage.waitForLoad();
    await commitmentPage.assertUrlContains(/commitment\/dashboard/);
    await verifyExport(page, commitmentPage, 'expiring');
  });
});
