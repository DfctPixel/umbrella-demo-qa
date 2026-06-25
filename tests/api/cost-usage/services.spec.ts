import { test, expect } from '@playwright/test';
import { createAuthenticatedContext } from '../../../helpers/auth/auth-bootstrap';
import { CostUsageClient } from '../../../helpers/clients/cost-usage.client';

test.describe('Cost Usage @api', () => {
  let api: CostUsageClient;

  test.beforeAll(async () => {
    const { context, tokens } = await createAuthenticatedContext();
    api = new CostUsageClient(context, tokens);
  });

  test('should fetch distinct service names', async () => {
    const services = await api.getDistinctServiceNames();
    expect(services).toBeDefined();
    if (services.services && services.services.length > 0) {
      expect(typeof services.services[0].serviceName).toBe('string');
    }
  });

  test('should fetch distinct service costs with non-negative values', async () => {
    const costs = await api.getDistinctServiceCosts();
    expect(costs).toBeDefined();
    if (costs.services && costs.services.length > 0) {
      for (const svc of costs.services) {
        expect(svc.serviceName).toBeDefined();
        if (svc.cost !== undefined) {
          expect(svc.cost).toBeGreaterThanOrEqual(0);
        }
      }
    }
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
    expect(data).toBeDefined();
    if (data.totalCost !== undefined) {
      expect(data.totalCost).toBeGreaterThanOrEqual(0);
    }
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
    expect(data).toBeDefined();
    if (data.totalCost !== undefined) {
      expect(data.totalCost).toBeGreaterThanOrEqual(0);
    }
  });

  test('should fetch budgets list', async () => {
    const budgets = await api.getBudgets();
    expect(budgets).toBeDefined();
    if (budgets.budgets && budgets.budgets.length > 0) {
      for (const b of budgets.budgets) {
        expect(b.id).toBeDefined();
        expect(b.name).toBeDefined();
      }
    }
  });

  test('should fetch recommendations total and categories', async () => {
    const total = await api.getRecommendationsTotal();
    expect(typeof total).toBe('number');
    expect(total).toBeGreaterThanOrEqual(0);
    const categories = await api.getRecommendationCategories();
    expect(Array.isArray(categories)).toBeTruthy();
    for (const cat of categories) {
      expect(cat.id).toBeDefined();
      expect(cat.name).toBeDefined();
    }
  });

  test('should fetch custom dashboard panels', async () => {
    const panels = await api.getPanels();
    expect(Array.isArray(panels)).toBeTruthy();
    if (panels.length > 0) {
      expect(panels[0].uuid).toBeDefined();
      expect(typeof panels[0].uuid).toBe('string');
    }
  });

  test('should fetch K8s and tag cost data with non-negative values', async () => {
    const k8s = await api.getDistinctK8sCosts();
    expect(k8s).toBeDefined();
    if (k8s.services && k8s.services.length > 0) {
      for (const svc of k8s.services) {
        if (svc.cost !== undefined) expect(svc.cost).toBeGreaterThanOrEqual(0);
      }
    }
    const tags = await api.getDistinctTagCosts();
    expect(tags).toBeDefined();
  });
});
