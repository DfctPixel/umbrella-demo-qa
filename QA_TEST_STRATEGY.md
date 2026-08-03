# QA Test Strategy

This document is the operating model for the Umbrella FinOps QA solution. It separates fast, deterministic feedback from high-fidelity release evidence and defines what must be automated versus explored manually.

## Guiding principles

1. Test user-visible behavior and published API contracts, not implementation details.
2. Put each check at the lowest layer that can provide trustworthy feedback.
3. Keep tests isolated: each test owns its context, credentials, data preconditions, and cleanup.
4. A green test must mean the contract was exercised. Missing data is an explicit precondition result, never a silent pass.
5. Use exact status codes, schemas, invariants, rounding rules, time zones, and authorization expectations.
6. Treat retries as diagnostics for infrastructure instability, not as a way to hide product failures.
7. Keep tenant data and credentials out of source, logs, screenshots, traces, and artifacts.

These principles follow the [Playwright best-practices guidance](https://playwright.dev/docs/best-practices), the [Playwright CI guidance](https://playwright.dev/docs/ci), the Android testing strategy's pyramid and five-layer model ([Android Developers](https://developer.android.com/training/testing/fundamentals/strategies)), and Apple's testing guidance ([Apple Developer](https://developer.apple.com/documentation/xcode/testing)). The pyramid is a risk-based target, not a percentage compliance metric.

## Patterns adopted from the learning repositories

The local `learning-export` examples were reviewed as reference material. The following patterns are now applied here:

- worker-scoped authenticated API fixtures and project dependencies for reusable setup;
- browser/device projects kept explicit so a mobile or cross-browser lane can be added without weakening the default gate;
- `forbidOnly`, bounded CI retries, first-retry traces, failure screenshots, and machine-readable JUnit output;
- response guards in every typed API client, with endpoint/status diagnostics and no raw tenant payloads in errors;
- fail-fast configuration diagnostics before authentication network calls.

Demo-only patterns were intentionally not copied: hard-coded credentials, positional selectors without a contract reason, unconditional `test.skip()` placeholders, arbitrary sleeps, and raw response dumps in reports. These examples are useful for learning syntax, but would reduce isolation or make a green enterprise gate less trustworthy.

## Test layers and ownership

| Layer | Purpose | Examples in this repository | Execution | Gate |
| --- | --- | --- | --- | --- |
| Pure/unit | Money, dates, key construction, parsing, and normalization | `strictParseAmount`, date and aggregation oracles | Local and CI | Blocking |
| Contract | Status, headers, request/response schemas, error envelopes, auth scheme | `tests/api/contracts`, `tests/api/schemas`, negative tests | Every intentional CI dispatch | Blocking |
| API integration | Cross-endpoint consistency and FinOps invariants | `tests/api/integration`, `tests/api/finops` | Regression lane | Blocking before promotion |
| Component/behavior | A page or reusable table's visible behavior | Page objects and `DataTable` checks | Regression lane | Blocking for changed domain |
| E2E workflow | Critical user task from navigation through rendered result | Login, Cost & Usage, commitment export | Smoke + regression | Blocking for release |
| Visual/accessibility | Stable visual states and semantic/keyboard behavior | `tests/ui/visual`; planned axe/keyboard lane | UI change or scheduled | Blocking for approved baselines; accessibility defect gate |
| Release/manual | Unknowns, usability, compatibility, abuse, and exploratory discovery | `MANUAL_EXPLORATORY_CHARTERS.md` | Each release or risk change | Release sign-off |

The current suite is API-heavy by design. That is healthy for a remote FinOps system, but test count is not coverage. Each new feature should add the smallest useful unit/oracle test, a contract check, an integration invariant where data crosses endpoints, and only then an E2E journey.

## Executable lanes

Tests use tags in the title so lanes are discoverable and reviewable:

| Lane | Selector | Scope | Policy |
| --- | --- | --- | --- |
| Smoke | `@smoke` | Login, one contract request, one Cost & Usage journey | No retries; fast and blocking |
| Contract | `@contract` | Request/response/error/auth contracts | Blocking; exact expectations |
| API regression | `@api` | API, invariants, negative, integration, schemas | Blocking before promotion |
| UI regression | `@ui` | Journeys, exports, login | Blocking before promotion |
| Visual | `@visual` | Approved stable baselines | Run on pinned browser/OS; review snapshot changes |
| Security | `@security` | Tenant isolation, object/property authorization, token and sensitive-field checks | Scheduled and release candidate |
| Performance | `@performance` | Latency and payload smoke only | Load/percentile testing belongs in a dedicated environment |
| Manual | charter IDs `M-*` | Exploratory and compatibility sessions | Evidence required for release sign-off |

The repository scripts expose the first three lanes. A lane must fail if no test matched it; an empty lane is a configuration defect.

## Environment and test data contract

- Use a dedicated synthetic QA tenant. Do not use production or personal accounts.
- Resolve `userKey`, account, account type, division, currency, and capability from the authenticated profile where possible.
- Require explicit `QA_ACCOUNT_KEY` and `QA_ACCOUNT_TYPE_ID` fallback secrets when the profile omits account data; fail at fixture setup with a clear precondition error.
- Freeze a known billing period for reconciliation tests. Record the period, currency, timezone, filters, and expected data availability as test metadata.
- Create mutable data through API factories with unique names and a cleanup registry. Never depend on another test's created budget, alert, dashboard, or recommendation.
- Use test data builders that return canonical IDs and do not log full payloads. Redact emails, account IDs, ARNs, tags, and tokens from failure messages.

## API and FinOps quality rules

1. Keep endpoint-specific request builders. Do not put endpoints with different required headers, query parameters, or bodies into a generic "stateless" array.
2. Publish a versioned OpenAPI contract when the product endpoint contract is available. Validate success and error responses, parameter bounds, enums, formats, pagination, and security schemes.
3. Assert one documented status per input class. If behavior is unknown, record a product contract decision rather than accepting both success and error.
4. Use typed clients that validate status, headers, and body before returning a decoded payload; keep the raw request context available for contract tests that need headers. Never parse an assumed JSON body before checking content type and status.
5. Keep money in integer minor units or a decimal representation. Define sign semantics for credits, refunds, discounts, adjustments, and committed spend. Define rounding and currency precision explicitly.
6. For every UI calculation, capture the exact browser request, apply an independent oracle to the response, and compare the rendered card/chart/table/export value. The page object must not copy production aggregation logic.
7. Verify conservation properties: daily-to-monthly rollup, grouping totals, allocation buckets, commitment utilization, recommendation totals, anomaly counts, and currency/timezone boundaries.
8. Add security cases for authentication, token expiry, object-level authorization, property exposure, tenant isolation, pagination abuse, rate limiting, and sensitive-field leakage. Use the [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) and [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x11-t10/) as the checklist source.

## Web UI and visual rules

- Page objects may expose business actions and stable semantic/test-id locators; they must not encode DOM ancestry or positional assumptions without an asserted reason.
- Prefer role, label, accessible name, and product-owned `data-testid` locators. Use `toBeVisible`, `toHaveText`, and other web-first assertions rather than immediate `isVisible()` snapshots.
- Assert loading, success, empty, error, and partial-data states for every critical page.
- Scope screenshots to stable components, mask only documented volatile values, pin browser/OS/fonts, and review baseline changes as code review artifacts.
- Add accessibility automation with `@axe-core/playwright` for critical pages, then supplement it with manual keyboard, focus, zoom, contrast, screen-reader-name, and chart/table semantics checks. Automated accessibility checks do not replace manual assessment.
- Add responsive web projects for a representative phone and tablet viewport. A responsive web project is not a substitute for native Android/iOS tests.

## Mobile strategy

This repository currently automates the web application. Native mobile automation should be a separate project and should share API clients, factories, contracts, and oracles rather than duplicating business assertions.

| Mobile layer | Recommended technology | Scope |
| --- | --- | --- |
| Domain/unit | Platform unit framework | Money, date, auth state, refresh, offline queue |
| Service/contract | Shared API client or Pact/OpenAPI checks | Auth headers, refresh, pagination, error mapping |
| Native component | Android instrumented/Compose or iOS XCTest | Form state, accessible names, loading/error components |
| Native E2E | Appium for cross-platform flows; XCTest/Espresso for platform fidelity | Login, dashboard, filters, export/share, session recovery |
| Device/release | Device farm and a small risk-based matrix | OS versions, screen sizes, network, rotation, background/resume |

Use secure platform storage for tokens (Keychain/Keystore), never plain preferences. Test refresh five minutes before expiry, invalid refresh, logout, reinstall, background/resume, offline/online recovery, clock/timezone changes, and revoked access. Appium is a transport/driver layer; it does not replace native component tests. See the [Appium documentation](https://appium.io/docs/en/latest/) and the Android guidance on [edge cases](https://developer.android.com/training/testing/fundamentals/what-to-test).

## Reliability and CI policy

- CI runs one workflow per branch/ref at a time; a newer intentional dispatch cancels stale work.
- CI uses one worker for reproducibility and shared-tenant safety. Sharding is preferred over increasing worker pressure when runtime becomes material; see [Playwright sharding](https://playwright.dev/docs/next/test-sharding).
- Retries are limited to one diagnostic retry in CI. A test that passes only on retry is reported as flaky and counted against a flake budget.
- Keep traces on first retry, screenshots on failure, and videos only when needed. Upload reports only when tests run and retain them for the minimum useful period.
- Review artifacts for credentials, emails, account identifiers, ARNs, tags, and raw API bodies before sharing. Sanitize diagnostics structurally (field names/types, status, request classification), not by dumping payloads.
- Required checks must be named consistently: lint/typecheck, smoke, contract, regression, visual/a11y, and security/performance as applicable.

## Definition of done for a new feature

1. A risk/contract note names the user outcome, data source, roles, tenant boundary, currency, timezone, and empty/error behavior.
2. Pure calculations and parsers have fast tests for normal, zero, negative, maximum, malformed, and rounding cases.
3. The API contract covers success, validation, auth, error envelope, pagination, and sensitive-field exposure.
4. A cross-endpoint invariant exists when the feature displays or exports calculated data.
5. One critical E2E path proves the user can complete the task and sees the calculated result.
6. Accessibility, responsive/mobile, visual, performance, and exploratory coverage are either implemented or have a documented risk-based reason to defer.
7. CI evidence and any known defects/expected failures are recorded with an owner and issue ID.
