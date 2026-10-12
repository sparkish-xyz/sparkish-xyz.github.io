import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const origin = 'https://sparking.win';
const legacyOrigin = 'https://sparkish-xyz.github.io';

test.describe('canonical domain metadata', () => {
  test.use({ javaScriptEnabled: false });

  test('public pages and crawl discovery use sparking.win without changing route paths', async ({ page, request }) => {
    const routes = JSON.parse(readFileSync('site-src/routes.json', 'utf8')) as Record<string, string[]>;
    for (const [family, files] of Object.entries(routes)) {
      for (const file of files) {
        const path = '/' + file.replace(/index\.html$/, '');
        const response = await page.goto(path);
        expect(response?.status(), path).toBe(200);
        expect(await response!.text(), path).not.toContain(legacyOrigin);
        // Private Android review pages deliberately have no search metadata.
        if (family === 'androidReview') continue;
        const canonicalPath = family === 'legacyAquatickStubs' ? '/aquatick' + path : path;
        await expect(page.locator('link[rel="canonical"]'), path).toHaveAttribute('href', origin + canonicalPath);
        const metadata = await page.locator('link[rel="alternate"][hreflang], meta[property="og:url"], meta[property="og:image"], meta[name="twitter:image"]').evaluateAll(elements =>
          elements.map(element => element.getAttribute('href') ?? element.getAttribute('content') ?? ''),
        );
        for (const url of metadata) expect(new URL(url).origin, `${path}: ${url}`).toBe(origin);
        // Parse JSON-LD as well as checking the whole HTML for stale origins.
        for (const schema of await page.locator('script[type="application/ld+json"]').allTextContents()) {
          expect(JSON.stringify(JSON.parse(schema)), path).toContain(origin);
        }
      }
    }
    for (const path of ['/robots.txt', '/sitemap.xml', '/llms.txt']) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      const text = await response.text();
      expect(text, path).toContain(origin);
      expect(text, path).not.toContain(legacyOrigin);
      if (path === '/robots.txt') expect(text).toContain(`Sitemap: ${origin}/sitemap.xml`);
    }
  });
});

test('GitHub Pages custom domain is served and owned by the generator', async ({ request }) => {
  const response = await request.get('/CNAME');
  expect(response.status()).toBe(200);
  expect(await response.text()).toBe(new URL(origin).hostname + '\n');
  expect(readFileSync('site-src/templates/CNAME', 'utf8')).toBe(await response.text());
  const manifest = JSON.parse(readFileSync('site-src/generated-files.json', 'utf8')) as {
    generatedTextFiles: string[];
    rootOnlyFiles: string[];
  };
  expect(manifest.generatedTextFiles).toContain('CNAME');
  expect(manifest.rootOnlyFiles).toContain('CNAME');
});
