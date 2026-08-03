import { APIRequestContext } from '@playwright/test';
import { readJson, readText } from './response';

export class CostUsageClient {
  constructor(public readonly context: APIRequestContext) {}

  /** POST /api/v1/invoices/caui — returns array of cost records (may be empty). */
  async postCaui(body: Record<string, unknown>): Promise<Record<string, unknown>[]> {
    const r = await this.context.post('/api/v1/invoices/caui', { data: body });
    return readJson<Record<string, unknown>[]>(r, 'POST /api/v1/invoices/caui');
  }

  /** GET /api/v1/invoices/service-names/distinct — returns array of [name, name] pairs. */
  async getDistinctServiceNames(): Promise<string[][]> {
    const r = await this.context.get('/api/v1/invoices/service-names/distinct');
    return readJson<string[][]>(r, 'GET /api/v1/invoices/service-names/distinct');
  }

  /** GET /api/v1/invoices/service-costs/distinct — returns flat dimension categories (region, service, instancetype, ...). */
  async getDistinctServiceCosts(): Promise<Record<string, string[]>> {
    const r = await this.context.get('/api/v1/invoices/service-costs/distinct');
    return readJson<Record<string, string[]>>(r, 'GET /api/v1/invoices/service-costs/distinct');
  }

  /** GET /api/v1/invoices/service-costs/distinct-k8s — returns K8s dimension categories. */
  async getDistinctK8sCosts(): Promise<Record<string, string[]>> {
    const r = await this.context.get('/api/v1/invoices/service-costs/distinct-k8s');
    return readJson<Record<string, string[]>>(r, 'GET /api/v1/invoices/service-costs/distinct-k8s');
  }

  /** GET /api/v1/invoices/service-costs/distinct-tags — returns tag key arrays. */
  async getDistinctTagCosts(): Promise<Record<string, string[]>> {
    const r = await this.context.get('/api/v1/invoices/service-costs/distinct-tags');
    return readJson<Record<string, string[]>>(r, 'GET /api/v1/invoices/service-costs/distinct-tags');
  }

  /** GET /api/v1/budgets/v2/i/ — returns array of budget objects. */
  async getBudgets(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/budgets/v2/i/', { params: { only_metadata: 'true' } });
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/budgets/v2/i/');
  }

  async getPanels(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/custom-dashboard/panels');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/usage/custom-dashboard/panels');
  }

  async getRecommendationsTotal(): Promise<number> {
    const r = await this.context.post('/api/v1/recommendationsNew/list/total', { data: {} });
    return parseInt(await readText(r, 'POST /api/v1/recommendationsNew/list/total'), 10);
  }

  async getRecommendationCategories(): Promise<{ id: string; name: string }[]> {
    const r = await this.context.post('/api/v1/recommendationsNew/heatmap/dynamicFilter/cat_id', { data: {} });
    const b = await readJson<{ page?: { id: string; name: string }[] }>(
      r,
      'POST /api/v1/recommendationsNew/heatmap/dynamicFilter/cat_id',
    );
    return b.page || [];
  }

  async getRecommendationsList(): Promise<{ page?: Record<string, unknown>[] }> {
    const r = await this.context.post('/api/v1/recommendationsNew/list', {
      data: { pageNumber: 1, pageSize: 10, sort: { property: 'annualSavings', direction: 'desc' } },
    });
    return readJson<{ page?: Record<string, unknown>[] }>(r, 'POST /api/v1/recommendationsNew/list');
  }
}
