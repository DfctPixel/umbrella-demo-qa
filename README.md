# Umbrella Demo QA

End-to-end test suite for the [Umbrella FinOps platform](https://dev.umbrellacost.dev), built with [Playwright](https://playwright.dev) and TypeScript. Covers both API and UI testing for cost management, authentication, and cloud resource monitoring features.

## Features

- **API Tests** — Direct API testing against `https://api.dev.umbrellacost.dev/api/v1`
  - Authentication flow (JWT token acquisition, token verification, error handling)
  - Cost & Usage Explorer endpoints (services, costs, budgets, anomalies, commitments, recommendations, K8s data, dashboard panels)
  - **Advanced FinOps**: Commitment Dashboard KPIs, Anomaly Detection list, Recommendations list, Tag Governance coverage, Cost Alert Rules, Partner Billing Summary
  - **Cross-Domain Invariants**: CAUI granularity consistency, anomaly cost bounds, non-negative savings, service cost sums
- **UI Tests** — Browser-based E2E testing at `https://dev.umbrellacost.dev`
  - Login flow (valid credentials, empty fields, forgot password navigation)
  - Dashboard navigation and cost data display
  - Cost & Usage Explorer (service search, cost visualization, filter counts)
  - Commitment Dashboard CSV export integrity (Top Unutilized, Top Expiring)
- **CI/CD** — GitHub Actions workflow runs API tests, UI tests, ESLint, and TypeScript type checking on push/PR

## Project Structure

```
├── components/
│   └── DataTable.ts                 # Reusable table component (read, export CSV, parse)
├── config/
│   └── selectors.ts                 # Centralized selector constants for all pages
├── helpers/
│   ├── fixtures.ts                  # Authenticated fixture (test.extend)
│   ├── auth/
│   │   ├── types.ts                 # Env vars, AuthTokens interface, AuthenticationError
│   │   └── auth-bootstrap.ts        # authenticate() and createAuthenticatedContext()
│   └── clients/
│       ├── auth.client.ts           # AuthClient (plain sub users, signin-with-token, notifications)
│       ├── cost-usage.client.ts     # CostUsageClient (CAUI, services, budgets, K8s, tags, recs, panels)
│       └── finops.client.ts         # FinOpsClient (commitments, anomalies, tag governance, alerts, billing)
├── pages/
│   ├── BasePage.ts                  # Abstract base class with shared navigation/element utilities + fluent assertions
│   ├── LoginPage.ts                 # Login page object model
│   ├── DashboardPage.ts             # Dashboard page object model (sidebar navigation)
│   ├── CostUsageExplorerPage.ts     # Cost & Usage Explorer page object model
│   └── CommitmentDashboardPage.ts   # Commitment Dashboard (SP/RI charts & tables via DataTable)
├── tests/
│   ├── api/
│   │   ├── auth/
│   │   │   └── auth.spec.ts         # API authentication tests (4 tests)
│   │   ├── cost-usage/
│   │   │   └── services.spec.ts     # API cost & usage data tests (8 tests)
│   │   └── finops/
│   │       ├── commitments.spec.ts  # API advanced FinOps tests (10 tests)
│   │       └── integrity.spec.ts    # Cross-domain invariant tests (5 tests)
│   └── ui/
│       ├── auth/
│       │   └── login.smoke.spec.ts  # UI login flow smoke tests (4 tests)
│       ├── journeys/
│       │   └── cost-usage.spec.ts   # UI Cost & Usage Explorer (3 tests)
│       └── exports/
│           └── commitment-csv.spec.ts # UI CSV export integrity (2 tests)
├── .github/workflows/ci.yml         # CI pipeline
├── eslint.config.mjs                # ESLint configuration
├── playwright.config.ts             # Playwright configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies and scripts
```

## Prerequisites

- [Node.js](https://nodejs.org) 18+ (LTS recommended)
- npm

## Setup

```bash
# Clone the repository
git clone https://github.com/DfctPixel/umbrella-demo-qa.git
cd umbrella-demo-qa

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Configure credentials (optional — defaults are set in helpers/auth/types.ts)
copy .env.example .env
```

## Running Tests

```bash
# Run all tests (API + UI)
npm test

# Run only API tests (headless)
npm run test:api

# Run only UI tests (headless)
npm run test:ui

# Run UI tests in headed mode (visible browser)
npm run test:headed

# Run tests with Playwright debugger
npm run test:debug

# View HTML test report
npm run report

# TypeScript type check
npx tsc --noEmit

# ESLint check
npm run lint
```

### Filtering by test name

```bash
# Run specific test file
npx playwright test tests/api/auth/auth.spec.ts

# Run tests with a specific tag
npx playwright test --grep "@ui"
npx playwright test --grep "@api"
```

## Test Suites

### API Tests (27 tests)

#### Auth (`tests/api/auth/auth.spec.ts`)

| Test Name | Description |
|---|---|
| `should successfully authenticate and receive JWT + refresh tokens` | JWT token acquisition and payload validation |
| `should verify identity via signin-with-token` | Post-authentication identity verification |
| `should reject wrong password (negative)` | Negative test for invalid credentials |
| `should reject expired or garbage JWT (negative)` | Negative test for invalid/expired tokens |

#### Cost & Usage (`tests/api/cost-usage/services.spec.ts`)

| Test Name | FinOps Domain | Description |
|---|---|---|
| `should fetch distinct service names` | **Cost Allocation** | Service name enumeration |
| `should fetch distinct service costs with non-negative values` | **Cost Allocation** | Cost sanity check (non-negative per service) |
| `should post CAUI query (monthly) and return cost data` | **Cost Mgmt** | Monthly cost aggregation query |
| `should post CAUI query (daily) and return cost data` | **Cost Mgmt** | Daily cost aggregation query |
| `should fetch budgets list` | **Budgets** | Budget metadata validation |
| `should fetch recommendations total and categories` | **Optimization** | Recommendations data validation |
| `should fetch custom dashboard panels` | **Reporting** | Dashboard panel/KPI widget validation |
| `should fetch K8s and tag cost data with non-negative values` | **Containers** | K8s workload + tag cost visibility |

#### FinOps Commitments (`tests/api/finops/commitments.spec.ts`)

| Test Name | FinOps Domain | Description |
|---|---|---|
| `should fetch commitment dashboard KPIs` | **Commitments** | Commitment Dashboard KPIs |
| `should fetch commitment utilization summary` | **Commitments** | Savings Plans utilization summary |
| `should fetch total savings for SP and RI` | **Commitments** | YTD savings from SP + RI |
| `should fetch anomaly stats` | **Anomalies** | Anomaly detection stats |
| `should fetch anomaly detection list` | **Anomalies** | Anomaly list with cost impact, delta, status |
| `should fetch anomaly alert rules` | **Anomalies** | Alert rule metadata validation |
| `should fetch tag governance coverage` | **Cost Allocation** | Tag coverage completeness |
| `should fetch tag governance resources` | **Cost Allocation** | Tagged resource paged list |
| `should fetch cost alert rules` | **Alerts** | Cost alert configuration |
| `should fetch partner billing summary` | **Partner Billing** | Partner billing summary with pagination |

#### Cross-Domain Invariants (`tests/api/finops/integrity.spec.ts`)

| Test Name | Description |
|---|---|
| `monthly CAUI total should roughly equal daily granularity` | Verifies CAUI consistency across granularities |
| `anomaly daily cost should not exceed total cost impact` | Verifies anomaly cost bounds |
| `recommendations should have non-negative savings` | Verifies annual/monthly savings >= 0 |
| `service costs should sum to a reasonable total` | Verifies total cost > 0 |
| `anomaly stats should be non-negative` | Verifies total/open counts >= 0 |

### UI Tests (9 tests)

| Suite | File | Description |
|---|---|---|
| Login Smoke | `tests/ui/auth/login.smoke.spec.ts` | Login form render, valid login, empty credentials, forgot password |
| Cost & Usage Journey | `tests/ui/journeys/cost-usage.spec.ts` | Navigation from sidebar, cost data display, service search filter |
| Commitment CSV Export | `tests/ui/exports/commitment-csv.spec.ts` | Top Unutilized CSV vs UI, Top Expiring CSV vs UI |

## Authentication Flow

The authentication system uses a multi-step JWT workflow:

1. **Realm check** — `GET /user-management/users/user-realm?username=...` (with `apikey: -1:-1:-1`)
2. **SSO** — `POST /users/sso` with `{"username":"..."}` (username only)
3. **Sign in** — `POST /users/signin` with `{"username":"...","password":"..."}` → returns `jwtToken` + `refreshToken`

> **Note:** Due to a Playwright `APIRequestContext` limitation where custom headers like `apikey` are stripped on some Node.js versions, authentication uses native Node.js `fetch()`. The authenticated context is then created with a Bearer JWT for subsequent Playwright API calls.

## Configuration

Key configuration in `playwright.config.ts`:

| Setting | Value |
|---|---|
| `baseURL` | `https://dev.umbrellacost.dev` |
| Timeout | 60 seconds |
| Trace | `on-first-retry` |
| Screenshot | `only-on-failure` |
| Video | `retain-on-failure` |
| Viewport (UI) | 1920×1080 |

The API base URL is configured via the `API_URL` environment variable (default: `https://api.dev.umbrellacost.dev/api/v1`).

## CI/CD

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs three parallel jobs:

- **test-api** — Runs all API tests (`--grep @api`)
- **test-ui** — Runs all UI tests (`--grep @ui`, headless Chromium)
- **lint** — ESLint + TypeScript type checking (`tsc --noEmit`)

## Page Objects

The project uses the Page Object Model pattern extending a shared `BasePage`:

- **`BasePage`** — Abstract base class with `navigate()`, `waitForLoadState()`, `waitForUrl()`, `clickVisible()`, `fillVisible()`, `getTextContent()`, fluent assertions (`assertVisible`, `assertHasText`, `assertUrlContains`, `assertDisabled`, `assertCount`)
- **`LoginPage`** — Email/password input, Next/Login buttons, forgot password link
- **`DashboardPage`** — MTD cost, sidebar navigation to Cost & Usage Explorer
- **`CostUsageExplorerPage`** — Total cost value (with `$`), search input, filtered count
- **`CommitmentDashboardPage`** — Commitment KPIs, SP/RI charts, Top Unutilized/Expiring tables (via `DataTableComponent`)

### Components

- **`DataTableComponent`** — Reusable table component with `readRows()`, `waitForData()`, `exportToCsv()`, `getRowCount()`. Used by `CommitmentDashboardPage`.

### Fixtures

- **`authenticatedPage`** — Custom fixture via `test.extend()` that logs in once via UI and provides a pre-authenticated page on the dashboard. Used by all journey and export tests.

## Environment Variables

See `.env.example` for the required environment variables:

| Variable | Description |
|---|---|
| `USER_EMAIL` | Login email for the Umbrella platform |
| `USER_PASSWORD` | Login password |
| `BASE_URL` | UI base URL (default: `https://dev.umbrellacost.dev`) |
| `API_URL` | API base URL (default: `https://api.dev.umbrellacost.dev/api/v1`) |

## Manual Test Scenarios

The following FinOps features are covered by automated tests at the API/read level but would benefit from **manual exploratory testing** for deeper validation, or require write operations that cannot be automated with the current user permissions:

| Area | Manual Test Ideas | Why Manual? | Read-Only API Coverage |
|---|---|---|---|
| **Budgets CRUD** | Create a new budget with custom filters, verify alert triggers when cost approaches threshold, edit budget amount, delete budget | Write operation — **Create Budget button is disabled** for this user | Budgets list (read-only) |
| **Commitment Contracts** | Apply a new commitment, modify existing SP/RI terms, test coverage gap analysis with write actions | Write operations (modify/apply commitments) | Commitment dashboard KPIs, utilization summary, total savings |
| **Anomaly Alert Config** | Configure anomaly detection thresholds, create alert rules, verify alert notifications appear on dashboard | Complex multi-step configuration flows (write) | Anomaly list, anomaly stats, alert rules list |
| **Cost Allocation** | Explore Business Mapping, create/verify tag groups, test Filter Group logic with AND/OR conditions | Write operations + visual verification of allocation logic | Distinct service costs, tag governance coverage/resources, tag cost data |
| **Recommendations** | Apply a recommendation (e.g., Right Sizing), verify cost impact, test Waste Detector filters, approve/reject workflows | Write operations with financial impact validation | Recommendations total, categories, detailed list |
| **Partner Billing** | Navigate Billing Summary/History, verify customer management, test Credits flow, create billing rules | Partner-specific features requiring multi-account context | Billing summary with pagination |
| **CostGPT** | Test natural language queries about cost data, verify response accuracy, test complex multi-step questions | Conversational AI with non-deterministic responses | None |
| **Pricing Pages** | Navigate Pricing menu, verify cost type and pricing mode toggles | Page returns 404 — feature not fully available | None |
| **Export/Download** | Export CAUI data to CSV, download dashboard reports, test Commitment Dashboard CSV exports | File download handling across multiple formats | None |
| **Alerts** | Create Cost Alert Rules (trend/threshold), test Commitment Expiration alerts, verify alert triggers | Write operations — "Create Alert Rule" button visible, 0 existing rules | Cost alert rules list (read-only) |

### Browser Exploration Summary

Manual exploratory testing was performed across all major sections of the platform. Key findings:

| Section | Status | Data Quality | Automation Potential |
|---|---|---|---|
| **Dashboard** | ✅ Explored | Rich KPI data visible ($121K MTD cost, $197K YTD savings) | Already automated |
| **Cost & Usage Explorer** | ✅ Explored | Service search, cost visualization, filters | Already automated |
| **Budget** | ✅ Explored | Create Budget disabled, 0/1 budgets, Summary tab available | Read via API + UI confirms disabled |
| **My Commitments** | ✅ Explored | 2 expired RIs, KPIs: $163K Net Savings, 99.7% Utilization | Read via API + UI charts verified |
| **Commitment Dashboard** | ✅ Explored | 5 SPs (86-100% utilization), savings/waste charts | Automated |
| **Anomaly Detection** | ✅ Explored | 6 real anomalies (EC2 $593, GuardDuty $61, Redshift $2,748, etc.) | Automated |
| **Recommendations** | ✅ Explored | Waste Detector: -$6,133 potential savings, no recommendations found | Partial API coverage |
| **Tag Governance** | ✅ Explored | 0% coverage ($392/$126K tagged), 163K pages of untagged resources | Automated |
| **CostGPT** | ✅ Explored | Preset questions available, non-deterministic AI responses | Manual only |
| **Alerts** | ✅ Explored | 0 alert rules, Create Alert Rule available (write operation) | Read via API, UI write = manual |
| **Partner Billing** | ✅ Explored | Billing Summary with paginated table, CSV/Invoice export | Read via API |
| **Pricing** | ✅ Explored | Returns 404 — not implemented | N/A |
| **Cost Allocation sub-pages** | ⬜ Not explored | Business Mapping, Tag Groups, Enrichment Tags, Filter Group, Views | Pending |
| **Unit Economics** | ⬜ Not explored | — | Pending |

## Known Gaps

| Gap | Impact | Future Priority |
|---|---|---|
| No budget write (create/edit/delete) tests | Cannot validate budget lifecycle end-to-end | **HIGH** |
| No commitment contract/coverage gap tests | Cannot validate commitment optimization suggestions | **HIGH** |
| No Cost Allocation / Tag Governance write tests | Cannot validate cost allocation accuracy | **HIGH** |
| No recommendations "apply" or approval workflow tests | Cannot validate cost optimization impact | **MEDIUM** |
| No UI page objects for Partner Billing, Alerts, CostGPT pages | UI coverage limited to explored sections | **MEDIUM** |
| No negative data validation (zero/negative costs) | Edge cases for data quality not covered | **LOW** |
| No performance/timing tests | SLA violations not detected | **LOW** |
| Pricing page returns 404 | Cannot test pricing feature | **LOW** |
| Cost Allocation sub-pages (Business Mapping, Tag Groups, etc.) not explored | Potential write operations in untested flows | **MEDIUM** |
| CostGPT non-deterministic responses | AI chatbot cannot be validated deterministically | **LOW** |
