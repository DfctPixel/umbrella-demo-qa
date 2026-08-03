import { APIRequestContext } from '@playwright/test';
import { readJson } from './response';

export class DashboardClient {
  constructor(public readonly context: APIRequestContext) {}

  /** GET /api/v1/usage/custom-dashboard/dashboard/default — returns the default dashboard configuration. */
  async getDefaultDashboard(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/usage/custom-dashboard/dashboard/default');
    return readJson<Record<string, unknown>>(r, 'GET /api/v1/usage/custom-dashboard/dashboard/default');
  }

  /** GET /api/v1/usage/custom-dashboard/dashboards — returns all dashboards. */
  async getDashboards(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/custom-dashboard/dashboards');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/usage/custom-dashboard/dashboards');
  }

  /** GET /api/v1/usage/custom-dashboard/dashboards-templates — returns dashboard templates. */
  async getDashboardTemplates(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/custom-dashboard/dashboards-templates');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/usage/custom-dashboard/dashboards-templates');
  }

  /** GET /api/v1/usage/custom-dashboard/dashboard-labels — returns dashboard label definitions. */
  async getDashboardLabels(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/custom-dashboard/dashboard-labels');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/usage/custom-dashboard/dashboard-labels');
  }

  /** GET /api/v1/usage/custom-dashboard/dashboard-settings — returns dashboard settings. */
  async getDashboardSettings(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/usage/custom-dashboard/dashboard-settings');
    return readJson<Record<string, unknown>>(r, 'GET /api/v1/usage/custom-dashboard/dashboard-settings');
  }

  /** GET /api/v1/invoices/dimensions-config — returns the dimensions configuration. */
  async getDimensionsConfig(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/invoices/dimensions-config');
    return readJson<Record<string, unknown>>(r, 'GET /api/v1/invoices/dimensions-config');
  }

  /** GET /api/v1/invoices/dimensions-config/dimensions/{dimension}/values — returns values for a given dimension (e.g. viewscustomtags, subviewscustomtags, workloadtype). */
  async getDimensionValues(dimension: string): Promise<Record<string, unknown>[]> {
    const r = await this.context.get(`/api/v1/invoices/dimensions-config/dimensions/${dimension}/values`);
    return readJson<Record<string, unknown>[]>(
      r,
      `GET /api/v1/invoices/dimensions-config/dimensions/${dimension}/values`,
    );
  }

  /** GET /api/v1/invoices/cue-views — returns available CUE views. */
  async getCueViews(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/invoices/cue-views');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/invoices/cue-views');
  }

  /** GET /api/v1/users/on-boarding/v2/byod/vendors — returns BYOD vendor list. */
  async getByodVendors(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/users/on-boarding/v2/byod/vendors');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/users/on-boarding/v2/byod/vendors');
  }
}
