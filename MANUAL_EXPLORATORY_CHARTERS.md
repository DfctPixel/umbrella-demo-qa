# Manual Exploratory Test Charters

## Current automation context (reviewed 2026-08-04)

The automated web gate at `cb93d3c` is green for 133 API, 8 UI, and 10 unit
tests, but it does not replace these exploratory sessions. Visual is available
on demand, while accessibility, responsive, security, performance, mutation,
and multi-tenant exploration remain release-risk activities. Use the latest
commit and CI run URL in each session record; do not treat the historical
exploration report as current execution evidence.

These charters cover the live Umbrella FinOps web application. They are intentionally mission-based rather than scripted: the tester follows the mission, varies data and actions, records observations, and reports defects with evidence. This is session-based exploratory testing as described by the [ISTQB Test Analyst syllabus](https://www.istqb.org/wp-content/uploads/sdm-uploads/ISTQB-CTAL-TA-Syllabus-v4.0-EN-4.pdf).

## How to run a session

- Time-box: 45–60 minutes per charter; reserve the last 10 minutes for evidence and triage.
- Use a dedicated synthetic tenant and a fresh browser context unless the charter explicitly tests persistence.
- Record build/commit, environment, browser/device, role, tenant capability, period, currency, timezone, filters, and test data IDs.
- Explore normal, empty, boundary, interrupted, and unauthorized paths. Follow suspicious behavior instead of returning to the script.
- Capture a sanitized screenshot, visible error text, request classification/status, and reproduction steps. Never attach tokens, cookies, raw emails, ARNs, account IDs, or full request bodies.
- Classify findings as product defect, data-quality defect, test/framework defect, environment issue, or usability/accessibility issue.

## Charters

### M-01 — Authentication, session, and recovery (P0)

**Mission:** Establish whether a user can sign in, remain correctly scoped, recover from expiration, and sign out without leaking data.

Explore valid/invalid credentials, realm/SSO transition, refresh, new tab, reload, back/forward, idle expiry, logout, browser restart, and a revoked/expired token. Verify the URL, visible identity, account/division/currency scope, API statuses, cookie/token clearing, and redirect behavior. Confirm that a failed login does not expose whether an account exists.

### M-02 — Dashboard KPI truth and states (P0)

**Mission:** Verify dashboard cards communicate correct, stable values for a known period and tenant.

Try current month, previous month, month boundary, zero-cost period, credits/refunds, currency changes, division/account changes, slow loading, API failure, and partial widgets. Compare card values with the independently requested API data using the documented rounding rule. Check stale values do not remain after filters change and that loading/empty/error states are distinguishable.

### M-03 — Cost & Usage calculations (P0)

**Mission:** Prove the chart, totals, table, and search/filter controls represent the same query and aggregation.

Vary daily/monthly granularity, start=end day, timezone/DST boundary, year boundary, service/account/region/tag filters, include/exclude filters, amortization/cost type, and no-data periods. Confirm selected filter pills, exact request shape, result dates, negative credits/adjustments, chart tooltip, table totals, and CSV values. Toggle filters rapidly and navigate away/back to detect stale responses and race conditions.

### M-04 — Dimensions and filter semantics (P1)

**Mission:** Find mismatches between configured dimensions, filter controls, request parameters, and result grouping.

Exercise every enabled dimension, custom tags with special characters, long values, empty values, duplicate selections, case differences, multi-select, clear-all, saved filters, and an unsupported/disabled dimension. Verify URL/state persistence, reset behavior, no cross-filter leakage, and that totals conserve when grouping is changed.

### M-05 — Commitments and exports (P0)

**Mission:** Validate commitment KPIs, table rows, utilization calculations, and exports as one consistent record set.

Explore RI/SP modes, account/service filters, expiring and unutilized tables, empty tables, duplicate display names, date/timezone formatting, currency formatting, large values, zero denominator, CSV quoting/commas/newlines, download cancellation, repeated export, and browser refresh during export. Correlate rows only through a proven stable shared identifier; never use row order or an ambiguous date-only key.

### M-06 — Recommendations and pagination (P1)

**Mission:** Verify recommendation list, totals, heatmap, sorting, filters, and pagination share one consistent scope.

Try first/last/empty/negative/oversized page values, every supported sort, missing sort, repeated requests, fast filter changes, no recommendations, duplicate IDs, long text, and a recommendation with zero savings. Confirm documented validation statuses, page-count semantics, totals, stable ordering, idempotency, and tenant scope.

### M-07 — Anomalies, alerts, and notifications (P1)

**Mission:** Check the lifecycle and consistency of anomalies from detection through notification and resolution.

Use empty, single, and multiple anomalies; reversed/invalid/future dates; page count versus record count; `alerted=true`; rule enable/disable; acknowledgement/close; notification preference changes; duplicate notification delivery; and refresh during state transition. Verify identifier, service, cost impact, state, owner, timestamps, and notification correlation against the documented contract.

### M-08 — Custom dashboards and reports (P1)

**Mission:** Explore dashboard/panel configuration, persistence, sharing, and rendering under imperfect data.

Create/rename/reorder/remove a panel where permitted, cancel midway, refresh, open in a second tab, use an empty panel, resize the viewport, and test a failed/slow panel request. Confirm saved state, ownership, tenant isolation, accessible titles, keyboard operation, and that a deleted/unauthorized panel cannot remain visible from cache.

### M-09 — Authorization and tenant isolation (P0)

**Mission:** Prove that roles and tenant boundaries protect both actions and response properties.

Use at least two roles and two synthetic tenants. Change account/division IDs, object IDs, pagination, filters, and export parameters manually; replay a request with another tenant's identifier; inspect response fields, downloads, URLs, browser storage, and caches. Verify unauthorized access returns the documented status and error shape, not an empty success that can hide a BOLA/property-authorization defect.

### M-10 — Accessibility and responsive behavior (P1)

**Mission:** Determine whether a keyboard, screen reader, zoomed, touch, or narrow-viewport user can complete critical tasks.

Run keyboard-only login, navigation, filter selection, table traversal, chart access, and export. Check focus order/visibility, skip links, accessible names, live loading/error announcements, headings, table headers, contrast, 200% zoom, reduced motion, portrait/landscape, tablet, and phone widths. Verify no horizontal scroll hides actions and no tooltip is pointer-only.

### M-11 — Resilience, performance, and recovery (P1)

**Mission:** Find user-visible failures caused by latency, partial outages, or repeated actions.

Use throttled/slow network, offline/online transitions, API 4xx/5xx, timeout, malformed/partial payload, browser reload during request, duplicate click, back/forward, and multiple tabs. Record time to usable state, request count, retries, cancellation behavior, error recovery, and whether stale or duplicated data appears. This charter is a discovery tool; publish percentile SLOs separately from one remote smoke timing check.

### M-12 — Privacy and artifact hygiene (P0)

**Mission:** Verify secrets and tenant-sensitive data cannot escape through the application or QA evidence.

Inspect page source, browser storage, URLs, console errors, downloads, screenshots, traces, videos, network failures, and CI artifacts. Confirm tokens are not in localStorage when secure alternatives are available, passwords are never rendered/logged, export files are scoped, error messages are redacted, and test artifacts contain only synthetic identifiers.

## Session note template

```text
Charter: M-__
Date/time:
Build/commit:
Environment/browser/device:
Role / synthetic tenant:
Period / currency / timezone:
Data and filters:
Mission notes:
Observed risks:
Defects (steps, expected, actual, severity, evidence):
Follow-up automation candidate:
Unexplored areas / constraints:
Tester:
```

## Release sign-off minimum

For a release candidate, complete M-01, M-02, M-03, M-05, M-09, and M-10 at minimum; add M-06–M-08 for changes in those domains. A charter is not "passed" because the page loaded: record the data precondition, user outcome, and evidence for each mission.
