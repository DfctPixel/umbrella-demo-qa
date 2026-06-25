# Umbrella FinOps Platform — Application Snapshots

> Generated from Playwright browser exploration on 2026-06-24/25.
> For an AI model to review the app structure and test coverage.

---

## 1. DASHBOARD PAGE

**URL:** `https://dev.umbrellacost.dev/dashboard`
**User:** Hahime1226@inkight.com

### Key Metrics (visible in header)
| Metric | Value | Change |
|--------|-------|--------|
| MTD Cost | $121,881 | Previous MTD $155,934 (-21.84%) |
| Previous Month Total | $161,356 | — |
| Annual Potential Savings | — | Current Waste 0.00% |
| New Recommendations | 1,743 | Today 0, Yesterday 0 |
| YTD Savings | $197,379 | From Recs $21,578, From Commitments $175,801 |

### Sidebar Navigation Structure
- **Dashboard**
- **Unit Economics**
- **Recommendations** → Waste Detector, Reports, Preferences
- **Cost & Usage** → Cost & Usage Explorer, Reports, Dashboards, Panels, Assets, Resource Explorer, Metrics Explorer, K8s Preferences
- **Cost Allocation** → Business Mapping, Tag Governance, Tag Groups, Enrichment Tags, Filter Group, Views
- **Commitment** → Dashboard, My Commitments
- **Services** → EC2, RDS, S3
- **Monitoring** → Anomaly Detection, Budget, Alerts
- **Partner** → Billing Rules, Billing Status, Billing Summary, Billing History, Credits, Manage Customers, Preferences, Reports
- **CostGPT**
- **Pricing**

### Widgets
1. **Daily Cost chart** — Previous Month vs Current Month line chart
2. **Monthly Cost chart** — Bar chart for Dec 2025–Jun 2026
3. **Top 10 by Service** — Table with Service, Previous MTD Costs, MTD Costs, Change ($/%). Services include CloudWatch Events ($0), Amazon Route 53 ($12), AWS KMS ($53), etc.
4. **Anomalies widget** — "You have no open Anomalies"
5. **Budgets widget** — "We saw you haven't set up any budgets yet"
6. **Commitments Inventory** — 6 Savings Plans (1 will expire this month), 0 Reservations
7. **YTD Savings** — Total $197,379 ($21,578 from Recs, $175,801 from Commitments)
8. **MTD Cost Breakdown** — Pie chart: Amazon Redshift $43,144 (35.4%), EC2 $21,370 (17.53%), Savings Plans $19,561 (16.05%), S3 $14,503 (11.9%)
9. **Cost by Region** — us-east-1 $95,489 (78.35%), Global $26,265 (21.55%), eu-central-1 $101

### Top Bar Controls
- Pricing mode: Customer / Partner
- Account: 932213950603
- Currency: USD ($)
- Notifications: 1
- Cost Type dropdown, Cost dropdown (Unblended), Exclude Tax

---

## 2. COMMITMENT DASHBOARD

**URL:** `https://dev.umbrellacost.dev/commitment/dashboard`
**Date Range:** Jan 26 – Jun 26

### KPI / Filter Bar
- Service filter: EC2 (dropdown)

### Charts
1. **Monthly Usage By Pricing Method** — Stacked area chart showing On-Demand, Spot, Savings Plans running hours. Y-axis: 0–280K hours
2. **Total Hours Distribution** — Pie chart: Spot, Savings Plans, On-Demand
3. **Commitment Savings & Waste** — Bar chart: RI Savings, SP Savings, RI Waste, SP Waste. Y-axis: $0–$22K

### Table: Top 10 Unutilized Commitment
| Linked Account | Commitment | Expiration Date | Utilization Percent |
|---|---|---|---|
| sp-compute-2024-5 | 5.0 | 2027-04-02 | 86.48% |
| sp-compute-2024-4 | 5.0 | 2027-04-02 | 95.14% |
| sp-compute-2024-3 | 5.0 | 2027-04-02 | 99.04% |
| sp-compute-2024-2 | 5.0 | 2027-04-02 | 99.90% |

### Table: Top 10 Commitment Expiring Soon
| Linked Account | Commitment | Expiration Date | Utilization Percent |
|---|---|---|---|
| sp-compute-2024-1 | 5.0 | 2027-04-02 | 100% |
| sp-compute-2024-2 | 5.0 | 2027-04-02 | 99.90% |
| sp-compute-2024-3 | 5.0 | 2027-04-02 | 99.04% |
| sp-compute-2024-4 | 5.0 | 2027-04-02 | 95.14% |
| sp-compute-2024-5 | 5.0 | 2027-04-02 | 86.48% |

### Export
- "Export as CSV" button on each chart and table

---

## 3. ANOMALY DETECTION

**URL:** `https://dev.umbrellacost.dev/monitoring/anomaly-detection`

### Tabs
- **Cost Anomalies** (selected)
- **New Services**

