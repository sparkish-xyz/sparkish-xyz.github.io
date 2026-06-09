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
    expect(jsonLd).toContain('ad-free taxi card');
  });

  test('hub links to Korea Map Link', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /View Korea Map Link/i }).click();
    await expect(page).toHaveURL(/\/korea-map-link\/(en|fr|ko|ja|zh-Hans|zh-Hant)\/?$/);
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

  test('AquaTick screenshot strip starts with the first card visible', async ({ page }) => {
    await page.setViewportSize({ width: 720, height: 800 });
    await page.goto('/aquatick/ko/');
    await page.locator('#film').scrollIntoViewIfNeeded();

    const metrics = await page.locator('.film-strip').evaluate((strip) => {
      const firstCard = strip.querySelector('.film-card');
      if (!firstCard) {
        throw new Error('Missing screenshot card');
      }

      const stripRect = strip.getBoundingClientRect();
      const firstRect = firstCard.getBoundingClientRect();

      return {
        stripLeft: Math.round(stripRect.left),
        firstLeft: Math.round(firstRect.left),
        pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(metrics.firstLeft).toBeGreaterThanOrEqual(metrics.stripLeft);
    expect(metrics.pageOverflow).toBe(0);
  });

  test('Japanese AquaTick hero remains readable at tablet width', async ({ page }) => {
    await page.setViewportSize({ width: 720, height: 900 });
    await page.goto('/aquatick/ja/');

    const metrics = await page.evaluate(() => {
      const h1 = document.querySelector('.hero h1');
      const firstButton = document.querySelector('.hero-actions .btn');
      const actions = document.querySelector('.hero-actions');
      if (!h1 || !firstButton || !actions) {
        throw new Error('Missing Japanese hero content');
      }

      const h1Rect = h1.getBoundingClientRect();
      const buttonRect = firstButton.getBoundingClientRect();
      const buttonTextRange = document.createRange();
      buttonTextRange.selectNodeContents(firstButton);
      const buttonLineCount = new Set(
        Array.from(buttonTextRange.getClientRects(), (rect) => Math.round(rect.top)),
      ).size;

      return {
        h1Height: Math.round(h1Rect.height),
        buttonWidth: Math.round(buttonRect.width),
        buttonLineCount,
        actionsDirection: getComputedStyle(actions).flexDirection,
        pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(metrics.h1Height).toBeLessThanOrEqual(150);
    expect(metrics.buttonWidth).toBeGreaterThanOrEqual(280);
    expect(metrics.buttonLineCount).toBeLessThanOrEqual(1);
    expect(metrics.actionsDirection).toBe('column');
    expect(metrics.pageOverflow).toBe(0);
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

  test('Korea Map Link chooser uses navigator.language for French', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('kmbLangPref');
      Object.defineProperty(navigator, 'language', {
        get: () => 'fr-FR',
        configurable: true,
      });
    });
    await page.goto('/korea-map-link/');
    await expect(page).toHaveURL(/\/korea-map-link\/fr\/?$/);
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
      'screenshot-onboarding.png',
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

  test('Korea Map Link locale pages keep meta and JSON-LD descriptions in sync', async ({ page }) => {
    const locales = ['en', 'fr', 'ko', 'ja', 'zh-Hans', 'zh-Hant'] as const;

    for (const locale of locales) {
      await page.goto(`/korea-map-link/${locale}/`);
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
      const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content');
      const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
      const json = JSON.parse(jsonLd ?? '{}') as {
        '@graph'?: Array<{ description?: string }>;
      };
      const jsonDescription = json['@graph']?.[0]?.description;

      expect(metaDescription, locale).toBeTruthy();
      expect(metaDescription, locale).toBe(ogDescription);
      expect(metaDescription, locale).toBe(twitterDescription);
      expect(metaDescription, locale).toBe(jsonDescription);
    }
  });

  test('Korea Map Link locale pages keep FAQ and screenshot structure in parity', async ({ page }) => {
    const locales = ['en', 'fr', 'ko', 'ja', 'zh-Hans', 'zh-Hant'] as const;
    const counts = [];

    for (const locale of locales) {
      await page.goto(`/korea-map-link/${locale}/`);
      counts.push({
        locale,
        details: await page.locator('section.faq details').count(),
        figures: await page.locator('section.shots figure').count(),
      });
    }

    const expectedDetails = counts[0].details;
    const expectedFigures = counts[0].figures;

    for (const entry of counts) {
      expect(entry.details, entry.locale).toBe(expectedDetails);
      expect(entry.figures, entry.locale).toBe(expectedFigures);
    }

    expect(expectedDetails).toBe(5);
    expect(expectedFigures).toBe(5);
  });

  test('Korea Map Link screenshots keep expected dimensions', async ({ request }) => {
    const screenshots = [
      'screenshot-onboarding.png',
      'screenshot-home.png',
      'screenshot-resolve.png',
      'screenshot-place-detail.png',
      'screenshot-taxi.png',
    ];

    for (const name of screenshots) {
      const res = await request.get(`/korea-map-link/assets/${name}`);
      expect(res.status(), name).toBe(200);

      const body = await res.body();
      const width = body.readUInt32BE(16);
      const height = body.readUInt32BE(20);

      expect(width, name).toBe(1320);
      expect(height, name).toBe(2868);
    }
  });

  test('Korea Map Link locale pages keep title tags in sync with social titles', async ({ page }) => {
    const locales = ['en', 'fr', 'ko', 'ja', 'zh-Hans', 'zh-Hant'] as const;

    for (const locale of locales) {
      await page.goto(`/korea-map-link/${locale}/`);
      const title = await page.title();
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');

      expect(title, locale).toBeTruthy();
      expect(title, locale).toBe(ogTitle);
      expect(title, locale).toBe(twitterTitle);
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
