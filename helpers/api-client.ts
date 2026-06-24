import { APIRequestContext, expect } from '@playwright/test';
import { AuthTokens } from './auth';

// ── Response type interfaces ────────────────────────────────────

export interface SigninWithTokenResponse {
  userName?: string;
  userKey?: string;
  email?: string;
}

export interface NotificationSettingsResponse {
  enabled?: boolean;
  email?: string;
  [key: string]: unknown;
}

export interface VendorResponse {
  id?: string;
  name?: string;
  [key: string]: unknown;
}

export interface CauiResponse {
  data?: unknown[];
  totalCost?: number;
  [key: string]: unknown;
}

export interface DistinctServiceNamesResponse {
  services?: Array<{ serviceName?: string }>;
  [key: string]: unknown;
}

export interface DistinctServiceCostsResponse {
  services?: Array<{ serviceName?: string; cost?: number }>;
  [key: string]: unknown;
}

export interface CueViewsResponse {
  views?: Array<{ id?: string; name?: string }>;
  [key: string]: unknown;
}

export interface RecommendationsHeatmapResponse {
  summary?: unknown;
  [key: string]: unknown;
}

export interface AnomalyStatsResponse {
  total?: number;
  open?: number;
  [key: string]: unknown;
}

export interface BudgetsResponse {
  budgets?: Array<{ id?: string; name?: string }>;
  [key: string]: unknown;
}

export interface CommitmentSummaryResponse {
  utilization?: unknown;
  [key: string]: unknown;
}

export interface CommitmentSavingsResponse {
  totalCommitment?: number;
  [key: string]: unknown;
}

export interface PanelResponse {
  uuid?: string;
  name?: string;
  type?: string;
  route?: string;
  displayStatus?: string;
  [key: string]: unknown;
}

export interface DashboardResponse {
  id?: string;
  name?: string;
  [key: string]: unknown;
}

// ── API Client ──────────────────────────────────────────────────

/**
 * Typed wrapper around the Umbrella FinOps REST API.
 *
 * All methods use Playwright's APIRequestContext and return typed responses
 * where possible, falling back to untyped JSON for dynamic endpoints.
 */
export class UmbrellaApiClient {
  constructor(
    public readonly context: APIRequestContext,
    public readonly tokens: AuthTokens
  ) {}

  // ── Auth / User ──────────────────────────────────────────────

  async getPlainSubUsers(): Promise<Record<string, unknown>> {
    const res = await this.context.get('/users/plain-sub-users');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<Record<string, unknown>>;
  }

  async signinWithToken(): Promise<SigninWithTokenResponse> {
    const res = await this.context.post('/users/signin-with-token', {
      data: { selectedRole: null },
      headers: { Authorization: `Bearer ${this.tokens.jwtToken}` },
    });
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<SigninWithTokenResponse>;
  }

  async getNotificationSettings(): Promise<NotificationSettingsResponse> {
    const res = await this.context.get('/users/user-settings/notifications');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<NotificationSettingsResponse>;
  }

  async getOnboardingVendors(): Promise<VendorResponse[]> {
    const res = await this.context.get('/users/on-boarding/v2/byod/vendors');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<VendorResponse[]>;
  }

  // ── Cost & Usage ─────────────────────────────────────────────

  async postCaui(body: Record<string, unknown>): Promise<CauiResponse> {
    const res = await this.context.post('/invoices/caui', { data: body });
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<CauiResponse>;
  }

  async getDistinctServiceNames(): Promise<DistinctServiceNamesResponse> {
    const res = await this.context.get('/invoices/service-names/distinct');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<DistinctServiceNamesResponse>;
  }

  async getDistinctServiceCosts(): Promise<DistinctServiceCostsResponse> {
    const res = await this.context.get('/invoices/service-costs/distinct');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<DistinctServiceCostsResponse>;
  }

  async getCueViews(): Promise<CueViewsResponse> {
    const res = await this.context.get('/invoices/cue-views');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<CueViewsResponse>;
  }

  async getRecommendationsHeatmap(): Promise<RecommendationsHeatmapResponse> {
    const res = await this.context.post('/recommendationsNew/heatmap/summary', {
      data: {},
    });
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<RecommendationsHeatmapResponse>;
  }

  async getAnomalyStats(): Promise<AnomalyStatsResponse> {
    const res = await this.context.get('/anomaly-detection/anomalies/stats');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<AnomalyStatsResponse>;
  }

  async getBudgets(): Promise<BudgetsResponse> {
    const res = await this.context.get('/budgets/v2/i/', {
      params: { only_metadata: 'true' },
    });
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<BudgetsResponse>;
  }

