import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { BASE_URL } from './support/site-contracts';

const routes = JSON.parse(readFileSync('site-src/routes.json', 'utf8')) as { legal: string[] };
const paths = routes.legal.map(file => `/${file.replace(/index\.html$/, '')}`);
const retiredHosts = /chatgpt\.site|github\.com\/[^"\s]+\/wiki|kinetto-api\.sparking\.win\/v1\/legal/;

test.describe('Project-hosted support and legal documents', () => {
  test.use({ javaScriptEnabled: false });

  test('every document is readable, has matching search metadata, and uses valid local links', async ({ page, request }) => {
    const checked = new Set<string>();
    for (const path of paths) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${BASE_URL}${path}`);
      expect(await page.locator('meta[name="description"]').getAttribute('content'), path).toBeTruthy();
      await expect(page.locator('script, iframe, form')).toHaveCount(0);
      const html = await response!.text();
      expect(html, path).not.toMatch(retiredHosts);
      const language = await page.locator('html').getAttribute('lang');
      expect(['en', 'ko', 'ja']).toContain(language);
      // Authored language variants must match the sitemap, including single-language originals.
      const sitemap = await (await request.get('/sitemap.xml')).text();
      const entry = sitemap.match(new RegExp(`<url>\\s*<loc>${BASE_URL.replaceAll('.', '\\.').replaceAll('/', '\\/')}${path.replaceAll('/', '\\/')}</loc>[\\s\\S]*?</url>`))?.[0];
      expect(entry, path).toBeDefined();
      for (const alternate of await page.locator('link[rel="alternate"]').all()) {
        const lang = await alternate.getAttribute('hreflang');
        const href = await alternate.getAttribute('href');
        expect(entry).toContain(`hreflang="${lang}" href="${href}"`);
      }
      for (const reference of await page.locator('a[href], img[src], link[rel="stylesheet"]').evaluateAll(elements =>
        [...new Set(elements.map(element => element.getAttribute('href') ?? element.getAttribute('src')).filter((value): value is string => Boolean(value)))],
      )) {
        const url = new URL(reference, page.url());
        if (url.origin === BASE_URL) expect(reference, `${path} → ${reference} stays on the preview origin`).toMatch(/^\//);
        if (url.origin !== new URL(page.url()).origin && url.origin !== BASE_URL) continue;
        if (!checked.has(url.pathname)) {
          expect((await request.get(url.pathname)).status(), `${path} → ${reference}`).toBe(200);
          checked.add(url.pathname);
        }
        if (url.hash) {
          const target = await (await request.get(url.pathname)).text();
          expect(target, `${path} → ${reference}`).toContain(`id="${decodeURIComponent(url.hash.slice(1))}"`);
        }
      }
    }
  });

  test('all landing pages and the hub link to documents on this site', async ({ page, request }) => {
    const landings = ['/', '/aquatick/en/', '/aquatick/ko/', '/aquatick/ja/', '/kinetto/', '/kinetto/ko/', '/kinetto/ja/', '/alarmcrew/', '/alarmcrew/en/', '/alarmcrew/ja/'];
    for (const path of landings) {
      await page.goto(path);
      const html = await (await request.get(path)).text();
      expect(html, path).not.toMatch(retiredHosts);
      const links = await page.locator('footer a').evaluateAll(elements => elements.map(element => element.getAttribute('href')!));
      const documents = links.filter(href => /\/(?:legal|privacy|terms|support|delete-account)\//.test(href));
      expect(documents.length, path).toBeGreaterThanOrEqual(3);
      for (const href of documents) {
        expect(href, path).toMatch(/^\//);
        expect((await request.get(href)).status(), `${path} → ${href}`).toBe(200);
      }
      if (path !== '/') {
        await page.locator('footer a[href$="/privacy/"]').click();
        await expect(page.locator('.document-body')).toBeVisible();
      }
    }
    expect(await (await request.get('/llms.txt')).text()).not.toMatch(retiredHosts);
  });

  test('policy clauses and effective dates survive migration', async ({ page }) => {
    await page.goto('/aquatick/privacy/');
    const aqua = page.locator('.document-body');
    await expect(aqua.locator('h2')).toHaveCount(5);
    for (const text of ['October 4, 2026', 'CloudKit', 'JSON', 'Amplitude', 'IDFV and IP-based location collection are disabled', 'Session Replay are not enabled', 'RevenueCat', 'Google Mobile Ads', 'Firebase Analytics and Crashlytics', 'does not sell personal data', 'delete the app', 'alarmcrew.support@gmail.com']) {
      await expect(aqua).toContainText(text);
    }
    await page.goto('/alarmcrew/privacy/');
    const alarm = page.locator('.document-body');
    await expect(alarm.locator('h2')).toHaveCount(8);
    for (const text of ['2026년 9월 29일', '비개인화 광고', 'IDFA', 'Android에는 이 AdMob 광고 기능이 포함되지 않습니다', '90일', '대한민국 서울', 'Android Keystore']) {
      await expect(alarm).toContainText(text);
    }
    await page.goto('/alarmcrew/terms/');
    await expect(page.locator('.document-body')).toContainText('2026년 9월 16일');
    await expect(page.locator('.document-body h2')).toHaveCount(5);
    await page.goto('/kinetto/privacy/');
    const kinetto = page.locator('.document-body');
    await expect(kinetto.locator('h2')).toHaveCount(6);
    for (const text of ['2026-09-12', 'anonymous server account', 'off by default', 'firebase-v1', 'pseudonymized', 'Keychain', 'not linked to a user or device identifier']) {
      await expect(kinetto).toContainText(text);
    }
  });

  test('language navigation keeps the same document and the index identifies original languages', async ({ page }) => {
    await page.goto('/kinetto/privacy/');
    await page.locator('footer').getByRole('link', { name: 'Terms of Use', exact: true }).click();
    await expect(page).toHaveURL(/\/kinetto\/terms\/$/);
    await page.locator('.language-links').getByRole('link', { name: '한국어' }).click();
    await expect(page).toHaveURL(/\/kinetto\/ko\/terms\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
    await page.locator('.language-links').getByRole('link', { name: '日本語' }).click();
    await expect(page).toHaveURL(/\/kinetto\/ja\/terms\/$/);
    await expect(page.locator('.document-body')).toContainText('基本規約');
    await page.locator('footer').getByRole('link', { name: 'プライバシーポリシー', exact: true }).click();
    await expect(page).toHaveURL(/\/kinetto\/ja\/privacy\/$/);
    await page.goto('/legal/ja/');
    await expect(page.locator('[data-app="aquatick"] nav a').first()).toContainText('English');
    await expect(page.locator('[data-app="alarmcrew"] nav a').first()).toContainText('한국어');
  });

  test('account deletion retains bilingual instructions, scope, ownership checks, and usable email fallback', async ({ page }) => {
    await page.goto('/alarmcrew/delete-account/');
    const body = page.locator('.document-body');
    for (const text of ['앱을 다시 설치하거나 로그인하지 않아도', '닉네임만으로 다른 사람의 계정을 삭제하지 않습니다', '6자리', '90일', '메일 앱이 열리지 않으면', 'verify account ownership', 'Alarms created by other people remain']) {
      await expect(body).toContainText(text);
    }
    const actions = page.locator('a.action');
    await expect(actions).toHaveCount(2);
    const recipient = await actions.first().getAttribute('href');
    expect(recipient).toMatch(/^mailto:[^?]+\?subject=AlarmCrew%20/);
    await expect(body).toContainText(recipient!.slice(7).split('?')[0]!);
    await body.getByRole('link', { name: 'English instructions' }).click();
    await expect(page).toHaveURL(/#english$/);
    await expect(page.locator('#english')).toHaveAttribute('lang', 'en');
    await body.getByRole('link', { name: '개인정보처리방침', exact: true }).click();
    await expect(page).toHaveURL(/\/alarmcrew\/privacy\/$/);
  });

  test('Apple license information preserves the official agreement link', async ({ page }) => {
    for (const locale of ['en', 'ko', 'ja']) {
      await page.goto(`/aquatick/${locale}/terms/`);
      await expect(page.locator('.document-body a.action')).toHaveAttribute('href', 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/');
      await expect(page.locator('.document-body')).toContainText('EULA');
    }
  });

  test('mobile contents, keyboard focus, narrow layouts and print work without JavaScript', async ({ page }) => {
    const representative = ['/legal/ko/', '/alarmcrew/privacy/', '/alarmcrew/delete-account/', '/kinetto/ja/privacy/', '/aquatick/privacy/'];
    for (const width of [320, 375, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of representative) {
        await page.goto(path);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), `${path} at ${width}px`).toBe(0);
        await expect(page.locator('h1')).toBeInViewport();
      }
    }
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/alarmcrew/privacy/');
    const contents = page.locator('.table-of-contents');
    await contents.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(contents).toHaveAttribute('open', '');
    await contents.locator('a').nth(2).click();
    await expect(page).toHaveURL(/#section-3$/);
    await expect(page.locator('#section-3')).toBeInViewport();
    await page.goto('/kinetto/ko/privacy/');
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.document-sidebar')).not.toBeVisible();
    await expect(page.locator('.document-body')).toBeVisible();
  });
});
