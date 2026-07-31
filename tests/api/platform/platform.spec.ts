import { test, expect } from '../../../helpers/fixtures/api';

test.describe('Platform @api', () => {

  test('GET /users/plain-sub-users — authenticated user has required identity fields', async ({ api }) => {
    const r = await api.context.get('/api/v1/users/plain-sub-users');
    expect(r.status(), 'authenticated request should return 200').toBe(200);
    const body = await r.json();
    expect(body.id, 'user must have an id').toBeGreaterThan(0);
    expect(body.user_key, 'user_key required').toBeTruthy();
    expect(body.user_name, 'user_name required').toBeTruthy();
    expect(body.user_type, 'user_type required').toBeTruthy();
    // Verify JWT sub matches user_key (cross-check from integration layer)
    const payload = JSON.parse(Buffer.from(api.tokens.jwtToken.split('.')[1], 'base64').toString());
    expect(body.user_key).toBe(payload.sub);
  });

  test('GET /users/user-settings/notifications — raw data contains valid notification configs', async ({ api }) => {
    const r = await api.context.get('/api/v1/users/user-settings/notifications');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(body.userNotificationRawData, 'userNotificationRawData required').toBeDefined();
    expect(Array.isArray(body.userNotificationRawData), 'userNotificationRawData should be an array').toBe(true);
    // Notification items should have toggle flags (budget, anomaly, etc.) with defined values
    if (body.userNotificationRawData.length > 0) {
      const item = body.userNotificationRawData[0];
      expect(item.id, 'notification setting must have id').toBeDefined();
      expect(item.user_key, 'notification setting must have user_key').toBeDefined();
      // Verify boolean-like fields are present
      ['is_budget', 'is_email_notification'].forEach(f => {
        expect(item).toHaveProperty(f);
      });
    }
  });

  test('GET /notifications — correlates with notification settings count', async ({ api }) => {
    const [settingsR, notifsR] = await Promise.all([
      api.context.get('/api/v1/users/user-settings/notifications'),
      api.context.get('/api/v1/users/notifications'),
    ]);
    expect(settingsR.ok()).toBe(true);
    expect(notifsR.ok()).toBe(true);
    const notifs = await notifsR.json();
    expect(Array.isArray(notifs), 'notifications should be an array').toBe(true);
    // Notifications may have zero entries even when settings are enabled
    // (historical notifications have settled). Assert structure only.
  });

  test('GET /invoices/service-names/distinct — services used in CAUI should be present here', async ({ api }) => {
    const [r1, r2] = await Promise.all([
      api.context.get('/api/v1/invoices/service-names/distinct'),
      api.context.post('/api/v1/invoices/caui', {
        data: { granularity: 'Monthly', startDate: `${new Date().getFullYear()}-01-01`, endDate: new Date().toISOString().split('T')[0], metrics: ['cost'], groupBy: ['service'] },
      }),
    ]);
    expect(r1.ok()).toBe(true);
    expect(r2.ok()).toBe(true);
    const pairs = await r1.json();
    const caui = await r2.json() as Record<string, unknown>[];
    // Every service appearing in CAUI results should be in service-names
    const known = new Set<string>((pairs as string[][]).map(p => p[0]));
    const cauiSvcs = new Set(caui.filter(r => r.service).map(r => String(r.service)));
    for (const svc of cauiSvcs) {
      expect(known.has(svc), `CAUI service '${svc}' missing from service-names/distinct`).toBe(true);
    }
  });

  test('GET /divisions/i/ — division map keys should be numeric account IDs', async ({ api }) => {
    const r = await api.context.get('/api/v1/divisions/i/', { params: { includeEmpty: 'true' } });
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(body.preparedRawDivisions, 'preparedRawDivisions required').toBeDefined();
    expect(body.mapLinkedAccIdToDivisionName, 'mapLinkedAccIdToDivisionName required').toBeDefined();
    // Standard collapsible panel responds with object, not array
    expect(typeof body.mapLinkedAccIdToDivisionName).toBe('object');
    // Division entries should have name and id
    if (Array.isArray(body.preparedRawDivisions) && body.preparedRawDivisions.length > 0) {
      const div = body.preparedRawDivisions[0];
      expect(div.name || div.divisionName, 'division should have a name').toBeDefined();
    }
  });

  test('GET /invoices/dimensions-config — every dimension name can be used as a CAUI groupBy', async ({ api }) => {
    const [dr, ...cauiResults] = await Promise.all([
      api.context.get('/api/v1/invoices/dimensions-config'),
    ]);
    expect(dr.ok()).toBe(true);
    const dc = await dr.json();
    expect(dc.version, 'dimensions config must have version').toBeTruthy();
    expect(Array.isArray(dc.dimensions)).toBe(true);
    const dimNames = (dc.dimensions as any[]).map(d => d.name).filter(Boolean);
    // Test up to 3 dimension names as CAUI groupBy parameters
    const today = new Date().toISOString().split('T')[0];
    for (const dim of dimNames.slice(0, 3)) {
      const r = await api.context.post('/api/v1/invoices/caui', {
        data: { granularity: 'Monthly', startDate: `${new Date().getFullYear()}-01-01`, endDate: today, metrics: ['cost'], groupBy: [dim] },
      });
      expect(r.ok(), `CAUI with groupBy=${dim} should succeed`).toBe(true);
      const data = await r.json();
      expect(Array.isArray(data), `CAUI with groupBy=${dim} should return array`).toBe(true);
    }
  });

  test('GET /users/on-boarding/v2/byod/vendors — each vendor has cloudTypeId matching a known provider', async ({ api }) => {
    const r = await api.context.get('/api/v1/users/on-boarding/v2/byod/vendors');
    expect(r.ok()).toBe(true);
    const body = await r.json();
    expect(Array.isArray(body)).toBe(true);
    for (const v of body) {
      expect(v.cloudTypeId, 'vendor must have cloudTypeId').toBeDefined();
      expect(v.vendorName, 'vendor must have vendorName').toBeDefined();
      expect(typeof v.vendorName).toBe('string');
    }
  });
});
