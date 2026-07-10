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
  requiredText,
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

  test('locale pages expose App Store download and Pro prices without banned platform claims', async ({ page }) => {
    for (const locale of AQUATICK_LOCALES) {
      await page.goto(`/aquatick/${locale}/`);

      await expect(page.locator('a[href*="apps.apple.com/app/aquatick"]'), `${locale} App Store link`).not.toHaveCount(0);

      const bodyText = await requiredText(page.locator('body'), `${locale} body text`);
      expect(bodyText, `${locale} aquarium copy`).not.toMatch(/aquarium|水槽|아쿠아리움/i);
      expect(bodyText, `${locale} visionOS copy`).not.toMatch(/visionOS/i);
      expect(bodyText, `${locale} monthly Pro price`).toMatch(/\$0\.99/);
      expect(bodyText, `${locale} yearly Pro price`).toMatch(/\$5\.99/);

      const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? '').join('\n'));
      expect(hrefs, `${locale} Google Play links`).not.toMatch(/play\.google/i);
    }
  });

  test('locked AquaTick S1-S5 layout uses summary, core, privacy, and pricing contracts', async ({ page }) => {
    await page.goto('/aquatick/ko/');

    await expect(page.locator('#features .summary-card'), 'summary-card count').toHaveCount(4);
    await expect(page.locator('#screens .core-feature-card'), 'core-feature-card count').toHaveCount(6);

    const vaultCard = page.locator('#screens .core-feature-card').filter({
      has: page.locator('img[src*="screenshot-iphone-vault"]'),
    });
    await expect(vaultCard, 'vault core feature card').toHaveCount(1);
    await expect(vaultCard.locator('img[src*="screenshot-iphone-vault"]'), 'vault screen image').toBeVisible();

    await expect(page.locator('#privacy'), 'privacy section').toBeVisible();
    await expect(page.locator('#privacy .privacy-col'), 'privacy column count').toHaveCount(4);

    const pricingText = await requiredText(page.locator('#pricing'), 'pricing section');
    expect(pricingText, 'monthly Pro price').toMatch(/\$0\.99/);
    expect(pricingText, 'yearly Pro price').toMatch(/\$5\.99/);
  });

  test('locale pages claim Cup Vault favorites max 5 in meta, screens, and dateModified 2026-07-10', async ({ page }) => {
    const vaultSignals: Record<(typeof AQUATICK_LOCALES)[number], RegExp> = {
      en: /Cup Vault|favorite|favorites/i,
      ko: /보관함|즐겨찾기/,
      ja: /保管庫|お気に入り/,
    };
    const fiveSignals: Record<(typeof AQUATICK_LOCALES)[number], RegExp> = {
      en: /\b5\b|up to 5|max(?:imum)? 5/i,
      ko: /최대\s*5|5개/,
      ja: /最大\s*5|5件/,
    };

    for (const locale of AQUATICK_LOCALES) {
      await page.goto(`/aquatick/${locale}/`);

      const ldJson = await requiredText(page.locator('script[type="application/ld+json"]').first(), `${locale} ld+json`);
      expect(ldJson, `${locale} dateModified`).toMatch(/"dateModified"\s*:\s*"2026-07-10"/);

      const metaDescription = await requiredAttribute(page.locator('meta[name="description"]'), 'content', `${locale} meta description`);
      expect(metaDescription, `${locale} meta vault signal`).toMatch(vaultSignals[locale]);
      expect(metaDescription, `${locale} meta favorites cap`).toMatch(fiveSignals[locale]);

      const vaultCard = page.locator('#screens .core-feature-card').filter({
        hasText: vaultSignals[locale],
      });
      await expect(vaultCard, `${locale} vault core feature card`).toHaveCount(1);

      const vaultCardText = await requiredText(vaultCard.first(), `${locale} vault card text`);
      expect(vaultCardText, `${locale} screen vault signal`).toMatch(vaultSignals[locale]);
      expect(vaultCardText, `${locale} screen favorites cap`).toMatch(fiveSignals[locale]);
    }
  });

  test('AquaTick screens strip starts with the first card visible', async ({ page }) => {
    await page.setViewportSize({ width: 720, height: 800 });
    await page.goto('/aquatick/ko/');
    await page.locator('#screens').scrollIntoViewIfNeeded();

    const metrics = await page.locator('#screens .screen-grid').evaluate((grid) => {
      const firstCard = grid.querySelector('.core-feature-card');
      if (firstCard === null) {
        throw new Error('Missing core feature card');
      }

      const stripRect = grid.getBoundingClientRect();
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

  test('Japanese AquaTick hero remains readable at tablet width under documented centered-hero budget', async ({ page }) => {
    await page.setViewportSize({ width: 720, height: 900 });
    await page.goto('/aquatick/ja/');

    const metrics = await page.evaluate(() => {
      const h1 = document.querySelector('.hero h1');
      const firstButton = document.querySelector('.hero-actions .btn');
      const actions = document.querySelector('.hero-actions');
      if (h1 === null || firstButton === null || actions === null) {
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

    expect(metrics.h1Height).toBeLessThanOrEqual(280);
    expect(metrics.buttonWidth).toBeGreaterThanOrEqual(280);
    expect(metrics.buttonLineCount).toBeLessThanOrEqual(1);
    expect(['column', 'row']).toContain(metrics.actionsDirection);
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
