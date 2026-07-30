import { expect } from '@playwright/test';
import { test } from '../../../helpers/fixtures';
import { CommitmentDashboardPage } from '../../../pages/CommitmentDashboardPage';

test.describe('Commitment CSV Export @ui', () => {

  /**
   * Map from canonical UI column names to the actual raw CSV column names
   * emitted by the export endpoint.  Each canonical name may match one of
   * several possible CSV headers depending on the export contract version.
   *
   * TODO: agree the exact export field set with the product/API owner and
   * reduce this to a 1:1 mapping.
   */
  const FIELD_MAP: Record<string, string[]> = {
    'Linked Account':    ['Linked Account', 'Account', 'AccountName', 'Customer', 'CustomerName'],
    'Commitment':        ['Commitment', 'PlanType', 'SavingsPlan', 'ReservedInstance', 'SavingsPlanARN'],
    'Expiration Date':   ['Expiration Date', 'EndDate', 'EndDateTime', 'Expiry', 'ExpiryDate'],
    'Utilization Percent': ['Utilization', 'UtilizationPercent', 'UtilizationPct', 'UsagePct', 'Utilization %'],
  };

  function resolveField(csvHeaders: string[], canonical: string): string {
    const candidates = FIELD_MAP[canonical];
    if (!candidates) throw new Error(`Unknown canonical field "${canonical}"`);
    const match = candidates.find(h => csvHeaders.includes(h));
    if (!match) throw new Error(
      `CSV export is missing a header that maps to "${canonical}". ` +
      `Searched: [${candidates.join(', ')}]. Actual headers: [${csvHeaders.join(', ')}]. ` +
      `Update FIELD_MAP with the correct raw column name.`,
    );
    return match;
  }

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

    expect(csvRows.length, 'CSV row count must match UI row count').toBe(uiRows.length);

    const csvHeaders = Object.keys(csvRows[0]);

    // Resolve the actual CSV column name for each canonical field.
    // Throws with a descriptive error when a mapping is missing.
    const csvLinkedAccount   = resolveField(csvHeaders, 'Linked Account');
    const csvCommitment      = resolveField(csvHeaders, 'Commitment');
    const csvExpirationDate  = resolveField(csvHeaders, 'Expiration Date');
    const csvUtilPct         = resolveField(csvHeaders, 'Utilization Percent');

    // Build UI lookup key from canonical field names
    const uiByKey = new Map<string, Record<string, string>>();
    for (const row of uiRows) {
      const key = `${normalize(row['Linked Account'] || '')}::${normalize(row['Commitment'] || '')}::${normalize(row['Expiration Date'] || '')}`;
      if (key !== '::::') uiByKey.set(key, row);
    }

    for (const csvRow of csvRows) {
      const key = `${normalize(csvRow[csvLinkedAccount] || '')}::${normalize(csvRow[csvCommitment] || '')}::${normalize(csvRow[csvExpirationDate] || '')}`;
      expect(key, 'CSV row must have all fields mapped').not.toBe('::::');

      const uiRow = uiByKey.get(key);
      expect(uiRow, `CSV row "${key}" must have a matching UI row`).toBeDefined();

      expect(normalize(csvRow[csvCommitment]), `Commitment mismatch for ${key}`)
        .toBe(normalize(uiRow!['Commitment'] || ''));
      expect(normalize(csvRow[csvExpirationDate]), `Expiration Date mismatch for ${key}`)
        .toBe(normalize(uiRow!['Expiration Date'] || ''));

      const csvPct = pct(csvRow[csvUtilPct] || '');
      const uiPct  = pct(uiRow!['Utilization Percent'] || '');
      expect(Math.abs(csvPct - uiPct), `Utilization Percent mismatch for ${key}: CSV=${csvPct}% UI=${uiPct}%`)
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
