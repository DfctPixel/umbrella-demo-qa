/**
 * Centralized selector configuration.
 *
 * Single source of truth for all UI locators. Update selectors here
 * to propagate changes across all page objects. Enables easy
 * support for multiple environments or mobile variants.
 */

export const LOGIN_SELECTORS = {
  emailInput: '[placeholder="sam@company.com"]',
  passwordInput: '[placeholder="8 Characters minimum"]',
  nextButton: 'button:has-text("Next")',
  loginButton: 'button:has-text("Login")',
  forgotPassword: 'button:has-text("Forgot password")',
  registerLink: 'a:has-text("Register")',
} as const;

export const SIDEBAR_SELECTORS = {
  topItem: (id: string) => `#sideBarItemButton-${id}`,
  subItem: (id: string) => `#innerSideBarItemButton-${id}`,
} as const;

export const DASHBOARD_SELECTORS = {
  mtdCost: 'text=MTD cost',
  previousMonthCost: 'text=Previous Month Total Cost',
  forecastingCard: 'text=Forecasted Monthly Cost',
  annualSavings: 'text=Annual Potential Savings',
  recommendations: 'text=New Recommendations',
} as const;

export const COMMITMENT_DASHBOARD_SELECTORS = {
  heading: 'h3:has-text("Commitment Dashboard")',
  topUnutilized: 'text=Top 10 Unutilized Commitment',
  topExpiring: 'text=Top 10 Commitment Expiring Soon',
  exportCsv: 'button:has-text("Export as CSV")',
  table: 'table',
} as const;

export const ANOMALY_SELECTORS = {
  heading: 'h3:has-text("Anomaly Detection")',
  costAnomaliesTab: 'role=tab[name="Cost Anomalies"]',
  newServicesTab: 'role=tab[name="New Services"]',
  searchInput: 'input[placeholder="Search"]',
  alertConfig: 'text=Alert configuration',
} as const;

export const BUDGET_SELECTORS = {
  heading: 'h3:has-text("Budget")',
  createBudgetButton: 'button:has-text("Create Budget")',
  currentBudgetsTab: 'role=tab[name="Current Budgets"]',
  budgetSummaryTab: 'role=tab[name="Budget Summary"]',
} as const;

export const CAUI_SELECTORS = {
  heading: 'h3:has-text("Cost & Usage Explorer")',
  totalCost: 'text=Total Cost',
  searchInput: 'input[placeholder="Search"]',
  groupByService: 'text=Group By:',
} as const;
