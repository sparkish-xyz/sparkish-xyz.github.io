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
        // Read the original response without following HTML meta refreshes. Browser
        // navigation can discard a legacy redirect's response body before inspection.
        const response = await request.get(path);
        expect(response.status(), path).toBe(200);
        const html = await response.text();
        expect(html, path).not.toContain(legacyOrigin);
        // Private Android review pages deliberately have no search metadata.
        if (family === 'androidReview') continue;
        const metadata = await page.evaluate(source => {
          const document = new DOMParser().parseFromString(source, 'text/html');
          return {
            canonicals: Array.from(document.querySelectorAll('link[rel="canonical"]'), element => element.getAttribute('href')),
            urls: Array.from(document.querySelectorAll('link[rel="alternate"][hreflang], meta[property="og:url"], meta[property="og:image"], meta[name="twitter:image"]'),
              element => element.getAttribute('href') ?? element.getAttribute('content') ?? ''),
            schemas: Array.from(document.querySelectorAll('script[type="application/ld+json"]'), element => element.textContent ?? ''),
          };
        }, html);
        const canonicalPath = family === 'legacyAquatickStubs' ? '/aquatick' + path : path;
        expect(metadata.canonicals, path).toEqual([origin + canonicalPath]);
        for (const url of metadata.urls) expect(new URL(url).origin, `${path}: ${url}`).toBe(origin);
        for (const schema of metadata.schemas) {
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