  async getCommitmentSummary(params: Record<string, string>): Promise<CommitmentSummaryResponse> {
    const res = await this.context.get('/commitment/utilization/i/summary', {
      params,
    });
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<CommitmentSummaryResponse>;
  }

  // ── Commitment savings (FinOps core) ─────────────────────────

  async getCommitmentTotalSavings(commitmentType: string, dates: string[]): Promise<CommitmentSavingsResponse> {
    const qs = dates.map((d) => `dates=${encodeURIComponent(d)}`).join('&');
    const res = await this.context.get(
      `/commitment/utilization/totalsavings?commitmentType=${commitmentType}&${qs}`,
    );
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<CommitmentSavingsResponse>;
  }

  // ── Dashboard / Custom ───────────────────────────────────────

  async getDefaultDashboard(): Promise<DashboardResponse> {
    const res = await this.context.get('/usage/custom-dashboard/dashboard/default');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<DashboardResponse>;
  }

  async getDashboards(): Promise<DashboardResponse[]> {
    const res = await this.context.get('/usage/custom-dashboard/dashboards');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<DashboardResponse[]>;
  }

  async getPanels(): Promise<PanelResponse[]> {
    const res = await this.context.get('/usage/custom-dashboard/panels');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<PanelResponse[]>;
  }

  async getChannels(): Promise<Record<string, unknown>> {
    const res = await this.context.get('/channels');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<Record<string, unknown>>;
  }

  // ── K8s cost data ────────────────────────────────────────────

  async getDistinctK8sCosts(): Promise<DistinctServiceCostsResponse> {
    const res = await this.context.get('/invoices/service-costs/distinct-k8s');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<DistinctServiceCostsResponse>;
  }

  // ── Tag cost data ────────────────────────────────────────────

  async getDistinctTagCosts(): Promise<DistinctServiceCostsResponse> {
    const res = await this.context.get('/invoices/service-costs/distinct-tags');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<DistinctServiceCostsResponse>;
  }

  // ── Recommendations total count ──────────────────────────────

  async getRecommendationsTotal(): Promise<number> {
    const res = await this.context.post('/recommendationsNew/list/total', { data: {} });
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    return parseInt(text, 10);
  }

  // ── Recommendations heatmap dynamic filter categories ────────

  async getRecommendationCategories(): Promise<Array<{ id: string; name: string }>> {
    const res = await this.context.post('/recommendationsNew/heatmap/dynamicFilter/cat_id', { data: {} });
    expect(res.ok()).toBeTruthy();
    const body = await res.json() as { page?: Array<{ id: string; name: string }> };
    return body.page || [];
  }

  // ── Commitment Dashboard (FinOps commitments) ────────────────

  async getCommitmentDashboard(params: Record<string, string>): Promise<Record<string, unknown>> {
    const res = await this.context.get('/commitment/dashboard', { params });
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<Record<string, unknown>>;
  }

  // ── Anomaly Detection list ──────────────────────────────────

  async getAnomalyDetectionList(params: Record<string, string>): Promise<Array<Record<string, unknown>>> {
    const res = await this.context.get('/anomaly-detection', { params });
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<Array<Record<string, unknown>>>;
  }

  async getAnomalyAlertRules(): Promise<Array<Record<string, unknown>>> {
    const res = await this.context.get('/anomaly-detection/rules');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<Array<Record<string, unknown>>>;
  }

  // ── Recommendations list (detailed) ─────────────────────────

  async getRecommendationsList(): Promise<Record<string, unknown>> {
    const res = await this.context.post('/recommendationsNew/list', {
      data: {
        pageNumber: 1,
        pageSize: 10,
        sort: { property: 'annualSavings', direction: 'desc' },
      },
    });
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<Record<string, unknown>>;
  }

  // ── Tag Governance coverage ─────────────────────────────────

  async getTagGovernanceCoverage(): Promise<Record<string, unknown>> {
    const res = await this.context.get('/tag-governance/coverage');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<Record<string, unknown>>;
  }

  async getTagGovernanceResources(params: Record<string, string>): Promise<Record<string, unknown>> {
    const res = await this.context.post('/tag-governance/resources', { data: params });
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<Record<string, unknown>>;
  }

  // ── Alerts / Alert Rules ────────────────────────────────────

  async getCostAlertRules(): Promise<Record<string, unknown>> {
    const res = await this.context.get('/alerts/rules');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<Record<string, unknown>>;
  }

  // ── Partner Billing Summary ─────────────────────────────────

  async getBillingSummary(params: Record<string, string>): Promise<Record<string, unknown>> {
    const res = await this.context.get('/partner/billing-summary', { params });
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<Record<string, unknown>>;
  }
}
