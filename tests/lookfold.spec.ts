import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const locales = ['ko', 'en', 'ja'] as const;
const origin = 'https://sparking.win';
const docs = ['support', 'privacy', 'terms'] as const;
const contact = 'mailto:alarmcrew.support@gmail.com';
const prohibited = /apps\.apple\.com|itunes\.apple\.com|testflight\.apple\.com|apple-itunes-app|installUrl|downloadUrl|\bdownload\b|다운로드|ダウンロード|피팅\s*팩|fitting packs?|試着パック|href="tel:|\{\{[^}]+\}\}/i;

test('the Lookfold language cover leads readers to their own edition', async ({ browser }) => {
  for (const [browserLocale, edition] of [['ko-KR','ko'],['ja-JP','ja'],['fr-FR','en']]) {
    const context = await browser.newContext({ locale: browserLocale! });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:8080/lookfold/');
    await expect(page).toHaveURL(new RegExp('/lookfold/' + edition + '/$'));
    await expect(page.locator('html')).toHaveAttribute('lang', edition!);
    await context.close();
  }
});

test('static cover, discovery and product metadata keep the release status accurate', async ({ page, request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const summary = await (await request.get('/llms.txt')).text();
  const cover = await (await request.get('/lookfold/')).text();
  expect(cover).not.toMatch(prohibited);
  for (const locale of locales) {
    expect(cover).toContain('href="/lookfold/' + locale + '/"');
    for (const suffix of ['', ...docs.map(doc => doc + '/')]) {
      expect(sitemap).toContain('<loc>' + origin + '/lookfold/' + locale + '/' + suffix + '</loc>');
    }
  }
  expect(summary).toMatch(/Lookfold[\s\S]*submitted for App Review/);
  const hub = await (await request.get('/')).text();
  const graph = JSON.parse(hub.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]!)['@graph'];
  const app = graph.find((node: { '@type': string }) => node['@type'] === 'ItemList').itemListElement
    .find((entry: { item: { name: string } }) => entry.item.name === 'Lookfold');
  expect(app.item.url).toBe(origin + '/lookfold/');
  for (const property of ['offers','installUrl','downloadUrl','aggregateRating']) expect(app.item).not.toHaveProperty(property);
});

