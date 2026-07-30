# Umbrella FinOps — Mobile App Development Specification

> Generated: 2026-07-29 | Based on live exploration of dev.umbrellacost.dev

---

## 1. Authentication Flow

### Overview

Auth is a 5-step process using a combination of API key (`apikey` header), JWT (`authorization` header), and session cookies. All API calls flow through `https://api.dev.umbrellacost.dev/api/v1`.

### Step-by-Step

#### Step 1: Realm Check
```
GET /api/v1/user-management/users/user-realm?username={email}
Headers: Content-Type: application/json, apikey: -1:-1:-1
```
Determines which authentication realm the user belongs to. Returns realm configuration.

#### Step 2: SSO (Fire-and-Forget)
```
POST /api/v1/users/sso
Headers: Content-Type: application/json, apikey: -1:-1:-1
Body: { "username": "user@example.com" }
```
Initiates SSO flow if applicable. The response is not consumed — this is fire-and-forget.

#### Step 3: Sign In
```
POST /api/v1/users/signin
Headers: Content-Type: application/json, apikey: -1:-1:-1
Body: { "username": "user@example.com", "password": "secret" }
Response: {
  "jwtToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "username": "sub_claim_value"
}
```
Returns the JWT token pair. The `username` field in the response contains the JWT `sub` claim (the user key), NOT the email.

#### Step 4: Session Cookie Establishment
```
POST /api/v1/users/signin-with-token
Headers:
  Content-Type: application/json
  authorization: {jwtToken}           (raw, no "Bearer " prefix)
  apikey: -1:-1:-1
  commonparams: {"isPpApplied":false}
Body: { "selectedRole": null }
Response: sets a Set-Cookie header with the JSESSIONID / session cookie
```
This call establishes a server-side session. The `Set-Cookie` header from either this response or the signin response must be captured and included in subsequent requests.

#### Step 5: User Profile & API Key Resolution
```
GET /api/v1/users/plain-sub-users
Headers:
  Content-Type: application/json
  authorization: {jwtToken}           (raw, no "Bearer " prefix)
  apikey: -1:-1:-1
  commonparams: {"isPpApplied":false}
  frontend-request: true
Response: {
  "user_key": "abc123...",
  "accounts": [{ "accountKey": 111111177, "accountTypeId": 0 }],
  "root_user": true,
  "is_parent": true,
  "sub_users": [...],
  ...user profile fields
}
```
Extract `user_key`, `accountKey` (from first account), and `accountTypeId` to construct the authenticated API key.

### Header Specification

| Header | Value | When |
|--------|-------|------|
| `Content-Type` | `application/json` | All requests |
| `apikey` | `-1:-1:-1` (anonymous) | Auth steps 1-4 |
| `apikey` | `{userKey}:{accountKey}:{accountTypeId}` | All authenticated requests |
| `authorization` | `{jwtToken}` (raw, no prefix) | All authenticated requests |
| `commonparams` | `{"isPpApplied":false}` | All authenticated requests |
| `frontend-request` | `true` | All authenticated requests |
| `Cookie` | session cookie from signin-with-token | All authenticated requests |

### Anonymous API Key
```
ANONYMOUS_APIKEY = "-1:-1:-1"
```
Used only during the auth bootstrap sequence.

### Constructing the Authenticated API Key
```
authenticated_apikey = "{userKey}:{accountKey}:{accountTypeId}"
```
Example: `"abc123def:111111177:0"`

### Mobile Token Storage Strategy

Use platform-specific secure storage:

- **iOS**: Keychain Services (`SecItemAdd`/`SecItemCopyMatching`)
  - Store JWT token, refresh token, user key, account key, account type ID, and user email separately
  - Use `kSecAttrAccessible = kSecAttrAccessibleWhenUnlockedThisDeviceOnly`

- **Android**: EncryptedSharedPreferences or Android Keystore
  - Use `EncryptedSharedPreferences` with `AES256_SIV` key scheme
  - Alternative: Android Keystore for RSA-encrypted credential blob

- **Never** store tokens in AsyncStorage, plain SharedPreferences, or UserDefaults.

### Token Refresh Strategy

1. Store `jwtToken` and `refreshToken` from Step 3
2. When receiving a 401, attempt token refresh:
   ```
   POST /api/v1/users/refresh-token
   Headers: apikey (authenticated), authorization (current JWT)
   Body: { "refreshToken": "{stored refresh token}" }
   ```
3. On successful refresh, store new `jwtToken` and `refreshToken`
4. On refresh failure (e.g., 401), clear stored tokens and redirect to login
5. Implement automatic refresh 5 minutes before JWT expiry (decode `exp` from JWT payload)

### Cookie-Based Session Handling

- The session cookie (`JSESSIONID` or similar) from Step 4 must be included as a `Cookie` header on all authenticated requests
- Mobile HTTP clients (like OkHttp on Android, URLSession on iOS) should be configured with a cookie jar that persists cookies across requests
- On app restart, re-run Step 4 with the stored JWT to obtain a fresh session cookie

---

## 2. Complete API Catalog

### Authentication Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/v1/user-management/users/user-realm?username={email}` | Anonymous | Check realm |
| `POST` | `/api/v1/users/sso` | Anonymous | Initiate SSO (fire-and-forget) |
| `POST` | `/api/v1/users/signin` | Anonymous | User sign-in → JWT tokens |
| `POST` | `/api/v1/users/signin-with-token` | JWT + Anonymous | Establish session cookie |
| `GET` | `/api/v1/users/plain-sub-users` | JWT + Anonymous | Get user profile & sub-users |

---

### 2.1 Dashboard Domain

#### `GET /api/v1/users/plain-sub-users`
Called on every page load to get the current user's profile, accounts, and sub-users.

**Response shape:**
```json
{
  "user_key": "abc123def",
  "user_name": "John Doe",
  "email": "john@example.com",
  "user_type": "admin",
  "root_user": true,
  "is_parent": true,
  "accounts": [
    { "accountKey": 111111177, "accountTypeId": 0 }
  ],
  "sub_users": [
    { "user_key": "...", "user_name": "...", "email": "..." }
  ]
}
```

#### `GET /api/v1/users/user-settings/notifications`
Returns user notification preferences and unread counts.

**Response shape:**
```json
{
  "unreadCount": 3,
  "notifications": [...]
}
```

#### `GET /api/v1/usage/custom-dashboard/dashboard/default`
Returns the default dashboard configuration with panels, widgets, and layout.

