import { expect, test } from '@playwright/test';
import {
  AQUATICK_IMAGE_ASSETS,
  AQUATICK_LOCALES,
  AQUATICK_SCREENSHOTS,
  BASE_URL,
  aquatickUrl,
  expectHtmlRoute,
  expectImageResponse,
  localStorageValue,
  requiredAttribute,
  sha256,
} from './support/site-contracts';

test.describe('AquaTick route contracts', () => {
  test('legacy locale redirects seed aquaLangPref', async ({ page }) => {
    for (const locale of AQUATICK_LOCALES) {
      await page.goto(`/${locale}/`);
      await expect(page, locale).toHaveURL(new RegExp(`/aquatick/${locale}/?$`));
      await expect.poll(() => localStorageValue(page, 'aquaLangPref'), { message: locale }).toBe(locale);
    }
  });

  test('locale pages do not bounce and seed aquaLangPref', async ({ page }) => {
    for (const locale of AQUATICK_LOCALES) {
      await page.goto(`/aquatick/${locale}/`);
      await expect(page, locale).toHaveURL(new RegExp(`/aquatick/${locale}/?$`));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect.poll(() => localStorageValue(page, 'aquaLangPref'), { message: locale }).toBe(locale);
    }
  });

  test('locale path without trailing slash seeds aquaLangPref', async ({ page }) => {
    await page.goto('/aquatick/ko');
    await expect(page).toHaveURL(/\/aquatick\/ko\/?$/);
    const pref = await localStorageValue(page, 'aquaLangPref');
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

  test('route inventory stays available', async ({ request }) => {
    await expectHtmlRoute(request, '/aquatick/');
    for (const locale of AQUATICK_LOCALES) {
      await expectHtmlRoute(request, `/aquatick/${locale}/`);
    }
    for (const locale of AQUATICK_LOCALES) {
      await expectHtmlRoute(request, `/${locale}/`);
    }
  });

  test('locale pages keep canonical and hreflang route inventory', async ({ page }) => {
    const expectedAlternates = new Map([
      ['ko', aquatickUrl('ko')],
      ['en', aquatickUrl('en')],
      ['ja', aquatickUrl('ja')],
      ['x-default', `${BASE_URL}/aquatick/`],
    ]);

    for (const locale of AQUATICK_LOCALES) {
      await page.goto(`/aquatick/${locale}/`);
      await expect(page.locator('link[rel="canonical"]'), locale).toHaveAttribute('href', aquatickUrl(locale));
      for (const [hreflang, href] of expectedAlternates) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`), `${locale}:${hreflang}`).toHaveAttribute('href', href);
      }
    }
  });

  test('AquaTick film strip includes vault screenshot card', async ({ page }) => {
    await page.goto('/aquatick/ko/');
    const vaultCard = page.locator('.film-card img[src*="screenshot-iphone-vault"]');
    await expect(vaultCard).toBeVisible();
    await expect(vaultCard).toHaveAttribute('alt', /보관함/);
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

  test('legacy and canonical app icons return image responses', async ({ request }) => {
    await expectImageResponse(request, '/assets/aquatick-app-icon.png');
    await expectImageResponse(request, '/aquatick/assets/aquatick-app-icon.png');
  });

  test('mirrored /assets/ screenshots return image responses', async ({ request }) => {
    for (const name of AQUATICK_SCREENSHOTS) {
      await expectImageResponse(request, `/assets/${name}`);
    }
  });

  test('legacy /assets/ image mirror is byte-identical to /aquatick/assets/', async ({ request }) => {
    for (const name of AQUATICK_IMAGE_ASSETS) {
      const legacy = await expectImageResponse(request, `/assets/${name}`);
      const canonical = await expectImageResponse(request, `/aquatick/assets/${name}`);
      expect(sha256(legacy), name).toBe(sha256(canonical));
    }
  });
});
