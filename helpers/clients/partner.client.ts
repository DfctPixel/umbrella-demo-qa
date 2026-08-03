import { APIRequestContext } from '@playwright/test';
import { readJson } from './response';

export class PartnerClient {
  constructor(public readonly context: APIRequestContext) {}

  /** GET /api/v1/msp/billing-rules/v2 — returns billing rules. */
  async getBillingRules(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/msp/billing-rules/v2');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/msp/billing-rules/v2');
  }

  /** GET /api/v1/msp/billing-rules/v2/templates — returns billing rule templates. */
  async getBillingRuleTemplates(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/msp/billing-rules/v2/templates');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/msp/billing-rules/v2/templates');
  }

  /** GET /api/v1/divisions/customers/aws/costs/ — returns customer AWS costs with optional query params. */
  async getCustomerCosts(params: Record<string, string>): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/divisions/customers/aws/costs/', { params });
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/divisions/customers/aws/costs/');
  }

  /** GET /api/v1/divisions/customers/aws/credit — returns customer credit information. */
  async getCustomerCredit(): Promise<Record<string, unknown>> {
    const r = await this.context.get('/api/v1/divisions/customers/aws/credit');
    return readJson<Record<string, unknown>>(r, 'GET /api/v1/divisions/customers/aws/credit');
  }

  /** GET /api/v1/divisions/customers/credit/alerts — returns customer credit alerts. */
  async getCustomerCreditAlerts(): Promise<Record<string, unknown>[]> {
    const r = await this.context.get('/api/v1/divisions/customers/credit/alerts');
    return readJson<Record<string, unknown>[]>(r, 'GET /api/v1/divisions/customers/credit/alerts');
  }
}
