import { expect, test } from '@playwright/test';
import { AQUATICK_LOCALES, BASE_URL, aquatickUrl } from './support/site-contracts';

const KINETTO_LOCALES = ['en', 'ko', 'ja'] as const;

function kinettoUrl(locale: (typeof KINETTO_LOCALES)[number]): string {
  return locale === 'en' ? `${BASE_URL}/kinetto/` : `${BASE_URL}/kinetto/${locale}/`;
}

type SitemapEntry = {
  readonly loc: string;
  readonly alternates: ReadonlyMap<string, string>;
};

function parseSitemap(xml: string): readonly SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const urlBlockPattern = /<url>([\s\S]*?)<\/url>/g;
  let blockMatch = urlBlockPattern.exec(xml);

  while (blockMatch !== null) {
    const block = blockMatch[1];
    if (block !== undefined) {
      const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
      const loc = locMatch?.[1];
      if (loc !== undefined) {
        const alternates = new Map<string, string>();
        const alternatePattern = /hreflang="([^"]+)" href="([^"]+)"/g;
        let alternateMatch = alternatePattern.exec(block);
        while (alternateMatch !== null) {
          const hreflang = alternateMatch[1];
          const href = alternateMatch[2];
          if (hreflang !== undefined && href !== undefined) {
            alternates.set(hreflang, href);
          }
          alternateMatch = alternatePattern.exec(block);
        }
        entries.push({ loc, alternates });
      }
    }
    blockMatch = urlBlockPattern.exec(xml);
  }

  return entries;
}

test.describe('sitemap route contracts', () => {
  test('sitemap route inventory matches public static routes', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const entries = parseSitemap(await res.text());
    const locs = entries.map((entry) => entry.loc);

    expect(locs).toEqual([
      `${BASE_URL}/`,
      `${BASE_URL}/aquatick/`,
      ...AQUATICK_LOCALES.map((locale) => aquatickUrl(locale)),
      ...KINETTO_LOCALES.map((locale) => kinettoUrl(locale)),
    ]);
  });

  test('sitemap hreflang alternates match every locale page contract', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const entries = parseSitemap(await res.text());
    const byLoc = new Map(entries.map((entry) => [entry.loc, entry]));

    const aquatickAlternates = new Map([
      ['ko', aquatickUrl('ko')],
      ['en', aquatickUrl('en')],
      ['ja', aquatickUrl('ja')],
      ['x-default', `${BASE_URL}/aquatick/`],
    ]);
    for (const loc of [`${BASE_URL}/aquatick/`, ...AQUATICK_LOCALES.map((locale) => aquatickUrl(locale))]) {
      const entry = byLoc.get(loc);
      expect(entry, loc).toBeDefined();
      expect(entry?.alternates, loc).toEqual(aquatickAlternates);
    }

    const kinettoAlternates = new Map([
      ['en', kinettoUrl('en')],
      ['ko', kinettoUrl('ko')],
      ['ja', kinettoUrl('ja')],
      ['x-default', kinettoUrl('en')],
    ]);
    for (const loc of KINETTO_LOCALES.map((locale) => kinettoUrl(locale))) {
      const entry = byLoc.get(loc);
      expect(entry, loc).toBeDefined();
      expect(entry?.alternates, loc).toEqual(kinettoAlternates);
    }
  });
});
