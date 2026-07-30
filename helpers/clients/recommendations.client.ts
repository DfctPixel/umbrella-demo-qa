import { APIRequestContext } from '@playwright/test';

export class RecommendationsClient {
  constructor(public readonly context: APIRequestContext) {}

  /** POST /api/v1/recommendationsNew/heatmap — returns recommendations heatmap data. */
  async getRecommendationsHeatmap(): Promise<Record<string, unknown>> {
    const r = await this.context.post('/api/v1/recommendationsNew/heatmap', { data: {} });
    return r.json();
  }

  /** POST /api/v1/recommendationsNew/heatmap/summary — returns heatmap summary. */
  async postHeatmapSummary(): Promise<Record<string, unknown>> {
    const r = await this.context.post('/api/v1/recommendationsNew/heatmap/summary', { data: {} });
    return r.json();
  }

  /** POST /api/v1/recommendationsNew/heatmap/dynamicFilter/{filterName} — returns filter values for a given filter name. */
  async postHeatmapDynamicFilter(filterName: string): Promise<Record<string, unknown>> {
    const r = await this.context.post(
      `/api/v1/recommendationsNew/heatmap/dynamicFilter/${filterName}`,
      { data: {} },
    );
    return r.json();
  }

  /** POST /api/v1/recommendationsNew/heatmap/dynamicRanges — returns dynamic range definitions. */
  async postHeatmapDynamicRanges(): Promise<Record<string, unknown>> {
    const r = await this.context.post('/api/v1/recommendationsNew/heatmap/dynamicRanges', { data: {} });
    return r.json();
  }

  /** POST /api/v1/recommendationsNew/heatmap/dynamicFilter/service?invoiceMode={invoiceMode} — returns service filter values for the given invoice mode. */
  async postHeatmapDynamicFilterService(invoiceMode: string): Promise<Record<string, unknown>> {
    const r = await this.context.post(
      '/api/v1/recommendationsNew/heatmap/dynamicFilter/service',
      { data: {}, params: { invoiceMode } },
    );
    return r.json();
  }

  /** POST /api/v1/recommendationsNew/heatmap/dynamicFilter/type_id?invoiceMode={invoiceMode} — returns type_id filter values for the given invoice mode. */
  async postHeatmapDynamicFilterTypeId(invoiceMode: string): Promise<Record<string, unknown>> {
    const r = await this.context.post(
      '/api/v1/recommendationsNew/heatmap/dynamicFilter/type_id',
      { data: {}, params: { invoiceMode } },
    );
    return r.json();
  }

  /** GET /api/v1/recommendationsNew/heatmap/groupByOptions — returns available group-by options. */
  async getHeatmapGroupByOptions(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/recommendationsNew/heatmap/groupByOptions');
    return r.json();
  }

  /** POST /api/v1/recommendationsNew/list — returns paginated recommendations list. */
  async getRecommendationsList(params: Record<string, unknown>): Promise<Record<string, unknown>> {
    const r = await this.context.post('/api/v1/recommendationsNew/list', { data: params });
    return r.json();
  }

  /** POST /api/v1/recommendationsNew/list/columns — returns column definitions for the recommendations list. */
  async getRecommendationsListColumns(): Promise<Record<string, unknown>[]> {
    const r = await this.context.post('/api/v1/recommendationsNew/list/columns', { data: {} });
    return r.json();
  }

  /** GET /api/v1/recommendationsNew/views — returns available recommendations views. */
  async getRecommendationsViews(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/recommendationsNew/views');
    return r.json();
  }

  /** GET /api/v1/recommendations/report — returns the recommendations report. */
  async getRecommendationsReport(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/recommendations/report');
    return r.json();
  }
}