### Filters
- Date range: May 1, 2026 – Jun 24, 2026

### Real Anomaly Data Found
| Service | Cost Impact | Daily Cost | Delta | Status |
|---------|-------------|------------|-------|--------|
| EC2 | $593 | $291 | 79% | Closed |
| GuardDuty | $61 | $27 | 60% | Closed |
| Redshift | $2,748 | $106 | 17% | Closed |
| CloudWatch | $126 | $50 | 54% | Closed |
| Lambda | $142 | $27 | 99% | Closed |
| S3 | $1,293 | $129 | 37% | Closed |

### UI Elements
- "Alert configuration (0)" button — shows 0 existing alert rules
- Date range filter picker

---

## 4. BUDGET PAGE

**URL:** `https://dev.umbrellacost.dev/monitoring/budget`

- **"Create Budget" button is DISABLED** (cannot create budgets with current user role)
- **Tab: Current Budgets** — Shows "0/1 Budgets", "There are no budgets found"
- **Tab: Budget Summary** — available but not explored in detail

---

## 5. COSTGPT

**URL:** `https://dev.umbrellacost.dev/cost-gpt`

### Page Content
- Heading: **"CostGPT — Your Cost Companion"**
- Description: "Introducing CostGPT, your trusted cloud optimization companion! With CostGPT, you can receive personalized data analysis and visualizations in real-time."
- **Capabilities** button + **Learn More** link to docs

### Preset Questions (Recommended for you)
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

### Chat Input
- Textbox: "Ask your first question..."
- Submit button (disabled until text entered)

---

## 6. ALERTS PAGE

**URL:** `https://dev.umbrellacost.dev/monitoring/alerts`

### Tabs
- **Cost Alert Rules (0)** — selected
- **Commitment Expiration Alert Rules (0)**

### Content
- "You have no alert rules yet. Would you like to create alert rule?"
- **"Create Alert Rule" button** — visible and clickable (write operation)
- Filter toggles: Trend alerts, Threshold alerts (both checked by default)

---

## 7. PARTNER BILLING SUMMARY

**URL:** `https://dev.umbrellacost.dev/partner/billing-summary`

### Table Columns
Customer Name, Month, Year, Reseller Cost, Customer Cost, Total Margin, RI Margin, SP Margin, Tiers Margin, Billing Rule Margin, AWS Credits, Reseller Credit

### Controls
- Date: From May 2026 → To May 2026
- Search textbox
- Invoice export (disabled)
- Table Export (CSV)
- Pagination: Page 1 (disabled nav)

### Data
- "Nothing was found Try different filters" — no billing data for this user

---

## 8. PRICING PAGE

**URL:** `https://dev.umbrellacost.dev/pricing`

- **Returns "Page Not Found"** (404) — sidebar route exists but page component not implemented/deployed

---

## 9. TAG GOVERNANCE

**URL:** `https://dev.umbrellacost.dev/cost-allocation/tag-governance`

### Tabs
- **Resource Virtual Tags** (selected)
- **Tags Analyzer**

### Coverage Stats
- Virtual Tags Coverage: $392.58 (2 resources) / $126,692.89 (3,271,314 resources) = **0%**
- Untagged Resources (Last 30d): $11,674.42 (2,178,182 resources)
- Total pages: 163,566 pages of resources

### Resource Table Columns
Resource Cost, Resource Name/ID, Service, Region, Linked Account, Tags, Enrichment Tags, Virtual Tags

### Actions
- "Add Virtual Tag" button on each row (write operation)

---

## 10. MY COMMITMENTS

**URL:** `https://dev.umbrellacost.dev/commitment/my-commitments`

### Tabs
- **Reservations**: Active (0), Expired this month (0), Expired (2)
- **Savings Plans** (selected by default)

### KPI Bar
| Metric | Value |
|--------|-------|
| Annual Potential Savings | $0 |
| Utilization | 99.7% |
| Net Savings | $163,870 |
| Total Waste | $1,077 |
| ESR | 29.8% |
| Recurring Fee | $386,054 |
| On-Demand Equivalent Spend | $549,924 |

### Charts
- Utilization & Coverage graph
- Net Savings by Service (Redshift $163.9K at 100%)

### Table Columns
Linked Account ID, Linked Account, Instance Type, Amortized Fee, Service, Potential Savings, Net Savings, Waste, No. of Instances, Region, Status

---

## 11. COST & USAGE EXPLORER

**URL:** `https://dev.umbrellacost.dev/cost-usage/cost-usage-explorer`

### UI Elements
- Total Cost display
- Group By: Service, Date
- Breadcrumb navigation
- Amortized toggle button
- Search input for services
- Service list with pagination
- Filter controls: Presented items (X/Y count)
- Apply button
- Show K8S Breakdown toggle

---

## 12. RECOMMENDATIONS / WASTE DETECTOR

