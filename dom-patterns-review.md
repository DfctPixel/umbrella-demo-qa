# Umbrella FinOps — DOM Patterns & Locator Reference

## LOGIN PAGE (`/log_in`)

```
textbox "sam@company.com"         → input[placeholder="sam@company.com"]
button "Next"                      → getByRole('button', { name: 'Next' })
textbox "8 Characters minimum"    → input[placeholder="8 Characters minimum"]
button "Login"                     → getByRole('button', { name: 'Login' })
button "Forgot password"          → getByRole('button', { name: 'Forgot password' })
link "Register"                    → getByRole('link', { name: 'Register' })
```

**Flow:** Email → Next → Password → Login → Redirect to `/dashboard`

---

## SIDEBAR NAVIGATION (all authenticated pages)

**Pattern:** Top-level items use `#sideBarItemButton-{id}`, sub-items use `#innerSideBarItemButton-{id}`

| Nav Item | Button ID |
|---|---|
| Dashboard | `#sideBarItemButton-dashboard` |
| Unit Economics | `#sideBarItemButton-unitEconomics` |
| Recommendations | `#sideBarItemButton-recommendations` |
| → Waste Detector | `#innerSideBarItemButton-recommendationExplorer` |
| Cost & Usage | `#sideBarItemButton-costAndUsage` |
| → Cost & Usage Explorer | `#innerSideBarItemButton-costAndUsageExplorer` |
| → Reports | `#innerSideBarItemButton-reports` |
| → Dashboards | `#innerSideBarItemButton-dashboards` |
| → Panels | `#innerSideBarItemButton-panels` |
| → Assets | `#innerSideBarItemButton-assets` |
| → Resource Explorer | `#innerSideBarItemButton-resourceExplorer` |
| → Metrics Explorer | `#innerSideBarItemButton-metricsExplorer` |
| → K8s Preferences | `#innerSideBarItemButton-preferences` |
| Cost Allocation | `#sideBarItemButton-costAllocation` |
| → Business Mapping | `#innerSideBarItemButton-businessMapping` |
| → Tag Governance | `#innerSideBarItemButton-governanceTags` |
| → Tag Groups | `#innerSideBarItemButton-virtualTags` |
| → Enrichment Tags | `#innerSideBarItemButton-enrichmentTags` |
| → Filter Group | `#innerSideBarItemButton-filterGroup` |
| → Views | `#innerSideBarItemButton-views` |
| Commitment | `#sideBarItemButton-commitment` |
| → Dashboard | `#innerSideBarItemButton-commitmentDashboard` |
| → My Commitments | `#innerSideBarItemButton-myCommitments` |
| Services | `#sideBarItemButton-services` |
| → EC2 | `#innerSideBarItemButton-ec2` |
| → RDS | `#innerSideBarItemButton-rds` |
| → S3 | `#innerSideBarItemButton-s3` |
| Monitoring | `#sideBarItemButton-monitoring` |
| → Anomaly Detection | `#innerSideBarItemButton-anomalyDetection` |
| → Budget | `#innerSideBarItemButton-budget` |
| → Alerts | `#innerSideBarItemButton-alerts` |
| Partner | `#sideBarItemButton-partner` |
| → Billing Rules | `#innerSideBarItemButton-billingRulesNew` |
| → Billing Status | `#innerSideBarItemButton-billingStatus` |
| → Billing Summary | `#innerSideBarItemButton-billingSummary` |
| → Billing History | `#innerSideBarItemButton-billingHistory` |
| → Credits | `#innerSideBarItemButton-credits` |
| → Manage Customers | `#innerSideBarItemButton-manageCustomers` |
| CostGPT | `#sideBarItemButton-costGpt` (no submenu) |
| Pricing | `#sideBarItemButton-pricing` (returns 404) |

**Navigation pattern:**
```typescript
async navigateTo() {
  await page.locator('#sideBarItemButton-commitment').click();
  await page.locator('#innerSideBarItemButton-commitmentDashboard').waitFor({ state: 'visible' });
  await page.locator('#innerSideBarItemButton-commitmentDashboard').click();
  await page.waitForURL(/commitment\/dashboard/);
}
```

---

## DASHBOARD (`/dashboard`)

