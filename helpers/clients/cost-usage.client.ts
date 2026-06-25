import { APIRequestContext, expect } from '@playwright/test';
import { AuthTokens } from '../auth/types';

export interface CauiResponse { data?: unknown[]; totalCost?: number; [key: string]: unknown; }
export interface DistinctServiceNamesResponse { services?: Array<{ serviceName?: string }>; [key: string]: unknown; }
export interface DistinctServiceCostsResponse { services?: Array<{ serviceName?: string; cost?: number }>; [key: string]: unknown; }
export interface BudgetsResponse { budgets?: Array<{ id?: string; name?: string }>; [key: string]: unknown; }
export interface PanelResponse { uuid?: string; name?: string; type?: string; [key: string]: unknown; }

export class CostUsageClient {
  constructor(public readonly context: APIRequestContext, public readonly tokens: AuthTokens) {}

  async postCaui(body: Record<string, unknown>): Promise<CauiResponse> {
    const r = await this.context.post('/invoices/caui', { data: body }); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getDistinctServiceNames(): Promise<DistinctServiceNamesResponse> {
    const r = await this.context.get('/invoices/service-names/distinct'); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getDistinctServiceCosts(): Promise<DistinctServiceCostsResponse> {
    const r = await this.context.get('/invoices/service-costs/distinct'); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getDistinctK8sCosts(): Promise<DistinctServiceCostsResponse> {
    const r = await this.context.get('/invoices/service-costs/distinct-k8s'); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getDistinctTagCosts(): Promise<DistinctServiceCostsResponse> {
    const r = await this.context.get('/invoices/service-costs/distinct-tags'); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getBudgets(): Promise<BudgetsResponse> {
    const r = await this.context.get('/budgets/v2/i/', { params: { only_metadata: 'true' } }); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getPanels(): Promise<PanelResponse[]> {
    const r = await this.context.get('/usage/custom-dashboard/panels'); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getDefaultDashboard(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/usage/custom-dashboard/dashboard/default'); expect(r.ok()).toBeTruthy(); return r.json(); }
  async getRecommendationsTotal(): Promise<number> {
    const r = await this.context.post('/recommendationsNew/list/total', { data: {} }); expect(r.ok()).toBeTruthy(); return parseInt(await r.text(), 10); }
  async getRecommendationCategories(): Promise<Array<{ id: string; name: string }>> {
    const r = await this.context.post('/recommendationsNew/heatmap/dynamicFilter/cat_id', { data: {} }); expect(r.ok()).toBeTruthy(); const b = await r.json() as { page?: Array<{ id: string; name: string }> }; return b.page || []; }
  async getRecommendationsList(): Promise<Record<string, unknown>> {
    const r = await this.context.post('/recommendationsNew/list', { data: { pageNumber: 1, pageSize: 10, sort: { property: 'annualSavings', direction: 'desc' } } }); expect(r.ok()).toBeTruthy(); return r.json(); }
}