**URL:** `https://dev.umbrellacost.dev/recommendations/explorer`

- **Potential Savings: $-6,133** (negative value)
- Status filter: Open
- Date range: 24 Jun 2025 – 24 Jun 2026
- Table columns: Annual Potential Savings, Monthly Potential Savings, Current Annual Cost, Recommendation Type, Linked Account, Resource, Age, Region, Tags
- Table shows: "No Recommendation was found Try different filters"

---

## API ENDPOINTS DISCOVERED

### Authentication
- `GET /user-management/users/user-realm?username=...`
- `POST /users/sso` body: `{"username":"..."}`
- `POST /users/signin` body: `{"username":"...","password":"..."}`

### Cost & Usage
- `POST /invoices/caui` — CAUI queries (monthly/daily granularity)
- `GET /invoices/service-names/distinct`
- `GET /invoices/service-costs/distinct`
- `GET /invoices/service-costs/distinct-k8s`
- `GET /invoices/service-costs/distinct-tags`
- `GET /invoices/service-costs/public/distinct`
- `GET /invoices/cue-views`

### Commitments
- `GET /commitment/dashboard?periodGranLevel=month&startDate=...&endDate=...&filters[service]=ec2`
- `GET /commitment/utilization/i/summary`
- `GET /commitment/utilization/totalsavings`

### Anomaly Detection
- `GET /anomaly-detection?startDate=...&endDate=...&isPpApplied=false`
- `GET /anomaly-detection?alerted=true&startDate=...&endDate=...`
- `GET /anomaly-detection/rules`
- `GET /anomaly-detection/anomalies/stats`

### Recommendations
- `POST /recommendationsNew/list`
- `POST /recommendationsNew/list/total`
- `POST /recommendationsNew/heatmap/summary`
- `POST /recommendationsNew/heatmap/dynamicRanges`
- `POST /recommendationsNew/heatmap/dynamicFilter/cat_id`
- `GET /recommendationsNew/views`
- `GET /recommendationsNew/heatmap/groupByOptions`
- `POST /recommendationsNew/list/columns`

### Dashboard / Custom
- `GET /usage/custom-dashboard/dashboard/default`
- `GET /usage/custom-dashboard/dashboards`
- `GET /usage/custom-dashboard/panels`
- `GET /usage/custom-dashboard/dashboards-templates`
- `GET /usage/reports/all`

### User / Auth
- `GET /users/plain-sub-users`
- `POST /users/signin-with-token`
- `GET /users/user-settings/notifications`
- `GET /users/notifications`
- `GET /users/on-boarding/v2/byod/vendors`
- `GET /users/same-company-users`

### Budget
- `GET /budgets/v2/i/?only_metadata=true`

### Tag Governance
- `GET /tag-governance/coverage`
- `POST /tag-governance/resources`

### Alerts
- `GET /alerts/rules`

### Partner
- `GET /partner/billing-summary`

### Other
- `GET /divisions/i/?includeEmpty=true`
- `GET /channels`
- `GET /workflow/available-workflow-channels`
- `POST /client-metrics`

---

## KNOWN BUGS / ISSUES

1. **Pricing page returns 404** — Route exists in sidebar, component not implemented
2. **Waste Detector shows negative savings (-$6,133)** — Data calculation or display bug
3. **Recommendations inconsistency** — Dashboard shows 1,743 recommendations, but Waste Detector table shows none
4. **Budget creation disabled** — User lacks write permissions
5. **Google Analytics CSP blocks** — `rmkt`, `ccm`, `pagead` requests blocked by CSP (non-functional, cosmetic only)

---

## TEST COVERAGE SUMMARY

### Automated Tests (19 API + 10 UI)

**API Tests:**
- `auth.spec.ts` — JWT auth, signin, negative tests, protected endpoints (4 tests)
- `cost-usage.spec.ts` — Services, costs, CAUI, anomaly stats, budgets, commitments, recommendations, K8s, panels (11 tests)
- `commitment-anomaly.spec.ts` — Commitment Dashboard, anomaly list, alert rules, recommendations list, tag governance, cost alert rules, billing summary (8 tests)

**UI Tests:**
- `login.spec.ts` — Login form, valid login, empty credentials, forgot password (4 tests)
- `cost-usage.spec.ts` — Navigation, cost data display, service search (3 tests)
- `console-errors.spec.ts` — No console errors during login/dashboard/CAUI (2 tests)
- `advanced-features.spec.ts` — Budget disabled state (1 test)
- `data-export.spec.ts` — CSV vs UI table comparison for Commitment Dashboard (2 tests)

### Manual / Non-automatable Features
- Budget CRUD (write blocked)
- Commitment contract modifications
- Anomaly alert rule configuration
- Cost Allocation write operations (Business Mapping, Tag Groups)
- Recommendations apply/approve workflows
- CostGPT conversational AI (non-deterministic)
- Pricing page (404)
- File export/download
- Alerts write operations
