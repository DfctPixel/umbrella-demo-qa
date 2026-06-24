import { test, expect } from '@playwright/test';
import { createAuthenticatedContext } from '../../helpers/auth';
import { UmbrellaApiClient } from '../../helpers/api-client';

test.describe('API Cost & Usage @api', () => {
  let api: UmbrellaApiClient;

  test.beforeAll(async () => {
    const { context, tokens } = await createAuthenticatedContext();
    api = new UmbrellaApiClient(context, tokens);
  });

  test('should fetch distinct service names', async () => {
    const services = await api.getDistinctServiceNames();
    expect(services).toBeDefined();
    // The API returns a paginated object, not a raw array
    expect(typeof services).toBe('object');
  });

  test('should fetch distinct service costs', async () => {
    const costs = await api.getDistinctServiceCosts();
    expect(costs).toBeDefined();
    // The API returns a paginated object, not a raw array
    expect(typeof costs).toBe('object');
  });

  test('should post CAUI query and get cost data', async () => {
    const body = {
      granularity: 'Monthly',
      startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      metrics: ['cost'],
      groupBy: ['service'],
    };
    const data = await api.postCaui(body);
    expect(data).toBeDefined();
  });

  test('should fetch cue views', async () => {
    const views = await api.getCueViews();
    expect(views).toBeDefined();
  });

  test('should fetch recommendations heatmap', async () => {
    const heatmap = await api.getRecommendationsHeatmap();
    expect(heatmap).toBeDefined();
  });

  test('should fetch anomaly stats', async () => {
    const stats = await api.getAnomalyStats();
    expect(stats).toBeDefined();
  });

  test('should fetch budgets list', async () => {
    const budgets = await api.getBudgets();
    expect(budgets).toBeDefined();
  });

  test('should fetch default dashboard', async () => {
    const dashboard = await api.getDefaultDashboard();
    expect(dashboard).toBeDefined();
  });

  test('should fetch dashboards list', async () => {
    const dashboards = await api.getDashboards();
    expect(dashboards).toBeDefined();
  });
});
