import { test, expect, Locator } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CommitmentDashboardPage } from '../../pages/CommitmentDashboardPage';
import { USER_EMAIL, USER_PASSWORD } from '../../helpers/auth';
import * as fs from 'fs';
import * as path from 'path';

function parseCsv(csvText: string): Record<string, string>[] {
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
    return row;
  });
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '', inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else { current += char; }
  }
  result.push(current.trim());
  return result;
}

async function readTableRows(table: Locator): Promise<Record<string, string>[]> {
  const headerCells = table.locator('thead tr').first().locator('th, td');
  const headerCount = await headerCells.count();
  const headers: string[] = [];
  for (let i = 0; i < headerCount; i++) {
    headers.push(((await headerCells.nth(i).textContent()) || '').trim());
  }
  const allRows = table.locator('tbody tr');
  const rowCount = await allRows.count();
  const result: Record<string, string>[] = [];
  for (let r = 0; r < rowCount; r++) {
    const row = allRows.nth(r);
    if ((await row.locator('input').count()) > 0) continue;
    const cells = row.locator('td, th');
    const cellCount = await cells.count();
    const entry: Record<string, string> = {};
    for (let c = 0; c < Math.min(cellCount, headers.length); c++) {
      const raw = ((await cells.nth(c).innerText()) || '').replace(/\s+/g, ' ').trim();
      entry[headers[c]] = raw;
    }
    if (Object.keys(entry).length > 0) result.push(entry);
  }
  return result;
}

function normalizeValue(val: string): string {
  return val.replace(/\s+/g, ' ').trim();
}

async function exportAndCompare(
  page: any, commitmentPage: CommitmentDashboardPage,
  headingText: string, fileName: string
) {
  await commitmentPage.navigateTo();
  await commitmentPage.waitForLoad();
  await expect(page).toHaveURL(/commitment\/dashboard/);

  // Use heading text for semantic table finding (not positional nth())
  const sectionHeading = page.getByText(headingText);
  await expect(sectionHeading).toBeVisible({ timeout: 15_000 });

  const table = page.locator('table').filter({ hasText: 'Linked Account' }).first();
  await expect(table).toBeVisible({ timeout: 10_000 });
  await expect(table.locator('tbody tr').first()).toBeVisible({ timeout: 10_000 });

  const uiRows = await readTableRows(table);
  expect(uiRows.length).toBeGreaterThanOrEqual(1);

  const exportSection = sectionHeading.locator('..').locator('..');
  const exportButton = exportSection.getByRole('button', { name: /Export as CSV/i });
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 15_000 }),
    exportButton.click(),
  ]);

  const downloadPath = path.resolve('test-results', fileName);
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
}

test.describe('Data Export Integrity @ui', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USER_EMAIL, USER_PASSWORD);
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForDashboardLoad();
  });

  test('should export Top Unutilized table to CSV matching UI data', async ({ page }) => {
    await exportAndCompare(page, new CommitmentDashboardPage(page), 'Top 10 Unutilized Commitment', 'export.csv');
  });

  test('should export Top Expiring table to CSV matching UI data', async ({ page }) => {
    await exportAndCompare(page, new CommitmentDashboardPage(page), 'Top 10 Commitment Expiring Soon', 'export-expiring.csv');
  });
});
