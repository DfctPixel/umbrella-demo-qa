import { expect } from '@playwright/test';
import { test } from '../../../helpers/fixtures';
import { CommitmentDashboardPage } from '../../../pages/CommitmentDashboardPage';

test.describe('Commitment CSV Export @ui', () => {

  /**
   * Exact mapping from canonical UI column names to the raw CSV column names
   * emitted by the export endpoint.
   *
   * Verified export contract (2026-07-30): {EndDateTime, SavingsPlanARN,
   * UsedCommitment, TotalCommitment}.
   *
   * The composite key uses SavingsPlanARN (unique per commitment) rather
   * than a UI-displayed account name, because the export may omit the
   * account identifier column.  If the CSV does expose an account-like
   * header, it is included in the key when present.
   */
  const CSV_HEADERS = {
    commitment:       'SavingsPlanARN',
    expirationDate:  'EndDateTime',
    usedAmount:      'UsedCommitment',
    totalAmount:     'TotalCommitment',
  } as const;

  /** Candidate account-identifier fields that may appear in the CSV export. */
  const ACCOUNT_HEADER_CANDIDATES = [
    'Linked Account', 'Account', 'AccountName', 'Customer', 'CustomerName',
  ];

  const REQUIRED = Object.values(CSV_HEADERS);

  function normalize(s: string): string {
    return s.replace(/\s+/g, ' ').trim();
  }

  function detectAccountHeader(csvHeaders: string[]): string | null {
    return ACCOUNT_HEADER_CANDIDATES.find(h => csvHeaders.includes(h)) ?? null;
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

    // Require every mapped contract header
    for (const h of REQUIRED) {
      expect(csvHeaders, `CSV export must contain header "${h}"`).toContain(h);
    }

    const csvAccountField = detectAccountHeader(csvHeaders);

    // Build UI lookup key: primary key is commitment name, fall back to
    // account+commitment+expiry when all three are available.
    const uiByKey = new Map<string, Record<string, string>>();
    for (const row of uiRows) {
      const commitment = normalize(row['Commitment'] || '');
      const account    = normalize(row['Linked Account'] || '');
      const expiry     = normalize(row['Expiration Date'] || '');
      const key = account ? `${account}::${commitment}::${expiry}` : commitment;
      if (key) uiByKey.set(key, row);
    }

    for (const csvRow of csvRows) {
      const csvCommit = normalize(csvRow[CSV_HEADERS.commitment] || '');
      const csvExpiry = normalize(csvRow[CSV_HEADERS.expirationDate] || '');

      // Build CSV-side key. Use account field when available.
      const csvAccount = csvAccountField ? normalize(csvRow[csvAccountField] || '') : '';
      const key = csvAccount ? `${csvAccount}::${csvCommit}::${csvExpiry}` : csvCommit;

      expect(key, 'CSV row must have at minimum a SavingsPlanARN').toBeTruthy();

      const uiRow = uiByKey.get(key);
      expect(uiRow, `CSV row "${key}" must have a matching UI row`).toBeDefined();

      // Text fields
      expect(csvCommit, `Commitment mismatch for ${key}`)
        .toBe(normalize(uiRow!['Commitment'] || ''));

      // Expiration Date comparison: ISO date in CSV vs UI display label
      const csvDate = new Date(csvExpiry).toISOString().slice(0, 10);
      const uiParts = (uiRow!['Expiration Date'] || '').split('/');
      const uiDate = uiParts.length === 3
        ? `${uiParts[2]}-${uiParts[0].padStart(2, '0')}-${uiParts[1].padStart(2, '0')}`
        : csvExpiry;
      expect(csvDate, `Expiration Date mismatch for ${key}`).toBe(uiDate);

      // Utilization = used / total × 100
      const used  = parseFloat(csvRow[CSV_HEADERS.usedAmount] || '0');
      const total = parseFloat(csvRow[CSV_HEADERS.totalAmount] || '0');
      const csvUtilPct = total > 0 ? (used / total) * 100 : 0;

      const uiPct = parseFloat((uiRow!['Utilization Percent'] || '').replace(/[^0-9.]/g, ''));
      expect(Math.abs(csvUtilPct - uiPct),
        `Utilization mismatch for ${key}: CSV=${csvUtilPct.toFixed(2)}% UI=${uiPct.toFixed(2)}%`)
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
