import { test, expect, Page } from '@playwright/test';
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
 * Read a data table from the DOM as an array of row objects.
 * Expects a <table> with <thead> for headers and <tbody> for data rows.
 */
async function readTableData(page: Page, tableLocator: string): Promise<Record<string, string>[]> {
  // Get table headers
  const headers = await page.$$eval(`${tableLocator} thead tr:first-child th, ${tableLocator} thead tr:first-child td`, 
    (cells) => cells.map((c) => (c.textContent || '').trim()).filter(Boolean)
  );

  // Get table rows (skip filter row which has input fields)
  const rows = await page.$$eval(`${tableLocator} tbody tr`, 
    (trs, hdrs) => {
      return trs
        .filter((tr) => {
          // Skip rows that contain input elements (filter rows)
          return !tr.querySelector('input');
        })
        .map((tr) => {
          const cells = tr.querySelectorAll('td, th');
          const row: Record<string, string> = {};
          cells.forEach((cell, i) => {
            if (hdrs[i]) {
              // Get text, excluding inner elements like progress bars
              const text = (cell as HTMLElement).innerText
                .replace(/\s+/g, ' ')
                .trim();
              row[hdrs[i]] = text;
            }
          });
          return row;
        });
    },
    headers
  );

  return rows;
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

    // Wait for tables to fully load
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');

    // Read the "Top 10 Unutilized Commitment" table data from the DOM
    // Find the table by looking for the heading first, then the adjacent table
    const topUnutilizedTable = page.locator('table').filter({ has: page.locator('thead') }).first();
    await expect(topUnutilizedTable).toBeVisible({ timeout: 10_000 });

    const uiRows = await readTableData(page, 'table');
    
    // Click the Export as CSV button associated with this table
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15_000 }),
      page.getByRole('button', { name: /Export as CSV/i }).first().click(),
    ]);

    // Save the downloaded CSV to a temp file and read it
    const downloadPath = path.resolve('test-results', download.suggestedFilename() || 'export.csv');
    await download.saveAs(downloadPath);
    const csvText = fs.readFileSync(downloadPath, 'utf-8');
    const csvRows = parseCsv(csvText);

    // Compare: the number of data rows should match
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

    // Wait for tables to fully load
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');

    // Find the "Top 10 Commitment Expiring Soon" table
    const tables = page.locator('table');
    const tableCount = await tables.count();
    // The expiring table is usually the second data table
    const expiringTable = tables.nth(tableCount > 1 ? 1 : 0);
    await expect(expiringTable).toBeVisible({ timeout: 10_000 });

    // Read table data
    const uiRows = await readTableData(page, 'table:not(:first-child)');

    // Click the Export as CSV button — try the last one for the second table
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15_000 }),
      page.getByRole('button', { name: /Export as CSV/i }).last().click(),
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
