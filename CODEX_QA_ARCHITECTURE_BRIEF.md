# Enterprise FinOps QA Architecture Brief

## Decision

Keep the Playwright/TypeScript foundation and the useful read-only checks, but do **not** call the current suite enterprise-ready yet. The latest green gate executes 133 API tests, 8 UI tests, and 10 unit tests. It now has guarded clients, worker/setup isolation, strict expected-failure handling, and two committed visual baselines, but still lacks native accessibility, mutation, multi-tenant, and dedicated performance/security gates.

The goal is not a large test count. It is a small, trustworthy release gate backed by stronger contract, financial-reconciliation, and end-to-end tests, with deeper coverage running outside the pull-request lane.

## Current state (reviewed against `main` at `cb93d3c`)

- Latest CI run: [30856889558](https://github.com/DfctPixel/umbrella-demo-qa/actions/runs/30856889558), green.
- Lint/type-check/unit job: ESLint and TypeScript passed; 10 unit tests passed.
- API job: 133 tests passed. Three confirmed backend HTTP 500 contracts are
  represented as explicit expected failures (`DEFECT-API-500-RECOMMENDATIONS`,
  `DEFECT-API-500-COMMITMENT-DASHBOARD`, and
  `DEFECT-API-500-ANOMALY-DATES`).
- UI job: 8 tests passed. The visual project is available on demand, but it is
  not part of the default workflow and only two of its three screenshots have
  committed baselines.
- Current CI is push-triggered for non-review commits to `main` and also
  supports manual dispatch; concurrency cancels older runs for the same ref.

## Historical evidence from the original architecture review

- The original review evidence and historical findings remain below for traceability. They are not the current CI status.

## Findings requiring change (historical baseline)

The original findings table is retained for traceability. The setup-project,
worker-scoped API fixture, profile-derived tenant capability, guarded-client,
CSV-index, and chart-capture remediations are now implemented. Remaining gaps
are accessibility/keyboard automation, responsive projects, mutation and
multi-tenant lifecycle coverage, dedicated security/performance jobs, and a
deterministic visual baseline for the dashboard KPI card.

| Priority | Finding | Why it matters | Required remediation |
|---|---|---|
| P0 | Many tests accept both success and error responses as “handled gracefully.” | A regression can change valid input to an error (or invalid input to 200) without failing a test. | Replace each with the documented status, error schema/code, and response invariant. Unknown behaviour is a product/API-spec decision, not a test condition. |
| P0 | Financial tests assume all cost values are non-negative and use JavaScript `number`. | Credits, refunds, adjustments, and discounts can legitimately be negative; floating-point comparisons can conceal monetary errors. | Define a cost-metric semantics table and use integer minor units or a decimal library. Assert the exact expected sign and rounded display value per metric. |
| P0 | `globalSetup` authenticates and launches Chromium for API-only runs. | API CI carries UI setup cost and hides setup failures in a broad catch. | **Resolved:** the `setup` project now owns browser storage state and API uses a worker-scoped request fixture. Keep the dependency boundary explicit. |
| P0 | Account/division defaults are hard-coded (`111111177`, `0`). | The suite is coupled to one tenant and can validate the wrong account after a role or tenant change. | **Resolved:** capability is profile-derived with validated `QA_ACCOUNT_KEY`/`QA_ACCOUNT_TYPE_ID` fallbacks. Keep CI secrets configured and rotate them. |
| P1 | The chart reconciliation intercepts every CAUI response, chooses the first matching month/day label, and compares whole-dollar precision. | It can compare the tooltip against an unrelated request or an incorrect year/filter; errors below about $0.50 pass. | **Improved:** the test validates the request shape and capture flag, but the default-period precondition can still skip value comparison; provision a deterministic data period. |
| P1 | UI locators use `.first()`, `.nth()`, DOM ancestry, and CSS implementation details. | Page redesigns can silently redirect a test to the wrong element. | Add product-owned `data-testid` contracts for business controls, chart series/points, totals, empty/error states, table rows, and export controls. Page objects may compose those contracts but must not encode layout. |
| P1 | **Historical:** UI coverage was only login, one Cost & Usage path, and two exports; visual and accessibility coverage were absent. | Calculations can be correct in API responses but wrong, hidden, or inaccessible in the UI. | **Partially resolved:** UI journeys, exports, and a visual project now exist; add axe/keyboard checks and complete the visual baseline set. |
| P1 | **Historical:** the shared module “singleton” API fixture was only shared inside a Node worker and was never disposed centrally. | With parallel files it did not achieve the claimed global reuse and obscured resource ownership. | **Resolved:** the API context is worker-scoped and disposed by the fixture; extend the same lifecycle discipline to future mutation fixtures. |
| P1 | Schema tests are hand-inferred rather than generated from a versioned API contract. | They codify today’s observed responses, not a product agreement. | Publish OpenAPI 3.1/3.2; validate responses, parameters, errors, and security schemes against it in CI. |
| P2 | CSV parsing, download paths, `any`, and synchronous file I/O live in a reusable UI component. | It is brittle for quoted/multiline fields and difficult to reuse safely in parallel. | **Improved:** downloads use per-test output paths, strict parsing, duplicate detection, and explicit UI/export field mapping. Replace remaining `any` and extract reusable pure parsers into the unit project. |
| P2 | Performance checks use one remote shared-environment sample and hard-coded thresholds. | This is not a repeatable performance test or an SLO. | Keep a light latency smoke check, but move load/percentile/error-rate scenarios to k6/Gatling against an approved environment and publish SLOs. |
| P2 | Artifacts can include user email, billing screens, and potentially sensitive test data. | CI report sharing becomes a data-handling risk. | Use a dedicated synthetic tenant, redact sensitive text in artifacts, restrict artifact access, and retain them for the minimum period. |

## Target architecture

```text
tests/
  setup/                         # creates UI storage state; UI projects depend on it
  api/
    contract/                    # OpenAPI response, request, error, auth contracts
    finops-invariants/           # reconciliation and accounting rules
    security/                    # RBAC, tenant isolation, BOLA/property authorization
    workflows/                   # create/update/delete with setup and cleanup
  e2e/
    cost-usage/                  # UI action -> exact network query -> UI/API oracle
    commitments/
    budgets/
    anomalies-alerts/
    recommendations/
    exports/
  visual/                        # stable component/page baselines
  accessibility/                 # axe + keyboard/semantic acceptance checks
support/
  fixtures/                      # worker-scoped API, role, and tenant fixtures
  clients/                       # typed clients; every call exposes status/headers/body
  oracles/                       # money, dates, grouping, allocation, reconciliation
  factories/                     # uniquely named managed test data
  contracts/                     # checked-in OpenAPI/FOCUS mappings and schemas
  data/                          # deterministic tenant capabilities and seed identifiers
```

### Test lanes

| Lane | Trigger | Scope | Gate |
|---|---|---|---|
| `smoke` | Pull request | login, 6–10 critical API contracts, one Cost & Usage reconciliation, one critical role check | blocking, no retries |
| `regression` | Post-deploy / main | all deterministic API, E2E, export, a11y, and visual tests | blocking before promotion |
| `mutation` | Post-deploy | budgets, alerts, reports, dashboards, RBAC setup/cleanup in an isolated tenant | blocking for affected domains |
| `contract` | Pull request and provider-spec change | OpenAPI diff + response/error validation | blocking |
| `visual` | Pull request for UI changes; scheduled otherwise | stable desktop plus selected mobile baselines | reviewed baseline updates only |
| `performance` | Scheduled / release candidate | latency distribution, load, rate-limit, and large-query budgets | non-PR environment gate |
| `security` | Scheduled and release candidate | OWASP API authorization, property exposure, resource consumption | security gate |

The lane matrix is the target architecture, not the current workflow topology.
At `cb93d3c`, CI runs lint/type-check/unit, API regression, and UI regression on
each non-review push to `main` or manual dispatch. Visual is available through
`npm run test:visual` but is not a default job; accessibility, security,
performance, and mutation lanes remain planned or scheduled work.

## FinOps data-quality oracle catalogue

Each rule needs an owner, metric definition, source of truth, currency/rounding rule, time-zone rule, allowed tolerance, and test-data precondition. Do not write a test until those are explicit.

1. **Invoice reconciliation:** for a closed billing period, `sum(line effective cost)` equals invoice total in minor units, including tax, credits, refunds, fees, discounts, and rounding adjustment.
2. **Roll-up conservation:** every permitted grouping (service, account, region, tag, division, date) rolls up to the same filtered total. Include an explicit `Other`/unallocated bucket rule.
3. **Granularity conservation:** daily rows sum to monthly rows for the same immutable period, metric, currency, account, and filters. A daily record cannot be double counted merely because services are also grouped.
4. **UI/API reconciliation:** the browser action captures the exact request body; the test independently applies the documented aggregation/rounding oracle to the response and compares it to card, chart, table, and CSV values.
5. **Allocation correctness:** direct + shared + unallocated equals total; every shared-cost allocation method sums exactly to the source pool; tag/metadata compliance is measurable by spend, not only resource count.
6. **Currency and time semantics:** timezone, billing period, currency code, exchange-rate date/source, and display precision are asserted. Crossing month/year/DST boundaries must have dedicated examples.
7. **Commitments:** coverage/utilization is bounded, committed + on-demand costs reconcile to total by the specified cost metric, and realised savings never exceed eligible spend under the agreed definition.
8. **Recommendations:** recommendation count/annual and monthly savings reconcile across list, total, category, heatmap, export, and UI filters; recommendations are idempotent and are scoped to the permitted tenant.
9. **Ingestion freshness/completeness:** expected provider partitions arrive, are unique, meet freshness SLOs, and late adjustments are surfaced/audited rather than silently overwriting closed periods.
10. **Anomaly/budget consistency:** thresholds, state transitions, notifications, ownership, and the underlying cost series agree. Test creation, trigger, acknowledgement, notification, and cleanup in a managed tenant.

These rules align with the FinOps Foundation guidance to normalize data, evaluate data quality/consistency, establish ingestion observability, and reconcile periodically against provider and finance sources. FOCUS should be the normalized data contract where the product exposes normalized cloud-cost data. See [FinOps Data Ingestion](https://www.finops.org/framework/capabilities/data-ingestion/), [FinOps Allocation](https://www.finops.org/framework/capabilities/allocation/), and [FOCUS](https://focus.finops.org/).

## UI, visual, and accessibility standard

1. **State first.** Create or select a frozen period and known account through API setup; navigate through the user flow; assert the visible filter pills and selected metrics before validating a number.
2. **One independent oracle.** Never assert a UI calculation with the production aggregation logic copied into the page object. Put a small, tested pure function in `support/oracles` that consumes the captured response.
3. **Use stable locators.** Prefer a product-owned `data-testid` and meaningful ARIA role/name. Do not use positional locators without an asserted count and a documented reason.
4. **Visual baselines.** Use `expect(locator).toHaveScreenshot()` for the cost summary, chart/table state, error/empty state, and export modal. Freeze data and fonts; mask only known volatile items; commit baselines; baseline updates require reviewer approval. Run them in one pinned OS/browser image because screenshot rendering varies by environment. [Playwright visual-comparison guidance](https://playwright.dev/docs/test-snapshots)
5. **Accessibility.** Run `@axe-core/playwright` on the critical pages and add keyboard/tab-order and accessible-name checks for filters, charts, tooltips, tables, and download actions. Axe is a useful automated signal, not a replacement for manual assessment. [Playwright accessibility guidance](https://playwright.dev/docs/accessibility-testing)
6. **Responsive coverage.** Run the smoke path at desktop and a representative tablet/mobile project. The full visual matrix belongs in scheduled regression, not every PR.

## API, contract, and security standard

- Publish versioned OpenAPI as the source of truth. Validate supported status codes, required fields, enums, formats, pagination, error payloads, and auth schemes from it; run an OpenAPI diff check on PRs. OpenAPI exists specifically to provide a language-neutral API interface that tooling can use for testing. [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- Typed clients must return `{ response, body }` or assert the expected status before parsing. Do not hide an HTML/error response behind a claimed JSON return type.
- Use API requests to prepare state and verify server postconditions for UI actions; dispose isolated contexts in worker teardown. This is a native Playwright pattern. [Playwright API testing](https://playwright.dev/docs/api-testing)
- Test each protected resource with at least two roles and two tenants. Cover object-level access, property-level exposure/update, authentication/token expiry, rate limiting, pagination abuse, and sensitive workflow abuse. OWASP identifies object-level authorization, authentication, and object-property authorization as primary API risks. [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- Positive and negative tests must state the exact contract. For example, `pageSize=0` must either return documented `400 VALIDATION_ERROR` or a documented empty page—not “200 or any 4xx.”

## Implementation sequence for the coder

The first setup/authentication/fixture items in the historical sequence are
complete at `cb93d3c`. The remaining implementation priorities are listed
below; historical steps are retained so the architecture decisions remain
auditable.

### P0 — make current signals trustworthy

1. Replace `globalSetup` with a UI-only setup project/dependency. API tests must run without Chromium and without creating browser state.
2. Add worker fixtures for the API context, tenant capability, and cleanup registry; dispose all contexts deterministically.
3. Fix the login transition flake: assert `Next` enabled, click it, and assert a unique password-step marker before looking for `Forgot password`. Capture the relevant SSO/sign-in response and attach diagnostic details on failure.
4. Reduce the 90 ESLint warnings reported by the latest CI run. Each test gets a precise status/body contract or a documented `test.skip(condition, reason)` tied to a missing tenant capability; do not weaken a contract to silence a warning.
5. Replace the hard-coded account fallback with required tenant configuration and profile-derived selection; fail setup if the expected account cannot be used.
6. Upgrade the Cost & Usage reconciliation test to pin period/account/filter state, identify the exact CAUI request, use ISO dates and a money oracle, and validate card/chart/table/CSV against the same response.

### P1 — complete product-value coverage

1. Obtain or create a resettable QA tenant, at least two roles, and two tenant/account boundaries. Build budget, alert, report, dashboard, and permission lifecycle tests with cleanup.
2. Add the 10 FinOps invariants above for a closed/frozen billing period, including negative monetary flows and allocation/shared-cost rules.
3. Introduce product test IDs and refactor page/component objects around them.
4. Add OpenAPI and FOCUS-derived contract validation; delete/retire inferred duplicate schemas once the official contract covers them.
5. Add `@visual` and `@a11y` projects with reviewed baselines and axe checks.

### P2 — operational maturity

1. Add PR smoke, post-deploy regression, scheduled visual/security, and release-candidate performance jobs. Capture JUnit/HTML/traces, flake trend, duration, and coverage by business risk.
2. Add test-data lifecycle controls, artifact redaction, ownership/rotation for credentials, and a test quarantine policy with expiry.
3. Move load testing out of Playwright and define throughput, p95/p99 latency, error-rate, and data-volume SLOs.

## Current remaining priorities

1. Extract reusable money/date/CSV oracles from UI specs into the unit project
   and cover malformed, negative, rounding, and timezone cases.
2. Provision deterministic data periods so chart/API value comparisons do not
   skip on empty default data.
3. Add accessibility/keyboard checks, responsive phone/tablet projects, and a
   reviewed dashboard KPI visual baseline.
4. Link every `DEFECT-API-500-*` expected failure to an owner, external issue,
   and expiry/review condition; remove the marker only when the product defect
   is fixed and the test passes unexpectedly.

## Definition of done

A pull request is ready only when it has:

- a mapped business risk and test layer;
- deterministic data/tenant preconditions and cleanup;
- exact API and error contracts, not permissive alternatives;
- an independent FinOps calculation oracle where a cost is shown or exported;
- UI/API postcondition coverage for any user-visible data mutation;
- accessibility and visual coverage when a critical screen changes;
- no new flake, with retries reporting—not masking—attempts; and
- a readable failure artifact that identifies account, period, filters, expected metric, actual metric, request correlation, and rounding rule without exposing secrets.
