import { test, expect } from '../../../helpers/fixtures/api';

test.describe('Data Integrity @api', () => {

  test('Recommendation savings should be non-negative across all list items', {
    annotation: { type: 'issue', description: 'DEFECT-API-500-RECOMMENDATIONS' },
  }, async ({ api }) => {
    test.fail(true, 'DEFECT-API-500-RECOMMENDATIONS');
    // Known defect (CI run 30856482709): /recommendationsNew/list returns 500
    // whenever the sort field is present, even for valid pagination. The guard
    // throws instead of letting this invariant pass vacuously on an error body.
    const recs = await api.costUsage.getRecommendationsList();
    const items = recs.page || [];
    for (const item of items) {
      const annSavings = Number(item.annualSavings ?? NaN);
      if (!Number.isNaN(annSavings)) {
        expect(annSavings, 'annualSavings must be >= 0').toBeGreaterThanOrEqual(0);
      }
      const monSavings = Number(item.monthlySavings ?? NaN);
      if (!Number.isNaN(monSavings)) {
        expect(monSavings, 'monthlySavings must be >= 0').toBeGreaterThanOrEqual(0);
        // Annual savings should be >= 12× monthly (roughly)
        if (annSavings > 0 && monSavings > 0) {
          expect(annSavings, 'annualSavings should be ~12× monthlySavings').toBeGreaterThanOrEqual(monSavings * 10);
          expect(annSavings).toBeLessThanOrEqual(monSavings * 14);
        }
      }
    }
  });

  test('Anomaly stats should be non-negative and consistent', async ({ api }) => {
    const s = await api.finops.getAnomalyStats();
    expect(s.openAnomalies, 'openAnomalies must be present').toBeDefined();
    expect(s.impact, 'impact must be present').toBeDefined();
    const { openAnomalies = 0, impact = 0 } = s;
    expect(openAnomalies).toBeGreaterThanOrEqual(0);
    expect(impact).toBeGreaterThanOrEqual(0);
    if (openAnomalies > 0) {
      expect(impact, 'anomalies > 0 implies impact > 0').toBeGreaterThan(0);
    }
  });

  test('Service costs keys should be consistent between distinct and distinct-tags endpoints', async ({ api }) => {
    const costs = await api.costUsage.getDistinctServiceCosts();
    const tags = await api.costUsage.getDistinctTagCosts();
    // Both should return objects with array-valued keys
    const costKeys = Object.keys(costs).filter(k => Array.isArray(costs[k as keyof typeof costs]));
    const tagKeys = Object.keys(tags).filter(k => Array.isArray(tags[k as keyof typeof tags]));
    expect(costKeys.length, 'distinct service costs should have array-valued keys').toBeGreaterThan(0);
    expect(tagKeys.length, 'distinct tags should have array-valued keys').toBeGreaterThan(0);
  });

  test('K8s cost dimensions should be a proper subset of cloud cost dimensions', async ({ api }) => {
    const k8s = await api.costUsage.getDistinctK8sCosts();
    const costs = await api.costUsage.getDistinctServiceCosts();
    expect(k8s.namespace, 'k8s must have namespace dimension').toBeDefined();
    expect(Array.isArray(k8s.namespace)).toBe(true);

    const k8sKeys = Object.keys(k8s).filter(k => Array.isArray(k8s[k as keyof typeof k8s]));
    const costsKeys = Object.keys(costs).filter(k => Array.isArray(costs[k as keyof typeof costs]));

    expect(k8sKeys.length, 'K8s dimensions must include at least namespace').toBeGreaterThan(0);

    // Shared dimensions (e.g. service, region) should have subset values.
    // K8s-specific dimensions (namespace, cluster, pod) are valid only in K8s
    // and may be empty when the tenant has no K8s workload data.
    for (const key of k8sKeys) {
      if (!costsKeys.includes(key)) {
        continue;
      }
      const k8sSet = new Set(k8s[key] as string[]);
      const costsSet = new Set(costs[key] as string[]);
      for (const val of k8sSet) {
        expect(costsSet.has(val), `K8s ${key}="${val}" must appear in cloud cost ${key}`).toBe(true);
      }
    }
  });
});
