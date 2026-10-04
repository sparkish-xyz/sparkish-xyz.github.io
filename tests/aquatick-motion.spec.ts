import { expect, test } from '@playwright/test';

const locales = ['ko', 'en', 'ja'] as const;

test('hero opens into a larger product scene and reverses with native scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/aquatick/ko/');
  const hero = page.locator('.hero');
  await expect(hero).toHaveClass(/motion-hero/);
  await expect(page.locator('.hero-stage')).toHaveCSS('position', 'sticky');
  await expect(page.locator('.hero-actions .btn')).toBeInViewport();
  const initial = await page.locator('.hero-phone').boundingBox();
  const distance = await hero.evaluate(element => element.getBoundingClientRect().height - innerHeight);
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), distance * .8);
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '0');
  await expect.poll(() => page.locator('.hero-stage').evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(0);
  await expect.poll(async () => (await page.locator('.hero-phone').boundingBox())!.width).toBeGreaterThan(initial!.width * 1.08);
  await expect(page.locator('.hero-actions .btn')).toBeInViewport();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
  await expect.poll(async () => Math.round((await page.locator('.hero-phone').boundingBox())!.width)).toBe(Math.round(initial!.width));
});

test('desktop story follows native scroll forward and backward, then releases the page', async ({ page }) => {
  await page.setViewportSize({ width: 969, height: 1084 });
  await page.goto('/aquatick/ko/');
  await expect(page.locator('#features')).toHaveClass(/motion-story/);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.story-stage')).toHaveCSS('min-height', '824px');
  const range = await page.locator('#features').evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { start: rect.top + scrollY - 76, distance: rect.height - innerHeight + 76 };
  });
  for (const [progress, step] of [[.04, '0'], [.48, '1'], [.92, '2'], [.08, '0']] as const) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), range.start + range.distance * progress);
    await expect(page.locator('#features')).toHaveAttribute('data-active-step', step);
    await expect.poll(() => page.locator('.story-stage').evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBe(76);
    if (step === '2') await expect(page.locator('.logging-after')).toHaveCSS('opacity', '1');
    if (step === '0') await expect(page.locator('.logging-after')).toHaveCSS('opacity', '0');
  }
  await page.locator('#watch').scrollIntoViewIfNeeded();
  await expect(page.locator('#watch h2')).toBeInViewport();
});

test('motion is removed on preference or viewport changes without losing content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/aquatick/en/');
  await expect(page.locator('#features')).toHaveClass(/motion-story/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#features')).not.toHaveClass(/motion-story/);
  await expect(page.locator('.story-stage')).not.toHaveCSS('position', 'sticky');
  await expect(page.locator('.hero-copy')).toBeVisible();
  await expect(page.locator('.hero')).not.toHaveClass(/motion-hero/);
  await expect(page.locator('.hero-stage')).not.toHaveCSS('position', 'sticky');
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
  await expect(page.locator('.logging-after')).toHaveCSS('opacity', '0');
  await expect(page.locator('.watch-shot')).toHaveCSS('transform', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.locator('#features')).not.toHaveClass(/motion-story/);
  for (const item of await page.locator('.story-steps li').all()) await expect(item).toHaveCSS('opacity', '1');
  await page.setViewportSize({ width: 1440, height: 700 });
  await expect(page.locator('#features')).not.toHaveClass(/motion-story/);
  await expect(page.locator('.story-stage')).not.toHaveCSS('position', 'sticky');
});

test('localized gallery tabs work with keyboard and keep their position', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const locale of locales) {
    await page.goto(`/aquatick/${locale}/`);
    const first = page.locator('#screen-tab-0');
    const second = page.locator('#screen-tab-1');
    await first.scrollIntoViewIfNeeded();
    await first.focus();
    const previousY = await page.evaluate(() => scrollY);
    await page.keyboard.press('ArrowRight');
    await expect(second).toBeFocused();
    await expect(second).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#screen-panel-1')).toBeVisible();
    await expect(page.locator('#screen-panel-0')).not.toBeVisible();
    await expect.poll(() => page.locator('#screen-panel-1 img').evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    expect(Math.abs(await page.evaluate(() => scrollY) - previousY)).toBeLessThan(3);
    await page.keyboard.press('Home');
    await expect(first).toBeFocused();
    await expect(page.locator('#screen-panel-0')).toBeVisible();
  }
});

test('demo loads on request, plays, and stops with focus restored on Escape', async ({ page }) => {
  const mediaRequests: string[] = [];
  page.on('request', request => { if (request.url().endsWith('.mp4')) mediaRequests.push(request.url()); });
  await page.goto('/aquatick/ko/');
  expect(mediaRequests).toEqual([]);
  const trigger = page.locator('.demo-trigger');
  await trigger.click();
  const video = page.locator('.demo-dialog video');
  await expect(page.locator('.demo-dialog')).toBeVisible();
  await expect.poll(() => video.evaluate((element) => (element as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
  await expect.poll(() => video.evaluate((element) => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
  expect(mediaRequests.length).toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('.demo-dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(video).toHaveJSProperty('paused', true);
  await expect(video).toHaveJSProperty('currentTime', 0);
});

test('all locales fit narrow screens and load their localized native assets', async ({ page }) => {
  for (const locale of locales) {
    for (const width of [320, 375, 414, 768]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/aquatick/${locale}/`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), `${locale}:${width}`).toBe(0);
      await expect(page.locator('#features')).not.toHaveClass(/motion-story/);
      const title = await page.locator('h1').evaluate((element) => element.getBoundingClientRect());
      expect(title.x).toBeGreaterThanOrEqual(0);
      expect(title.right).toBeLessThanOrEqual(width);
      for (const kind of ['home', 'vault', 'watch']) {
        const response = await page.request.get(`/aquatick/assets/landing/${locale}/${kind}.png`);
        expect(response.ok()).toBe(true);
      }
    }
  }
});

test('no-JavaScript fallback exposes complete product content', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8080/aquatick/ko/');
  await expect(page.locator('.screen-tabs')).not.toBeVisible();
  await expect(page.locator('#screen-panel-0')).toBeVisible();
  await expect(page.locator('#screen-panel-1')).toBeVisible();
  await expect(page.locator('#features')).not.toHaveClass(/motion-story/);
  await expect(page.locator('.demo-trigger')).toHaveAttribute('href', /quick-add\.mp4$/);
  await expect(page.locator('#pricing table')).toBeVisible();
  await expect(page.locator('#faq')).toBeVisible();
  await context.close();
});
