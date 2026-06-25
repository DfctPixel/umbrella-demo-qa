import { APIRequestContext, expect } from '@playwright/test';
import { AuthTokens } from '../auth/types';

export class FinOpsClient {
  constructor(public readonly context: APIRequestContext, public readonly tokens: AuthTokens) {}

  async getCommitmentDashboard(params: Record<string, string>): Promise<Record<string, unknown>> {
    const r = await this.context.get('/commitment/dashboard', { params }); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getCommitmentSummary(params: Record<string, string>): Promise<Record<string, unknown>> {
    const r = await this.context.get('/commitment/utilization/i/summary', { params }); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getCommitmentTotalSavings(commitmentType: string, dates: string[]): Promise<Record<string, unknown>> {
    const qs = dates.map(d => `dates=${encodeURIComponent(d)}`).join('&');
    const r = await this.context.get(`/commitment/utilization/totalsavings?commitmentType=${commitmentType}&${qs}`); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getAnomalyStats(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/anomaly-detection/anomalies/stats'); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getAnomalyDetectionList(params: Record<string, string>): Promise<Array<Record<string, unknown>>> {
    const r = await this.context.get('/anomaly-detection', { params }); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getAnomalyAlertRules(): Promise<Array<Record<string, unknown>>> {
    const r = await this.context.get('/anomaly-detection/rules'); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getTagGovernanceCoverage(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/tag-governance/coverage'); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getTagGovernanceResources(params: Record<string, string>): Promise<Record<string, unknown>> {
    const r = await this.context.post('/tag-governance/resources', { data: params }); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getCostAlertRules(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/alerts/rules'); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getBillingSummary(params: Record<string, string>): Promise<Record<string, unknown>> {
    const r = await this.context.get('/partner/billing-summary', { params }); expect(r.ok()).toBeTruthy(); return r.json(); }
}