**Response shape:**
```json
{
  "dashboardId": "default",
  "name": "Default Dashboard",
  "panels": [
    {
      "panelId": "mtd-cost",
      "type": "kpi-card",
      "title": "MTD cost",
      "widgets": [
        {
          "type": "kpi",
          "metric": "totalCost",
          "label": "MTD cost",
          "currency": "USD"
        }
      ]
    }
  ],
  "layout": [...]
}
```

#### `GET /api/v1/usage/custom-dashboard/dashboards`
Returns all user-created dashboards.

**Response shape:**
```json
[
  {
    "id": "dashboard-1",
    "name": "My Dashboard",
    "isDefault": false,
    "panels": [...]
  }
]
```

#### `GET /api/v1/usage/custom-dashboard/dashboards-templates`
Returns available dashboard templates.

**Response shape:**
```json
[
  {
    "id": "template-ec2",
    "name": "EC2 Cost Dashboard",
    "category": "Compute",
    "panels": [...]
  }
]
```

#### `GET /api/v1/usage/custom-dashboard/dashboard-settings`
Returns dashboard-level settings.

**Request example:** `GET /api/v1/usage/custom-dashboard/dashboard-settings`
**Response shape:**
```json
{
  "currency": "USD",
  "timezone": "UTC",
  "dateRange": { "start": "2026-07-01", "end": "2026-07-31" }
}
```

#### `GET /api/v1/usage/custom-dashboard/dashboard-labels`
Returns dashboard label definitions for categorization.

**Response shape:**
```json
[
  { "labelId": "prod", "name": "Production", "color": "#FF0000" }
]
```

#### `GET /api/v1/usage/custom-dashboard/panels`
Returns all available panels/widgets that can be added to dashboards.

**Response shape:**
```json
[
  {
    "panelId": "cost-trend",
    "name": "Cost Trend",
    "type": "chart",
    "chartType": "line",
    "metrics": ["totalCost", "previousCost"]
  }
]
```

#### `GET /api/v1/users/on-boarding/v2/byod/vendors`
Returns available cloud providers for Bring Your Own Data onboarding.

**Response shape:**
```json
[
  { "vendor": "aws", "name": "Amazon Web Services", "connected": true },
  { "vendor": "azure", "name": "Microsoft Azure", "connected": false }
]
```

#### `POST /api/v1/recommendationsNew/heatmap/summary`
Returns summary statistics for the recommendations heatmap.

**Request example:**
```http
POST /api/v1/recommendationsNew/heatmap/summary
Content-Type: application/json
Body: {}
```
**Response shape:**
```json
{
  "totalAnnualSavings": 125000.50,
  "totalRecommendations": 340,
  "categories": [
    { "id": "idle", "name": "Idle Resources", "count": 150, "savings": 45000 }
  ]
}
```

#### `POST /api/v1/recommendationsNew/list/total`
Returns total count of recommendations (used for pagination).

**Request example:**
```http
POST /api/v1/recommendationsNew/list/total
Content-Type: application/json
Body: {}
```
**Response (plain integer):**
```
340
```

#### `GET /api/v1/anomaly-detection/anomalies/stats`
Returns anomaly statistics for the dashboard overview.

**Response shape:**
```json
{
  "openAnomalies": 12,
  "impact": 45230.75,
  "historyData": [
    { "date": "2026-07-01", "count": 3, "impact": 1200 }
  ]
}
```

#### `POST /api/v1/recommendationsNew/heatmap/dynamicFilter/cat_id`
Returns recommendation categories for filtering.

**Request example:**
```http
POST /api/v1/recommendationsNew/heatmap/dynamicFilter/cat_id
Content-Type: application/json
Body: {}
```
**Response shape:**
```json
{
  "page": [
    { "id": "idle_resources", "name": "Idle Resources" },
    { "id": "right_sizing", "name": "Right Sizing" }
  ]
}
```

#### `GET /api/v1/invoices/service-names/distinct`
Returns all distinct cloud service names.

**Response shape:**
```json
[
  ["Amazon EC2", "EC2"],
  ["Amazon RDS", "RDS"],
  ["Amazon S3", "S3"]
]
```

#### `GET /api/v1/commitment/utilization/i/summary`
Returns commitment utilization summary for SP and RI types.

**Query params:**
| Param | Example | Required |
|-------|---------|----------|
| `date` | `2026-07-01` | Yes |
| `commitmentType` | `sp` or `ri` | Yes |
| `linkedAccount` | `` | No |
| `payerAccount` | `` | No |
| `commitmentServices` | `EC2InstanceSavingsPlans` | Yes (repeatable) |

**Request example for SP:**
```
GET /api/v1/commitment/utilization/i/summary?date=2026-07-01&commitmentType=sp&linkedAccount=&payerAccount=&commitmentServices=EC2InstanceSavingsPlans&commitmentServices=ComputeSavingsPlans
```
**Request example for RI:**
```
GET /api/v1/commitment/utilization/i/summary?date=2026-07-01&commitmentType=ri&linkedAccount=&payerAccount=&commitmentServices=ec2&commitmentServices=rds&commitmentServices=elasticache&commitmentServices=redshift&commitmentServices=os&commitmentServices=es
```
**Response shape:**
```json
{
  "totalUtilization": 87.5,
  "totalCommitment": 50000,
  "utilizedAmount": 43750,
  "wasteAmount": 6250
}
```

#### `POST /api/v1/client-metrics`
Client-side metrics/telemetry (fire-and-forget). Returns 204 No Content.

**Request example:**
```http
POST /api/v1/client-metrics
Content-Type: application/json
Body: { "page": "dashboard", "loadTime": 1200, "errors": [] }
```

---

### 2.2 Cost & Usage Explorer Domain

#### `POST /api/v1/invoices/caui`
The core cost & usage query endpoint. Returns cost records based on complex filter criteria.

