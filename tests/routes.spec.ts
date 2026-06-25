import { expect, test } from '@playwright/test';

test.describe('Sparkish hub route contracts', () => {
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
});
