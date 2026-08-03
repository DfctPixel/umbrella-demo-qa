import { APIRequestContext } from '@playwright/test';
import { readJson } from './response';

export class PlatformClient {
  constructor(public readonly context: APIRequestContext) {}

  /** GET /api/v1/users/plain-sub-users — returns the authenticated user profile. */
  async getPlainSubUsers(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/users/plain-sub-users');
    return readJson<Record<string, unknown>>(r, 'GET /api/v1/users/plain-sub-users');
  }

  /** GET /api/v1/users/user-settings/notifications — returns user notification settings. */
  async getUserSettingsNotifications(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/users/user-settings/notifications');
    return readJson<Record<string, unknown>>(r, 'GET /api/v1/users/user-settings/notifications');
  }

  /** GET /api/v1/users/notifications — returns user notifications. */
  async getUserNotifications(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/users/notifications');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/users/notifications');
  }

  /** GET /api/v1/users/preferences — returns user preferences. */
  async getUserPreferences(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/users/preferences');
    return readJson<Record<string, unknown>>(r, 'GET /api/v1/users/preferences');
  }

  /** GET /api/v1/users/roles — returns user roles. */
  async getUserRoles(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/users/roles');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/users/roles');
  }

  /** GET /api/v1/users/same-company-users — returns users in the same company. */
  async getSameCompanyUsers(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/users/same-company-users');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/users/same-company-users');
  }

  /** GET /api/v1/users/events — returns user events with optional query params. */
  async getUserEvents(params: Record<string, string>): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/users/events', { params });
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/users/events');
  }

  /** GET /api/v1/channels — returns available channels. */
  async getChannels(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/channels');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/channels');
  }

  /** GET /api/v1/workflow/available-workflow-channels — returns available workflow channels. */
  async getWorkflowChannels(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/workflow/available-workflow-channels');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/workflow/available-workflow-channels');
  }

  /** GET /api/v1/divisions/i/ — returns divisions with optional includeEmpty query param. */
  async getDivisions(includeEmpty?: boolean): Promise<Record<string, unknown>[]> {
    const params: Record<string, string> = {};
    if (includeEmpty !== undefined) {
      params.includeEmpty = String(includeEmpty);
    }
    const r = await this.context.get('/api/v1/divisions/i/', { params });
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/divisions/i/');
  }

  /** GET /api/v1/usage/views — returns usage views. */
  async getViews(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/views');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/usage/views');
  }

  /** GET /api/v1/usage/virtual-tags/virtual-tags — returns virtual tags. */
  async getVirtualTags(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/virtual-tags/virtual-tags');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/usage/virtual-tags/virtual-tags');
  }

  /** GET /api/v1/usage/categories — returns usage categories. */
  async getCategories(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/categories');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/usage/categories');
  }

  /** GET /api/v1/usage/goals — returns usage goals. */
  async getGoals(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/goals');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/usage/goals');
  }

  /** GET /api/v1/usage/reports/all — returns all reports. */
  async getReportsAll(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/reports/all');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/usage/reports/all');
  }

  /** GET /api/v1/usage/reports/all-org — returns all organization reports. */
  async getReportsAllOrg(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/reports/all-org');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/usage/reports/all-org');
  }

  /** GET /api/v1/usage/business-mapping/viewpoints — returns business mapping viewpoints. */
  async getBusinessMappingViewpoints(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/business-mapping/viewpoints');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/usage/business-mapping/viewpoints');
  }

  /** GET /api/v1/gpt/user-data — returns GPT user data. */
  async getGptUserData(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/gpt/user-data');
    return readJson<Record<string, unknown>>(r, 'GET /api/v1/gpt/user-data');
  }

  /** GET /api/v1/gpt/available-data — returns GPT available data categories. */
  async getGptAvailableData(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/gpt/available-data');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/gpt/available-data');
  }

  /** GET /api/v1/invoices/service-costs/distinct-tags/governance — returns distinct tags for governance. */
  async getDistinctTagsGovernance(): Promise<Record<string, string[]>> {
    const r = await this.context.get('/api/v1/invoices/service-costs/distinct-tags/governance');
    return readJson<Record<string, string[]>>(
      r,
      'GET /api/v1/invoices/service-costs/distinct-tags/governance',
    );
  }

  /** GET /api/v2/commitment/riUtilizationDetails — returns RI utilization details with optional query params. */
  async getRiUtilizationDetails(params: Record<string, string>): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v2/commitment/riUtilizationDetails', { params });
    return readJson<Record<string, unknown>>(r, 'GET /api/v2/commitment/riUtilizationDetails');
  }

  /** POST /api/v1/client-metrics — fire-and-forget client metrics submission; no response expected. */
  async postClientMetrics(): Promise<void> {
    await this.context.post('/api/v1/client-metrics', { data: {} });
  }
}
