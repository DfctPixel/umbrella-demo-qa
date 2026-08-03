import { APIRequestContext } from '@playwright/test';
import { readJson } from './response';

export class FinOpsClient {
  constructor(public readonly context: APIRequestContext) {}

  async getCommitmentDashboard(params: Record<string, string>): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/commitment/dashboard', { params });
    return readJson<Record<string, unknown>>(r, 'GET /api/v1/commitment/dashboard');
  }

  async getCommitmentSummary(params: Record<string, string>): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/commitment/utilization/i/summary', { params });
    return readJson<Record<string, unknown>>(r, 'GET /api/v1/commitment/utilization/i/summary');
  }

  async getCommitmentTotalSavings(commitmentType: string, dates: string[]): Promise<Record<string, unknown>> {
    const qs = dates.map(d => `dates=${encodeURIComponent(d)}`).join('&');
    const r = await this.context.get(`/api/v1/commitment/utilization/totalsavings?commitmentType=${commitmentType}&${qs}`);
    return readJson<Record<string, unknown>>(
      r,
      `GET /api/v1/commitment/utilization/totalsavings?commitmentType=${commitmentType}`,
    );
  }

  async getAnomalyStats(): Promise<{ openAnomalies?: number; impact?: number; historyData?: unknown[] }> {
    const r = await this.context.get('/api/v1/anomaly-detection/anomalies/stats');
    return readJson<{ openAnomalies?: number; impact?: number; historyData?: unknown[] }>(
      r,
      'GET /api/v1/anomaly-detection/anomalies/stats',
    );
  }

  async getAnomalyDetectionList(params: Record<string, string>): Promise<unknown[]> {
    const r = await this.context.get('/api/v1/anomaly-detection', { params });
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/anomaly-detection');
  }

  async getAnomalyAlertRules(): Promise<unknown[]> {
    const r = await this.context.get('/api/v1/anomaly-detection/rules');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/anomaly-detection/rules');
  }

  async getTagGovernanceCoverage(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/tag-governance/coverage');
    return readJson<Record<string, unknown>>(r, 'GET /api/v1/tag-governance/coverage');
  }

  async getTagGovernanceResources(params: Record<string, string>): Promise<Record<string, unknown>> {
    const r = await this.context.post('/api/v1/tag-governance/resources', { data: params });
    return readJson<Record<string, unknown>>(r, 'POST /api/v1/tag-governance/resources');
  }

  async getCostAlertRules(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/alerts/rules');
    return readJson<Record<string, unknown>>(r, 'GET /api/v1/alerts/rules');
  }

  async getBillingSummary(params: Record<string, string>): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/partner/billing-summary', { params });
    return readJson<Record<string, unknown>>(r, 'GET /api/v1/partner/billing-summary');
  }
}
