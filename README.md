# Umbrella Demo QA

Playwright E2E test suite for the [Umbrella FinOps platform](https://dev.umbrellacost.dev).

## Setup

```bash
git clone https://github.com/DfctPixel/umbrella-demo-qa.git
cd umbrella-demo-qa
npm install
npx playwright install chromium
copy .env.example .env   # set USER_EMAIL/USER_PASSWORD
npm test                  # run all tests
```

## Design Choices

- **Page Object Model** — `BasePage` provides shared navigation, fill, click, and fluent assertion methods (`assertVisible`, `assertHasText`, `assertUrlContains`, etc.). `LoginPage`, `DashboardPage`, `CostUsageExplorerPage`, and `CommitmentDashboardPage` extend it.
- **DataTable component** — Reusable table abstraction with `readRows()`, `exportToCsv()`, `waitForData()`, `getRowCount()`. Used by `CommitmentDashboardPage` for Top Unutilized/Expiring tables.
- **Auth via Playwright `APIRequestContext`** — Authentication uses `request.newContext()` for realm check, SSO, sign-in, and signin-with-token steps. An anonymous context with `apikey: -1:-1:-1` handles the auth flow, then a second authenticated context is created with Bearer JWT and a dynamically built apikey (from `GET /users/plain-sub-users`) for all subsequent API calls.
- **API client pattern** — `AuthClient`, `CostUsageClient`, `FinOpsClient` each wrap an `APIRequestContext` and expose typed methods per endpoint. Tests use `test.use({ storageState })` for UI login persistence.
- **Config split** — Playwright config in `playwright.config.ts`, selectors in `config/selectors.ts`, environment types in `helpers/auth/types.ts`.
- **4 Playwright projects** — `api` (headless), `ui` (journeys with storageState), `ui-exports` (exports with storageState), `ui-login` (fresh login each time). All projects run in parallel.
- **10 parallel workers** — Tests are fully parallelized with 10 workers. UI tests share a pre-generated `storageState.json` from global setup so each worker starts authenticated without re-logging in.
- **Global setup** — `global-setup.ts` authenticates once via API, injects tokens into browser storage, and saves `storageState.json`. Gracefully skips browser launch when only API tests run (no Chromium installed).

## AI Tools Used

- DeepSeek as code gen + Codex as reviewer — Assisted with test generation, refactoring, and CI configuration.

## Bugs & Limitations Discovered

| Issue | Impact | Workaround |
|-------|--------|------------|
| **Pricing page returns 404** | Cannot test pricing feature at all | Skipped |
| **`signin-with-token` returns HTML, not JSON** | Identity verification test skipped — Playwright's `APIRequestContext` gets an HTML page, browser works fine | Test marked `.skip` |
| **Create Budget button disabled** | No budget write tests for this user role | All budget tests are read-only API |
| **CAUI API returns per-service-per-day, not daily aggregates** | Chart shows daily totals but raw data is per-service | Sum `total_cost` across services for each `usage_date` |