**Request body:**
```json
{
  "startDate": "2026-07-01",
  "endDate": "2026-07-31",
  "dateBasis": "usagedate",
  "granLevel": "day",
  "costType": ["cost", "discount"],
  "chargeType": ["Usage"],
  "groupBy": "service",
  "groupBySecondary": "usagedate",
  "filters": {
    "service": ["Amazon EC2", "Amazon RDS"],
    "region": ["us-east-1"],
    "account": ["111111177"]
  },
  "excludedChargeTypes": ["Tax"],
  "pageNumber": 1,
  "pageSize": 15,
  "sort": { "property": "totalCost", "direction": "desc" }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `startDate` | string | Start date (YYYY-MM-DD) |
| `endDate` | string | End date (YYYY-MM-DD) |
| `dateBasis` | string | `usagedate` or `invoicedate` |
| `granLevel` | string | `day`, `week`, `month`, `quarter`, `year` |
| `costType` | string[] | `["cost"]`, `["cost","discount"]`, `["discount"]` |
| `chargeType` | string[] | Charge type filters |
| `groupBy` | string | Primary grouping dimension: `service`, `region`, `account`, `usagedate` |
| `groupBySecondary` | string | Secondary grouping |
| `filters` | object | Dimension filters (service, region, account, tags, etc.) |
| `excludedChargeTypes` | string[] | Charge types to exclude (e.g., `["Tax"]`) |
| `pageNumber` | number | Pagination page (1-based) |
| `pageSize` | number | Records per page (default: 15) |
| `sort` | object | Sort configuration |

**Query param equivalents (also supported via GET-style params on the POST body):**
- `periodType`: `"relativeDates"` or `"fixedDates"`
- `displayMetricTypes`: `"Cost"` or `"Usage"`
- `filterBarGroupBy`: `"service"`
- `fieldToFilterdValuesMap`: URL-encoded JSON of excluded filter values
- `excludedFiltersStatusMap`: toggle states for excluded filters

**Response shape:**
```json
[
  {
    "usage_date": "2026-07-15",
    "total_cost": 5422.09,
    "service": "Amazon EC2",
    "region": "us-east-1",
    "account_id": "111111177",
    "instance_type": "m5.xlarge",
    "usage_quantity": 720,
    "cost_per_unit": 7.53,
    "currency": "USD",
    "charge_type": "Usage",
    "cost_type": "cost"
  }
]
```

#### `GET /api/v1/invoices/service-names/distinct`
Returns distinct service names as `[[displayName, key], ...]`.

#### `GET /api/v1/invoices/cue-views`
Returns saved CUE (Cost & Usage Explorer) views.

**Response shape:**
```json
[
  {
    "viewId": "view-123",
    "name": "Monthly EC2 Costs",
    "filters": {...},
    "isDefault": false
  }
]
```

#### `GET /api/v1/usage/goals`
Returns cost optimization goals.

**Response shape:**
```json
[
  {
    "goalId": "goal-1",
    "name": "Reduce EC2 by 20%",
    "target": 5000,
    "current": 6200,
    "progress": 60
  }
]
```

#### `GET /api/v1/usage/virtual-tags/virtual-tags`
Returns virtual tag definitions used for cost allocation.

**Response shape:**
```json
[
  {
    "tagId": "env",
    "tagName": "Environment",
    "rules": [
      { "condition": "account contains prod", "value": "Production" }
    ]
  }
]
```

#### `GET /api/v1/invoices/dimensions-config`
Returns the complete dimensions/filters configuration.

**Response shape:**
```json
{
  "dimensions": {
    "service": { "label": "Service", "type": "multi-select" },
    "region": { "label": "Region", "type": "multi-select" },
    "account": { "label": "Account", "type": "multi-select" },
    "instancetype": { "label": "Instance Type", "type": "multi-select" },
    "tags": { "label": "Tags", "type": "tag-key-value" }
  }
}
```

#### `GET /api/v1/invoices/dimensions-config/dimensions/{dimension}/values`
Returns available values for a given dimension.

**Dimensions discovered:**
- `viewscustomtags`
- `subviewscustomtags`
- `workloadtype`

**Request example:**
```
GET /api/v1/invoices/dimensions-config/dimensions/viewscustomtags/values
```
**Response shape:**
```json
[
  { "value": "Environment:Production", "count": 500 },
  { "value": "Environment:Staging", "count": 120 }
]
```

#### `GET /api/v1/channels`
Returns available notification channels (email, Slack, etc.).

**Response shape:**
```json
[
  { "channelId": "email", "name": "Email", "enabled": true },
  { "channelId": "slack", "name": "Slack", "enabled": false }
]
```

#### `GET /api/v1/usage/reports/all`
Returns all user reports.

#### `GET /api/v1/usage/reports/all-org`
Returns all organization-wide reports.

#### `GET /api/v1/usage/business-mapping/viewpoints`
Returns business mapping viewpoints for cost allocation.

#### `GET /api/v1/divisions/i/?includeEmpty=true`
Returns division hierarchy. `includeEmpty` param controls whether empty divisions are shown.

#### `GET /api/v1/users/events`
Returns user audit events with date range filtering.

**Request example:**
```
GET /api/v1/users/events?startDate=2026-07-01&endDate=2026-07-31
```

#### `GET /api/v1/users/notifications`
Returns user in-app notifications.

#### `GET /api/v1/users/roles`
Returns available user roles.

#### `GET /api/v1/users/preferences`
Returns user-level preferences.

#### `GET /api/v1/users/same-company-users`
Returns users within the same company/tenant.

#### `GET /api/v1/usage/categories`
Returns cost categories.

#### `GET /api/v1/usage/views`
Returns saved views.

#### `GET /api/v1/invoices/service-costs/distinct-tags/governance`
Returns distinct tags for governance.

---

### 2.3 Recommendations Domain

#### `POST /api/v1/recommendationsNew/heatmap`
Main heatmap data endpoint.

**Request body:**
```json
{
  "filters": {
    "category": "idle_resources",
    "service": "Amazon EC2",
    "region": "us-east-1"
  },
  "groupBy": "service",
  "dateRange": { "start": "2026-06-01", "end": "2026-07-31" }
}
```

#### `POST /api/v1/recommendationsNew/heatmap/summary`
Summary statistics for the heatmap (see Dashboard domain above).

#### `POST /api/v1/recommendationsNew/heatmap/dynamicFilter/cat_id`
Returns available category filters.

#### `POST /api/v1/recommendationsNew/heatmap/dynamicFilter/service?invoiceMode=true`
Returns available service filters.

#### `POST /api/v1/recommendationsNew/heatmap/dynamicFilter/type_id?invoiceMode=true`
Returns available type filters.

#### `POST /api/v1/recommendationsNew/heatmap/dynamicRanges`
Returns dynamic cost/value ranges for filtering.

#### `GET /api/v1/recommendationsNew/heatmap/groupByOptions`
Returns available grouping dimensions.

**Response shape:**
```json
[
  { "value": "service", "label": "Service" },
  { "value": "region", "label": "Region" },
  { "value": "account", "label": "Account" }
]
```

#### `POST /api/v1/recommendationsNew/list`
Paginated recommendations list.

**Request body:**
```json
{
  "pageNumber": 1,
  "pageSize": 10,
  "sort": { "property": "annualSavings", "direction": "desc" },
  "filters": {
    "category": "idle_resources"
  }
}
```
**Response shape:**
```json
{
  "page": [
    {
      "id": "rec-001",
      "resourceId": "i-1234567890abcdef0",
      "resourceName": "dev-server-01",
      "category": "idle_resources",
      "type": "Stop Instance",
      "service": "Amazon EC2",
      "region": "us-east-1",
      "annualSavings": 8760.00,
      "monthlySavings": 730.00,
      "description": "Instance has <1% CPU utilization over 14 days",
      "status": "open",
      "createdDate": "2026-07-15"
    }
  ],
  "totalCount": 340
}
```

#### `POST /api/v1/recommendationsNew/list/columns`
Returns available column definitions for the list view.

**Response shape:**
```json
[
  { "field": "resourceId", "label": "Resource ID", "visible": true, "sortable": true },
  { "field": "resourceName", "label": "Resource Name", "visible": true, "sortable": true },
  { "field": "annualSavings", "label": "Annual Savings", "visible": true, "sortable": true }
]
```

#### `POST /api/v1/recommendationsNew/list/total`
Returns total count of recommendations matching current filters (plain integer response).

#### `GET /api/v1/recommendationsNew/views`
Returns saved recommendation views.

#### `GET /api/v1/recommendations/report`
Returns a recommendations report.

---

### 2.4 Anomaly Detection Domain

#### `GET /api/v1/anomaly-detection`
Main anomaly list endpoint. Supports complex query parameters.

**Query params:**

| Param | Values | Description |
|-------|--------|-------------|
| `startDate` | `2026-06-01` | Start date for anomaly search |
| `endDate` | `2026-07-29` | End date for anomaly search |
| `isPpApplied` | `true`/`false` | Whether purchase price is applied |
| `alerted` | `true` | Filter to only alerted anomalies |
| `isPageCount` | `true` | Return page count instead of data |
| `pageNumber` | `1` | Page number |
| `pageSize` | `50` | Items per page |

**Request examples:**
```
GET /api/v1/anomaly-detection?startDate=2026-06-01&endDate=2026-07-29&isPpApplied=false
GET /api/v1/anomaly-detection?alerted=true&startDate=2026-06-01&endDate=2026-07-29&isPpApplied=false
GET /api/v1/anomaly-detection?startDate=2026-06-01&endDate=2026-07-29&isPpApplied=false&isPageCount=true
```

**Response shape (full list):**
```json
[
  {
    "uuid": "anomaly-abc-123",
    "title": "EC2 Cost Spike",
    "startTime": "2026-07-15T10:00:00Z",
    "endTime": "2026-07-15T14:00:00Z",
    "accountId": "111111177",
    "service": "Amazon EC2",
    "region": "us-east-1",
    "severity": "high",
    "actualCost": 12500.50,
    "expectedCost": 5000.00,
    "anomalyScore": 0.95,
    "alerted": true,
    "anomalyTriggeredItems": [
      { "type": "cost_spike", "threshold": 2.5, "actual": 2.5 }
    ],
    "status": "open"
  }
]
```

**Response shape (page count mode):**
```
25
```
Returns plain integer total page count.

#### `GET /api/v1/anomaly-detection/anomalies/stats`
Returns anomaly statistics (see Dashboard domain).

#### `GET /api/v1/anomaly-detection/rules`
Returns anomaly detection alert rules.

**Response shape:**
```json
[
  {
    "ruleId": "rule-001",
    "name": "Daily Cost Spike > 200%",
    "metric": "dailyCost",
    "threshold": 2.0,
    "enabled": true,
    "channels": ["email", "slack"],
    "scope": { "services": ["Amazon EC2"], "accounts": ["111111177"] }
  }
]
```

---

### 2.5 Commitments Domain

#### `GET /api/v1/commitment/dashboard`
Returns commitment dashboard data with KPI cards and charts.

**Query params:**

| Param | Example | Description |
|-------|---------|-------------|
| `periodGranLevel` | `month` | Time granularity |
| `startDate` | `2026-02-01` | Start date |
| `endDate` | `2026-07-31` | End date |
| `filters[service]` | `ec2` | Service filter |

**Request example:**
```
GET /api/v1/commitment/dashboard?periodGranLevel=month&startDate=2026-02-01&endDate=2026-07-31&filters[service]=ec2
```

**Response shape:**
```json
{
  "totalCommitments": 750000,
  "activeCommitments": 500000,
  "expiredCommitments": 250000,
  "utilizationRate": 87.5,
  "monthlyRecurring": 62500,
  "savingsYTD": 125000,
  "chartData": [
    { "month": "2026-02", "commitment": 750000, "utilization": 87 },
    { "month": "2026-03", "commitment": 745000, "utilization": 89 }
  ]
}
```

#### `GET /api/v1/commitment/utilization/i/summary`
Utilization summary for SP and RI (see Dashboard domain for params and response).

#### `GET /api/v1/commitment/utilization/totalsavings`
Total savings from commitments.

**Request example:**
```
GET /api/v1/commitment/utilization/totalsavings?commitmentType=sp&dates=2026-01-01&dates=2026-02-01&dates=2026-03-01
```

#### `GET /api/v2/commitment/riUtilizationDetails`
RI utilization details (v2 endpoint).

**Request example:**
```
GET /api/v2/commitment/riUtilizationDetails?start=2025-07-29&end=2026-07-29
```

---

### 2.6 Budgets Domain

#### `GET /api/v1/budgets/v2/i/`
Returns budget list.

**Query params:**

| Param | Example | Description |
|-------|---------|-------------|
| `only_metadata` | `true` | Return metadata only (no calculations) |

**Request example:**
```
GET /api/v1/budgets/v2/i/?only_metadata=true
```

**Response shape:**
```json
[
  {
    "budgetId": "budget-001",
    "budgetName": "Monthly AWS Budget",
    "budgetAmount": 100000,
    "budgetType": "monthly",
    "costType": "cost",
    "currentSpend": 75000,
    "forecastedSpend": 105000,
    "percentUtilized": 75,
    "alertThresholds": [80, 90, 100],
    "status": "ok",
    "accounts": ["111111177"],
    "services": ["Amazon EC2", "Amazon RDS"]
  }
]
```

#### `GET /api/v1/usage/alerts`
Returns usage alerts.

**Response shape:**
```json
[
  {
    "alertId": "alert-001",
    "alertName": "Budget > 80%",
    "alertType": "budget",
    "severity": "warning",
    "message": "EC2 budget at 82% with 10 days remaining",
    "createdAt": "2026-07-20T08:00:00Z",
    "isRead": false
  }
]
```

---

### 2.7 Partner Domain

#### `GET /api/v1/msp/billing-rules/v2`
Returns MSP billing rules.

#### `GET /api/v1/msp/billing-rules/v2/templates`
Returns billing rule templates.

#### `GET /api/v1/divisions/customers/aws/costs/`
Returns customer cost data.

**Request example:**
```
GET /api/v1/divisions/customers/aws/costs/?startDate=2026-06-01&endDate=2026-06-30
```

#### `GET /api/v1/divisions/customers/aws/credit`
Returns customer credit balances.

#### `GET /api/v1/divisions/customers/credit/alerts`
Returns customer credit alerts.

---

### 2.8 Platform Domain

#### `GET /api/v1/users/preferences`
User-level preferences.

#### `GET /api/v1/users/roles`
Available user roles.

#### `GET /api/v1/users/same-company-users`
Users within the same company/tenant.

#### `GET /api/v1/users/events`
User audit events with date filter.

#### `GET /api/v1/usage/views`
Saved views.

#### `GET /api/v1/usage/virtual-tags/virtual-tags`
Virtual tag definitions.

#### `GET /api/v1/usage/categories`
Cost categories.

#### `GET /api/v1/invoices/dimensions-config`
Dimensions configuration.

#### `GET /api/v1/invoices/dimensions-config/dimensions/{dimension}/values`
Dimension value lists for `viewscustomtags`, `subviewscustomtags`, `workloadtype`.

#### `GET /api/v1/invoices/service-costs/distinct-tags/governance`
Governance tag values.

---

### 2.9 AIOps / CostGPT Domain

#### `GET /api/v1/gpt/user-data`
Returns user data context for CostGPT.

#### `GET /api/v1/gpt/available-data`
Returns available data sources for CostGPT.

**Response shape:**
```json
{
  "accounts": ["111111177"],
  "dateRange": { "earliest": "2025-01-01", "latest": "2026-07-29" },
  "services": ["Amazon EC2", "Amazon RDS", "Amazon S3"],
  "supportedMetrics": ["cost", "usage", "savings"]
}
```

---

### 2.10 Workflow Domain

#### `GET /api/v1/workflow/available-workflow-channels`
Returns workflow/automation channels.

#### `GET /api/v1/channels`
Returns notification/integration channels.

---

### Pagination Patterns

The API uses two pagination patterns:

**Pattern A: Page-based (recommendations, anomalies, budgets)**
```
POST body: { "pageNumber": 1, "pageSize": 15 }
GET params: ?pageNumber=1&pageSize=15
```

**Pattern B: Count-first (caui, anomaly detection)**
```
GET ?isPageCount=true           → returns total page count
GET without isPageCount         → returns data page
```

---

### Filtering Patterns

**Date Ranges:**
```
?startDate=2026-07-01&endDate=2026-07-31
```

**Service Filters:**
```
?filters[service]=ec2
?commitmentServices=EC2InstanceSavingsPlans&commitmentServices=ComputeSavingsPlans (multiple)
```

**Boolean Toggles:**
```
?isPpApplied=false
?alerted=true
?only_metadata=true
```

**Include Empty:**
```
?includeEmpty=true
```

**Granularity:**
```
?periodGranLevel=month    // day, week, month, quarter, year
?granLevel=day
```

---

## 3. Screen Hierarchy & Navigation

### Bottom Tab Bar Navigation (Mobile Adaptation)

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│   Home   │ │  Explore │ │  Savings  │ │  Monitor │ │   More   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

### Screen Tree

```
Tab 1: Home (Dashboard)
  ├── Dashboard Overview (KPI cards, charts, recent anomalies)
  ├── Anomaly Detail Screen (tap on anomaly card)
  └── Recommendation Detail Screen

