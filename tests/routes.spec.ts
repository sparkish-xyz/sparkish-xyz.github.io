import { expect, test } from '@playwright/test';

test.describe('Sparkish hub route contracts', () => {
  test('hub links to AquaTick', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Playful tools/i })).toBeVisible();
    await page.getByRole('link', { name: /View AquaTick/i }).click();
    await expect(page).toHaveURL(/\/aquatick\/(ko|en|ja)\/?$/);
  });

  test('hub JSON-LD includes the two active MobileApplication cards', async ({ page }) => {
    await page.goto('/');
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toContain('"@type": "Organization"');
    expect(jsonLd).toContain('"@type": "MobileApplication"');
    expect(jsonLd).toContain('AquaTick');
    expect(jsonLd).toContain('"numberOfItems": 2');
    expect(jsonLd).toContain('KINETTO');

    const graph = JSON.parse(jsonLd ?? '')['@graph'] as Array<{
      itemListElement?: Array<{
        position?: number;
        item?: Record<string, unknown>;
      }>;
    }>;
    const kinettoListItem = graph
      .flatMap(({ itemListElement }) => itemListElement ?? [])
      .find(({ item }) => item?.['name'] === 'KINETTO');
    expect(kinettoListItem).toMatchObject({ position: 2 });
    const kinetto = kinettoListItem?.item;
    expect(kinetto).toMatchObject({
      '@type': 'MobileApplication',
      url: 'https://sparkish-xyz.github.io/kinetto/',
      image: 'https://sparkish-xyz.github.io/kinetto/assets/app-icon.png',
    });
    expect(kinetto).not.toHaveProperty('installUrl');
    expect(kinetto).not.toHaveProperty('price');
    expect(kinetto).not.toHaveProperty('offers');
  });

  test('retired Korea Map Link pages are absent from the public site', async ({ request }) => {
    for (const path of ['/', '/sitemap.xml', '/llms.txt']) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      expect(await response.text(), path).not.toMatch(/Korea Map Link|korea-map-link|6776109560/i);
    }
    for (const suffix of ['', 'en/', 'fr/', 'ko/', 'ja/', 'zh-Hans/', 'zh-Hant/', 'privacy/', 'support/', 'assets/app-icon.png']) {
      const path = `/korea-map-link/${suffix}`;
      expect((await request.get(path)).status(), path).toBe(404);
    }
  });

  test('hub links to KINETTO', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /View KINETTO/i }).click();
    await expect(page).toHaveURL(/\/kinetto\/?$/);
  });
});
