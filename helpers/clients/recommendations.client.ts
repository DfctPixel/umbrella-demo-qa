import { APIRequestContext } from '@playwright/test';
import { readJson } from './response';

export class RecommendationsClient {
  constructor(public readonly context: APIRequestContext) {}

  /** POST /api/v1/recommendationsNew/heatmap — returns recommendations heatmap data. */
  async getRecommendationsHeatmap(): Promise<Record<string, unknown>> {
    const r = await this.context.post('/api/v1/recommendationsNew/heatmap', { data: {} });
    return readJson<Record<string, unknown>>(r, 'POST /api/v1/recommendationsNew/heatmap');
  }

  /** POST /api/v1/recommendationsNew/heatmap/summary — returns heatmap summary. */
  async postHeatmapSummary(): Promise<Record<string, unknown>> {
    const r = await this.context.post('/api/v1/recommendationsNew/heatmap/summary', { data: {} });
    return readJson<Record<string, unknown>>(r, 'POST /api/v1/recommendationsNew/heatmap/summary');
  }

  /** POST /api/v1/recommendationsNew/heatmap/dynamicFilter/{filterName} — returns filter values for a given filter name. */
  async postHeatmapDynamicFilter(filterName: string): Promise<Record<string, unknown>> {
    const r = await this.context.post(
      `/api/v1/recommendationsNew/heatmap/dynamicFilter/${filterName}`,
      { data: {} },
    );
    return readJson<Record<string, unknown>>(
      r,
      `POST /api/v1/recommendationsNew/heatmap/dynamicFilter/${filterName}`,
    );
  }

  /** POST /api/v1/recommendationsNew/heatmap/dynamicRanges — returns dynamic range definitions. */
  async postHeatmapDynamicRanges(): Promise<Record<string, unknown>> {
    const r = await this.context.post('/api/v1/recommendationsNew/heatmap/dynamicRanges', { data: {} });
    return readJson<Record<string, unknown>>(r, 'POST /api/v1/recommendationsNew/heatmap/dynamicRanges');
  }

  /** POST /api/v1/recommendationsNew/heatmap/dynamicFilter/service?invoiceMode={invoiceMode} — returns service filter values for the given invoice mode. */
  async postHeatmapDynamicFilterService(invoiceMode: string): Promise<Record<string, unknown>> {
    const r = await this.context.post(
      '/api/v1/recommendationsNew/heatmap/dynamicFilter/service',
      { data: {}, params: { invoiceMode } },
    );
    return readJson<Record<string, unknown>>(
      r,
      'POST /api/v1/recommendationsNew/heatmap/dynamicFilter/service',
    );
  }

  /** POST /api/v1/recommendationsNew/heatmap/dynamicFilter/type_id?invoiceMode={invoiceMode} — returns type_id filter values for the given invoice mode. */
  async postHeatmapDynamicFilterTypeId(invoiceMode: string): Promise<Record<string, unknown>> {
    const r = await this.context.post(
      '/api/v1/recommendationsNew/heatmap/dynamicFilter/type_id',
      { data: {}, params: { invoiceMode } },
    );
    return readJson<Record<string, unknown>>(
      r,
      'POST /api/v1/recommendationsNew/heatmap/dynamicFilter/type_id',
    );
  }

  /** GET /api/v1/recommendationsNew/heatmap/groupByOptions — returns available group-by options. */
  async getHeatmapGroupByOptions(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/recommendationsNew/heatmap/groupByOptions');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/recommendationsNew/heatmap/groupByOptions');
  }

  /** POST /api/v1/recommendationsNew/list — returns paginated recommendations list. */
  async getRecommendationsList(params: Record<string, unknown>): Promise<Record<string, unknown>> {
    const r = await this.context.post('/api/v1/recommendationsNew/list', { data: params });
    return readJson<Record<string, unknown>>(r, 'POST /api/v1/recommendationsNew/list');
  }

  /** POST /api/v1/recommendationsNew/list/columns — returns column definitions for the recommendations list. */
  async getRecommendationsListColumns(): Promise<Record<string, unknown>[]> {
    const r = await this.context.post('/api/v1/recommendationsNew/list/columns', { data: {} });
    return readJson<Record<string, unknown>[]>(r, 'POST /api/v1/recommendationsNew/list/columns');
  }

  /** GET /api/v1/recommendationsNew/views — returns available recommendations views. */
  async getRecommendationsViews(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/recommendationsNew/views');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/recommendationsNew/views');
  }

  /** GET /api/v1/recommendations/report — returns the recommendations report. */
  async getRecommendationsReport(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/recommendations/report');
    return readJson<Record<string, unknown>>(r, 'GET /api/v1/recommendations/report');
  }
}