Tab 2: Explore (Cost & Usage)
  ├── Cost & Usage Explorer
  │   ├── Filter Bottom Sheet (cost type, date range, services, regions)
  │   ├── Chart View (daily/monthly bar chart)
  │   └── Table View (sortable cost records)
  ├── Reports List
  ├── Dashboards
  │   ├── Dashboard Detail (rendered panels/widgets)
  │   └── Templates Browser
  ├── Panels
  ├── Assets
  ├── Resource Explorer
  └── K8s Preferences

Tab 3: Savings
  ├── Waste Detector (Recommendations Explorer)
  │   ├── Heatmap View
  │   ├── Recommendations List
  │   ├── Filter Bottom Sheet
  │   └── Recommendation Detail
  ├── Reports
  ├── Preferences
  ├── Commitment Dashboard
  │   ├── SP Utilization Detail
  │   └── RI Utilization Detail
  ├── My Commitments (v2 details)
  ├── Unit Economics
  └── Pricing

Tab 4: Monitor
  ├── Anomaly Detection
  │   ├── Anomaly List
  │   ├── Anomaly Detail
  │   ├── Anomaly Stats
  │   └── Rules Configuration
  ├── Budget
  │   ├── Budget List
  │   └── Budget Detail (spend vs budget gauge)
  └── Alerts List

