import { expect, test, type Page } from '@playwright/test';

type AnalyticsEvent = { name: string; params: Record<string, unknown> };
declare global {
  interface Window {
    analyticsTest: {
      config?: Record<string, unknown>;
      events: AnalyticsEvent[];
    };
  }
}

const testConfig = {
  apiKey: 'test-key',
  projectId: 'test-project',
  appId: '1:123456789:web:test',
  measurementId: 'G-TEST1234',
};

async function mockFirebase(page: Page, options: { supported?: boolean; blocked?: boolean } = {}) {
  await page.route('**/assets/firebase-config.js', route => route.fulfill({
    contentType: 'text/javascript',
    body: `export default ${JSON.stringify(testConfig)};`,
  }));
  await page.route('https://www.gstatic.com/firebasejs/**', route => {
    if (options.blocked) return route.abort();
    const body = route.request().url().endsWith('firebase-app.js')
      ? 'export function initializeApp(config) { return { options: config }; }'
      : `
        window.analyticsTest = { events: [] };
        export async function isSupported() { return ${options.supported !== false}; }
        export function initializeAnalytics(app, options) {
          window.analyticsTest.config = options.config;
          return { app };
        }
        export function logEvent(analytics, name, params) {
          window.analyticsTest.events.push({ name, params });
          console.log('analytics-test-event ' + JSON.stringify({ name, params }));
        }
      `;
    return route.fulfill({ contentType: 'text/javascript', body });
  });
}

test('all ten landing pages load analytics; redirects and documents do not', async ({ request }) => {
  const landings = ['/', '/aquatick/ko/', '/aquatick/en/', '/aquatick/ja/', '/alarmcrew/', '/alarmcrew/en/', '/alarmcrew/ja/', '/kinetto/', '/kinetto/ko/', '/kinetto/ja/'];
  for (const path of landings) {
    const html = await (await request.get(path)).text();
    expect(html.match(/<script type="module" src="\/assets\/site-analytics.js"><\/script>/g), path).toHaveLength(1);
  }
  for (const path of ['/aquatick/', '/ko/', '/en/', '/ja/', '/legal/', '/kinetto/privacy/']) {
    expect(await (await request.get(path)).text(), path).not.toContain('/assets/site-analytics.js');
  }
});

test('local visits do not load Firebase even with valid configuration', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => {
    if (request.url().includes('gstatic.com/firebasejs/')) requests.push(request.url());
  });
  await mockFirebase(page);
  await page.goto('/aquatick/ko/');
  await page.waitForLoadState('networkidle');
  expect(requests).toEqual([]);
});

test('production visits log one page view with product and locale without requiring debug mode', async ({ page, request }) => {
  await page.route('https://sparkish-xyz.github.io/**', async route => {
    const url = new URL(route.request().url());
    await route.fulfill({ response: await request.get(url.pathname + url.search) });
  });
  await mockFirebase(page);
  await page.goto('https://sparkish-xyz.github.io/alarmcrew/en/?utm_source=website');
  await expect.poll(() => page.evaluate(() => window.analyticsTest?.events.length)).toBe(1);
  const state = await page.evaluate(() => window.analyticsTest);
  expect(state.config).toEqual({ send_page_view: false });
  expect(state.events[0]).toMatchObject({
    name: 'page_view',
    params: {
      app_name: 'AlarmCrew',
      page_language: 'en',
      page_path: '/alarmcrew/en/',
      page_location: 'https://sparkish-xyz.github.io/alarmcrew/en/?utm_source=website',
    },
  });
  // Finish in-flight asset proxies before Playwright disposes the request fixture.
  await page.unrouteAll({ behavior: 'wait' });
});

test('debug visits track App Store clicks and preserve link navigation', async ({ page }) => {
  const events: AnalyticsEvent[] = [];
  page.on('console', message => {
    const prefix = 'analytics-test-event ';
    if (message.text().startsWith(prefix)) events.push(JSON.parse(message.text().slice(prefix.length)));
  });
  await mockFirebase(page);
  await page.route('https://apps.apple.com/**', route => route.fulfill({ body: 'App Store' }));
  await page.goto('/aquatick/ko/?analytics_debug=1');
  await expect.poll(() => page.evaluate(() => window.analyticsTest?.events.length)).toBe(1);
  expect(await page.evaluate(() => window.analyticsTest.config)).toEqual({ send_page_view: false, debug_mode: true });

  await page.locator('.header-cta').click();
  await expect(page).toHaveURL('https://apps.apple.com/app/aquatick/id6762686013');
  expect(events).toHaveLength(2);
  expect(events[1]).toMatchObject({
    name: 'app_store_click',
    params: { app_name: 'AquaTick', page_language: 'ko', placement: 'header', link_url: 'https://apps.apple.com/app/aquatick/id6762686013' },
  });
});

test('unsupported browsers and blocked SDK requests leave the landing usable', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await mockFirebase(page, { supported: false });
  await page.goto('/kinetto/?analytics_debug=1');
  await page.waitForLoadState('networkidle');
  expect(await page.evaluate(() => window.analyticsTest.events)).toEqual([]);
  await expect(page.locator('h1')).toBeVisible();

  await mockFirebase(page, { blocked: true });
  await page.goto('/kinetto/ko/?analytics_debug=1');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('h1')).toBeVisible();
  expect(errors).toEqual([]);
});
