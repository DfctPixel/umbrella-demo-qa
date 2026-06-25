# Gap Analysis: umbrella-demo-qa vs learning-export Reference Architecture

> Comparing the current Umbrella FinOps test project against best practices
> from the swag-labs-playwright reference implementation.

---

## 1. Centralized Selector Configuration

| Reference | Current | Gap |
|-----------|---------|-----|
| `config/selectors.ts` — single source of truth for all locators | Selectors hardcoded in each page object constructor | **HIGH** |

**In our repo**, every `page.getByText()`, `page.locator('#id')`, etc. is defined inline in each page object's constructor. If a selector changes, you must find and update it in the page object. If you need different selectors for different environments (staging vs prod, mobile vs desktop), there's no mechanism.

**Recommendation**: Create `config/selectors.ts`:
```typescript
export const LOGIN_SELECTORS = {
  emailInput: '[placeholder="sam@company.com"]',
  passwordInput: '[placeholder="8 Characters minimum"]',
  nextButton: 'button:has-text("Next")',
  loginButton: 'button:has-text("Login")',
  forgotPassword: 'button:has-text("Forgot password")',
} as const;
```

---

## 2. Component-Based Architecture

| Reference | Current | Gap |
|-----------|---------|-----|
| `components/CartItem.ts`, `components/ProductItem.ts` encapsulating reusable UI patterns | No components — every page object is monolithic | **HIGH** |

**In our repo**, there's no separation between a "page" and a "component within a page." The Commitment Dashboard tables (Top Unutilized, Top Expiring) are the same structure — they should share a `DataTable` component. The anomaly list rows share structure too.

**Recommendation**: Create `components/DataTable.ts`:
```typescript
export class DataTableComponent {
  constructor(private table: Locator) {}

  async getRows(): Promise<Record<string, string>[]> { ... }
  async getRowCount(): Promise<number> { ... }
  async exportToCsv(): Promise<void> { ... }
}
```

Then `CommitmentDashboardPage` would use `new DataTableComponent(page.locator('table').first())` instead of inline table logic.

---

## 3. BasePage with Rich Assertions

| Reference | Current | Gap |
|-----------|---------|-----|
| 20+ methods: `click()`, `fill()`, `assertIsVisible()`, `assertHasCount()`, `assertTextContains()`, `assertUrlContains()`, etc. | 7 methods: `navigate()`, `waitForLoadState()`, `waitForUrl()`, `clickVisible()`, `fillVisible()`, `getTextContent()`, `reload()` | **MEDIUM** |

**In our repo**, all assertions live in spec files (`expect(page.getByText(...)).toBeVisible()`). The reference embeds fluent assertions in page objects, making specs shorter and more readable.

**Recommendation**: Add to `BasePage.ts`:
```typescript
async assertVisible(locator: Locator, msg?: string): Promise<this> {
  await expect(locator, msg).toBeVisible();
  return this; // fluent chaining
}

async assertHasText(locator: Locator, text: string, msg?: string): Promise<this> {
  await expect(locator, msg).toHaveText(text);
  return this;
}
```

---

## 4. Fluent Interface (Method Chaining)

| Reference | Current | Gap |
|-----------|---------|-----|
| Action methods return `this` enabling chains like `.login().assertFormIsVisible().assertErrorIsDisplayed()` | Actions return `void` or `Promise<void>` — no chaining | **MEDIUM** |

**Example from reference**:
```typescript
await loginPage
  .goto()
  .assertFormIsVisible()
  .login('user', 'pass')
  .loginFluent('invalid', 'wrong')
  .assertErrorIsDisplayed();
```

**Our current style**:
```typescript
await loginPage.goto();
await loginPage.login(email, pass);
await dashboardPage.waitForDashboardLoad();
await expect(page).toHaveURL(/dashboard/);
```

Fluent chaining makes tests shorter and more readable for complex flows.

---

## 5. Lazy Locator Initialization

