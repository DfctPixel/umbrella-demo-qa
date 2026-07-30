import { expect } from '@playwright/test';
import { test } from '../../../helpers/fixtures';
import { CommitmentDashboardPage } from '../../../pages/CommitmentDashboardPage';

test.describe('Commitment CSV Export @ui', () => {

  /**
   * Exact mapping from canonical UI column names to the raw CSV column names
   * emitted by the export endpoint.  "Utilization Percent" is derived from
   * UsedCommitment / TotalCommitment × 100 rather than a raw CSV field.
   *
   * Verified export contract (2026-07-30): {EndDateTime, SavingsPlanARN,
   * UsedCommitment, TotalCommitment}.
   */
  const CSV_HEADERS = {
    linkedAccount:    'Linked Account',
    commitment:       'SavingsPlanARN',
    expirationDate:  'EndDateTime',
    usedAmount:      'UsedCommitment',
    totalAmount:     'TotalCommitment',
  } as const;

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

    expect(csvRows.length, 'CSV row count must match UI row count').toBe(uiRows.length);

    const csvHeaders = Object.keys(csvRows[0]);

    // Assert every expected CSV header exists
    for (const [key, expected] of Object.entries(CSV_HEADERS)) {
      expect(csvHeaders, `CSV must contain "${expected}" (mapped from ${key})`).toContain(expected);
    }

    // Build UI lookup key from canonical field names
    const uiByKey = new Map<string, Record<string, string>>();
    for (const row of uiRows) {
      const key = `${normalize(row['Linked Account'] || '')}::${normalize(row['Commitment'] || '')}::${normalize(row['Expiration Date'] || '')}`;
      if (key !== '::::') uiByKey.set(key, row);
    }

    for (const csvRow of csvRows) {
      const csvLinked   = normalize(csvRow[CSV_HEADERS.linkedAccount] || '');
      const csvCommit   = normalize(csvRow[CSV_HEADERS.commitment] || '');
      const csvExpiry   = normalize(csvRow[CSV_HEADERS.expirationDate] || '');
      const key = `${csvLinked}::${csvCommit}::${csvExpiry}`;

      expect(key, 'CSV row must have all mapped fields').not.toBe('::::');

      const uiRow = uiByKey.get(key);
      expect(uiRow, `CSV row "${key}" must have a matching UI row`).toBeDefined();

      // Text fields: exact normalized match
      expect(normalize(csvRow[CSV_HEADERS.commitment] || ''), `Commitment mismatch for ${key}`)
        .toBe(normalize(uiRow!['Commitment'] || ''));
      expect(normalize(csvRow[CSV_HEADERS.expirationDate] || ''), `Expiration Date mismatch for ${key}`)
        .toBe(normalize(uiRow!['Expiration Date'] || ''));

      // Financial field: utilization = used / total × 100
      const used  = parseFloat(csvRow[CSV_HEADERS.usedAmount] || '0');
      const total = parseFloat(csvRow[CSV_HEADERS.totalAmount] || '0');
      const csvUtilPct = total > 0 ? (used / total) * 100 : 0;

      const uiPct = parseFloat((uiRow!['Utilization Percent'] || '').replace(/[^0-9.]/g, ''));
      expect(Math.abs(csvUtilPct - uiPct), `Utilization Percent mismatch for ${key}: CSV=${csvUtilPct.toFixed(2)}% UI=${uiPct.toFixed(2)}%`)
        .toBeLessThanOrEqual(0.5);
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
