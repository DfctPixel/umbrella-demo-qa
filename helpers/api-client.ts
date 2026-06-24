import { APIRequestContext, expect } from '@playwright/test';
import { AuthTokens } from './auth';

/**
 * Typed wrapper around the Umbrella FinOps REST API.
 */
export class UmbrellaApiClient {
  constructor(
    public readonly context: APIRequestContext,
    public readonly tokens: AuthTokens
  ) {}

  // ── Auth / User ──────────────────────────────────────────────

  /** GET /users/plain-sub-users — returns sub-users / whoami info */
  async getPlainSubUsers() {
    const res = await this.context.get('/users/plain-sub-users');
    return res.json();
  }

  /** POST /users/signin-with-token — verify token-based auth */
  async signinWithToken() {
    const res = await this.context.post('/users/signin-with-token', {
      data: { selectedRole: null },
      headers: { Authorization: `Bearer ${this.tokens.jwtToken}` },
    });
    return res.json();
  }

  /** GET /users/user-settings/notifications */
  async getNotificationSettings() {
    const res = await this.context.get('/users/user-settings/notifications');
    return res.json();
  }

  /** GET /users/on-boarding/v2/byod/vendors */
  async getOnboardingVendors() {
    const res = await this.context.get('/users/on-boarding/v2/byod/vendors');
    return res.json();
  }

  // ── Cost & Usage ─────────────────────────────────────────────

  /** POST /invoices/caui — Cost & Usage data query */
  async postCaui(body: Record<string, unknown>) {
    const res = await this.context.post('/invoices/caui', { data: body });
    return res.json();
  }

  /** GET /invoices/service-names/distinct */
  async getDistinctServiceNames() {
    const res = await this.context.get('/invoices/service-names/distinct');
    return res.json();
  }

  /** GET /invoices/service-costs/distinct */
  async getDistinctServiceCosts() {
    const res = await this.context.get('/invoices/service-costs/distinct');
    return res.json();
  }

  /** GET /invoices/cue-views */
  async getCueViews() {
    const res = await this.context.get('/invoices/cue-views');
    return res.json();
  }

  /** POST /recommendationsNew/heatmap/summary */
  async getRecommendationsHeatmap() {
    const res = await this.context.post('/recommendationsNew/heatmap/summary', {
      data: {},
    });
    return res.json();
  }

  /** GET /anomaly-detection/anomalies/stats */
  async getAnomalyStats() {
    const res = await this.context.get('/anomaly-detection/anomalies/stats');
    return res.json();
  }

  /** GET /budgets/v2/i/?only_metadata=true */
  async getBudgets() {
    const res = await this.context.get('/budgets/v2/i/', {
      params: { only_metadata: 'true' },
    });
    return res.json();
  }

  /** GET /commitment/utilization/i/summary */
  async getCommitmentSummary(params: Record<string, string>) {
    const res = await this.context.get('/commitment/utilization/i/summary', {
      params,
    });
    return res.json();
  }

  // ── Dashboard / Custom ───────────────────────────────────────

  /** GET /usage/custom-dashboard/dashboard/default */
  async getDefaultDashboard() {
    const res = await this.context.get('/usage/custom-dashboard/dashboard/default');
    return res.json();
  }

  /** GET /usage/custom-dashboard/dashboards */
  async getDashboards() {
    const res = await this.context.get('/usage/custom-dashboard/dashboards');
    return res.json();
  }

  /** GET /channels */
  async getChannels() {
    const res = await this.context.get('/channels');
    return res.json();
  }
}
