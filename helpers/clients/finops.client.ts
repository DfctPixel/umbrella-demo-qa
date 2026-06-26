import { APIRequestContext } from '@playwright/test';

export class FinOpsClient {
  constructor(public readonly context: APIRequestContext) {}

  async getCommitmentDashboard(params: Record<string, string>): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/commitment/dashboard', { params });
    return r.json();
  }

  async getCommitmentSummary(params: Record<string, string>): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/commitment/utilization/i/summary', { params });
    return r.json();
  }

  async getCommitmentTotalSavings(commitmentType: string, dates: string[]): Promise<Record<string, unknown>> {
    const qs = dates.map(d => `dates=${encodeURIComponent(d)}`).join('&');
    const r = await this.context.get(`/api/v1/commitment/utilization/totalsavings?commitmentType=${commitmentType}&${qs}`);
    return r.json();
  }

  async getAnomalyStats(): Promise<{ openAnomalies?: number; impact?: number; historyData?: unknown[] }> {
    const r = await this.context.get('/api/v1/anomaly-detection/anomalies/stats');
    return r.json();
  }

  async getAnomalyDetectionList(params: Record<string, string>): Promise<unknown[]> {
    const r = await this.context.get('/api/v1/anomaly-detection', { params });
    return r.json();
  }

  async getAnomalyAlertRules(): Promise<unknown[]> {
    const r = await this.context.get('/api/v1/anomaly-detection/rules');
    return r.json();
  }

  async getTagGovernanceCoverage(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/tag-governance/coverage');
    return r.json();
  }

  async getTagGovernanceResources(params: Record<string, string>): Promise<Record<string, unknown>> {
    const r = await this.context.post('/api/v1/tag-governance/resources', { data: params });
    return r.json();
  }

  async getCostAlertRules(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/alerts/rules');
    return r.json();
  }

  async getBillingSummary(params: Record<string, string>): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/partner/billing-summary', { params });
    return r.json();
  }
}
