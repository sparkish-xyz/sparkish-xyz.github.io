import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const origin = 'https://sparkish-xyz.github.io';
const guides = [
  { path: '/aquatick/ko/guides/apple-watch/', lang: 'ko', app: 'aquatick', alternate: '/aquatick/en/guides/apple-watch/' },
  { path: '/aquatick/en/guides/apple-watch/', lang: 'en', app: 'aquatick', alternate: '/aquatick/ko/guides/apple-watch/' },
  { path: '/aquatick/ko/guides/free-and-pro/', lang: 'ko', app: 'aquatick' },
  { path: '/alarmcrew/guides/crew-invites/', lang: 'ko', app: 'alarmcrew', alternate: '/alarmcrew/en/guides/crew-invites/' },
  { path: '/alarmcrew/en/guides/crew-invites/', lang: 'en', app: 'alarmcrew', alternate: '/alarmcrew/guides/crew-invites/' },
  { path: '/alarmcrew/guides/friends-and-crews/', lang: 'ko', app: 'alarmcrew' },
] as const;

test.describe('public product guides', () => {
  test.use({ javaScriptEnabled: false });

  test('every authored guide is registered, linked and discoverable', async ({ request, page }) => {
    const routes = JSON.parse(readFileSync('site-src/routes.json', 'utf8')) as { guides: string[] };
    expect(routes.guides.map(file => `/${file.replace(/index\.html$/, '')}`)).toEqual(guides.map(guide => guide.path));
    const sitemap = await (await request.get('/sitemap.xml')).text();
    const summary = await (await request.get('/llms.txt')).text();
    expect(summary).not.toContain('the user confirmed');
    for (const guide of guides) {
      expect(sitemap).toContain(`<loc>${origin}${guide.path}</loc>`);
      expect(summary).toContain(`${origin}${guide.path}`);
      const landing = guide.app === 'aquatick' ? `/aquatick/${guide.lang}/` : guide.lang === 'ko' ? '/alarmcrew/' : '/alarmcrew/en/';
      await page.goto(landing);
      await expect(page.locator(`#guides a[href="${guide.path}"]`)).toBeVisible();
    }
  });

  for (const guide of guides) {
    test(`${guide.path}: static content, metadata and all local references work`, async ({ page, request }) => {
      expect((await page.goto(guide.path))?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', guide.lang);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('article')).toBeVisible();
      await expect(page.locator('article h2').first()).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', origin + guide.path);
      const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText())['@graph'] as Array<Record<string, unknown>>;
      const article = graph.find(item => item['@type'] === 'Article');
      expect(article?.['headline']).toBe(await page.locator('h1').innerText());
      expect(article?.['dateModified']).toBe(await page.locator('time').getAttribute('datetime'));
      expect(article?.['inLanguage']).toBe(guide.lang);
      expect(graph.some(item => item['@type'] === 'BreadcrumbList')).toBe(true);
      expect(await page.locator('meta[name="description"]').getAttribute('content')).toBe(article?.['description']);
      await expect(page.locator('a[href*="apps.apple.com"]')).toHaveCount(1);
      await expect(page.locator('a[href*="play.google.com"], form')).toHaveCount(0);
      const references = await page.locator('a[href], img[src], link[rel="stylesheet"]').evaluateAll(elements =>
        [...new Set(elements.map(element => element.getAttribute('href') ?? element.getAttribute('src')).filter((value): value is string => value?.startsWith('/') === true))],
      );
      for (const ref of references) expect((await request.get(ref)).status(), ref).toBe(200);
      for (const href of await page.locator('a[href^="#"]').evaluateAll(elements => elements.map(element => element.getAttribute('href')))) {
        expect(await page.locator(href!).count(), href!).toBe(1);
      }
      if ('alternate' in guide) {
        const alternateLang = guide.lang === 'ko' ? 'en' : 'ko';
        await expect(page.locator(`link[hreflang="${alternateLang}"]`)).toHaveAttribute('href', origin + guide.alternate);
        await page.locator(`.language-links a[lang="${alternateLang}"]`).click();
        await expect(page).toHaveURL(new RegExp(`${guide.alternate}$`));
        await expect(page.locator(`link[hreflang="${guide.lang}"]`)).toHaveAttribute('href', origin + guide.path);
      } else {
        await expect(page.locator('link[hreflang]')).toHaveCount(0);
      }
    });

    test(`${guide.path}: mobile reading, images and native contents navigation`, async ({ page }) => {
      for (const width of [320, 375, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(guide.path);
        for (const img of await page.locator('article img').all()) {
          await img.scrollIntoViewIfNeeded();
          await expect.poll(() => img.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), `${width}px`).toBe(0);
        if (width < 980) {
          const toc = page.locator('.table-of-contents');
          await toc.locator('summary').focus();
          await page.keyboard.press('Enter');
          await expect(toc).toHaveAttribute('open', '');
          await toc.locator('a').first().click();
          await expect(page).toHaveURL(/#section-1$/);
        }
      }
    });
  }

  test('product facts remain readable and distinguish shipping platforms without scripts', async ({ page }) => {
    for (const lang of ['ko', 'en', 'ja']) {
      await page.goto(`/aquatick/${lang}/`);
      await expect(page.locator('#app-info table')).toBeVisible();
      await expect(page.locator('#app-info')).toContainText('watchOS 10.0');
      await expect(page.locator('#app-info')).toContainText('Apple Health');
      await expect(page.locator('#app-info')).toContainText('6');
      await page.goto(lang === 'ko' ? '/alarmcrew/' : `/alarmcrew/${lang}/`);
      await expect(page.locator('#app-info table')).toBeVisible();
      await expect(page.locator('#app-info')).toContainText('iOS 26.0');
      await expect(page.locator('#app-info')).toContainText('Android');
      const data = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
      expect(data.about.operatingSystem).toBe('iOS 26.0 or later');
      expect(data.about.sameAs).toEqual(['https://apps.apple.com/app/id6812283770']);
      expect(data.name).toBe(await page.title());
      expect(data.dateModified).toBe(await page.locator('#app-info time').getAttribute('datetime'));
    }
    await page.goto('/aquatick/en/guides/apple-watch/');
    await expect(page.locator('article')).toContainText('they do not record intake');
    await expect(page.locator('article')).toContainText('separate settings');
    await page.goto('/alarmcrew/en/guides/crew-invites/');
    await expect(page.locator('article')).toContainText('does not automatically join a Crew');
    await expect(page.locator('article')).toContainText('no public download or confirmed release date');
  });
});
