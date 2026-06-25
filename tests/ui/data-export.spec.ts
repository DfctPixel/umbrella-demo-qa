import { test, expect, Page, Locator } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CommitmentDashboardPage } from '../../pages/CommitmentDashboardPage';
import { USER_EMAIL, USER_PASSWORD } from '../../helpers/auth';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Parse CSV text into an array of row objects using the first row as headers.
 */
function parseCsv(csvText: string): Record<string, string>[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? '';
    });
    return row;
  });
}

/**
 * Parse a single CSV line, handling quoted fields.
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Read data rows from a <table> element in the DOM as an array of key-value pairs.
 * Uses the table's header row (first <tr> in <thead>) as keys.
 */
async function readTableRows(table: Locator): Promise<Record<string, string>[]> {
  // Get headers via Playwright locator API for proper auto-waiting
  const headerCells = table.locator('thead tr').first().locator('th, td');
  const headerCount = await headerCells.count();
  const headers: string[] = [];
  for (let i = 0; i < headerCount; i++) {
    headers.push(((await headerCells.nth(i).textContent()) || '').trim());
  }

  // Get data rows (skip filter rows containing <input> elements)
  const allRows = table.locator('tbody tr');
  const rowCount = await allRows.count();
  const result: Record<string, string>[] = [];

  for (let r = 0; r < rowCount; r++) {
    const row = allRows.nth(r);
    // Skip rows that contain input elements (filter rows)
    const inputs = row.locator('input');
    if ((await inputs.count()) > 0) continue;

    const cells = row.locator('td, th');
    const cellCount = await cells.count();
    const entry: Record<string, string> = {};

    for (let c = 0; c < Math.min(cellCount, headers.length); c++) {
      const raw = ((await cells.nth(c).innerText()) || '').replace(/\s+/g, ' ').trim();
      entry[headers[c]] = raw;
    }
    if (Object.keys(entry).length > 0) {
      result.push(entry);
    }
  }

  return result;
}

/**
 * Normalize a value for comparison: trim whitespace, collapse spaces.
 */
function normalizeValue(val: string): string {
  return val.replace(/\s+/g, ' ').trim();
}

test.describe('Data Export Integrity @ui', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USER_EMAIL, USER_PASSWORD);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardLoad();
  });

  test('should export Commitment Dashboard Top Unutilized table to CSV matching UI data', async ({ page }) => {
    const commitmentPage = new CommitmentDashboardPage(page);
    await commitmentPage.navigateTo();
    await commitmentPage.waitForLoad();

    await expect(page).toHaveURL(/commitment\/dashboard/);

    // Wait for the "Top 10 Unutilized Commitment" section heading + its table to be visible
    const sectionHeading = page.getByText('Top 10 Unutilized Commitment');
    await expect(sectionHeading).toBeVisible({ timeout: 15_000 });

    // The table following this heading — find via heading proximity
    const unutilizedTable = page.locator('table').filter({ hasText: 'Linked Account' }).first();
    await expect(unutilizedTable).toBeVisible({ timeout: 10_000 });
    await expect(unutilizedTable.locator('tbody tr').first()).toBeVisible({ timeout: 10_000 });

    // Read table data from the DOM
    const uiRows = await readTableRows(unutilizedTable);
    expect(uiRows.length).toBeGreaterThanOrEqual(1);

    // Click the Export as CSV button associated with this section
    // Find the Export button closest to this section heading
    const exportSection = sectionHeading.locator('..').locator('..');
    const exportButton = exportSection.getByRole('button', { name: /Export as CSV/i });
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15_000 }),
      exportButton.click(),
    ]);

    // Save the downloaded CSV to a temp file and read it
    const downloadPath = path.resolve('test-results', download.suggestedFilename() || 'export.csv');
    await download.saveAs(downloadPath);
    const csvText = fs.readFileSync(downloadPath, 'utf-8');
    const csvRows = parseCsv(csvText);

    expect(csvRows.length).toBeGreaterThanOrEqual(1);

    // Compare each row's key fields
    const keyColumns = ['Linked Account', 'Commitment', 'Expiration Date', 'Utilization Percent'];
    for (let i = 0; i < Math.min(uiRows.length, csvRows.length); i++) {
      for (const col of keyColumns) {
        if (uiRows[i][col] && csvRows[i][col]) {
          expect(normalizeValue(uiRows[i][col])).toContain(normalizeValue(csvRows[i][col]));
        }
      }
    }

    // Clean up the temp file
    try { fs.unlinkSync(downloadPath); } catch { /* ignore */ }
  });

  test('should export Commitment Dashboard Top Expiring table to CSV matching UI data', async ({ page }) => {
    const commitmentPage = new CommitmentDashboardPage(page);
    await commitmentPage.navigateTo();
    await commitmentPage.waitForLoad();

    await expect(page).toHaveURL(/commitment\/dashboard/);

    // Wait for the "Top 10 Commitment Expiring Soon" section heading + its table
    const sectionHeading = page.getByText('Top 10 Commitment Expiring Soon');
    await expect(sectionHeading).toBeVisible({ timeout: 15_000 });

    const expiringTable = page.locator('table').filter({ hasText: 'Expiration Date' }).first();
    await expect(expiringTable).toBeVisible({ timeout: 10_000 });
    await expect(expiringTable.locator('tbody tr').first()).toBeVisible({ timeout: 10_000 });

    // Read table data
    const uiRows = await readTableRows(expiringTable);
    expect(uiRows.length).toBeGreaterThanOrEqual(1);

    // Find the Export as CSV button for this section
    const exportSection = sectionHeading.locator('..').locator('..');
    const exportButton = exportSection.getByRole('button', { name: /Export as CSV/i });
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15_000 }),
      exportButton.click(),
    ]);

    const downloadPath = path.resolve('test-results', download.suggestedFilename() || 'export-expiring.csv');
    await download.saveAs(downloadPath);
    const csvText = fs.readFileSync(downloadPath, 'utf-8');
    const csvRows = parseCsv(csvText);

    expect(csvRows.length).toBeGreaterThanOrEqual(1);

    const keyColumns = ['Linked Account', 'Commitment', 'Expiration Date', 'Utilization Percent'];
    for (let i = 0; i < Math.min(uiRows.length, csvRows.length); i++) {
      for (const col of keyColumns) {
        if (uiRows[i][col] && csvRows[i][col]) {
          expect(normalizeValue(uiRows[i][col])).toContain(normalizeValue(csvRows[i][col]));
        }
      }
    }

    try { fs.unlinkSync(downloadPath); } catch { /* ignore */ }
  });
});
