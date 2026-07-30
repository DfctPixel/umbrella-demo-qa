import { APIRequestContext } from '@playwright/test';

export class DashboardClient {
  constructor(public readonly context: APIRequestContext) {}

  /** GET /api/v1/usage/custom-dashboard/dashboard/default — returns the default dashboard configuration. */
  async getDefaultDashboard(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/usage/custom-dashboard/dashboard/default');
    return r.json();
  }

  /** GET /api/v1/usage/custom-dashboard/dashboards — returns all dashboards. */
  async getDashboards(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/custom-dashboard/dashboards');
    return r.json();
  }

  /** GET /api/v1/usage/custom-dashboard/dashboards-templates — returns dashboard templates. */
  async getDashboardTemplates(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/custom-dashboard/dashboards-templates');
    return r.json();
  }

  /** GET /api/v1/usage/custom-dashboard/dashboard-labels — returns dashboard label definitions. */
  async getDashboardLabels(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/custom-dashboard/dashboard-labels');
    return r.json();
  }

  /** GET /api/v1/usage/custom-dashboard/dashboard-settings — returns dashboard settings. */
  async getDashboardSettings(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/usage/custom-dashboard/dashboard-settings');
    return r.json();
  }

  /** GET /api/v1/invoices/dimensions-config — returns the dimensions configuration. */
  async getDimensionsConfig(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/invoices/dimensions-config');
    return r.json();
  }

  /** GET /api/v1/invoices/dimensions-config/dimensions/{dimension}/values — returns values for a given dimension (e.g. viewscustomtags, subviewscustomtags, workloadtype). */
  async getDimensionValues(dimension: string): Promise<Record<string, unknown>[]> {
    const r = await this.context.get(`/api/v1/invoices/dimensions-config/dimensions/${dimension}/values`);
    return r.json();
  }

  /** GET /api/v1/invoices/cue-views — returns available CUE views. */
  async getCueViews(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/invoices/cue-views');
    return r.json();
  }

  /** GET /api/v1/users/on-boarding/v2/byod/vendors — returns BYOD vendor list. */
  async getByodVendors(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/users/on-boarding/v2/byod/vendors');
    return r.json();
  }
}
