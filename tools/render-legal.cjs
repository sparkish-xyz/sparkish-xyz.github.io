const fs = require('node:fs');
const path = require('node:path');

const sourceRoot = path.resolve(__dirname, '../site-src/legal');
const config = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'documents.json'), 'utf8'));
const languages = { en: 'English', ko: '한국어', ja: '日本語' };
const copy = {
  en: {
    hub: 'Support & Legal', intro: 'Help, privacy, and terms for each Sparkish app.',
    back: 'Back to the app', skip: 'Skip to content', documents: 'Documents', toc: 'On this page',
    original: 'Document language', all: 'All app documents',
    privacy: 'Privacy Policy', terms: 'Terms of Use', support: 'Support', 'delete-account': 'Account & Data Deletion',
  },
  ko: {
    hub: '고객지원 및 법적 문서', intro: 'Sparkish 앱별 도움말, 개인정보 처리방침과 이용약관을 확인하세요.',
    back: '앱 소개로 돌아가기', skip: '본문으로 바로가기', documents: '문서', toc: '이 페이지의 목차',
    original: '문서 제공 언어', all: '모든 앱 문서',
    privacy: '개인정보 처리방침', terms: '이용약관', support: '고객지원', 'delete-account': '계정 및 데이터 삭제',
  },
  ja: {
    hub: 'サポート・法的文書', intro: 'Sparkishの各アプリのヘルプ、プライバシーポリシー、利用規約をご覧ください。',
    back: 'アプリ紹介に戻る', skip: '本文へ移動', documents: '文書', toc: 'このページの目次',
    original: '文書の言語', all: 'すべてのアプリの文書',
    privacy: 'プライバシーポリシー', terms: '利用規約', support: 'サポート', 'delete-account': 'アカウント・データ削除',
  },
};

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function hubPath(lang) {
  return lang === 'en' ? '/legal/' : `/legal/${lang}/`;
}

function documentLanguage(appId, kind, lang) {
  const app = config.apps[appId];
  const locales = app.documents[kind].locales;
  return locales[lang] ? lang : app.defaultLanguage;
}

function documentPath(appId, kind, lang) {
  const language = documentLanguage(appId, kind, lang);
  if (appId === 'aquatick' && kind === 'privacy') return '/aquatick/privacy/';
  return `${config.apps[appId].landings[language]}${kind}/`;
}

function languageLinks(locales, lang, target) {
  if (locales.length < 2) return '';
  return `<nav class="language-links" aria-label="${escapeHTML(copy[lang].original)}">${locales.map(language =>
    `<a href="${target(language)}" lang="${language}" hreflang="${language}"${language === lang ? ' aria-current="page"' : ''}>${languages[language]}</a>`,
  ).join('')}</nav>`;
}

function pageShell({ lang, title, route, alternates, content, appId = '' }) {
  const text = copy[lang];
  const description = `${title} — ${text.intro}`;
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHTML(description)}">
  <meta name="color-scheme" content="light">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <title>${escapeHTML(title)} | Sparkish</title>
  <link rel="canonical" href="${config.origin}${route}">
${Object.entries(alternates).map(([language, url]) => `  <link rel="alternate" hreflang="${language}" href="${config.origin}${url}">`).join('\n')}
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHTML(title)} | Sparkish">
  <meta property="og:description" content="${escapeHTML(description)}">
  <meta property="og:url" content="${config.origin}${route}">
  <link rel="stylesheet" href="/tokens.css">
  <link rel="stylesheet" href="/legal/assets/legal.css">
</head>
<body${appId ? ` data-app="${appId}"` : ''}>
  <a class="skip-link" href="#main">${text.skip}</a>
  <header class="site-header shell">
    <a class="brand" href="/">Sparkish<span aria-hidden="true">.</span></a>
    <a class="hub-link" href="${hubPath(lang)}">${text.hub}</a>
  </header>
${content}
  <footer class="site-footer shell"><span>© 2026 Sparkish</span><a href="${hubPath(lang)}">${text.all}</a></footer>