Tab 5: More
  ├── Cost Allocation
  │   ├── Business Mapping
  │   ├── Tag Governance
  │   ├── Tag Groups
  │   ├── Enrichment Tags
  │   ├── Filter Group
  │   └── Views
  ├── Partner
  │   ├── Billing Rules
  │   ├── Billing Status
  │   ├── Billing Summary
  │   ├── Billing History
  │   ├── Credits
  │   ├── Manage Customers
  │   ├── Preferences
  │   └── Reports
  ├── AIOps
  │   ├── Insights
  │   ├── Executive View
  │   ├── AI CUE
  │   ├── Users & Teams
  │   ├── Model Summary
  │   ├── Models Lifecycle
  │   ├── AI Integrations
  │   ├── Anomalies
  │   └── Alerts
  ├── CostGPT
  ├── Settings
  │   ├── Account (user profile)
  │   ├── Preferences
  │   ├── Notifications
  │   └── Logout
  └── Search (global)
```

### Key Navigation Principles for Mobile

1. **Sidebar → Bottom Tab Bar**: The desktop sidebar categories map to 5 tabs
2. **Sub-items → Stack Navigation**: Each tab's sub-pages use stack-based drill-down
3. **Filter Panel → Bottom Sheet**: Desktop side-panel filters become modal bottom sheets
4. **Breadcrumbs → Back Button**: Use iOS/Android native back navigation
5. **Deep Linking**: Support URL schemes like `umbrella://dashboard`, `umbrella://anomaly/{id}`

