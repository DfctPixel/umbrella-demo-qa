/**
 * Centralized selector configuration.
 *
 * Single source of truth for all UI locators. Update selectors here
 * to propagate changes across all page objects. Enables easy
 * support for multiple environments or mobile variants.
 */

export const COMMITMENT_DASHBOARD_SELECTORS = {
  heading: 'h3:has-text("Commitment Dashboard")',
  topUnutilized: 'text=Top 10 Unutilized Commitment',
  topExpiring: 'text=Top 10 Commitment Expiring Soon',
  exportCsv: 'button:has-text("Export as CSV")',
  table: 'table',
} as const;
