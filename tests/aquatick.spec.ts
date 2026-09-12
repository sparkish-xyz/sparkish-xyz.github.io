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

  test('locale pages expose App Store download and localized Pro pricing without banned platform claims', async ({ page }) => {
    const pricingSignals: Record<(typeof AQUATICK_LOCALES)[number], RegExp> = {
      en: /monthly.*yearly|local prices/i,
      ko: /월.*연.*(?:요금|플랜)|가격/,
      ja: /月.*年.*(?:料金|プラン)|価格/,
    };

    for (const locale of AQUATICK_LOCALES) {
      await page.goto(`/aquatick/${locale}/`);

      await expect(page.locator('a[href*="apps.apple.com/app/aquatick"]'), `${locale} App Store link`).not.toHaveCount(0);

      const bodyText = await requiredText(page.locator('body'), `${locale} body text`);
      expect(bodyText, `${locale} aquarium copy`).not.toMatch(/aquarium|水槽|아쿠아리움/i);
      expect(bodyText, `${locale} visionOS copy`).not.toMatch(/visionOS/i);

      const pricingText = await requiredText(page.locator('#pricing'), `${locale} pricing text`);
      expect(pricingText, `${locale} localized pricing reference`).toMatch(pricingSignals[locale]);
      expect(pricingText, `${locale} hardcoded dollar pricing`).not.toMatch(/\$\s*\d/);

      const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? '').join('\n'));
      expect(hrefs, `${locale} Google Play links`).not.toMatch(/play\.google/i);
    }
  });

  test('locale pages expose logging, watch, privacy, and Pro contracts', async ({ page }) => {
    const loggingSignals: Record<(typeof AQUATICK_LOCALES)[number], RegExp> = {
      en: /log|tap/i,
      ko: /기록|탭/,
      ja: /記録|タップ/,
    };
    const watchSignals: Record<(typeof AQUATICK_LOCALES)[number], RegExp> = {
      en: /Apple Watch|wrist/i,
      ko: /Apple Watch|손목|워치/i,
      ja: /Apple Watch|手首|ウォッチ/i,
    };
    const noAccountSignals: Record<(typeof AQUATICK_LOCALES)[number], RegExp> = {
      en: /no account|without an account/i,
      ko: /계정(?:은|이)?\s*(?:없이|불필요|필요\s*없)/,
      ja: /アカウント(?:は)?\s*(?:なし|不要)/,
    };
    const optionalHealthSignals: Record<(typeof AQUATICK_LOCALES)[number], RegExp> = {
      en: /Apple Health.*optional|optional.*Apple Health/i,
      ko: /Apple Health.*(?:선택|임의)|(?:선택|임의).*Apple Health/,
      ja: /Apple Health.*(?:任意|選択)|(?:任意|選択).*Apple Health/,
    };
    const iCloudSignals: Record<(typeof AQUATICK_LOCALES)[number], RegExp> = {
      en: /iCloud/i,
      ko: /iCloud|아이클라우드/i,
      ja: /iCloud|アイクラウド/i,
    };
    const adFreeOnlySignals: Record<(typeof AQUATICK_LOCALES)[number], RegExp> = {
      en: /Pro(?:'s)? (?:benefit|feature).*ads only|Pro removes ads only/i,
      ko: /Pro\s*(?:혜택|기능).*광고\s*제거(?:입니다)?|광고\s*제거(?:만|뿐)/,
      ja: /Pro.*広告.*(?:のみ|だけ)|広告.*削除.*(?:のみ|だけ)/,
    };

    for (const locale of AQUATICK_LOCALES) {
      await page.goto(`/aquatick/${locale}/`);

      const features = page.locator('#features');
      await expect(features, `${locale} logging section`).toHaveClass(/logging-section/);
      const featuresText = await requiredText(features, `${locale} features text`);
      expect(featuresText, `${locale} logging signal`).toMatch(loggingSignals[locale]);

      const watchSection = page.locator('.watch-section');
      await expect(watchSection, `${locale} watch section`).toHaveCount(1);
      const watchText = await requiredText(watchSection, `${locale} watch text`);
      expect(watchText, `${locale} watch signal`).toMatch(watchSignals[locale]);

      const privacy = page.locator('#privacy');
      await expect(privacy.locator('details'), `${locale} privacy details`).toHaveCount(1);
      const privacyFacts = privacy.locator('.privacy-facts');
      await expect(privacyFacts.locator('dt'), `${locale} privacy facts`).toHaveCount(2);
      const privacyFactsText = await requiredText(privacyFacts, `${locale} privacy facts text`);
      expect(privacyFactsText, `${locale} no-account privacy fact`).toMatch(noAccountSignals[locale]);
      expect(privacyFactsText, `${locale} optional Health privacy fact`).toMatch(optionalHealthSignals[locale]);

      const pricingText = await requiredText(page.locator('#pricing'), `${locale} pricing text`);
      expect(pricingText, `${locale} iCloud Pro benefit`).toMatch(iCloudSignals[locale]);
      expect(pricingText, `${locale} Pro ad-only claim`).not.toMatch(adFreeOnlySignals[locale]);
    }
  });

  test('locale pages claim Cup Vault favorites max 6 in features and meta with dateModified 2026-09-12', async ({ page }) => {
    const favoriteLimitSignals: Record<(typeof AQUATICK_LOCALES)[number], RegExp> = {
      en: /up to\s*6\b|6\s+(?:Cup Vault\s+)?favorites/i,
      ko: /최대\s*6(?:개|개까지)?|6개/,
      ja: /最大\s*6\s*件?|6件/,
    };

    for (const locale of AQUATICK_LOCALES) {
      await page.goto(`/aquatick/${locale}/`);

      const ldJson = await requiredText(page.locator('script[type="application/ld+json"]').first(), `${locale} ld+json`);
      expect(ldJson, `${locale} dateModified`).toMatch(/"dateModified"\s*:\s*"2026-09-12"/);

      const metaDescription = await requiredAttribute(page.locator('meta[name="description"]'), 'content', `${locale} meta description`);
      expect(metaDescription, `${locale} meta favorites cap`).toMatch(favoriteLimitSignals[locale]);

      const featuresText = await requiredText(page.locator('#features'), `${locale} features text`);
      expect(featuresText, `${locale} features favorites cap`).toMatch(favoriteLimitSignals[locale]);
    }
  });

  test('mobile nav details close on same-page selection and restore summary focus on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/aquatick/en/');

    const menu = page.locator('details.nav-menu');
    const summary = menu.locator('summary');
    await summary.click();
    await expect(menu).toHaveJSProperty('open', true);

    await menu.locator('a[href="#features"]').first().click();
    await expect(menu).toHaveJSProperty('open', false);

    await summary.click();
    await expect(menu).toHaveJSProperty('open', true);
    await page.keyboard.press('Escape');
    await expect(menu).toHaveJSProperty('open', false);
    await expect(summary).toBeFocused();
  });

  test('AquaTick screen stories use linked full-size captures', async ({ page, request }) => {
    await page.setViewportSize({ width: 720, height: 800 });
    for (const locale of AQUATICK_LOCALES) {
      await page.goto(`/aquatick/${locale}/`);
      const stories = page.locator('#screens .screen-story');
      await expect(stories, `${locale} screen story count`).toHaveCount(2);

      for (let index = 0; index < 2; index += 1) {
        const story = stories.nth(index);
        const image = story.locator('img').first();
        const link = story.locator('a').first();
        const src = await requiredAttribute(image, 'src', `${locale} screen ${index + 1} image`);
        const href = await requiredAttribute(link, 'href', `${locale} screen ${index + 1} full-size link`);
        expect(href, `${locale} screen ${index + 1} link target`).toBe(src);
        expect(href, `${locale} screen ${index + 1} landing capture path`).toMatch(
          /^\/aquatick\/assets\/landing\/(?:en|ko|ja)\/(?:vault|history)\.png$/,
        );
        if (locale !== 'en' && href.includes('/en/')) {
          await expect(story.locator('.screen-caption')).toContainText(locale === 'ko' ? '영어' : '英語');
        }
        await expectImageResponse(request, href);
      }
    }
  });

  test('AquaTick heroes fit tablet width without overflow or wrapped buttons', async ({ page }) => {
    await page.setViewportSize({ width: 720, height: 900 });
    for (const locale of AQUATICK_LOCALES) {
      await page.goto(`/aquatick/${locale}/`);

      const metrics = await page.evaluate(() => {
        const firstButton = document.querySelector('.hero-actions .btn');
        if (firstButton === null) {
          throw new Error('Missing hero button');
        }

        const buttonTextRange = document.createRange();
        buttonTextRange.selectNodeContents(firstButton);

        return {
          buttonLineCount: new Set(
            Array.from(buttonTextRange.getClientRects(), (rect) => Math.round(rect.top)),
          ).size,
          pageOverflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        };
      });

      expect(metrics.buttonLineCount, `${locale} hero button line count`).toBeLessThanOrEqual(1);
      expect(metrics.pageOverflow, `${locale} hero page overflow`).toBe(0);
    }
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
