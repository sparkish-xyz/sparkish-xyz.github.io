const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://sparkish-xyz.github.io';
const BASE = ORIGIN + '/kinetto/';
const pages = [
  ['kinetto/index.html', 'en', BASE],
  ['kinetto/ko/index.html', 'ko', BASE + 'ko/'],
  ['kinetto/ja/index.html', 'ja', BASE + 'ja/'],
];
const hreflang = { en: BASE, ko: BASE + 'ko/', ja: BASE + 'ja/', 'x-default': BASE };

const read = (file) => {
  const fullPath = path.join(ROOT, file);
  assert(fs.existsSync(fullPath), 'missing ' + file);
  return fs.readFileSync(fullPath, 'utf8');
};
const tags = (html, name) => [...html.matchAll(new RegExp('<' + name + '\\b[^>]*>', 'gi'))].map((m) => m[0]);
const bodies = (html, name) => [...html.matchAll(new RegExp('<' + name + '\\b[^>]*>([\\s\\S]*?)</' + name + '\\s*>', 'gi'))].map((m) => m[1]);
const attr = (tag, name) => tag?.match(new RegExp("\\b" + name + "\\s*=\\s*([\"'])(.*?)\\1", 'i'))?.[2] ?? '';
const text = (value) => value.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const meta = (html, kind, name) => {
  const tag = tags(html, 'meta').find((candidate) => attr(candidate, kind).toLowerCase() === name && attr(candidate, 'content').trim());
  return attr(tag, 'content').trim();
};

function localRef(reference, pageFile) {
  let ref = reference.trim();
  if (ref.startsWith(ORIGIN + '/')) ref = ref.slice(ORIGIN.length);
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(ref)) return;
  const [pathPart = '', hash = ''] = ref.split('#', 2);
  const cleanPath = pathPart.split('?', 1)[0];
  const relative = cleanPath ? (cleanPath.startsWith('/') ? cleanPath.slice(1) : path.join(path.dirname(pageFile), cleanPath)) : pageFile;
  let target = path.join(ROOT, relative);
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!fs.existsSync(target) && path.extname(target) === '') target = path.join(target, 'index.html');
  assert(fs.existsSync(target), pageFile + ': broken local reference ' + reference);
  if (hash) {
    const ids = [...fs.readFileSync(target, 'utf8').matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]);
    assert(ids.includes(decodeURIComponent(hash)), pageFile + ': broken anchor ' + reference);
  }
}

function checkPage([file, lang, canonical]) {
  const html = read(file);
  assert.equal(attr(html.match(/<html\b[^>]*>/i)?.[0], 'lang'), lang, file + ': document lang');
  assert.equal(tags(html, 'h1').length, 1, file + ': exactly one h1');

  const links = tags(html, 'link');
  const canonicalLinks = links.filter((tag) => attr(tag, 'rel').toLowerCase().split(/\s+/).includes('canonical'));
  assert.equal(canonicalLinks.length, 1, file + ': exactly one canonical');
  assert.equal(attr(canonicalLinks[0], 'href'), canonical, file + ': canonical URL');
  const gotHreflang = Object.fromEntries(links
    .filter((tag) => attr(tag, 'rel').toLowerCase().split(/\s+/).includes('alternate'))
    .map((tag) => [attr(tag, 'hreflang'), attr(tag, 'href')]));
  assert.deepEqual(gotHreflang, hreflang, file + ': hreflang links');

  for (const [kind, name] of [['name', 'description'], ['property', 'og:title'], ['property', 'og:description'], ['property', 'og:image']]) {
    const value = meta(html, kind, name);
    assert(value, file + ': metadata ' + name);
    if (name === 'og:image') localRef(value, file);
  }

  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  assert(scripts.length > 0, file + ': JSON-LD required');
  for (const match of scripts) {
    const scriptTag = '<script' + match[1] + '>';
    assert.equal(attr(scriptTag, 'type').toLowerCase(), 'application/ld+json', file + ': executable script');
    let data;
    assert.doesNotThrow(() => { data = JSON.parse(match[2].trim()); }, file + ': valid JSON-LD');
    assert(data && typeof data === 'object' && data['@context'] && data['@type'], file + ': JSON-LD shape');
  }

  assert(links.some((tag) => attr(tag, 'rel').toLowerCase().split(/\s+/).includes('stylesheet') && attr(tag, 'href') === '/kinetto/assets/kinetto.css'), file + ': KINETTO stylesheet');
  assert(!/<form\b|(?:apps\.apple\.com|testflight\.apple\.com|itunes\.apple\.com)/i.test(html), file + ': form or store link is forbidden');
  assert(tags(html, 'details').length > 0 && tags(html, 'summary').length > 0, file + ': details/summary required');
  assert(bodies(html, 'nav').some((body) => /href\s*=\s*["']#[^"']+["']/i.test(body)), file + ': anchor menu required');
  for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) localRef(match[1], file);
}

try {
  for (const page of pages) checkPage(page);
  const hub = read('index.html');
  const productNames = ['AquaTick', 'Korea Map Link', 'KINETTO'];
  const hubNames = bodies(hub, 'h2').map(text).filter((name) => productNames.includes(name));
  assert.deepEqual(hubNames, productNames, 'hub app-card h2 order');
  for (const product of ['/aquatick/', '/korea-map-link/', '/kinetto/']) {
    assert([...hub.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)].some((m) => m[1].startsWith(product)), 'hub link ' + product);
  }
  for (const match of hub.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) localRef(match[1], 'index.html');

  const sitemap = read('sitemap.xml');
  for (const [, , url] of pages) assert(sitemap.includes('<loc>' + url + '</loc>'), 'sitemap URL ' + url);
  assert.equal((sitemap.match(/<loc>https:\/\/sparkish-xyz\.github\.io\/kinetto\/(?:ko\/|ja\/)?<\/loc>/g) ?? []).length, 3, 'sitemap has exactly three KINETTO URLs');
  console.log('[check:kinetto] pass');
} catch (error) {
  console.error('[check:kinetto] ' + error.message);
  process.exitCode = 1;
}
