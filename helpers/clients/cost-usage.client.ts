import { APIRequestContext } from '@playwright/test';

export class CostUsageClient {
  constructor(public readonly context: APIRequestContext) {}

  /** POST /api/v1/invoices/caui — returns array of cost records (may be empty). */
  async postCaui(body: Record<string, unknown>): Promise<Record<string, unknown>[]> {
    const r = await this.context.post('/api/v1/invoices/caui', { data: body });
    return r.json();
  }

  /** GET /api/v1/invoices/service-names/distinct — returns array of [name, name] pairs. */
  async getDistinctServiceNames(): Promise<string[][]> {
    const r = await this.context.get('/api/v1/invoices/service-names/distinct');
    return r.json();
  }

  /** GET /api/v1/invoices/service-costs/distinct — returns flat dimension categories (region, service, instancetype, ...). */
  async getDistinctServiceCosts(): Promise<Record<string, string[]>> {
    const r = await this.context.get('/api/v1/invoices/service-costs/distinct');
    return r.json();
  }

  /** GET /api/v1/invoices/service-costs/distinct-k8s — returns K8s dimension categories. */
  async getDistinctK8sCosts(): Promise<Record<string, string[]>> {
    const r = await this.context.get('/api/v1/invoices/service-costs/distinct-k8s');
    return r.json();
  }

  /** GET /api/v1/invoices/service-costs/distinct-tags — returns tag key arrays. */
  async getDistinctTagCosts(): Promise<Record<string, string[]>> {
    const r = await this.context.get('/api/v1/invoices/service-costs/distinct-tags');
    return r.json();
  }

  /** GET /api/v1/budgets/v2/i/ — returns array of budget objects. */
  async getBudgets(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/budgets/v2/i/', { params: { only_metadata: 'true' } });
    return r.json();
  }

  async getPanels(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/custom-dashboard/panels');
    return r.json();
  }

  async getRecommendationsTotal(): Promise<number> {
    const r = await this.context.post('/api/v1/recommendationsNew/list/total', { data: {} });
    return parseInt(await r.text(), 10);
  }

  async getRecommendationCategories(): Promise<{ id: string; name: string }[]> {
    const r = await this.context.post('/api/v1/recommendationsNew/heatmap/dynamicFilter/cat_id', { data: {} });
    const b = await r.json() as { page?: { id: string; name: string }[] };
    return b.page || [];
  }

  async getRecommendationsList(): Promise<{ page?: Record<string, unknown>[] }> {
    const r = await this.context.post('/api/v1/recommendationsNew/list', {
      data: { pageNumber: 1, pageSize: 10, sort: { property: 'annualSavings', direction: 'desc' } },
    });
    return r.json();
  }
}