**Structure (generic container > main > content)**
```
heading "MTD cost" [level=5]
  → sibling heading "$ 126,728" [level=2]     → getByText('MTD cost')
heading "Previous MTD Cost" [level=5]
  → sibling "$ 155,934"
text "-18.73%"
heading "Previous Month Total Cost" [level=5]
  → sibling "$ 161,356"
heading "Forecasted Monthly Cost" [level=5]
heading "Annual Potential Savings" [level=5]
  → sibling "-" (no data)
heading "New Recommendations" [level=5]
  → sibling "1743Today 0Yesterday"
heading "YTD Savings"
  → "Total Annual Savings: $ 197,954"
  → "Savings From Recommendations: $ 21,578"
  → "Savings From Commitments: $ 176,376"
anomalies widget: "1 Open Anomalies", "$ 61 Open Anomalies cost impact"
budgets widget: "We saw you haven't set up any budgets yet"
commitments: "6 Saving Plans", "1 will expire this month", "0 Reservation"
Top 10 table: <table> with column headers Service | Previous MTD Costs | MTD Costs | Change ($)
Cost by Region table: <table> with Region | MTD Costs | % of Total Cost
```

**Key selectors:**
```typescript
getByText('MTD cost')                          // MTD cost card
getByText('Previous Month Total Cost')          // Previous month card
getByText('Forecasted Monthly Cost')            // Forecast card
getByText('Annual Potential Savings')           // Savings card
getByText('New Recommendations')                // Recommendations card
page.locator('nav')                             // Sidebar
```

---

## COMMITMENT DASHBOARD (`/commitment/dashboard`)

```
heading "Commitment Dashboard" [level=3]
Date range: From "Jan 26" → To "Jun 26"
Service filter: combobox "EC2"

Charts:
  heading "Monthly Usage By Pricing Method" [level=5]
    → Export as CSV button
    → region with chart image (Running hours: 0-280K)
  heading "Total Hours Distribution" [level=5]
    → Export as CSV button
  heading "Commitment Savings & Waste" [level=5]
    → Export as CSV button

Tables:
heading "Top 10 Unutilized Commitment" [level=5]
  → Export as CSV button
  → <table> with columns: Linked Account | Commitment | Expiration Date | Utilization Percent
  Data rows: sp-compute-2024-5 (86.48%), sp-compute-2024-4 (95.14%), sp-compute-2024-3 (99.04%), sp-compute-2024-2 (99.90%)

heading "Top 10 Commitment Expiring Soon" [level=5]
  → Export as CSV button
  → <table> same columns
  Data rows: sp-compute-2024-1 (100%), sp-compute-2024-2 (99.90%), sp-compute-2024-3 (99.04%), sp-compute-2024-4 (95.14%), sp-compute-2024-5 (86.48%)
```

**Key selectors:**
```typescript
getByRole('heading', { name: /Commitment Dashboard/i })
getByText('Monthly Usage By Pricing Method')
getByText('Top 10 Unutilized Commitment')
getByText('Top 10 Commitment Expiring Soon')
getByRole('button', { name: /Export as CSV/i })
page.locator('table')  // tables with progressbar for utilization
```

---

## ANOMALY DETECTION (`/monitoring/anomaly-detection`)

```
heading "Anomaly Detection" [level=3]
tablist:
  tab "Cost Anomalies" [selected]
  tab "New Services"

Filters:
  From: "May 1st 26"
  To: "Jun 25th 26"
  textbox "Search"
  button "Alert configuration (0)"
  Pagination: Page 1 of 1

Table columns: Anomaly Start | Customer | Account Name | Service | Region | Usage Type | Cost Impact | Daily Cost Impact | Cost Delta % | Status

Data rows (each has click action + drill-down link to CAUI):
  AmazonCloudWatch $61 $61 32% Open
  Amazon Elastic Compute Cloud $593 $291 79% Closed
  Amazon GuardDuty $61 $27 60% Closed
  Amazon Redshift $2,748 $106 17% Closed
  AmazonCloudWatch $126 $50 54% Closed
  AWS Lambda $142 $27 99% Closed
  Amazon GuardDuty $69 $14 30% Closed
  Amazon Simple Storage Service $1,293 $129 37% Closed
  AmazonCloudWatch $60 $60 56% Closed
  Amazon GuardDuty $40 $9 52% Closed

Each row has: expand button, action buttons, status badge (Open/Closed), chart drill-down link
```

**Key selectors:**
```typescript
getByRole('heading', { name: /Anomaly Detection/i })
getByRole('tab', { name: /Cost Anomalies/i })
getByRole('tab', { name: /New Services/i })
getByText(/Alert configuration/i)
getByRole('textbox', { name: 'Search' })
```

