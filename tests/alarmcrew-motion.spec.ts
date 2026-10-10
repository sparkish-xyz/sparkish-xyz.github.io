import { expect, test, type Page } from '@playwright/test';

async function scrub(page: Page, selector: string, progress: number) {
  await page.locator(selector).evaluate((el, value) => {
    const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ac-nav-height'));
    const top = el.getBoundingClientRect().top + scrollY - offset;
    const distance = el.getBoundingClientRect().height - innerHeight + offset;
    window.scrollTo({ top: top + distance * value, behavior: 'instant' });
  }, progress);
}

async function matrix(page: Page, selector: string) {
  return page.locator(selector).evaluate(el => {
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    return { scale: m.a, y: m.m42, x: m.m41 };
  });
}

test('AlarmCrew hero fans out, enlarges and reverses with native scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/alarmcrew/');
  await expect(page.locator('.hero')).toHaveClass(/motion-hero/);
  await expect(page.locator('.hero-stage')).toHaveCSS('position', 'sticky');
  await scrub(page, '.hero', .9);
  await expect.poll(async () => (await matrix(page, '.hero-product')).scale).toBeGreaterThan(1.09);
  await expect.poll(() => page.locator('.hero-finale').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.9);
  await expect.poll(async () => (await matrix(page, '.hero-wing-left')).x).toBeLessThan(-75);
  await scrub(page, '.hero', 0);
  await expect.poll(async () => (await matrix(page, '.hero-product')).scale).toBeLessThan(1.01);
  await expect.poll(() => page.locator('.hero-copy').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.99);
});

test('AlarmCrew crew walkthrough pans the real capture, advances steps and releases', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/alarmcrew/en/');
  await expect(page.locator('#crew')).toHaveClass(/motion-crew/);
  for (const [progress, step] of [[.08, '0'], [.45, '1'], [.9, '2'], [.1, '0']] as const) {
    await scrub(page, '#crew', progress);
    await expect(page.locator('#crew')).toHaveAttribute('data-active-step', step);
    await expect(page.locator('[aria-current="step"]')).toHaveCount(1);
    await expect.poll(() => page.locator('.crew-stage').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(88);
    if (step === '2') await expect.poll(async () => (await matrix(page, '.crew-window img')).y).toBeLessThan(-150);
  }
  await page.locator('.next-section h2').scrollIntoViewIfNeeded();
  await expect(page.locator('.next-section h2')).toBeInViewport();
  await page.locator('.hero-purchase .button').focus();
  await expect(page.locator('.hero-purchase .button')).toBeFocused();
  await expect(page.locator('.hero-purchase .button')).toBeInViewport();
});

test('AlarmCrew motion cleans up on reduced-motion and responsive changes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/alarmcrew/ja/');
  await scrub(page, '#crew', .8);
  await expect(page.locator('#crew')).toHaveAttribute('data-active-step', '2');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero')).not.toHaveClass(/motion-hero/);
  await expect(page.locator('#crew')).not.toHaveClass(/motion-crew/);
  await expect(page.locator('.crew-stage')).not.toHaveCSS('position', 'sticky');
  await expect(page.locator('.crew-window img')).toHaveCSS('transform', 'none');
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero-finale')).not.toBeVisible();
  await expect(page.locator('[aria-current="step"]')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.locator('.hero')).not.toHaveClass(/motion-hero/);
  await expect(page.locator('#crew')).not.toHaveClass(/motion-crew/);
  await expect(page.locator('.crew-window img')).toHaveCSS('transform', 'none');
  await page.setViewportSize({ width: 1280, height: 600 });
  await expect(page.locator('.hero')).not.toHaveClass(/motion-hero/);
});

test('AlarmCrew content and downloads work without JavaScript or animation libraries', async ({ browser, page }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const plain = await context.newPage();
  await plain.goto('http://127.0.0.1:8080/alarmcrew/');
  await expect(plain.locator('[data-crew-step]')).toHaveCount(3);
  await expect(plain.locator('#crew')).not.toHaveClass(/motion-crew/);
  await expect(plain.locator('.hero-purchase .button')).toHaveAttribute('href', 'https://apps.apple.com/app/id6812283770');
  await plain.locator('.faq-list summary').first().click();
  await expect(plain.locator('.faq-list details').first()).toHaveAttribute('open', '');
  await expect(plain.locator('#app-info table')).toBeVisible();
  await context.close();
  await page.route('**/alarmcrew/assets/vendor/**', route => route.abort());
  await page.goto('/alarmcrew/en/');
  await expect(page.locator('.hero')).not.toHaveClass(/motion-hero/);
  await expect(page.locator('h1')).toBeVisible();
  await page.locator('.language-menu summary').click();
  await expect(page.locator('.language-menu')).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('.language-menu')).not.toHaveAttribute('open');
});
