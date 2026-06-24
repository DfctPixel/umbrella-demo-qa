# Umbrella Demo QA

End-to-end test suite for the [Umbrella FinOps platform](https://dev.umbrellacost.dev), built with [Playwright](https://playwright.dev) and TypeScript. Covers both API and UI testing for cost management, authentication, and cloud resource monitoring features.

## Features

- **API Tests** — Direct API testing against `https://api.dev.umbrellacost.dev/api/v1`
  - Authentication flow (JWT token acquisition, token verification, error handling)
  - Cost & Usage Explorer endpoints (services, costs, budgets, anomalies, commitments, recommendations, K8s data, dashboard panels)
  - **Advanced FinOps**: Commitment Dashboard KPIs, Anomaly Detection list, Recommendations list, Tag Governance coverage, Cost Alert Rules, Partner Billing Summary
- **UI Tests** — Browser-based E2E testing at `https://dev.umbrellacost.dev`
  - Login flow (valid credentials, empty fields, forgot password navigation)
  - Dashboard navigation and cost data display
  - Cost & Usage Explorer (service search, cost visualization)
  - **Advanced UI**: Commitment Dashboard navigation/charts, Anomaly Detection page with real data, Budget page verification
  - Console & network error monitoring across pages
- **CI/CD** — GitHub Actions workflow runs API tests, UI tests, and TypeScript linting on push/PR

## Project Structure

```
├── helpers/
│   ├── auth.ts                      # Authentication helper (native fetch for JWT)
│   └── api-client.ts                # Typed API client wrapper with FinOps response interfaces
├── pages/
│   ├── BasePage.ts                  # Abstract base class with shared navigation/element utilities
│   ├── LoginPage.ts                 # Login page object model
│   ├── DashboardPage.ts             # Dashboard page object model
│   ├── CostUsageExplorerPage.ts     # Cost & Usage Explorer page object model
│   ├── CommitmentDashboardPage.ts   # Commitment Dashboard (SP/RI charts & tables)
│   ├── AnomalyDetectionPage.ts      # Anomaly Detection (cost anomalies, new services)
│   └── BudgetPage.ts                # Budget management (read-only verification)
├── tests/
│   ├── api/
│   │   ├── auth.spec.ts             # API authentication tests
│   │   ├── cost-usage.spec.ts       # API cost & usage data tests (11 test cases)
│   │   └── commitment-anomaly.spec.ts # API advanced FinOps tests (8 test cases)
│   └── ui/
│       ├── login.spec.ts            # UI login flow tests
│       ├── cost-usage.spec.ts       # UI Cost & Usage Explorer tests
│       ├── console-errors.spec.ts   # Console/network error monitoring
│       └── advanced-features.spec.ts # UI Commitment Dashboard, Anomaly Detection, Budget
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

# Configure credentials (optional — defaults are set in helpers/auth.ts)
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
npx playwright test tests/api/auth.spec.ts

# Run tests with a specific tag
npx playwright test --grep "@ui"
npx playwright test --grep "@api"
```

## Test Suites

### API Tests (19+ tests)

| Suite | Test Name | FinOps Domain | Description |
|---|---|---|---|
| Auth | `should successfully authenticate and receive JWT + refresh tokens` | — | JWT token acquisition and payload validation |
| Auth | `should verify identity via signin-with-token` | — | Post-authentication identity verification |
| Auth | `should reject signin with wrong password (negative)` | — | Negative test for invalid credentials |
| Auth | `should access protected endpoints with valid JWT` | — | Verify JWT grants access to protected endpoints |
| Cost & Usage | `should fetch distinct service names` | **Cost Allocation** | Service name enumeration |
| Cost & Usage | `should fetch distinct service costs with non-negative values` | **Cost Allocation** | Cost sanity check (non-negative per service) |
| Cost & Usage | `should post CAUI query (monthly granularity)` | **Cost Mgmt** | Monthly cost aggregation query |
| Cost & Usage | `should post CAUI query (daily granularity)` | **Cost Mgmt** | Daily cost aggregation query |
| Cost & Usage | `should fetch anomaly stats with non-negative counts` | **Anomalies** | Anomaly detection data validation |
| Cost & Usage | `should fetch budgets list with valid structure` | **Budgets** | Budget metadata validation |
| Cost & Usage | `should fetch commitment utilization summary` | **Commitments** | Savings Plans utilization |
| Cost & Usage | `should fetch commitment total savings for Savings Plans and RIs` | **Commitments** | YTD savings from SP + RI |
| Cost & Usage | `should fetch recommendations total count and categories` | **Optimization** | Recommendations data validation |
| Cost & Usage | `should fetch K8s cost data with non-negative values` | **Containers** | K8s workload cost visibility |
| Cost & Usage | `should fetch custom dashboard panels with valid structure` | **Reporting** | Dashboard panel/KPI widget validation |
| Advanced FinOps | `should fetch commitment dashboard with valid KPIs` | **Commitments** | Commitment Dashboard KPIs (savings, waste, utilization) |
| Advanced FinOps | `should fetch anomaly detection list with valid structure` | **Anomalies** | Anomaly list with cost impact, delta, status |
| Advanced FinOps | `should fetch anomaly alert rules list` | **Anomalies** | Alert rule metadata validation |
| Advanced FinOps | `should fetch recommendations list with valid items` | **Optimization** | Recommendation item details (type, savings, status) |
| Advanced FinOps | `should fetch tag governance coverage data` | **Cost Allocation** | Tag coverage completeness |
| Advanced FinOps | `should fetch tag governance resources` | **Cost Allocation** | Tagged resource paged list |
| Advanced FinOps | `should fetch cost alert rules` | **Alerts** | Cost alert configuration |
| Advanced FinOps | `should fetch partner billing summary` | **Partner Billing** | Partner billing summary with pagination |

### UI Tests (10+ tests)

| Suite | File | Description |
|---|---|---|
| Login Flow | `tests/ui/login.spec.ts` | Login form display, valid credential login, empty credential validation, forgot password |
| Cost & Usage Explorer | `tests/ui/cost-usage.spec.ts` | Page navigation, cost data display, service search |
| Error Monitoring | `tests/ui/console-errors.spec.ts` | Console error detection, failed network request detection across login and explorer |
| Advanced Features | `tests/ui/advanced-features.spec.ts` | Commitment Dashboard charts, Anomaly Detection data, Budget page disabled state |

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

- **test-api** — Runs all API tests
- **test-ui** — Runs all UI tests (headless Chromium)
- **lint** — TypeScript type checking with `tsc --noEmit`

## Page Objects

The project uses the Page Object Model pattern extending a shared `BasePage`:

- **`BasePage`** — Abstract base class with `navigate()`, `waitForLoadState()`, `waitForUrl()`, `clickVisible()`, `fillVisible()`, `getTextContent()` etc.
- **`LoginPage`** — Email/password input, Next/Login buttons, forgot password link
- **`DashboardPage`** — MTD cost, forecast, savings cards, sidebar navigation to Cost & Usage Explorer
- **`CostUsageExplorerPage`** — Total cost, service search, filter controls, service list
- **`CommitmentDashboardPage`** — Commitment KPIs, SP/RI charts (Monthly Usage, Total Hours Distribution, Savings & Waste), Top Unutilized/Expiring tables
- **`AnomalyDetectionPage`** — Cost Anomalies / New Services tabs, anomaly list with cost impact and status
- **`BudgetPage`** — Budget heading, Create Budget button (disabled), Current Budgets / Budget Summary tabs

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
| **Dashboard** | ✅ ✓ Explored | Rich KPI data visible ($121K MTD cost, $197K YTD savings) | Already automated |
| **Cost & Usage Explorer** | ✅ ✓ Explored | Service search, cost visualization, filters | Already automated |
| **Budget** | ✅ ✓ Explored | Create Budget disabled, 0/1 budgets, Summary tab available | Read via API, UI confirms disabled |
| **My Commitments** | ✅ ✓ Explored | 2 expired RIs, KPIs: $163K Net Savings, 99.7% Utilization | Read via API + UI charts verified |
| **Commitment Dashboard** | ✅ ✓ Explored | 5 SPs (86-100% utilization), savings/waste charts | Automated (new) |
| **Anomaly Detection** | ✅ ✓ Explored | 6 real anomalies (EC2 $593, GuardDuty $61, Redshift $2,748, etc.) | Automated (new) |
| **Recommendations** | ✅ ✓ Explored | Waste Detector: -$6,133 potential savings, no recommendations found | Partial API coverage |
| **Tag Governance** | ✅ ✓ Explored | 0% coverage ($392/$126K tagged), 163K pages of untagged resources | Automated (new) |
| **CostGPT** | ✅ ✓ Explored | Preset questions available, non-deterministic AI responses | Manual only |
| **Alerts** | ✅ ✓ Explored | 0 alert rules, Create Alert Rule available (write operation) | Read via API, UI write = manual |
| **Partner Billing** | ✅ ✓ Explored | Billing Summary with paginated table, CSV/Invoice export | Read via API |
| **Pricing** | ✅ ✓ Explored | Returns 404 — not implemented | N/A |
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