---

## BUDGET (`/monitoring/budget`)

```
heading "Budget" [level=3]
tablist:
  tab "Current Budgets" [selected]
  tab "Budget Summary"
button "Create Budget" [disabled]
Text: "0/1 Budgets", "There are no budgets found"
```

---

## COSTGPT (`/cost-gpt`)

```
heading "CostGPT" [level=2]
heading "Your Cost Companion" [level=3]
button "Capabilities"
link "Learn More" → https://docs.umbrellacost.io/docs/costgpt#/

Recommended questions (list of buttons):
  1. "The top 5 services over $5k, with the most significant dollar value increase in the last month."
  2. "Get ec2 cost last month by instance family type."
  3. "What is the monthly average ec2 compute hour cost for each month this year?"
  4. "List linked accounts added this year and the date they were added."
  5. "Show a pie chart of top 5 ec2 instance types cost me the most this year."
  6. "Show me the amortized costs for the most expensive service last year month by month as a time series."
  7. "What are the 10 most significant service cost increases over the past 90 days sorted by dollar value?"
  8. "Amortized Cost forecast for the next 3 months."
  9. "What is the coverage for each service over the last 12 months?"
  10. "What are the best ways to save data transfer cost in AWS?"

textbox "Ask your first question..."
button [disabled] (submit)
```

---

## ALERTS (`/monitoring/alerts`)

```
heading "Alerts" [level=3]
tablist:
  tab "Cost Alert Rules (0)" [selected]
  tab "Commitment Expiration Alert Rules (0)"
Filter toggles: checkbox "Trend alerts" [checked], checkbox "Threshold alerts" [checked]
Text: "You have no alert rules yet. Would you like to create alert rule?"
Button: "Create Alert Rule" (visible, not disabled)
```

---

## PARTNER BILLING SUMMARY (`/partner/billing-summary`)

```
heading "Billing Summary" [level=3]
Date range: From "May 2026" → To "May 2026"
textbox "Search"
button "Invoice export" [disabled]
link "Table Export" (CSV)
Pagination: Page 1

Table columns: Customer Name | Month | Year | Reseller Cost | Customer Cost | Total Margin | RI Margin | SP Margin | Tiers Margin | Billing Rule Margin | AWS Credits | Reseller Credit

Data: "Nothing was found Try different filters"
```

## COMMON HEADER PATTERNS (all pages)

```
radiogroup "Pricing mode options" → Customer (selected) / Partner
button "932213950603"              → Account selector
text "USD ($)"                      → Currency
button "?"                          → Help
notification count (dot)
button "Hahime1226@inkight.com"     → User menu
button "Close sidebar"              → Toggle sidebar
```

## API ENDPOINT PATTERNS

```
Auth:      GET  /user-management/users/user-realm?username={email}
           POST /users/sso           body: {"username"}
           POST /users/signin        body: {"username", "password"}

CAUI:      POST /invoices/caui       body: {granularity, startDate, endDate, metrics, groupBy}

Service:   GET  /invoices/service-names/distinct
           GET  /invoices/service-costs/distinct
           GET  /invoices/service-costs/distinct-k8s
           GET  /invoices/service-costs/distinct-tags

Commit:    GET  /commitment/dashboard?periodGranLevel=month&startDate=&endDate=&filters[service]=ec2
           GET  /commitment/utilization/i/summary?date=&commitmentType=sp|ri
           GET  /commitment/utilization/totalsavings?commitmentType=sp|ri&dates=...

Anomaly:   GET  /anomaly-detection?startDate=&endDate=&isPpApplied=false
           GET  /anomaly-detection/rules
           GET  /anomaly-detection/anomalies/stats

Recs:      POST /recommendationsNew/list           body: {pageNumber, pageSize, sort}
           POST /recommendationsNew/list/total
           POST /recommendationsNew/heatmap/summary
           POST /recommendationsNew/heatmap/dynamicFilter/cat_id

Dashboard: GET  /usage/custom-dashboard/dashboard/default
           GET  /usage/custom-dashboard/panels
           GET  /usage/custom-dashboard/dashboards

Tags:      GET  /tag-governance/coverage
           POST /tag-governance/resources   body: {pageNumber, pageSize}

Other:     GET  /budgets/v2/i/?only_metadata=true
           GET  /alerts/rules
           GET  /partner/billing-summary
```