---

## 4. Key UI Components (Mobile Adaptation)

### 4.1 KPI Cards
- Horizontal scrollable card row (like App Store "Featured" cards)
- Each card: metric label, large value, sparkline, percentage change indicator
- Colors: green (cost decrease), red (cost increase), amber (warning)

**Key KPIs from dashboard:**
| KPI | API Source |
|-----|-----------|
| MTD Cost | `custom-dashboard/dashboard/default` |
| Previous MTD Cost | Calculated from CAUI with prior month |
| Forecasted Cost | `custom-dashboard/dashboard/default` |
| Total Savings | Sum of `recommendationsNew/list/total` |
| Open Anomalies | `anomaly-detection/anomalies/stats` |
| Commitment Utilization | `commitment/utilization/i/summary` |

### 4.2 Tables
- **Columns**: Horizontal scroll for columns beyond viewport
- **Sorting**: Tap column header → sort asc/desc
- **Pagination**: Infinite scroll with "Load more" or pull-to-refresh
- **Row tap**: Navigate to detail screen
- **Export**: Share sheet with CSV option

### 4.3 Charts
- **Line Chart**: Daily/monthly cost trends → use native chart library (Charts for iOS, MPAndroidChart for Android, or Victory Native for React Native)
- **Bar Chart**: Top 10 by service, cost by region → vertical or horizontal bars
- **Pie/Donut**: Cost distribution by service/region
- **Heatmap**: Recommendations heatmap → grid-based visualization
- **Gauge**: Budget utilization → semi-circular gauge

### 4.4 Filters
- **Bottom Sheet**: Pull-up panel for all filters
- **Date Range Picker**: Native date pickers with preset ranges (Last 7d, 30d, MTD, YTD, Custom)
- **Granularity Picker**: Day / Week / Month / Quarter / Year segmented control
- **Cost Type Toggle**: Cost / Discount chips/pills
- **Exclude Tax Toggle**: Switch component
- **Service Multi-Select**: Searchable chip list with checkboxes
- **Apply/Reset Buttons**: Sticky footer in filter bottom sheet

### 4.5 Search
- Global search bar accessible from More tab or pull-down gesture
- Search across: services, anomalies, recommendations, budgets
- Recent searches persisted locally

### 4.6 Export/Share
- Native share sheet integration (iOS: UIActivityViewController, Android: ShareSheet Intent)
- CSV export from tables and charts
- Share anomaly alerts and budget reports

### 4.7 Notifications
- Push notifications for: anomaly alerts, budget threshold breaches, recommendation updates
- In-app notification center from `GET /api/v1/users/notifications`
- Badge count on Monitor tab for unread alerts

### 4.8 Anomaly Cards
- List of anomalies with severity color coding (high=red, medium=amber, low=yellow)
- Each card: service, region, actual vs expected cost delta, time range, severity badge
- Swipe to dismiss or mark as reviewed

### 4.9 Budget Tracking
- Budget list with progress bars showing % utilized
- Color transitions: green (<80%), amber (80-99%), red (>=100%)
- Tap to see detailed spend breakdown

---

## 5. Data Models

All models use TypeScript-like interfaces for clarity.

### 5.1 Auth & User

```typescript
interface AuthTokens {
  jwtToken: string;
  refreshToken: string;
  username: string;       // JWT "sub" claim, used as user_key in apikey
}

interface User {
  user_key: string;
  user_name: string;
  email: string;
  user_type: 'admin' | 'member' | 'viewer';
  root_user: boolean;
  is_parent: boolean;
}

interface Account {
  accountKey: number;     // e.g., 111111177
  accountTypeId: number;  // e.g., 0
}

interface PlainSubUserResponse {
  user_key?: string;
  accounts?: Account[];
  root_user?: boolean;
  is_parent?: boolean;
  user_name?: string;
  email?: string;
  user_type?: string;
  sub_users?: User[];
}

interface ApikeyConfig {
  userKey: string;
  accountKey: number;
  accountTypeId: number;
}
// Format: "{userKey}:{accountKey}:{accountTypeId}"
```

### 5.2 Cost Records

```typescript
interface CostRecord {
  usage_date: string;           // "2026-07-15"
  total_cost: number;           // 5422.09
  service: string;              // "Amazon EC2"
  region: string;               // "us-east-1"
  account_id: string;           // "111111177"
  instance_type?: string;       // "m5.xlarge"
  usage_quantity?: number;      // 720
  cost_per_unit?: number;       // 7.53
  currency: string;             // "USD"
  charge_type: string;          // "Usage", "Tax", "Discount"
  cost_type: string;            // "cost", "discount"
  tags?: Record<string, string>;
}

interface CauiRequestBody {
  startDate: string;
  endDate: string;
  dateBasis: 'usagedate' | 'invoicedate';
  granLevel: 'day' | 'week' | 'month' | 'quarter' | 'year';
  costType: string[];
  chargeType?: string[];
  excludedChargeTypes?: string[];
  groupBy: string;
  groupBySecondary?: string;
  filters?: Record<string, string[]>;
  pageNumber: number;
  pageSize: number;
  sort?: { property: string; direction: 'asc' | 'desc' };
}
```

### 5.3 Anomalies

```typescript
interface AnomalyTriggeredItem {
  type: string;
  threshold: number;
  actual: number;
}

interface Anomaly {
  uuid: string;
  title: string;
  startTime: string;             // ISO 8601
  endTime: string;               // ISO 8601
  accountId: string;
  service: string;
  region: string;
  severity: 'low' | 'medium' | 'high';
  actualCost: number;
  expectedCost: number;
  anomalyScore: number;          // 0.0 to 1.0
  alerted: boolean;
  anomalyTriggeredItems: AnomalyTriggeredItem[];
  status: 'open' | 'acknowledged' | 'resolved';
}

interface AnomalyStats {
  openAnomalies: number;
  impact: number;
  historyData: Array<{
    date: string;
    count: number;
    impact: number;
  }>;
}

interface AnomalyAlertRule {
  ruleId: string;
  name: string;
  metric: string;
  threshold: number;
  enabled: boolean;
  channels: string[];
  scope?: {
    services?: string[];
    accounts?: string[];
    regions?: string[];
  };
}

interface AnomalyQueryParams {
  startDate: string;
  endDate: string;
  isPpApplied: boolean;
  alerted?: boolean;
  pageNumber?: number;
  pageSize?: number;
  isPageCount?: boolean;
}
```

### 5.4 Budgets

