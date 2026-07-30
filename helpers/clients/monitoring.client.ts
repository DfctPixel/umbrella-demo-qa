import { APIRequestContext } from '@playwright/test';

export class MonitoringClient {
  constructor(public readonly context: APIRequestContext) {}

  /** GET /api/v1/anomaly-detection — returns anomaly detection response with optional query params. */
  async getAnomalyDetectionList(params: Record<string, string>): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/anomaly-detection', { params });
    return r.json();
  }

  /** GET /api/v1/anomaly-detection?isPageCount=true — returns anomaly detection page count. */
  async getAnomalyDetectionPageCount(params: Record<string, string>): Promise<{ count: number }> {
    const r = await this.context.get('/api/v1/anomaly-detection', {
      params: { ...params, isPageCount: 'true' },
    });
    return r.json();
  }

  /** GET /api/v1/anomaly-detection?alerted=true — returns alerted anomalies. */
  async getAnomalyDetectionAlerted(params: Record<string, string>): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/anomaly-detection', {
      params: { ...params, alerted: 'true' },
    });
    return r.json();
  }

  /** GET /api/v1/anomaly-detection/rules — returns anomaly alert rules array. */
  async getAnomalyAlertRules(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/anomaly-detection/rules');
    return r.json();
  }

  /** GET /api/v1/usage/alerts — returns usage alerts. */
  async getUsageAlerts(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/usage/alerts');
    return r.json();
  }
}
