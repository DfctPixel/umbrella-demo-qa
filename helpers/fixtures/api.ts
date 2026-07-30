import { test as base, expect } from '@playwright/test';
import { APIRequestContext } from '@playwright/test';
import { createAuthenticatedContext } from '../auth/auth-bootstrap';
import { AuthTokens, TenantCapability } from '../auth/types';
import { DashboardClient } from '../clients/dashboard.client';
import { MonitoringClient } from '../clients/monitoring.client';
import { RecommendationsClient } from '../clients/recommendations.client';
import { PartnerClient } from '../clients/partner.client';
import { PlatformClient } from '../clients/platform.client';
import { CostUsageClient } from '../clients/cost-usage.client';
import { FinOpsClient } from '../clients/finops.client';

export interface ApiFixture {
  context: APIRequestContext;
  tokens: AuthTokens;
  capability: TenantCapability;
  dashboard: DashboardClient;
  monitoring: MonitoringClient;
  recommendations: RecommendationsClient;
  partner: PartnerClient;
  platform: PlatformClient;
  costUsage: CostUsageClient;
  finops: FinOpsClient;
}

const test = base.extend<{}, { api: ApiFixture }>({
  api: [async ({}, use) => {
    const { context, tokens, capability } = await createAuthenticatedContext();
    const fixture: ApiFixture = {
      context,
      tokens,
      capability,
      dashboard: new DashboardClient(context),
      monitoring: new MonitoringClient(context),
      recommendations: new RecommendationsClient(context),
      partner: new PartnerClient(context),
      platform: new PlatformClient(context),
      costUsage: new CostUsageClient(context),
      finops: new FinOpsClient(context),
    };
    await use(fixture);
    await context.dispose();
  }, { scope: 'worker' }],
});

export { test, expect };
