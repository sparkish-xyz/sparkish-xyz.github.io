import { expect, test } from '@playwright/test';

// Public product facts must agree even when a crawler does not execute JavaScript.
test.describe('AquaTick search content', () => {
  test.use({ javaScriptEnabled: false });

  test('localized pages expose product answers, download terms and app languages', async ({ page }) => {
    for (const locale of ['en', 'ko', 'ja']) {
      await page.goto(`/aquatick/${locale}/`);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('.hero-tagline')).toContainText('AquaTick');
      await expect(page.locator('#pricing table')).toBeVisible();
      await expect(page.locator('#faq')).toBeVisible();
      await expect(page.locator('#faq')).toContainText('watchOS 10.0');
      const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText())['@graph'] as Array<Record<string, unknown>>;
      const app = graph.find((item) => item['@type'] === 'MobileApplication');
      expect(app?.['inLanguage']).toEqual(['en', 'fr', 'ja', 'ko', 'pl', 'zh-Hans', 'es']);
      expect(app?.['offers']).toMatchObject({ price: '0', priceCurrency: 'USD' });
      expect(app?.['aggregateRating']).toBeUndefined();
      for (const image of await page.locator('img[src$=".webp"]').all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((img) => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0)).toBe(true);
      }
    }
  });

  test('chooser and AI summary distinguish quick logging from progress-only surfaces', async ({ page, request }) => {
    await page.goto('/aquatick/');
    await expect(page.locator('main')).toContainText('up to 6 favorite cups');
    await expect(page.locator('main')).toContainText('Live Activity and Dynamic Island show progress only');
    const html = await (await request.get('/aquatick/')).text();
    const summary = await (await request.get('/llms.txt')).text();
    for (const content of [html, summary]) {
      expect(content).toContain('Quick Add widgets');
      expect(content).not.toMatch(/up to 5|Widgets, Live Activity|widgets, Live Activity/);
    }
    expect(summary).toContain('separate layout setting with up to 6 cups');
  });
});
