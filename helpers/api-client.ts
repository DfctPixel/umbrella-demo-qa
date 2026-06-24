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

  async getChannels(): Promise<Record<string, unknown>> {
    const res = await this.context.get('/channels');
    expect(res.ok()).toBeTruthy();
    return res.json() as Promise<Record<string, unknown>>;
  }
}
