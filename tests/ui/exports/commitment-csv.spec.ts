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

  /**
   * Normalize a date from either format to ISO day string "YYYY-MM-DD".
   * - CSV: "2024-07-01T00:00:00" → "2024-07-01"
   * - UI:  "07/01/2024"           → "2024-07-01"
   * Throws on unrecognised input.
   */
  function normalizeDate(raw: string): string {
    const s = raw.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) return `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`;
    throw new Error(`Cannot normalise date: "${raw}"`);
  }

  /**
   * Parse a raw CSV amount as a finite positive number.
   * Accepts optional leading `$` and comma-grouped thousands.
   * Throws on NaN, Infinity, embedded non-numeric characters, or empty input.
   */
  function strictParseAmount(raw: string): number {
    if (typeof raw !== 'string' || raw.trim() === '') {
      throw new Error(`Amount must be a non-empty string, got ${typeof raw}`);
    }
    const trimmed = raw.trim();
    const cleaned = trimmed.replace(/^[\$€£]/, '').replace(/,/g, '').trim();
    if (!/^\d+(\.\d+)?$/.test(cleaned)) {
      throw new Error(
        `Amount must be a decimal number, got "${raw}" (cleaned: "${cleaned}"). ` +
        `Expected format: optional currency symbol + digits + optional decimal.`,
      );
    }
    const n = parseFloat(cleaned);
    if (!Number.isFinite(n) || n < 0) {
      throw new Error(`Amount must be a finite non-negative number, got "${raw}" (${n})`);
    }
    return n;
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

    // Build UI indexes.  Both key formats normalise dates so they match
    // the CSV-side values after normalisation.
    const uiByFullKey = new Map<string, Record<string, string>>();
    const uiByArnKey  = new Map<string, Record<string, string>>();
    const seenArns    = new Set<string>();
    for (const row of uiRows) {
      const commitment = normalize(row['Commitment'] || '');
      const account    = normalize(row['Linked Account'] || '');
      const expiry     = normalizeDate(row['Expiration Date'] || '');
      if (account) {
        uiByFullKey.set(`${account}::${commitment}::${expiry}`, row);
      }
      if (commitment) {
        if (seenArns.has(commitment)) {
          throw new Error(
            `Duplicate ARN "${commitment}" in UI table — the ARN-only index would be ambiguous. ` +
            `Either the CSV export must carry an account column, or commitments must be unique.`,
          );
        }
        seenArns.add(commitment);
        uiByArnKey.set(commitment, row);
      }
    }

    for (const csvRow of csvRows) {
      const csvCommit  = normalize(csvRow[CSV_HEADERS.commitment] || '');
      const csvExpiry  = normalize(csvRow[CSV_HEADERS.expirationDate] || '');

      expect(csvCommit, 'CSV row must have a SavingsPlanARN').toBeTruthy();

      // Choose the lookup strategy based on whether the CSV carries an
      // account column — never mix the two.
      let uiRow: Record<string, string> | undefined;
      if (csvAccountField) {
        const csvAccount = normalize(csvRow[csvAccountField] || '');
        const fullKey    = `${csvAccount}::${csvCommit}::${csvExpiry}`;
        uiRow = uiByFullKey.get(fullKey);
        expect(uiRow,
          `CSV row with account field must match UI composite key "${fullKey}"`,
        ).toBeDefined();
      } else {
        uiRow = uiByArnKey.get(csvCommit);
        expect(uiRow,
          `CSV row without account field must match ARN "${csvCommit}" in UI`,
        ).toBeDefined();
      }

      // Text field: commitment (ARN) — must match
      expect(csvCommit, `Commitment mismatch for ${csvCommit}`)
        .toBe(normalize(uiRow!['Commitment'] || ''));

      // Date field: normalise both sides to "YYYY-MM-DD"
      const csvDate = normalizeDate(csvExpiry);
      const uiDate  = normalizeDate(uiRow!['Expiration Date'] || '');
      expect(csvDate, `Expiration Date mismatch for ${csvCommit}`).toBe(uiDate);

      // Utilization = used / total × 100
      const used        = strictParseAmount(csvRow[CSV_HEADERS.usedAmount] || '');
      const total       = strictParseAmount(csvRow[CSV_HEADERS.totalAmount] || '');
      const csvUtilPct  = total > 0 ? (used / total) * 100 : 0;

      const uiPct = parseFloat((uiRow!['Utilization Percent'] || '').replace(/[^0-9.]/g, ''));
      expect(Math.abs(csvUtilPct - uiPct),
        `Utilization mismatch for ${csvCommit}: CSV=${csvUtilPct.toFixed(2)}% UI=${uiPct.toFixed(2)}%`)
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
