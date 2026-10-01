import { expect, test } from '@playwright/test';

const locales = [
  { lang: 'ko', path: '/alarmcrew/', label: '한국어', heading: '같이 일어나면,아침이 달라져요.' },
  { lang: 'en', path: '/alarmcrew/en/', label: 'English', heading: 'Good mornings.Better together.' },
  { lang: 'ja', path: '/alarmcrew/ja/', label: '日本語', heading: '一緒に起きると、朝が変わる。' },
] as const;

test('Sparkish links to the AlarmCrew Korean canonical page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /View AlarmCrew/ }).click();
  await expect(page).toHaveURL(/\/alarmcrew\/$/);
});

for (const locale of locales) {
  test(`${locale.lang}: product truth, localized media, and canonical metadata`, async ({ page, request }) => {
    await page.goto(locale.path);
    await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
    await expect(page.locator('h1')).toHaveText(locale.heading);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://sparkish-xyz.github.io${locale.path}`);
    await expect(page.locator('link[hreflang]')).toHaveCount(4);
    await expect(page.locator('.platform')).toHaveCount(2);
    await expect(page.locator('.platform-status').first()).toContainText(/다운로드|Available|公開/);
    await expect(page.locator('.platform-status').last()).toContainText(/준비|Preparing|準備/);
    await expect(page.locator('a[href*="apps.apple.com"]')).toHaveCount(2);
    await expect(page.locator('a[href*="play.google.com"], form')).toHaveCount(0);
    const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
    expect(ld.about).not.toHaveProperty('offers');
    expect(ld.about).not.toHaveProperty('aggregateRating');
    expect(ld.about.installUrl).toBe('https://apps.apple.com/app/id6812283770');
    for (const figure of await page.locator('.screen-figure').all()) {
      const source = await figure.locator('img').getAttribute('src');
      expect(source).toContain(`/assets/${locale.lang}/`);
    }
    // Check actual route references rather than duplicating an asset inventory.
    const references = await page.locator('img, script[src], link[rel="stylesheet"], .screen-figure a').evaluateAll(elements =>
      [...new Set(elements.map(element => element.getAttribute('src') ?? element.getAttribute('href')).filter((value): value is string => Boolean(value)))],
    );
    for (const path of references) expect((await request.get(path)).status(), path).toBe(200);
  });

  test(`${locale.lang}: language disclosure and FAQ work from the keyboard`, async ({ page }) => {
    await page.goto(locale.path);
    const menu = page.locator('.language-menu');
    const toggle = menu.locator('summary');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(menu).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(menu).not.toHaveAttribute('open');
    await expect(toggle).toBeFocused();
    await toggle.click();
    await page.locator('h1').click();
    await expect(menu).not.toHaveAttribute('open');
    const faq = page.locator('.faq-list details').first();
    await faq.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(faq).toHaveAttribute('open', '');
    await expect(faq.locator('p')).toBeVisible();
    const next = locales[(locales.indexOf(locale) + 1) % locales.length]!;
    await toggle.click();
    await menu.getByRole('link', { name: next.label }).click();
    await expect(page).toHaveURL(new RegExp(`${next.path}$`));
    await expect(page.locator('html')).toHaveAttribute('lang', next.lang);
  });

  test(`${locale.lang}: mobile and desktop fit, images render, and labels stay on one line`, async ({ page }) => {
    for (const width of [320, 375, 414, 768, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(locale.path);
      // Visit each real image to exercise lazy loading, including below the fold.
      for (const img of await page.locator('img').all()) {
        await img.scrollIntoViewIfNeeded();
        await expect.poll(() => img.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
      }
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        outside: [...document.querySelectorAll('h1, h2, .button, .screen-figure, .platform, .footer-links a')].filter(element => {
          const box = element.getBoundingClientRect();
          return box.left < -1 || box.right > innerWidth + 1;
        }).map(element => element.className || element.tagName),
        wrapped: [...document.querySelectorAll('.button, .header-nav a, .footer-links a, .text-link, .brand')].filter(element => {
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          const centers: number[] = [];
          while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!node.textContent?.trim() || node.parentElement?.closest('[aria-hidden="true"]')) continue;
            const range = document.createRange(); range.selectNodeContents(node);
            centers.push(...[...range.getClientRects()].map(rect => rect.top + rect.height / 2));
          }
          return centers.length > 0 && Math.max(...centers) - Math.min(...centers) > parseFloat(getComputedStyle(element).fontSize);
        }).map(element => element.textContent),
      }));
      expect(layout.overflow, `${width}px overflow`).toBe(0);
      expect(layout.outside, `${width}px clipped content`).toEqual([]);
      expect(layout.wrapped, `${width}px wrapped controls`).toEqual([]);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
    const button = page.locator('.button');
    await button.focus();
    expect(await button.evaluate(element => getComputedStyle(element).outlineStyle)).toBe('solid');
  });
}
