import { expect, test } from '@playwright/test';
import {
  BASE_URL,
  KMB_LOCALES,
  KMB_SCREENSHOTS,
  expectHtmlRoute,
  expectImageResponse,
  kmbUrl,
  localStorageValue,
  requiredAttribute,
  requiredText,
} from './support/site-contracts';

const KMB_HREFLANGS = new Map([
  ['en', kmbUrl('en')],
  ['fr', kmbUrl('fr')],
  ['ko', kmbUrl('ko')],
  ['ja', kmbUrl('ja')],
  ['zh-Hans', kmbUrl('zh-Hans')],
  ['zh-Hant', kmbUrl('zh-Hant')],
  ['x-default', `${BASE_URL}/korea-map-link/`],
]);

test.describe('Korea Map Link route contracts', () => {
  test('privacy and support pages load', async ({ page }) => {
    await page.goto('/korea-map-link/privacy/');
    await expect(page.getByRole('heading', { name: /Privacy Policy/i })).toBeVisible();
    await page.goto('/korea-map-link/support/');
    await expect(page.getByRole('heading', { name: /^Support$/i })).toBeVisible();
  });

  test('chooser redirects from browser language defaults', async ({ page }) => {
    const cases = [
      { language: 'en-US', expected: 'en' },
      { language: 'ko-KR', expected: 'ko' },
      { language: 'ja-JP', expected: 'ja' },
      { language: 'fr-FR', expected: 'fr' },
      { language: 'zh-TW', expected: 'zh-Hant' },
      { language: 'zh-CN', expected: 'zh-Hans' },
    ] as const;

    for (const entry of cases) {
      await page.addInitScript((language) => {
        localStorage.removeItem('kmbLangPref');
        Object.defineProperty(navigator, 'language', {
          get: () => language,
          configurable: true,
        });
      }, entry.language);
      await page.goto('/korea-map-link/');
      await expect(page, entry.language).toHaveURL(new RegExp(`/korea-map-link/${entry.expected}/?$`));
    }
  });

  test('chooser honors stored language preference', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kmbLangPref', 'ja');
    });
    await page.goto('/korea-map-link/');
    await expect(page).toHaveURL(/\/korea-map-link\/ja\/?$/);
  });

  test('locale pages do not bounce and seed kmbLangPref', async ({ page }) => {
    for (const locale of KMB_LOCALES) {
      await page.goto(`/korea-map-link/${locale}/`);
      await expect(page, locale).toHaveURL(new RegExp(`/korea-map-link/${locale}/?$`));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect.poll(() => localStorageValue(page, 'kmbLangPref'), { message: locale }).toBe(locale);
    }
  });

  test('route inventory stays available', async ({ request }) => {
    await expectHtmlRoute(request, '/korea-map-link/');
    await expectHtmlRoute(request, '/korea-map-link/privacy/');
    await expectHtmlRoute(request, '/korea-map-link/support/');
    for (const locale of KMB_LOCALES) {
      await expectHtmlRoute(request, `/korea-map-link/${locale}/`);
    }
  });

  test('app icon and screenshots return image responses', async ({ request }) => {
    await expectImageResponse(request, '/korea-map-link/assets/app-icon.png');
    for (const name of KMB_SCREENSHOTS) {
      await expectImageResponse(request, `/korea-map-link/assets/${name}`);
    }
  });

  test('screenshots keep expected dimensions', async ({ request }) => {
    for (const name of KMB_SCREENSHOTS) {
      const body = await expectImageResponse(request, `/korea-map-link/assets/${name}`);
      const width = body.readUInt32BE(16);
      const height = body.readUInt32BE(20);

      expect(width, name).toBe(1320);
      expect(height, name).toBe(2868);
    }
  });

  test('locale pages keep FAQ and screenshot structure in parity', async ({ page }) => {
    const counts = [];

    for (const locale of KMB_LOCALES) {
      await page.goto(`/korea-map-link/${locale}/`);
      counts.push({
        locale,
        details: await page.locator('section.faq details').count(),
        figures: await page.locator('section.shots figure').count(),
      });
    }

    const first = counts.at(0);
    expect(first).toBeDefined();
    if (first === undefined) {
      throw new Error('Missing KMB parity baseline');
    }

    for (const entry of counts) {
      expect(entry.details, entry.locale).toBe(first.details);
      expect(entry.figures, entry.locale).toBe(first.figures);
    }

    expect(first.details).toBe(5);
    expect(first.figures).toBe(5);
  });

  test('locale pages keep SEO title, meta, social, JSON-LD, canonical, and hreflang in parity', async ({ page }) => {
    for (const locale of KMB_LOCALES) {
      await page.goto(`/korea-map-link/${locale}/`);

      const title = await page.title();
      const description = await requiredAttribute(page.locator('meta[name="description"]'), 'content', `${locale}:description`);
      const ogTitle = await requiredAttribute(page.locator('meta[property="og:title"]'), 'content', `${locale}:og:title`);
      const ogDescription = await requiredAttribute(page.locator('meta[property="og:description"]'), 'content', `${locale}:og:description`);
      const ogUrl = await requiredAttribute(page.locator('meta[property="og:url"]'), 'content', `${locale}:og:url`);
      const ogImage = await requiredAttribute(page.locator('meta[property="og:image"]'), 'content', `${locale}:og:image`);
      const twitterTitle = await requiredAttribute(page.locator('meta[name="twitter:title"]'), 'content', `${locale}:twitter:title`);
      const twitterDescription = await requiredAttribute(page.locator('meta[name="twitter:description"]'), 'content', `${locale}:twitter:description`);
      const twitterImage = await requiredAttribute(page.locator('meta[name="twitter:image"]'), 'content', `${locale}:twitter:image`);
      const jsonLd = await requiredText(page.locator('script[type="application/ld+json"]'), `${locale}:jsonld`);

      expect(title, locale).toBeTruthy();
      expect(title, locale).toBe(ogTitle);
      expect(title, locale).toBe(twitterTitle);
      expect(description, locale).toBe(ogDescription);
      expect(description, locale).toBe(twitterDescription);
      expect(jsonLd, locale).toContain('"@type": "MobileApplication"');
      expect(jsonLd, locale).toContain('"name": "Korea Map Link"');
      expect(jsonLd, locale).toContain(description);
      expect(ogUrl, locale).toBe(kmbUrl(locale));
      expect(ogImage, locale).toBe(`${BASE_URL}/korea-map-link/assets/app-icon.png`);
      expect(twitterImage, locale).toBe(ogImage);
      await expect(page.locator('link[rel="canonical"]'), locale).toHaveAttribute('href', kmbUrl(locale));
      for (const [hreflang, href] of KMB_HREFLANGS) {
        await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`), `${locale}:${hreflang}`).toHaveAttribute('href', href);
      }
    }
  });
});
