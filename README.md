# Umbrella Demo QA

Playwright E2E test suite for the [Umbrella FinOps platform](https://dev.umbrellacost.dev).

## QA operating documents

- [QA test strategy](QA_TEST_STRATEGY.md) — test pyramid, lanes, data isolation, web/API/mobile strategy, CI, and definition of done.
- [Manual exploratory charters](MANUAL_EXPLORATORY_CHARTERS.md) — time-boxed web-app sessions with FinOps data-integrity, security, accessibility, responsive, and resilience missions.
- [Architecture review handoff](QA_ARCHITECTURE_REVIEW.md) — current reviewer findings and implementation handoff.

## Setup

```bash
git clone https://github.com/DfctPixel/umbrella-demo-qa.git
cd umbrella-demo-qa
npm install
npx playwright install chromium
copy .env.example .env   # set USER_EMAIL, USER_PASSWORD, QA_ACCOUNT_KEY, QA_ACCOUNT_TYPE_ID
npm test                  # run all tests
```

Useful lanes:

```bash
npm run test:unit         # pure unit tests (response guards, parsers)
npm run test:smoke        # fast critical path
npm run test:contract     # API contract checks
npm run test:api          # API regression
npm run test:ui           # UI regression
npm run test:visual       # approved visual baselines
```

CI runs on every push to `main` and on manual dispatch:

```bash
gh workflow run "CI - Playwright Tests" --ref main
```

`QA_ARCHITECTURE_REVIEW.md`-only commits are excluded from the push trigger so
review records do not consume the shared QA tenant. The workflow keeps only the
newest run for a branch and cancels an older run when a newer one starts. Use
the `test:visual:update` script only when a reviewed visual-baseline change is
intentional.

### Required environment variables

| Variable | Purpose |
|----------|---------|
| `USER_EMAIL` | QA tenant login email |
| `USER_PASSWORD` | QA tenant login password |
| `QA_ACCOUNT_KEY` | Numeric account key (fallback when the profile server omits `accounts[0]`) |
| `QA_ACCOUNT_TYPE_ID` | Numeric account type ID (same fallback) |
| `QA_DIVISION_ID` | Division ID (default `0`) |
| `QA_CURRENCY` | Display currency (default `USD`) |

The API fixture resolves the tenant capability at authentication time by calling
`GET /users/plain-sub-users`. When the live profile includes `accounts[0]` its
values are always used. The `QA_ACCOUNT_KEY` / `QA_ACCOUNT_TYPE_ID` env vars serve
as a validated fallback for tenants whose profiles omit the account list. Both
values must be finite non-negative integers; an invalid number produces a clear
error message at fixture setup time.

## Design Choices

- **Page Object Model** — `BasePage` provides shared navigation, fill, click, and fluent assertion methods (`assertVisible`, `assertHasText`, `assertUrlContains`, etc.). `LoginPage`, `DashboardPage`, `CostUsageExplorerPage`, and `CommitmentDashboardPage` extend it.
- **DataTable component** — Reusable table abstraction with `readRows()`, `exportToCsv()`, `waitForData()`, `getRowCount()`. Used by `CommitmentDashboardPage` for Top Unutilized/Expiring tables.
- **Auth via Playwright `APIRequestContext`** — Authentication uses `request.newContext()` for realm check, SSO, sign-in, and signin-with-token steps. An anonymous context with `apikey: -1:-1:-1` handles the auth flow, then a second authenticated context is created with Bearer JWT and a dynamically built apikey (from `GET /users/plain-sub-users`) for all subsequent API calls. The authentication function also resolves the tenant capability (`accountKey`, `accountTypeId`, `divisionId`, `currency`) and returns it so both API fixtures and UI storage setup consume the same values.
- **Worker-scoped API fixture** — API tests share one authenticated context per Playwright worker via `helpers/fixtures/api.ts`, which uses a `scope: 'worker'` fixture. The context is created once and disposed when the worker shuts down, eliminating redundant per-file auth flows.
- **Setup project for UI state** — A dedicated `setup` Playwright project (`tests/setup/auth.setup.ts`) authenticates once, injects tokens into browser storage, and saves `storageState.json`. The `ui` and `ui-exports` projects declare `dependencies: ['setup']` so every worker starts pre-authenticated without re-running the login flow. The `ui-login` project does not depend on setup because it tests the login flow itself.
- **7 Playwright projects** — `setup` (generates storageState), `unit` (pure mocked-response tests), `api` (browserless, pure APIRequestContext), `ui` (journeys with storageState), `ui-exports` (exports with storageState), `ui-visual` (approved visual baselines), and `ui-login` (fresh login each time). The API project runs browserlessly — no Chromium launch — and is capped at 4 workers locally to avoid tenant throttling.
- **Worker isolation** — Local runs use up to 10 workers (API up to 4); CI is deliberately capped at one worker because the shared QA tenant is a scarce resource. API tests use a worker-scoped fixture; UI projects reuse `storageState.json` from the setup project.
- **Guarded API clients** — `helpers/clients/response.ts` rejects non-2xx responses, unexpected content types, and invalid JSON before a test can assert against a misleading payload. Errors identify the endpoint and status without dumping tenant data. All authenticated flows (clients, sign-in, and tenant-capability resolution) go through the same guard.
- **CI diagnostics** — Playwright emits both HTML and JUnit reports. CI uploads the reports and the selected JUnit/connectivity diagnostics even after failures, while avoiding blanket trace uploads that could contain authenticated network headers.
- **Fail-fast environment checks** — the authentication credential configuration (`USER_EMAIL`, `USER_PASSWORD`) is validated before any network call, so missing CI secrets produce an actionable configuration error instead of a confusing realm/sign-in failure.

## AI Tools Used

- DeepSeek as code gen + Codex as reviewer — Assisted with test generation, refactoring, and CI configuration.

## Bugs & Limitations Discovered

| Issue | Impact | Workaround |
|-------|--------|------------|
| **Pricing page returns 404** | Cannot test pricing feature at all | Skipped |
| **`signin-with-token` returns HTML, not JSON** | Identity verification test skipped — Playwright's `APIRequestContext` gets an HTML page, browser works fine | Test marked `.skip` |
| **Create Budget button disabled** | No budget write tests for this user role | All budget tests are read-only API |
| **CAUI API returns per-service-per-day, not daily aggregates** | Chart shows daily totals but raw data is per-service | Sum `total_cost` across services for each `usage_date` |