for (const locale of locales) {
  test.describe(locale + ' Lookfold edition', () => {
    test.use({ javaScriptEnabled: false });
    test('manual recording, optional fitting, prices and localized documents work without scripts', async ({ page, request }) => {
      const base = '/lookfold/' + locale + '/';
      await page.goto(base);
      await expect(page.locator('html')).toHaveAttribute('lang',locale);
      await expect(page.locator('a[aria-current="page"]')).toHaveAttribute('href', base);
      await expect(page.locator('#release-title')).toContainText(/준비|in the making|準備/);
      await expect(page.locator('#journal')).toContainText('AI');
      for (const fact of ['Free','Lookfold Plus']) await expect(page.locator('#plans')).toContainText(fact);
      await expect(page.locator('#plans')).not.toContainText(/US \$8\.99|35|30|5 GiB/);
      await expect(page.locator('.source-note')).toContainText('1.0 (7)');
      await expect(page.locator('.availability')).toContainText('Apple');
      expect(await page.content()).not.toMatch(prohibited);
      const pictures = page.locator('.catalogue img');
      await expect(pictures).toHaveCount(3);
      for (const pic of await pictures.all()) {
        const url = (await pic.getAttribute('src'))!;
        expect(url).toMatch(new RegExp('^/lookfold/assets/' + locale + '/'));
        expect((await request.get(url)).ok()).toBe(true);
        await pic.scrollIntoViewIfNeeded();
        await expect.poll(() => pic.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      }
      for (const kind of docs) {
        await page.goto(base);
        await page.locator('footer a[href="' + base + kind + '/"]').click();
        await expect(page.locator('.document-body')).toBeVisible();
        await expect(page.locator('.document-body a[href="' + contact + '"]')).toBeVisible();
        expect(await page.content()).not.toMatch(prohibited);
        if (kind === 'support') {
          const body = await page.locator('.document-body').innerText();
          const submissionHistory = {
            ko: '이전 빌드를 앱 심사에 제출한 이력이 있습니다. 제출은 심사 승인이나 공개 출시를 뜻하지 않습니다.',
            en: 'A previous build was submitted for app review. Submission does not mean approval or public availability.',
            ja: '以前のビルドをアプリ審査に提出した履歴があります。提出は審査の承認や一般公開を意味しません。',
          };
          expect(body).toContain(submissionHistory[locale]);
          expect(body).not.toMatch(/has not been submitted|심사에 제출하지 않았|審査にはまだ提出/);
        }
        if (kind === 'privacy' || kind === 'terms') {
          await expect(page.locator('.document-body')).toContainText('Byunghak Ko');
          await expect(page.locator('.document-body')).toContainText('2026-11-07');
        }
        if (kind === 'privacy') {
          for (const provider of ['Apple','Supabase','OpenAI','RevenueCat']) await expect(page.locator('.document-body')).toContainText(provider);
          await expect(page.locator('.document-body')).toContainText('1833-6972');
          await expect(page.locator('.document-body')).toContainText('118');
          expect(await page.locator('.document-body').innerText()).not.toContain('심사 제출 전인');
          const operationsCopy = {
            ko: ['최대 90일', '달력 기준 3일', '아직 운영 검증이 끝나지 않았습니다'],
            en: ['90 days after closure', 'three calendar days', 'not yet operationally verified'],
            ja: ['最長90日', '暦日で3日', '運用検証は未完了'],
          };
          for (const text of operationsCopy[locale]) await expect(page.locator('.document-body')).toContainText(text);
        }
      }
    });
    test('keyboard navigation and the garment gallery fit mobile, tablet and desktop', async ({ page }) => {
      for (const width of [320,375,414,768,1440]) {
        await page.setViewportSize({width,height:900});
        await page.goto('/lookfold/' + locale + '/');
        await page.keyboard.press('Tab');
        await expect(page.locator('.skip')).toBeFocused();
        const layout = await page.evaluate(() => {
          const bounds = document.querySelector('.plate')!.getBoundingClientRect();
          const buttons = Array.from(document.querySelectorAll('.hero-actions a,.langs a,.footlinks a'));
          return {right:bounds.right, width:innerWidth,overflow:document.documentElement.scrollWidth - innerWidth,
            wraps:buttons.filter(el => el.scrollWidth > el.clientWidth + 1).map(el=>el.textContent)};
        });
        expect(layout.right).toBeLessThanOrEqual(layout.width);
        expect(layout.overflow).toBe(0);
        expect(layout.wraps).toEqual([]);
      }
    });
  });
}

test('delivered media match the recorded icon and native screenshot sources', () => {
  const provenance = JSON.parse(readFileSync('lookfold/assets/provenance.json','utf8')) as {
    captureBuild: string; sourceBuild: string; captureEvidence: string; sourceEvidence: string;
    currentCaptureAssets: string[];
    legacy: {candidate5Capture: {captureBuild: string; captureEvidence: string}};
    sources: Record<string,{source:string,sha256:string,source_sha256:string,sourceBuild?:string,sourceCommit?:string}>
  };
  const { sources } = provenance;
  expect(provenance.captureBuild).toBe('1.0 (7)');
  expect(provenance.captureBuild).toBe(provenance.sourceBuild);
  expect(provenance.captureEvidence).toMatch(/candidate7-simulator-identity\.json$/);
  expect(provenance.sourceEvidence).toMatch(/candidate7-artifact-evidence\.json$/);
  expect(provenance.currentCaptureAssets).toHaveLength(9);
  for (const name of provenance.currentCaptureAssets) {
    expect(sources[name]?.sourceBuild,name).toBe(provenance.captureBuild);
  }
  expect(provenance.legacy.candidate5Capture.captureBuild).toBe('1.0 (5)');
  expect(provenance.legacy.candidate5Capture.captureEvidence).toMatch(/candidate5-final-simulator-identity\.json$/);
  for (const name of ['app-icon.png','white-shirt.webp','denim.webp','jacket.webp']) {
    expect(sources[name]?.sourceCommit,name).toBeTruthy();
    expect(provenance.currentCaptureAssets).not.toContain(name);
  }
  for (const [name, entry] of Object.entries(sources)) {
    expect(createHash('sha256').update(readFileSync('lookfold/assets/' + name)).digest('hex'),name).toBe(entry.sha256);
    if (name === 'app-icon.png') expect(entry.sha256).toBe(entry.source_sha256);
    else expect(entry.source).toMatch(/^release\/app-store\/assets\/screenshots\/(ko-KR|ja|en-US)\//);
  }
});
