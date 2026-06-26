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
- **4 Playwright projects** — `api` (headless), `ui` (journeys with storageState), `ui-exports` (exports with storageState), `ui-login` (fresh login each time).
- **Global setup** — `global-setup.ts` generates `storageState.json` used by UI projects to skip re-login.

## AI Tools Used

- DeepSeek as code gen + Codex as reviewer — Assisted with test generation, refactoring, and CI configuration.

## Bugs & Limitations Discovered

| Issue | Impact | Workaround |
|-------|--------|------------|
| **Pricing page returns 404** | Cannot test pricing feature at all | Skipped |
| **`signin-with-token` returns HTML, not JSON** | Identity verification test skipped — Playwright's `APIRequestContext` gets an HTML page, browser works fine | Test marked `.skip` |
| **Create Budget button disabled** | No budget write tests for this user role | All budget tests are read-only API |
| **CAUI tooltip `textContent()` concatenates without newlines** | Regex must match glued text like `"May 31Total: $ 5,422.09Percent of Total: 39%"` | Use narrow regex (`\w+\s+\d+` for date, `\$?\s*[\d,.\-]+` for total) |
| **CAUI API returns per-service-per-day, not daily aggregates** | Chart shows daily totals but raw data is per-service | Sum `total_cost` across services for each `usage_date` |
| **`MTD cost` text matches 6 elements** | Locator ambiguous (matches "MTD Costs", "Previous MTD Cost", etc.) | Use `{ exact: true }` |
| **Recharts tooltip class is `.recharts-tooltip-wrapper`** | Expected `.chart-tooltip` doesn't exist | Use correct Recharts CSS class |
| **Chart fires multiple CAUI calls on page load** | `waitForResponse` catches the wrong one | Use `page.route()` to capture all responses, then match by date |
| **`APIRequestContext` strips custom headers** | `apikey` header lost on some Node.js versions | Use native `fetch()` for auth, then build authenticated context |
| **Recommendations endpoint returns 0 items** | Waste Detector shows savings potential but no recommendations list | Test verifies only non-negative savings on existing items |
| **CostGPT responses non-deterministic** | AI chat can't be validated with exact assertions | Manual exploration only |
| **No Commitments summary data on some dates** | Returns empty object (`{}`) when no data | Test verifies it's an object, not actual data |
| **`global-setup.ts` fails without Chromium** | API-only CI run crashes on `chromium.launch()` | Fallback to empty `storageState.json` via `request.newContext()` |

## Manually Verified

- **Dashboard** — $121K MTD cost, $197K YTD savings visible. Sidebar navigation works.
- **Cost & Usage Explorer** — Service search filters correctly, cost visualization renders, service count updates.
- **Partner Billing** — Paginated billing summary table, CSV/Invoice export available.
- **CostGPT** — Preset questions work, responses are non-deterministic AI-generated.
- **Pricing page** — Returns 404 (not implemented).
- **Budget** — Create Budget button is disabled for this user (read-only).