```typescript
interface Budget {
  budgetId: string;
  budgetName: string;
  budgetAmount: number;
  budgetType: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  costType: string;
  currentSpend: number;
  forecastedSpend: number;
  percentUtilized: number;       // 0-100+
  alertThresholds: number[];     // [80, 90, 100] — percentage thresholds
  status: 'ok' | 'warning' | 'exceeded';
  accounts: string[];
  services: string[];
  startDate?: string;
  endDate?: string;
}
```

### 5.5 Recommendations

```typescript
interface Recommendation {
  id: string;
  resourceId: string;
  resourceName: string;
  category: string;              // "idle_resources", "right_sizing", etc.
  type: string;                  // "Stop Instance", "Resize", etc.
  service: string;
  region: string;
  annualSavings: number;
  monthlySavings: number;
  description: string;
  status: 'open' | 'implemented' | 'dismissed';
  createdDate: string;
  effort?: 'low' | 'medium' | 'high';
  riskLevel?: 'low' | 'medium' | 'high';
}

interface RecommendationsListRequest {
  pageNumber: number;
  pageSize: number;
  sort?: { property: string; direction: 'asc' | 'desc' };
  filters?: {
    category?: string;
    service?: string;
    region?: string;
    status?: string;
  };
}

interface RecommendationHeatmapSummary {
  totalAnnualSavings: number;
  totalRecommendations: number;
  categories: Array<{
    id: string;
    name: string;
    count: number;
    savings: number;
  }>;
}
```

### 5.6 Commitments

```typescript
interface CommitmentDashboard {
  totalCommitments: number;
  activeCommitments: number;
  expiredCommitments: number;
  utilizationRate: number;
  monthlyRecurring: number;
  savingsYTD: number;
  chartData: Array<{
    month: string;
    commitment: number;
    utilization: number;
  }>;
}

interface CommitmentUtilizationSummary {
  totalUtilization: number;      // percentage
  totalCommitment: number;
  utilizedAmount: number;
  wasteAmount: number;
}

interface CommitmentDashboardParams {
  periodGranLevel: string;
  startDate: string;
  endDate: string;
  'filters[service]'?: string;
}

interface CommitmentSummaryParams {
  date: string;
  commitmentType: 'sp' | 'ri';
  linkedAccount: string;
  payerAccount: string;
  commitmentServices: string;    // or string[]
}
```

### 5.7 Dashboard

```typescript
interface DashboardWidget {
  type: 'kpi-card' | 'chart' | 'table' | 'text';
  metric: string;
  label: string;
  currency?: string;
  chartType?: 'line' | 'bar' | 'pie' | 'area';
  dimensions?: string[];
}

interface DashboardPanel {
  panelId: string;
  type: string;
  title: string;
  widgets: DashboardWidget[];
  position?: { x: number; y: number; w: number; h: number };
}

interface Dashboard {
  dashboardId: string;
  name: string;
  isDefault: boolean;
  panels: DashboardPanel[];
  layout: Array<{ panelId: string; x: number; y: number; w: number; h: number }>;
  settings?: {
    currency: string;
    timezone: string;
    dateRange: { start: string; end: string };
  };
}

interface DashboardTemplate {
  id: string;
  name: string;
  category: string;
  panels: DashboardPanel[];
}
```

### 5.8 Platform / Misc

```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'warning' | 'success';
  read: boolean;
  createdAt: string;
  link?: string;           // deeplink path
}

interface Channel {
  channelId: string;
  name: string;
  type: 'email' | 'slack' | 'webhook' | 'teams';
  enabled: boolean;
}

interface Division {
  id: string;
  name: string;
  parentId?: string;
  includeEmpty?: boolean;
}

interface View {
  id: string;
  name: string;
  type: string;
  filters: Record<string, unknown>;
  isDefault: boolean;
}

interface VirtualTag {
  tagId: string;
  tagName: string;
  rules: Array<{
    condition: string;
    value: string;
  }>;
}

interface CostCategory {
  id: string;
  name: string;
  description?: string;
}

interface Goal {
  goalId: string;
  name: string;
  target: number;
  current: number;
  progress: number;
  metric: string;
  deadline?: string;
}

interface CueView {
  viewId: string;
  name: string;
  filters: Record<string, unknown>;
  isDefault: boolean;
}
```

---

## 6. Mobile E2E Test Strategy

### 6.1 Framework Recommendation

**Primary: Playwright with Mobile Viewports**
- Use existing Playwright setup from `D:\umbrella-demo-qa\playwright.config.ts`
- Add mobile viewport projects to existing config
- Leverages the existing auth bootstrap, API clients, and page objects

**Alternative for Native Apps:**
- **React Native**: Detox or Maestro for E2E
- **Flutter**: Flutter integration_test + patrol
- **Native iOS/Android**: Appium + WebDriverAgent/Espresso

### 6.2 Viewport Sizes to Test

Add to `playwright.config.ts` the following mobile projects:

```typescript
{
  name: 'mobile-ios',
  use: {
    ...devices['iPhone 15 Pro Max'],
    storageState: 'storageState.json',
  },
},
{
  name: 'mobile-ios-small',
  use: {
    ...devices['iPhone SE'],
    storageState: 'storageState.json',
  },
},
{
  name: 'mobile-android',
  use: {
    ...devices['Pixel 7'],
    storageState: 'storageState.json',
  },
},
{
  name: 'mobile-android-small',
  use: {
    ...devices['Pixel 5'],
    storageState: 'storageState.json',
  },
},
```

Target response design:
- **Narrow**: 375px (iPhone SE) → single column, stacked cards
- **Medium**: 393px (iPhone 15 Pro) → optimized single column
- **Wide**: 412px (Pixel 7) → slightly wider single column

### 6.3 Auth State Management for Mobile Tests

Use the existing `global-setup.ts` pattern with mobile-adapted state:

```typescript
// In mobile setup:
const context = await browser.newContext({
  ...devices['iPhone 15 Pro Max'],
  baseURL: process.env.BASE_URL,
});

const page = await context.newPage();
await page.goto('/log_in');

// Inject auth tokens (same pattern as global-setup.ts)
await page.evaluate(({ jwt, refresh, userKey, email }) => {
  localStorage.setItem('authToken', jwt);
  localStorage.setItem('refreshToken', refresh);
  // ... same as global-setup.ts
}, tokens);

// Save mobile-specific storage state
await context.storageState({ path: 'storageState-mobile.json' });
```

For native mobile apps, adapt the auth bootstrap flow:
1. Store tokens in Keychain/Keystore (see Section 1)
2. On app launch, check for stored tokens
3. If valid, use Step 4 (signin-with-token) to get session cookie
4. If expired/invalid, redirect to login screen

