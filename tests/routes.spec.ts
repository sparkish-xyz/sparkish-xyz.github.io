import { test, expect } from '@playwright/test';

test.describe('Sparkish site routes', () => {
  test('hub links to AquaTick', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Playful tools/i })).toBeVisible();
    await page.getByRole('link', { name: /View AquaTick/i }).click();
    await expect(page).toHaveURL(/\/aquatick\/(ko|en|ja)\/?$/);
  });

  test('hub JSON-LD includes Organization and MobileApplication', async ({ page }) => {
    await page.goto('/');
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toContain('"@type": "Organization"');
    expect(jsonLd).toContain('"@type": "MobileApplication"');
    expect(jsonLd).toContain('AquaTick');
    expect(jsonLd).toContain('Korea Map Link');
    expect(jsonLd).toContain('for first-time trips');
  });

  test('hub links to Korea Map Link', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /View Korea Map Link/i }).click();
    await expect(page).toHaveURL(/\/korea-map-link\/(en|ko|ja|zh-Hans|zh-Hant)\/?$/);
  });

  test('legacy /ko/ redirects and seeds aquaLangPref', async ({ page }) => {
    await page.goto('/ko/');
    await expect(page).toHaveURL(/\/aquatick\/ko\/?$/);
    const pref = await page.evaluate(() => localStorage.getItem('aquaLangPref'));
    expect(pref).toBe('ko');
  });

  test('legacy /en/ redirects and seeds aquaLangPref', async ({ page }) => {
    await page.goto('/en/');
    await expect(page).toHaveURL(/\/aquatick\/en\/?$/);
    const pref = await page.evaluate(() => localStorage.getItem('aquaLangPref'));
    expect(pref).toBe('en');
  });

  test('legacy /ja/ redirects and seeds aquaLangPref', async ({ page }) => {
    await page.goto('/ja/');
    await expect(page).toHaveURL(/\/aquatick\/ja\/?$/);
    const pref = await page.evaluate(() => localStorage.getItem('aquaLangPref'));
    expect(pref).toBe('ja');
  });

  test('locale page does not bounce away from direct URL', async ({ page }) => {
    await page.goto('/aquatick/ko/');
    await expect(page).toHaveURL(/\/aquatick\/ko\/?$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('locale path without trailing slash seeds aquaLangPref', async ({ page }) => {
    await page.goto('/aquatick/ko');
    await expect(page).toHaveURL(/\/aquatick\/ko\/?$/);
    const pref = await page.evaluate(() => localStorage.getItem('aquaLangPref'));
    expect(pref).toBe('ko');
  });

  test('chooser honors stored language preference', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('aquaLangPref', 'ja');
    });
    await page.goto('/aquatick/');
    await expect(page).toHaveURL(/\/aquatick\/ja\/?$/);
  });

  test('chooser redirects from /aquatick/index.html', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('aquaLangPref', 'ko');
    });
    await page.goto('/aquatick/index.html');
    await expect(page).toHaveURL(/\/aquatick\/ko\/?$/);
  });

  test('chooser uses navigator.language when no stored pref', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('aquaLangPref');
      Object.defineProperty(navigator, 'language', {
        get: () => 'en-US',
        configurable: true,
      });
    });
    await page.goto('/aquatick/');
    await expect(page).toHaveURL(/\/aquatick\/en\/?$/);
  });

  test('legacy /assets/ icon returns 200', async ({ request }) => {
    const res = await request.get('/assets/aquatick-app-icon.png');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/image/);
  });

  test('canonical /aquatick/assets/ icon returns 200', async ({ request }) => {
    const res = await request.get('/aquatick/assets/aquatick-app-icon.png');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/image/);
  });

  test('Korea Map Link privacy and support pages load', async ({ page }) => {
    await page.goto('/korea-map-link/privacy/');
    await expect(page.getByRole('heading', { name: /Privacy Policy/i })).toBeVisible();
    await page.goto('/korea-map-link/support/');
    await expect(page.getByRole('heading', { name: /^Support$/i })).toBeVisible();
  });

  test('Korea Map Link chooser redirects to English by default', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('kmbLangPref');
      Object.defineProperty(navigator, 'language', {
        get: () => 'en-US',
        configurable: true,
      });
    });
    await page.goto('/korea-map-link/');
    await expect(page).toHaveURL(/\/korea-map-link\/en\/?$/);
  });

  test('Korea Map Link chooser uses navigator.language for Korean', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('kmbLangPref');
      Object.defineProperty(navigator, 'language', {
        get: () => 'ko-KR',
        configurable: true,
      });
    });
    await page.goto('/korea-map-link/');
    await expect(page).toHaveURL(/\/korea-map-link\/ko\/?$/);
  });

  test('Korea Map Link chooser uses navigator.language for Japanese', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('kmbLangPref');
      Object.defineProperty(navigator, 'language', {
        get: () => 'ja-JP',
        configurable: true,
      });
    });
    await page.goto('/korea-map-link/');
    await expect(page).toHaveURL(/\/korea-map-link\/ja\/?$/);
  });

  test('Korea Map Link chooser maps zh-TW to Traditional Chinese', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('kmbLangPref');
      Object.defineProperty(navigator, 'language', {
        get: () => 'zh-TW',
        configurable: true,
      });
    });
    await page.goto('/korea-map-link/');
    await expect(page).toHaveURL(/\/korea-map-link\/zh-Hant\/?$/);
  });

  test('Korea Map Link chooser maps zh-CN to Simplified Chinese', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('kmbLangPref');
      Object.defineProperty(navigator, 'language', {
        get: () => 'zh-CN',
        configurable: true,
      });
    });
    await page.goto('/korea-map-link/');
    await expect(page).toHaveURL(/\/korea-map-link\/zh-Hans\/?$/);
  });

  test('Korea Map Link chooser honors stored language preference', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kmbLangPref', 'ja');
    });
    await page.goto('/korea-map-link/');
    await expect(page).toHaveURL(/\/korea-map-link\/ja\/?$/);
  });

  test('Korea Map Link locale page does not bounce away from direct URL', async ({ page }) => {
    await page.goto('/korea-map-link/ko/');
    await expect(page).toHaveURL(/\/korea-map-link\/ko\/?$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Korea Map Link locale path seeds kmbLangPref', async ({ page }) => {
    await page.goto('/korea-map-link/zh-Hans/');
    await expect(page).toHaveURL(/\/korea-map-link\/zh-Hans\/?$/);
    const pref = await page.evaluate(() => localStorage.getItem('kmbLangPref'));
    expect(pref).toBe('zh-Hans');
  });

  test('Korea Map Link app icon returns 200', async ({ request }) => {
    const res = await request.get('/korea-map-link/assets/app-icon.png');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/image/);
  });

  test('Korea Map Link screenshots return 200', async ({ request }) => {
    const screenshots = [
      'screenshot-home.png',
      'screenshot-resolve.png',
      'screenshot-place-detail.png',
      'screenshot-taxi.png',
    ];
    for (const name of screenshots) {
      const res = await request.get(`/korea-map-link/assets/${name}`);
      expect(res.status(), name).toBe(200);
      expect(res.headers()['content-type'], name).toMatch(/image/);
    }
  });

  test('mirrored /assets/ screenshots return 200', async ({ request }) => {
    const screenshots = [
      'screenshot-iphone-home.png',
      'screenshot-iphone-history.png',
      'screenshot-watch-home.png',
      'screenshot-iphone-settings.png',
    ];
    for (const name of screenshots) {
      const res = await request.get(`/assets/${name}`);
      expect(res.status(), name).toBe(200);
      expect(res.headers()['content-type'], name).toMatch(/image/);
    }
  });
});