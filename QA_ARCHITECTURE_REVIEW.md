# QA Architecture Review

## Outcome

The expanded API, integration, schema, and contract-test solution is retained. The suite now contains **140 tests in 17 spec files**. The full retained suite completed successfully against the configured QA environment; TypeScript compilation also passes.

The review removed only checks that did not establish a stable, documented product contract. It did not remove API or contract coverage simply because an endpoint is variable or read-only.

## Changes made during the review

- Fixed four TypeScript defects in the expanded suite: two invalid `expect.fail` calls, an optional anomaly-stat type, and the `plain-sub-users` response type.
- Capped the API project at four workers because the shared QA tenant produced a concurrency-only failure under the previous full-suite load. A focused repeat run passed; the cap prevents the test suite from creating artificial throttling.
- Kept the contract suite and tagged its latency/body-size probes as `@performance`, separating timing checks from functional contracts.
- Removed 14 low-signal checks: one permanently skipped identity check and 13 assertions that accepted incompatible outcomes, only asserted an optional header/type, or tolerated server errors as valid input validation.
- Fixed the Cost & Usage chart/API comparison to normalize zero-padded UI dates before reconciling chart data with the per-service API response.

## Coverage assessment

| Area | Assessment | Notes |
| --- | --- | --- |
| Authentication and authorization | High | Token, invalid credential, and invalid-token paths are covered. |
| Cost and usage | High | CAUI, service dimensions, budgets, recommendation data, and UI/API reconciliation are covered. |
| Recommendations | High | List, categories, filters, and integrity checks are covered. |
| Platform and account configuration | Medium | Read models are covered; role and mutation workflows are not. |
| Monitoring and FinOps | Medium | Read/integrity paths are covered; alert lifecycle and write actions are not. |
| API contracts | Medium | Status, shape, and cross-endpoint checks are useful, but they are not yet backed by a versioned OpenAPI source of truth. |
| UI journeys and CSV export | Medium | Primary cost journey is strong; export mapping and accessibility need more deterministic coverage. |

## Remaining technical debt and recommendations

1. **Replace conditional assertions with explicit contracts.** ESLint reports 105 `playwright/no-conditional-in-test` warnings. Most come from optional-field checks against environment-dependent data. Make required fields/statuses part of an OpenAPI contract, create deterministic fixture data, and turn each conditional into either a direct assertion or a documented precondition skip.
2. **Publish a versioned API specification.** Generate schema/contract tests from OpenAPI (required fields, enums, error payloads, status codes) rather than maintaining inferred shapes in test code.
3. **Split execution lanes.** Run a small API/UI smoke suite on pull requests, the full contract/integration suite after merge, and `@performance` probes on a scheduled environment with defined SLOs.
4. **Use a resettable QA tenant for mutations.** This enables budget, alert, dashboard, and permission CRUD tests with reliable setup and cleanup instead of leaving write coverage role-gated.
5. **Move API lifecycle into a Playwright worker fixture.** The current shared API fixture is practical, but a worker-scoped fixture with disposal makes authentication/context ownership explicit and prevents context leaks.
6. **Strengthen UI quality signals.** Add accessibility assertions for critical flows and make CSV checks validate an explicit API-to-export field mapping rather than UI text alone.

## Verification

- `npx tsc --noEmit` — passed.
- Full retained Playwright suite against QA — passed (140 tests).
- ESLint — 0 errors, 105 warnings; warnings are intentionally left visible as follow-up work.
