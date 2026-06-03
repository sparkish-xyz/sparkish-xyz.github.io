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