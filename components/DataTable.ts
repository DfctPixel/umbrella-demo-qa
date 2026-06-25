import { Locator } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Reusable DataTable component.
 *
 * Encapsulates common table interactions: reading rows, exporting to CSV,
 * filtering out filter rows. Used by CommitmentDashboardPage and any
 * page with tabular data.
 */
export class DataTableComponent {
  constructor(private readonly table: Locator) {}

  /**
   * Read all data rows from the table as key-value pairs.
   * Uses the table's <thead> for column headers and skips rows
   * that contain <input> elements (filter rows).
   */
  async readRows(): Promise<Record<string, string>[]> {
    const headerCells = this.table.locator('thead tr').first().locator('th, td');
    const headerCount = await headerCells.count();
    const headers: string[] = [];
    for (let i = 0; i < headerCount; i++) {
      headers.push(((await headerCells.nth(i).textContent()) || '').trim());
    }

    const allRows = this.table.locator('tbody tr');
    const rowCount = await allRows.count();
    const result: Record<string, string>[] = [];

    for (let r = 0; r < rowCount; r++) {
      const row = allRows.nth(r);
      // Skip filter rows that contain input elements
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

  /**
   * Get the number of data rows (excluding filter rows).
   */
  async getRowCount(): Promise<number> {
    const rows = await this.readRows();
    return rows.length;
  }

  /**
   * Wait for at least one data row to be visible.
   */
  async waitForData(timeout = 10_000): Promise<void> {
    await this.table.locator('tbody tr').first().waitFor({ state: 'visible', timeout });
  }

  /**
   * Click an Export as CSV button associated with this table's section,
   * download the file, and parse it.
   */
  async exportToCsv(
    exportButton: Locator,
    page: any,
    fileName: string
  ): Promise<Record<string, string>[]> {
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15_000 }),
      exportButton.click(),
    ]);

    const downloadPath = path.resolve('test-results', fileName);
    await download.saveAs(downloadPath);
    const csvText = fs.readFileSync(downloadPath, 'utf-8');
    const csvRows = this.parseCsv(csvText);

    try { fs.unlinkSync(downloadPath); } catch { /* ignore */ }
    return csvRows;
  }

  private parseCsv(csvText: string): Record<string, string>[] {
    const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = this.parseCsvLine(lines[0]);
    return lines.slice(1).map((line) => {
      const values = this.parseCsvLine(line);
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
      return row;
    });
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '',
      inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; } else { inQuotes = !inQuotes; }
      } else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; } else { current += char; }
    }
    result.push(current.trim());
    return result;
  }
}
