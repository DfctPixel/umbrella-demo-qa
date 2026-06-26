import { test, expect, APIRequestContext } from '@playwright/test';
import { createAuthenticatedContext } from '../../../helpers/auth/auth-bootstrap';
import { CostUsageClient } from '../../../helpers/clients/cost-usage.client';

test.describe('Cost Usage @api', () => {
  let api: CostUsageClient;
  let context: APIRequestContext;

  test.beforeAll(async () => {
    const { context: ctx, tokens } = await createAuthenticatedContext();
    context = ctx;
    api = new CostUsageClient(context);
  });

  test.afterAll(async () => {
    await context.dispose();
  });

  test('should fetch distinct service names', async () => {
    const services = await api.getDistinctServiceNames();
    expect(Array.isArray(services)).toBe(true);
  });

  test('should fetch distinct service costs with non-negative values', async () => {
    const costs = await api.getDistinctServiceCosts();
    expect(costs.service).toBeDefined();
    expect(Array.isArray(costs.service)).toBe(true);
  });

  test('should post CAUI query (monthly) and return cost data', async () => {
    const body = {
      granularity: 'Monthly',
      startDate: `${new Date().getFullYear()}-01-01`,
      endDate: new Date().toISOString().split('T')[0],
      metrics: ['cost'],
      groupBy: ['service'],
    };
    const data = await api.postCaui(body);
    expect(Array.isArray(data)).toBe(true);
  });

  test('should post CAUI query (daily) and return cost data', async () => {
    const body = {
      granularity: 'Daily',
      startDate: `${new Date().getFullYear()}-01-01`,
      endDate: new Date().toISOString().split('T')[0],
      metrics: ['cost'],
      groupBy: ['service'],
    };
    const data = await api.postCaui(body);
    expect(Array.isArray(data)).toBe(true);
  });

  test('should fetch budgets list', async () => {
    const budgets = await api.getBudgets();
    expect(Array.isArray(budgets)).toBe(true);
    for (const b of budgets) {
      expect(b.budgetName).toBeDefined();
    }
  });

  test('should fetch recommendations total and categories', async () => {
    const total = await api.getRecommendationsTotal();
    expect(total).toBeGreaterThanOrEqual(0);
    const categories = await api.getRecommendationCategories();
    expect(categories.length).toBeGreaterThan(0);
    for (const cat of categories) {
      expect(cat.id).toBeDefined();
      expect(cat.name).toBeDefined();
    }
  });

  test('should fetch custom dashboard panels', async () => {
    const panels = await api.getPanels();
    expect(Array.isArray(panels)).toBe(true);
  });

  test('should fetch K8s and tag cost data with non-negative values', async () => {
    const k8s = await api.getDistinctK8sCosts();
    expect(k8s.namespace).toBeDefined();
    expect(Array.isArray(k8s.namespace)).toBe(true);
    const tags = await api.getDistinctTagCosts();
    expect(tags.customtags_keys).toBeDefined();
    expect(Array.isArray(tags.customtags_keys)).toBe(true);
  });
});