| Reference | Current | Gap |
|-----------|---------|-----|
| Getter-based locators: `get inventoryItems(): Locator { return (this._inventoryItems ??= ...); }` | All locators eagerly created in constructor | **LOW** |

**Impact**: Minimal for our project. Our page objects are small enough that eager init isn't a problem. Lazy init helps when you have 50+ locators per page (we have 5-10).

---

## 6. Configuration-Driven Page Objects

| Reference | Current | Gap |
|-----------|---------|-----|
| Constructor accepts optional custom selectors: `constructor(page: Page, selectors = DEFAULT_SELECTORS)` | Constructor only takes `page: Page` — no selector injection | **LOW** |

**Impact**: Low for now, but if we ever need to test against different app versions or support mobile selectors, we'd need this pattern.

---

## 7. Embedded Assertions in Page Objects

| Reference | Current | Gap |
|-----------|---------|-----|
| Pages have `assertItemVisible()`, `assertCartBadgeCount()`, etc. | All assertions in spec files | **MEDIUM** |

**Benefit**: Self-documenting tests. When you read `await commitmentPage.assertTableHasRows()`, you know exactly what's being checked without looking at the locator.

---

## 8. DataTable Component Reuse

| Reference | Current | Gap |
|-----------|---------|-----|
| N/A (different domain) | Two nearly identical table operations in `data-export.spec.ts` — duplicated code | **HIGH** |

**Our code** has `readTableRows()` defined as a free function in `data-export.spec.ts`. The same table-reading logic would need to be duplicated if another spec needed it. Should be a reusable component.

---

## 9. Unused Page Object Properties

| Reference | Current | Gap |
|-----------|---------|-----|
| N/A | `DashboardPage` defines 6 locators, only `mtdCost` is ever asserted | **MEDIUM** |

**Dead locators**:
- `DashboardPage`: `previousMonthCost`, `forecastingCard`, `annualSavings`, `recommendations`, `sidebar` — never used
- `CostUsageExplorerPage`: `groupByService`, `groupByDate`, `breadcrumb`, `amortizedButton`, `serviceList`, `filterCount`, `applyButton`, `showK8sBreakdown`, `getServiceCount()`, `selectFirstService()` — never used

---

## 10. Unused API Client Methods

| Reference | Current | Gap |
|-----------|---------|-----|
| N/A | `signinWithToken()`, `getOnboardingVendors()`, `getCueViews()`, `getRecommendationsHeatmap()`, `getDefaultDashboard()`, `getDashboards()`, `getChannels()`, `getDistinctTagCosts()` — defined, never called | **MEDIUM** |

---

## 11. Test Data Management

| Reference | Current | Gap |
|-----------|---------|-----|
| Uses fixtures (`test.extend`) for auth state | Implemented in commit `dba8402` | ✅ **DONE** |

---

## 12. ESLint + TypeScript in CI

| Reference | Current | Gap |
|-----------|---------|-----|
| Both lint and type-check run in CI | Fixed in commit `5076347` | ✅ **DONE** |

---

## Summary of Gaps

| Priority | Gap | Effort | Impact |
|----------|-----|--------|--------|
| 🔴 HIGH | Shared DataTable component for table interactions | 2h | Eliminates duplicated CSV export / table-reading logic |
| 🔴 HIGH | Component architecture (extract table, chart, anomaly row components) | 4h | Reusable across Commitment Dashboard, Anomaly Detection, Cost by Region |
| 🟡 MEDIUM | Fluent assertions in BasePage | 1h | Makes tests shorter, more readable |
| 🟡 MEDIUM | Remove dead locators from page objects | 0.5h | Reduces maintenance burden, clarifies coverage |
| 🟡 MEDIUM | Centralized selector configuration | 2h | Single source of truth for all locators |
| 🟢 LOW | Lazy initialization pattern | 0.5h | Micro-optimization for large page objects |
| 🟢 LOW | Configuration-driven page objects | 1h | Useful if multi-environment selectors needed |
| 🟢 LOW | Remove unused API client methods or add tests for them | 0.5h | Cleans up dead code |
