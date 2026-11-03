import { expect, test } from '@playwright/test';

const locales = ['ko', 'en', 'ja'] as const;

test('cat previews support pointer and keyboard selection without moving the page', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const locale of locales) {
    await page.goto(`/aquatick/${locale}/`);
    const tabs = page.locator('#cats [role="tab"]');
    const panels = page.locator('#cats [role="tabpanel"]');
    await expect(tabs).toHaveCount(3);
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    await tabs.first().click();
    await expect(panels.first()).toBeVisible();
    const previousY = await page.evaluate(() => scrollY);
    await page.keyboard.press('ArrowLeft');
    await expect(tabs.last()).toBeFocused();
    await expect(panels.last()).toBeVisible();
    await expect(panels.first()).not.toBeVisible();
    await page.keyboard.press('Home');
    await expect(tabs.first()).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();
    await expect(panels.nth(1)).toBeVisible();
    expect(Math.abs(await page.evaluate(() => scrollY) - previousY)).toBeLessThan(3);
    const image = panels.nth(1).locator('img');
    await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('.release-note')).toContainText('2.0');
  }
});

test('cat collection captures are localized and the picker fits a narrow phone', async ({ page, request }) => {
  await page.setViewportSize({ width: 320, height: 812 });
  for (const locale of locales) {
    await page.goto(`/aquatick/${locale}/#cats`);
    const screenshot = page.locator('.cat-collection-shot img');
    const src = await screenshot.getAttribute('src');
    expect(src).toBe(`/aquatick/assets/landing/${locale}/cats.png?v=20261104`);
    await expect(page.locator('.cat-collection-shot > a')).toHaveAttribute('href', src!);
    expect((await request.get(src!)).ok()).toBe(true);
    for (const tab of await page.locator('.cat-tabs button').all()) {
      await tab.click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
      const box = await tab.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  }
});

test('without JavaScript all cats, eligibility and full screenshots remain available', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const locale of locales) {
    await page.goto(`http://127.0.0.1:8080/aquatick/${locale}/`);
    await expect(page.locator('.cat-tabs')).not.toBeVisible();
    for (const panel of await page.locator('[data-cat-panel]').all()) await expect(panel).toBeVisible();
    await expect(page.locator('[data-cat-panel="milk-teddy"]')).toContainText('2026');
    await expect(page.locator('.cat-notes')).toContainText('Pro');
    await expect(page.locator('.cat-collection-shot a').first()).toBeVisible();
  }
  await context.close();
});
