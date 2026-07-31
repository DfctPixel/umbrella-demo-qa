import { Schema, FieldSchema } from './validator';

// ═══════════════════════════════════════════════════════════════════════════════
// Auth schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /user-management/users/user-realm — user realm lookup response */
export const userRealmSchema: Schema = [
  { key: 'id', type: 'string' },
  { key: 'name', type: 'string' },
  { key: 'realm', type: 'string', required: false },
];

/** POST /users/signin — sign-in response body */
export const signinResponseSchema: Schema = [
  { key: 'jwtToken', type: 'string', nonEmpty: true },
  { key: 'refreshToken', type: 'string', nonEmpty: true },
  { key: 'username', type: 'string', nonEmpty: true },
];

/** GET /users/plain-sub-users — array item schema */
export const plainSubUserSchema: Schema = [
  { key: 'id', type: 'number', min: 1 },
  { key: 'user_key', type: 'string', nonEmpty: true },
  { key: 'user_name', type: 'string', nonEmpty: true },
  { key: 'user_type', type: 'string', nonEmpty: true },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Dashboard schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /usage/custom-dashboard/dashboard/default — default dashboard response */
export const dashboardSchema: Schema = [
  { key: 'version', type: 'number', min: 0 },
  { key: 'cloudTypeId', type: 'number', min: 0, required: false },
  {
    key: 'dimensions',
    type: 'array',
    items: [] as Schema,
  },
  { key: 'id', type: 'string', required: false },
  { key: 'name', type: 'string', required: false },
  { key: 'description', type: 'string', required: false },
  { key: 'panels', type: 'array', required: false, items: [] as Schema },
  { key: 'panelsLayout', type: 'string', required: false },
  { key: 'createdAt', type: 'string', required: false },
  { key: 'updatedAt', type: 'string', required: false },
];

/** GET /invoices/dimensions-config — dimensions configuration response */
export const dimensionsConfigSchema: Schema = [
  { key: 'version', type: 'string' },
  {
    key: 'dimensions',
    type: 'array',
    items: [] as Schema,
  },
];

/** Each item in dimensionsConfig.dimensions[] */
export const dimensionItemSchema: Schema = [
  { key: 'name', type: 'string', nonEmpty: true },
  { key: 'label', type: 'string', nonEmpty: true },
  { key: 'type', type: 'string', required: false },
  { key: 'values', type: 'array', required: false },
  { key: 'enabled', type: 'boolean', required: false },
  { key: 'required', type: 'boolean', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Anomaly schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /anomaly-detection/anomalies/stats — anomaly stats response */
export const anomalyStatsSchema: Schema = [
  { key: 'openAnomalies', type: 'number', min: 0 },
  { key: 'impact', type: 'number', min: 0 },
  {
    key: 'historyData',
    type: 'array',
    required: false,
    items: [
      { key: 'date', type: 'string', required: false },
      { key: 'count', type: 'number', min: 0, required: false },
      { key: 'value', type: 'number', min: 0, required: false },
    ],
  },
  { key: 'totalAnomalies', type: 'number', min: 0, required: false },
  { key: 'resolvedAnomalies', type: 'number', min: 0, required: false },
];

/**
 * GET /anomaly-detection — each item in anomalies[] list
 *
 * Confirmed contract (2026-07-31, live tenant): each anomaly is identified by
 * `uuid`; `id`/`anomalyId` do not exist in the response. The service and cost
 * fields are `serviceName` and `totalCostImpact`, not `service`/`costImpact`.
 */
export const anomalySchema: Schema = [
  { key: 'uuid', type: 'string', nonEmpty: true },
  { key: 'anomalyType', type: 'string', nonEmpty: true },
  { key: 'serviceName', type: 'string', nonEmpty: true },
  { key: 'totalCostImpact', type: 'number', min: 0 },
  { key: 'accountId', type: 'string', required: false },
  { key: 'linkedAccountId', type: 'string', required: false },
  { key: 'linkedAccountName', type: 'string', required: false },
  { key: 'cloudProvider', type: 'string', required: false },
  { key: 'regionTagName', type: 'string', required: false },
  { key: 'purchaseOption', type: 'string', required: false },
  { key: 'usageQuantityType', type: 'string', required: false },
  { key: 'direction', type: 'string', required: false },
  { key: 'endDate', type: 'string', required: false },
  { key: 'updateDate', type: 'string', required: false },
  { key: 'startTime', type: 'number', required: false },
  { key: 'currentCost', type: 'number', min: 0, required: false },
  { key: 'lastDayImpact', type: 'number', required: false },
  { key: 'impact', type: 'number', required: false },
  { key: 'percentChange', type: 'number', required: false },
  { key: 'sumAnomalyDeltas', type: 'number', required: false },
  { key: 'isClosed', type: 'boolean', required: false },
  { key: 'anomalyTriggeredItems', type: 'object', required: false },
  { key: 'baseline', type: 'array', required: false },
  { key: 'dataPoints', type: 'array', required: false },
  { key: 'cubeletSplits', type: 'array', required: false },
  { key: 'cubeletLastSplit', type: 'any', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Budget schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /budgets/v2/i/ — each item in budgets list */
export const budgetSchema: Schema = [
  { key: 'budgetName', type: 'string', nonEmpty: true },
  { key: 'id', type: 'string', required: false },
  { key: 'name', type: 'string', required: false },
  { key: 'amount', type: 'number', min: 0, required: false },
  { key: 'currentCost', type: 'number', min: 0, required: false },
  { key: 'forecastedCost', type: 'number', min: 0, required: false },
  { key: 'timeRange', type: 'string', required: false, nullable: true },
  { key: 'period', type: 'string', required: false, nullable: true },
  { key: 'status', type: 'string', required: false, nullable: true },
  { key: 'createdAt', type: 'string', required: false, nullable: true },
  { key: 'updatedAt', type: 'string', required: false, nullable: true },
  { key: 'enabled', type: 'boolean', required: false },
  { key: 'division_id', type: 'string', required: false },
  { key: 'currency', type: 'string', required: false, nullable: true },
  { key: 'ownerId', type: 'string', required: false },
  { key: 'type', type: 'string', required: false, nullable: true },
  { key: 'thresholds', type: 'array', required: false },
  { key: 'notifications', type: 'array', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Commitment schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /commitment/utilization/i/summary — commitment summary response */
export const commitmentSummarySchema: Schema = [
  { key: 'total', type: 'number', min: 0, required: false },
  { key: 'expiredTotal', type: 'number', min: 0, required: false },
  { key: 'activeTotal', type: 'number', min: 0, required: false },
  { key: 'utilizationPercent', type: 'number', min: 0, required: false },
  { key: 'unutilizedTotal', type: 'number', min: 0, required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Recommendation schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** POST /recommendationsNew/heatmap/summary — heatmap summary response */
export const recommendationSummarySchema: Schema = [
  { key: 'potentialAnnualSavings', type: 'number', min: 0 },
  { key: 'totalCount', type: 'number', min: 0 },
  { key: 'monthlySavings', type: 'number', min: 0, required: false },
  { key: 'implementedCount', type: 'number', min: 0, required: false },
  { key: 'implementedSavings', type: 'number', min: 0, required: false },
  { key: 'pendingCount', type: 'number', min: 0, required: false },
];

/** POST /recommendationsNew/list — each item in page[] list */
export const recommendationListItemSchema: Schema = [
  { key: 'id', type: 'string', nonEmpty: true, required: false },
  { key: 'name', type: 'string', nonEmpty: true, required: false },
  { key: 'annualSavings', type: 'number', min: 0, required: false },
  { key: 'monthlySavings', type: 'number', min: 0, required: false },
  { key: 'resourceId', type: 'string', required: false },
  { key: 'service', type: 'string', required: false },
  { key: 'region', type: 'string', required: false },
  { key: 'account_id', type: 'string', required: false },
  { key: 'recommendationType', type: 'string', required: false },
  { key: 'status', type: 'string', required: false },
  { key: 'category', type: 'string', required: false },
  { key: 'priority', type: 'string', required: false },
  { key: 'ageDays', type: 'number', min: 0, required: false },
  { key: 'tags', type: 'object', required: false },
  { key: 'link', type: 'string', required: false },
];

/** GET /recommendationsNew/heatmap/groupByOptions — group-by option item */
export const heatmapGroupOptionSchema: Schema = [
  { key: 'id', type: 'string', nonEmpty: true },
  { key: 'name', type: 'string', nonEmpty: true },
  { key: 'default', type: 'boolean', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Category schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /usage/categories — category item */
export const categorySchema: Schema = [
  { key: 'id', type: 'string', nonEmpty: true },
  { key: 'name', type: 'string', nonEmpty: true },
  { key: 'color', type: 'string', required: false },
  { key: 'description', type: 'string', required: false },
  { key: 'enabled', type: 'boolean', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Dashboard panels
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /usage/custom-dashboard/panels — panel item */
export const dashboardPanelSchema: Schema = [
  { key: 'id', type: 'string', nonEmpty: true },
  { key: 'name', type: 'string', required: false },
  { key: 'type', type: 'string', required: false },
  { key: 'config', type: 'object', required: false },
  { key: 'category', type: 'string', required: false },
  { key: 'dashboardId', type: 'string', required: false },
  { key: 'order', type: 'number', required: false },
  { key: 'createdAt', type: 'string', required: false },
  { key: 'updatedAt', type: 'string', required: false },
  { key: 'visible', type: 'boolean', required: false },
  { key: 'size', type: 'string', required: false },
  { key: 'dataSource', type: 'string', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Vendor schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /users/on-boarding/v2/byod/vendors — vendor item */
export const vendorSchema: Schema = [
  { key: 'cloudTypeId', type: 'number', min: 0 },
  { key: 'vendorName', type: 'string', nonEmpty: true },
  { key: 'id', type: 'string', required: false },
  { key: 'name', type: 'string', required: false },
  { key: 'logoUrl', type: 'string', required: false },
  { key: 'enabled', type: 'boolean', required: false },
  { key: 'description', type: 'string', required: false },
  { key: 'order', type: 'number', required: false },
  { key: 'supportedCurrencies', type: 'array', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Channel schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /channels or /workflow/available-workflow-channels — channel item */
export const channelSchema: Schema = [
  { key: 'id', type: 'string', nonEmpty: true },
  { key: 'name', type: 'string', nonEmpty: true },
  { key: 'type', type: 'string', required: false },
  { key: 'enabled', type: 'boolean', required: false },
  { key: 'config', type: 'object', required: false },
  { key: 'description', type: 'string', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// User preference schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /users/preferences — user preferences response */
export const userPreferenceSchema: Schema = [
  { key: 'theme', type: 'string', required: false },
  { key: 'timezone', type: 'string', required: false },
  { key: 'currency', type: 'string', required: false },
  { key: 'language', type: 'string', required: false },
  { key: 'dateFormat', type: 'string', required: false },
  { key: 'notificationsEnabled', type: 'boolean', required: false },
  { key: 'emailNotifications', type: 'boolean', required: false },
  { key: 'defaultDashboard', type: 'string', required: false },
  { key: 'defaultRegion', type: 'string', required: false },
  { key: 'costDisplayUnit', type: 'string', required: false },
  { key: 'id', type: 'string', required: false },
  { key: 'userId', type: 'string', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// User role schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /users/roles or /users/same-company-users — user role item */
export const userRoleSchema: Schema = [
  { key: 'user_key', type: 'string', nonEmpty: true, required: false },
  { key: 'user_name', type: 'string', nonEmpty: true, required: false },
  { key: 'role', type: 'string', required: false },
  { key: 'email', type: 'string', required: false },
  { key: 'id', type: 'string', required: false },
  { key: 'company', type: 'string', required: false },
  { key: 'status', type: 'string', required: false },
  { key: 'lastLogin', type: 'string', required: false },
  { key: 'permissions', type: 'array', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Division schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /divisions/i/ — divisions response */
export const divisionSchema: Schema = [
  { key: 'preparedRawDivisions', type: 'array' },
  { key: 'mapLinkedAccIdToDivisionName', type: 'array' },
  { key: 'divisions', type: 'array', required: false },
  { key: 'totalCount', type: 'number', min: 0, required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Billing rule schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /msp/billing-rules/v2 — billing rule item */
export const billingRuleSchema: Schema = [
  { key: 'id', type: 'string', required: false },
  { key: 'name', type: 'string', required: false },
  { key: 'type', type: 'string', required: false },
  { key: 'rate', type: 'number', min: 0, required: false },
  { key: 'enabled', type: 'boolean', required: false },
  { key: 'description', type: 'any', required: false },
  { key: 'createdAt', type: 'string', required: false },
  { key: 'updatedAt', type: 'string', required: false },
  { key: 'conditions', type: 'array', required: false },
  { key: 'applicableTo', type: 'string', required: false },
  { key: 'divisionId', type: 'string', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Credit alert schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /divisions/customers/credit/alerts — credit alert item */
export const creditAlertSchema: Schema = [
  { key: 'id', type: 'string', required: false },
  { key: 'division_id', type: 'string', required: false },
  { key: 'customerName', type: 'string', required: false },
  { key: 'creditAmount', type: 'number', min: 0, required: false },
  { key: 'threshold', type: 'number', min: 0, required: false },
  { key: 'status', type: 'string', required: false },
  { key: 'createdAt', type: 'string', required: false },
  { key: 'triggeredAt', type: 'string', required: false },
  { key: 'message', type: 'string', required: false },
  { key: 'isActive', type: 'boolean', required: false },
  { key: 'alertType', type: 'string', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Notification setting schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /users/user-settings/notifications — notification setting item */
export const notificationSettingSchema: Schema = [
  { key: 'id', type: 'number', required: false, nullable: true },
  { key: 'division_id', type: 'string', required: false, nullable: true },
  { key: 'user_key', type: 'string', required: false },
  { key: 'is_budget', type: 'number', required: false, nullable: true },
  { key: 'is_anomaly', type: 'number', required: false, nullable: true },
  { key: 'is_commitment', type: 'number', required: false, nullable: true },
  { key: 'is_recommendation', type: 'number', required: false, nullable: true },
  { key: 'is_credit', type: 'number', required: false, nullable: true },
  { key: 'channel_id', type: 'string', required: false, nullable: true },
  { key: 'enabled', type: 'number', required: false, nullable: true },
  { key: 'name', type: 'string', required: false, nullable: true },
  { key: 'description', type: 'string', required: false, nullable: true },
  { key: 'createdAt', type: 'string', required: false, nullable: true },
  { key: 'updatedAt', type: 'string', required: false, nullable: true },
];

// ═══════════════════════════════════════════════════════════════════════════════
// User event schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /users/events — user event item */
export const userEventSchema: Schema = [
  { key: 'id', type: 'string', required: false },
  { key: 'type', type: 'string', required: false },
  { key: 'userId', type: 'string', required: false },
  { key: 'username', type: 'string', required: false },
  { key: 'timestamp', type: 'string', required: false },
  { key: 'description', type: 'string', required: false },
  { key: 'action', type: 'string', required: false },
  { key: 'ip', type: 'string', required: false },
  { key: 'userAgent', type: 'string', required: false },
  { key: 'details', type: 'object', required: false },
  { key: 'sessionId', type: 'string', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// View schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /usage/views — view item */
export const viewSchema: Schema = [
  { key: 'id', type: 'string', required: false },
  { key: 'name', type: 'string', required: false },
  { key: 'type', type: 'string', required: false },
  { key: 'config', type: 'object', required: false },
  { key: 'createdAt', type: 'string', required: false },
  { key: 'updatedAt', type: 'string', required: false },
  { key: 'isDefault', type: 'boolean', required: false },
  { key: 'isShared', type: 'boolean', required: false },
  { key: 'ownerId', type: 'string', required: false },
  { key: 'filters', type: 'object', required: false },
  { key: 'groupBy', type: 'array', required: false },
  { key: 'metrics', type: 'array', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Virtual tag schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /usage/virtual-tags/virtual-tags — virtual tag item */
export const virtualTagSchema: Schema = [
  { key: 'id', type: 'string', required: false },
  { key: 'name', type: 'string', required: false },
  { key: 'key', type: 'string', required: false },
  { key: 'type', type: 'string', required: false },
  { key: 'value', type: 'string', required: false },
  { key: 'enabled', type: 'boolean', required: false },
  { key: 'description', type: 'string', required: false },
  { key: 'createdAt', type: 'string', required: false },
  { key: 'updatedAt', type: 'string', required: false },
  { key: 'rules', type: 'array', required: false },
  { key: 'scope', type: 'string', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Goal schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /usage/goals — goal item */
export const goalSchema: Schema = [
  { key: 'id', type: 'string', required: false },
  { key: 'name', type: 'string', required: false },
  { key: 'type', type: 'string', required: false },
  { key: 'target', type: 'number', min: 0, required: false },
  { key: 'current', type: 'number', min: 0, required: false },
  { key: 'progress', type: 'number', min: 0, required: false },
  { key: 'deadline', type: 'string', required: false },
  { key: 'status', type: 'string', required: false },
  { key: 'description', type: 'string', required: false },
  { key: 'createdAt', type: 'string', required: false },
  { key: 'updatedAt', type: 'string', required: false },
  { key: 'ownerId', type: 'string', required: false },
  { key: 'divisionId', type: 'string', required: false },
  { key: 'notifications', type: 'array', required: false },
  { key: 'metrics', type: 'array', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Report schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /usage/reports/all — report item */
export const reportSchema: Schema = [
  { key: 'id', type: 'string', required: false },
  { key: 'name', type: 'string', required: false },
  { key: 'type', type: 'string', required: false },
  { key: 'description', type: 'string', required: false },
  { key: 'createdAt', type: 'string', required: false },
  { key: 'updatedAt', type: 'string', required: false },
  { key: 'schedule', type: 'string', required: false },
  { key: 'lastRunAt', type: 'string', required: false },
  { key: 'status', type: 'string', required: false },
  { key: 'format', type: 'string', required: false },
  { key: 'recipients', type: 'array', required: false },
  { key: 'filters', type: 'object', required: false },
  { key: 'ownerId', type: 'string', required: false },
  { key: 'isOrgReport', type: 'boolean', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Customer cost schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /divisions/customers/aws/costs/ — customer cost item */
export const customerCostSchema: Schema = [
  { key: 'id', type: 'string', required: false },
  { key: 'customerId', type: 'string', required: false },
  { key: 'customerName', type: 'string', required: false },
  { key: 'totalCost', type: 'number', min: 0, required: false },
  { key: 'linked_account_id', type: 'string', required: false },
  { key: 'division_id', type: 'string', required: false },
  { key: 'period', type: 'string', required: false },
  { key: 'startDate', type: 'string', required: false },
  { key: 'endDate', type: 'string', required: false },
  { key: 'service', type: 'string', required: false },
  { key: 'region', type: 'string', required: false },
  { key: 'currency', type: 'string', required: false },
  { key: 'amortizedCost', type: 'number', min: 0, required: false },
  { key: 'unblendedCost', type: 'number', min: 0, required: false },
  { key: 'netAmortizedCost', type: 'number', min: 0, required: false },
  { key: 'netUnblendedCost', type: 'number', min: 0, required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CUE view schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /invoices/cue-views — CUE view item */
export const cueViewSchema: Schema = [
  { key: 'id', type: 'string', required: false },
  { key: 'name', type: 'string', required: false },
  { key: 'type', type: 'string', required: false },
  { key: 'config', type: 'object', required: false },
  { key: 'createdAt', type: 'string', required: false },
  { key: 'updatedAt', type: 'string', required: false },
  { key: 'isDefault', type: 'boolean', required: false },
  { key: 'isShared', type: 'boolean', required: false },
  { key: 'ownerId', type: 'string', required: false },
  { key: 'filters', type: 'object', required: false },
  { key: 'groupBy', type: 'array', required: false },
  { key: 'metrics', type: 'array', required: false },
  { key: 'description', type: 'string', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Dashboard label schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /usage/custom-dashboard/dashboard-labels — dashboard label item */
export const dashboardLabelSchema: Schema = [
  { key: 'id', type: 'string', required: false },
  { key: 'name', type: 'string', required: false },
  { key: 'color', type: 'string', required: false },
  { key: 'text', type: 'string', required: false },
  { key: 'icon', type: 'string', required: false },
  { key: 'dashboardId', type: 'string', required: false },
  { key: 'createdAt', type: 'string', required: false },
  { key: 'updatedAt', type: 'string', required: false },
  { key: 'position', type: 'string', required: false },
  { key: 'tooltip', type: 'string', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// GPT user data schemas
// ═══════════════════════════════════════════════════════════════════════════════

/** GET /gpt/user-data — GPT user data response */
export const gptUserDataSchema: Schema = [
  { key: 'userId', type: 'string', required: false },
  { key: 'userKey', type: 'string', required: false },
  { key: 'username', type: 'string', required: false },
  { key: 'email', type: 'string', required: false },
  { key: 'companyId', type: 'string', required: false },
  { key: 'companyName', type: 'string', required: false },
  { key: 'roles', type: 'array', required: false },
  { key: 'preferences', type: 'object', required: false },
  { key: 'features', type: 'array', required: false },
  { key: 'permissions', type: 'array', required: false },
  { key: 'linkedAccounts', type: 'array', required: false },
  { key: 'costData', type: 'object', required: false },
  { key: 'cloudConnections', type: 'array', required: false },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Cross-reference nested schemas so validateSchema can resolve them
// ═══════════════════════════════════════════════════════════════════════════════

// Wire up dashboardSchema.dimensions.items to dimensionItemSchema
(dashboardSchema[2] as { key: string; type: string; items?: Schema }).items = dimensionItemSchema;

// Wire up dimensionsConfigSchema.dimensions.items to dimensionItemSchema
(dimensionsConfigSchema[1] as { key: string; type: string; items?: Schema }).items = dimensionItemSchema;
