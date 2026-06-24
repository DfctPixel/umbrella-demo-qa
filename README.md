# Umbrella Demo QA

End-to-end test suite for the [Umbrella FinOps platform](https://dev.umbrellacost.dev), built with [Playwright](https://playwright.dev) and TypeScript. Covers both API and UI testing for cost management, authentication, and cloud resource monitoring features.

## Features

- **API Tests** — Direct API testing against `https://api.dev.umbrellacost.dev/api/v1`
  - Authentication flow (JWT token acquisition, token verification, error handling)
  - Cost & Usage Explorer endpoints (services, costs, budgets, dashboards, anomalies, etc.)
- **UI Tests** — Browser-based E2E testing at `https://dev.umbrellacost.dev`
  - Login flow (valid credentials, empty fields, forgot password navigation)
  - Dashboard navigation and cost data display
  - Cost & Usage Explorer (service search, cost visualization)
  - Console & network error monitoring across pages
- **CI/CD** — GitHub Actions workflow runs API tests, UI tests, and TypeScript linting on push/PR

## Project Structure

```
├── helpers/
│   ├── auth.ts                      # Authentication helper (native fetch for JWT)
│   └── api-client.ts                # Typed API client wrapper
├── pages/
│   ├── LoginPage.ts                 # Login page object model
│   ├── DashboardPage.ts             # Dashboard page object model
│   └── CostUsageExplorerPage.ts     # Cost & Usage Explorer page object model
├── tests/
│   ├── api/
│   │   ├── auth.spec.ts             # API authentication tests
│   │   └── cost-usage.spec.ts       # API cost & usage data tests
│   └── ui/
│       ├── login.spec.ts            # UI login flow tests
│       ├── cost-usage.spec.ts       # UI Cost & Usage Explorer tests
│       └── console-errors.spec.ts   # Console/network error monitoring
├── .github/workflows/ci.yml         # CI pipeline
├── playwright.config.ts             # Playwright configuration
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

### API Tests (13 tests)

| Suite | File | Description |
|---|---|---|
| Auth | `tests/api/auth.spec.ts` | JWT authentication, token verification, negative password test, protected endpoint access |
| Cost & Usage | `tests/api/cost-usage.spec.ts` | Service names, costs, CAUI queries, cue views, recommendations, anomaly stats, budgets, dashboards |

### UI Tests (9 tests)

| Suite | File | Description |
|---|---|---|
| Login Flow | `tests/ui/login.spec.ts` | Login form display, valid credential login, empty credential validation, forgot password |
| Cost & Usage Explorer | `tests/ui/cost-usage.spec.ts` | Page navigation, cost data display, service search |
| Error Monitoring | `tests/ui/console-errors.spec.ts` | Console error detection, failed network request detection across login and explorer |

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
| `apiURL` | `https://api.dev.umbrellacost.dev/api/v1` |
| Timeout | 60 seconds |
| Trace | `on-first-retry` |
| Screenshot | `only-on-failure` |
| Video | `retain-on-failure` |
| Viewport (UI) | 1920×1080 |

## CI/CD

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs three parallel jobs:

- **test-api** — Runs all API tests
- **test-ui** — Runs all UI tests (headless Chromium)
- **lint** — TypeScript type checking with `tsc --noEmit`

## Page Objects

The project uses the Page Object Model pattern for UI tests:

- **`LoginPage`** — Email/password input, Next/Login buttons, forgot password link
- **`DashboardPage`** — MTD cost, forecast, savings cards, sidebar navigation
- **`CostUsageExplorerPage`** — Total cost, service search, filter controls, service list

## Environment Variables

See `.env.example` for the required environment variables:

| Variable | Description |
|---|---|
| `USER_EMAIL` | Login email for the Umbrella platform |
| `USER_PASSWORD` | Login password |
| `BASE_URL` | UI base URL (default: `https://dev.umbrellacost.dev`) |
| `API_BASE_URL` | API base URL (default: `https://api.dev.umbrellacost.dev/api/v1`) |