### 6.4 Key User Journeys to Automate

| Journey | Priority | Steps |
|---------|----------|-------|
| **Auth Flow** | P0 | Login → Dashboard loads → Logout |
| **Dashboard Overview** | P0 | Load dashboard → Verify KPI cards visible → Tap anomaly card → Verify detail |
| **Cost Explorer** | P0 | Navigate to Explore → Apply date filter → Verify chart renders → Search service → Verify table |
| **Anomaly Review** | P0 | Navigate to Monitor → View anomaly list → Filter by severity → Open detail → Dismiss |
| **Budget Tracking** | P1 | Navigate to Budgets → View budget list → Tap budget → Verify progress gauge |
| **Recommendations** | P1 | Navigate to Waste Detector → View heatmap → Filter by category → Open recommendation |
| **Commitment View** | P1 | Navigate to Commitment Dashboard → View SP/RI summaries |
| **CostGPT Chat** | P2 | Navigate to CostGPT → Send query → Verify response |
| **Settings** | P2 | Open Preferences → Change setting → Verify persistence |
| **Offline/Graceful Degradation** | P1 | Airplane mode → Verify cached data shown → Verify error states |
| **Deep Linking** | P2 | Open `umbrella://anomaly/{id}` → Verify correct screen loads |

### 6.5 Network Interception Patterns for Mobile

Use Playwright's `page.route()` to simulate mobile network conditions:

```typescript
// Slow 3G simulation for mobile
await page.route('**/api/v1/**', async (route) => {
  await new Promise(resolve => setTimeout(resolve, 400)); // 400ms latency
  await route.continue();
});

// Offline mode simulation
await context.setOffline(true);

// Intercept specific responses for testing edge cases
await page.route('**/api/v1/anomaly-detection**', async (route) => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify([]) // empty anomaly list
  });
});

// Mock large datasets
await page.route('**/api/v1/invoices/caui', async (route) => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify(generateMockCostRecords(1000))
  });
});
```

### 6.6 Visual Regression Testing

Use Playwright's built-in screenshot comparison:

```typescript
test('dashboard renders correctly on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 }); // iPhone 15 Pro
  await page.goto('/dashboard');
  await page.waitForSelector('[data-testid="mtd-cost-card"]');
  await expect(page).toHaveScreenshot('dashboard-mobile.png', {
    maxDiffPixelRatio: 0.02,
  });
});
```

**Key visual regression scenarios:**
- Dashboard cards layout at all 4 viewport sizes
- Chart rendering (line, bar, pie)
- Table column truncation on narrow screens
- Filter bottom sheet open state
- Anomaly severity colors
- Budget gauge rendering
- Dark mode support (if implemented)

### 6.7 API Test Integration

Reuse existing API client tests (from `tests/api/`) as contract tests for the mobile app. Add mobile-specific API assertions:

```typescript
test('CAUI returns valid records for mobile consumption', async ({ request }) => {
  const response = await request.post('/api/v1/invoices/caui', {
    data: {
      startDate: '2026-07-01',
      endDate: '2026-07-31',
      dateBasis: 'usagedate',
      granLevel: 'day',
      costType: ['cost'],
      groupBy: 'service',
      pageSize: 15,
    }
  });
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  // Mobile requires pagination support
  expect(Array.isArray(data)).toBe(true);
  // Verify all required fields for KPI cards
  for (const record of data.slice(0, 5)) {
    expect(record).toHaveProperty('total_cost');
    expect(record).toHaveProperty('service');
    expect(record).toHaveProperty('usage_date');
  }
});
```

### 6.8 Performance Testing for Mobile

Key metrics to validate:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Dashboard Time-to-Interactive | < 3s on 4G | `performance.getEntriesByType('navigation')` |
| Chart Render Time | < 1s | Time from API response to chart visible |
| Filter Apply Response | < 2s | Time from filter change to data update |
| Scroll Performance | 60fps | Chrome DevTools FPS meter on mobile emulation |
| Memory Usage | < 100MB | `performance.memory` API |
| API Payload Size | < 50KB per page | Response `content-length` header |

### 6.9 Test Data Strategy

- Use `.env` variables for credentials (already configured: `USER_EMAIL`, `USER_PASSWORD`, `BASE_URL`, `API_URL`)
- Use the `dev.umbrellacost.dev` environment for E2E tests
- Tag tests for mobile: `@mobile` annotation
- Run mobile tests in CI with: `npx playwright test --project=mobile-*`

### 6.10 Recommended Test Structure

```
tests/
├── api/                          # Existing API contract tests
│   ├── auth/
│   ├── cost-usage/
│   └── finops/
├── ui/
│   ├── journeys/
│   │   ├── cost-usage.spec.ts    # Existing
│   │   ├── dashboard-mobile.spec.ts     # NEW: Mobile dashboard
│   │   ├── anomaly-mobile.spec.ts       # NEW: Mobile anomaly flow
│   │   ├── budget-mobile.spec.ts        # NEW: Mobile budget flow
│   │   └── recommendations-mobile.spec.ts # NEW: Mobile recs flow
│   ├── auth/
│   │   └── login.smoke.spec.ts   # Existing
│   ├── exports/
│   │   └── commitment-csv.spec.ts # Existing
│   └── visual/
│       ├── dashboard-screenshots.spec.ts # NEW
│       └── component-screenshots.spec.ts  # NEW
```

---

## Appendix: Environment Configuration

### Required Environment Variables

```env
BASE_URL=https://dev.umbrellacost.dev
API_URL=https://api.dev.umbrellacost.dev/api/v1
USER_EMAIL=test-user@example.com
USER_PASSWORD=test-password
```

### Mobile App Configuration (additional)

```typescript
const MobileConfig = {
  apiBaseUrl: 'https://api.dev.umbrellacost.dev/api/v1',
  webBaseUrl: 'https://dev.umbrellacost.dev',
  tokenRefreshInterval: 5 * 60 * 1000,  // 5 minutes before expiry
  requestTimeout: 30000,                  // 30 seconds
  maxRetries: 3,
  pageSize: 15,                           // Default items per page
  currency: 'USD',
  defaultGranularity: 'day',
  dateRangePresets: [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Month to Date', type: 'mtd' },
    { label: 'Year to Date', type: 'ytd' },
  ],
};
```

---

> **End of Specification** — This document covers all endpoints, data models, screen layouts, and test strategies needed to build a production-ready mobile app for the Umbrella FinOps platform.