</body>
</html>
`;
}

function localizeReferences(body, appId, lang) {
  // Only rewrite the former document hosts. Third-party service policies remain authoritative links.
  const alarmRoutes = { 'privacy': 'privacy', 'terms': 'terms', 'delete-account': 'delete-account' };
  body = body.replace(/https:\/\/alarmcrew-support\.byunghak-kr\.chatgpt\.site\/(privacy|terms|delete-account)(?:\.html)?\/?/g,
    (_, kind) => `${config.origin}${documentPath('alarmcrew', alarmRoutes[kind], 'ko')}`);
  if (appId === 'alarmcrew') {
    body = body.replace(/href="\/(privacy|terms|delete-account)\.html"/g, (_, kind) => `href="${documentPath(appId, kind, lang)}"`);
  }
  body = body.replace(/href="https:\/\/sparkish-xyz\.github\.io(\/[^"\s]*)"/g, 'href="$1"');
  return body;
}

function documentPage(appId, kind, lang) {
  const app = config.apps[appId];
  const document = app.documents[kind].locales[lang];
  const sourcePath = path.resolve(sourceRoot, 'content', document.content);
  if (!sourcePath.startsWith(path.join(sourceRoot, 'content') + path.sep)) throw new Error('Unsafe document content path');
  let body = fs.readFileSync(sourcePath, 'utf8').trim();
  if (/<(?:script|iframe|form)\b|\bon\w+\s*=|javascript:/i.test(body)) throw new Error(`Unexpected active content in ${sourcePath}`);
  // The page header supplies the single H1; all authored paragraphs are kept.
  body = body.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');
  body = localizeReferences(body, appId, lang);
  body = body.replace(/<p>([\s\S]*?)<\/p>/g, (_, paragraph) => `<p>${paragraph.replace(/<br\s*\/?\s*>/g, '</p><p>')}</p>`);
  const headings = [];
  body = body.replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g, (_, heading) => {
    const id = `section-${headings.length + 1}`;
    headings.push({ id, heading });
    return `<h2 id="${id}">${heading}</h2>`;
  });
  const route = documentPath(appId, kind, lang);
  const locales = Object.keys(app.documents[kind].locales);
  const alternates = Object.fromEntries(locales.map(language => [language, documentPath(appId, kind, language)]));
  alternates['x-default'] = documentPath(appId, kind, app.defaultLanguage);
  const text = copy[lang];
  const toc = headings.map(({ id, heading }) => `<li><a href="#${id}">${heading}</a></li>`).join('');
  const content = `  <main id="main" class="shell document-layout">
    <aside class="document-sidebar">
      <a class="product-link" href="${app.landings[lang]}"><img src="${app.icon}" width="40" height="40" alt=""><span>${app.name}</span></a>
      <nav class="document-nav" aria-label="${text.documents}">${Object.keys(app.documents).map(item =>
        `<a href="${documentPath(appId, item, lang)}"${item === kind ? ' aria-current="page"' : ''}>${text[item]}</a>`,
      ).join('')}</nav>
      <nav class="desktop-toc" aria-label="${text.toc}"><p>${text.toc}</p><ul>${toc}</ul></nav>
      <details class="table-of-contents"><summary>${text.toc}</summary><ul>${toc}</ul></details>
    </aside>
    <div class="document-main">
      <header class="document-heading">
        <a class="back-link" href="${app.landings[lang]}">← ${text.back}</a>
        <p class="eyebrow">${app.name}</p>
        <h1>${escapeHTML(document.title)}</h1>
${languageLinks(locales, lang, language => documentPath(appId, kind, language))}
      </header>
      <article class="document-body" lang="${lang}" aria-label="${escapeHTML(document.title)}">${body}</article>
      <a class="back-link document-end" href="${app.landings[lang]}">← ${app.name} · ${text.back}</a>
    </div>
  </main>`;
  return pageShell({ lang, title: `${app.name} ${document.title}`, route, alternates, content, appId });
}

function hubPage(lang) {
  const text = copy[lang];
  const route = hubPath(lang);
  const alternates = Object.fromEntries(Object.keys(languages).map(language => [language, hubPath(language)]));
  alternates['x-default'] = hubPath('en');
  const content = `  <main id="main" class="shell document-hub">
    <header class="hub-heading"><p class="eyebrow">Sparkish</p><h1>${text.hub}</h1><p class="intro">${text.intro}</p>${languageLinks(Object.keys(languages), lang, hubPath)}</header>
    <div class="app-documents">${Object.entries(config.apps).map(([appId, app]) => `<section class="app-document-group" data-app="${appId}" aria-labelledby="${appId}-title">
      <a class="product-link" href="${app.landings[lang]}"><img src="${app.icon}" width="48" height="48" alt=""><h2 id="${appId}-title">${app.name}</h2></a>
      <nav aria-label="${app.name} ${text.documents}">${Object.keys(app.documents).map(kind => {
        const language = documentLanguage(appId, kind, lang);
        return `<a href="${documentPath(appId, kind, lang)}"><span>${text[kind]}</span>${language !== lang ? `<span class="content-language" lang="${language}">${languages[language]}</span>` : ''}<span aria-hidden="true">→</span></a>`;
      }).join('')}</nav>
    </section>`).join('')}</div>
  </main>`;
  return pageShell({ lang, title: text.hub, route, alternates, content });
}

function legalPages() {
  const pages = Object.keys(languages).map(lang => ({ file: hubPath(lang).slice(1) + 'index.html', render: () => hubPage(lang) }));
  for (const [appId, app] of Object.entries(config.apps)) {
    for (const [kind, document] of Object.entries(app.documents)) {
      for (const lang of Object.keys(document.locales)) {
        pages.push({ file: documentPath(appId, kind, lang).slice(1) + 'index.html', render: () => documentPage(appId, kind, lang) });
      }
    }
  }
  return pages;
}

module.exports = { legalPages, documentPath };
