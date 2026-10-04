const fs = require('node:fs');
const path = require('node:path');
const { documentPath } = require('./render-legal.cjs');

const sourceRoot = path.resolve(__dirname, '../site-src/guides');
const documents = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'documents.json'), 'utf8'));
const { origin, apps } = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../site-src/legal/documents.json'), 'utf8'));
const labels = {
  ko: { skip: '본문으로 바로가기', back: '앱 소개로 돌아가기', guides: '사용법', toc: '이 페이지의 목차', languages: '문서 언어', updated: '최근 확인', support: '고객지원', download: 'App Store에서 받기', related: '관련 사용법' },
  en: { skip: 'Skip to content', back: 'Back to the app', guides: 'Guides', toc: 'On this page', languages: 'Guide language', updated: 'Last checked', support: 'Support', download: 'Get it on the App Store', related: 'Related guides' },
};
const stores = { aquatick: 'https://apps.apple.com/app/aquatick/id6762686013', alarmcrew: 'https://apps.apple.com/app/id6812283770' };
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

function renderGuide(guide) {
  const app = apps[guide.app];
  const text = labels[guide.lang];
  const equivalents = documents.filter(item => item.app === guide.app && item.topic === guide.topic);
  const related = documents.filter(item => item.app === guide.app && item.lang === guide.lang && item.route !== guide.route);
  const alternates = equivalents.length > 1 ? Object.fromEntries(equivalents.map(item => [item.lang, item.route])) : {};
  if (equivalents.length > 1) alternates['x-default'] = (equivalents.find(item => item.lang === 'en') ?? equivalents[0]).route;
  const sourcePath = path.resolve(sourceRoot, 'content', guide.content);
  if (!sourcePath.startsWith(path.join(sourceRoot, 'content') + path.sep)) throw new Error('Unsafe guide content path');
  let body = fs.readFileSync(sourcePath, 'utf8').trim();
  if (/<(?:script|iframe|form|h1)\b|\bon\w+\s*=|javascript:/i.test(body)) throw new Error(`Unexpected active content in ${sourcePath}`);
  const headings = [];
  body = body.replace(/<h2>(.*?)<\/h2>/g, (_, heading) => {
    const id = `section-${headings.length + 1}`;
    headings.push({ id, heading });
    return `<h2 id="${id}">${heading}</h2>`;
  });
  const toc = headings.map(item => `<li><a href="#${item.id}">${item.heading}</a></li>`).join('');
  const url = origin + guide.route;
  const title = `${guide.title} | ${app.name}`;
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', '@id': url + '#webpage', url, name: title, description: guide.description, inLanguage: guide.lang, dateModified: guide.modified, mainEntity: { '@id': url + '#article' } },
      { '@type': 'Article', '@id': url + '#article', headline: guide.title, description: guide.description, inLanguage: guide.lang, image: origin + guide.image,
        datePublished: guide.published, dateModified: guide.modified, mainEntityOfPage: { '@id': url + '#webpage' },
        author: { '@type': 'Organization', name: 'Sparkish', url: origin + '/' }, publisher: { '@id': origin + '/#organization' },
        about: { '@type': 'MobileApplication', name: app.name, url: origin + app.landings[guide.lang] } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Sparkish', item: origin + '/' },
        { '@type': 'ListItem', position: 2, name: app.name, item: origin + app.landings[guide.lang] },
        { '@type': 'ListItem', position: 3, name: guide.title, item: url },
      ] },
    ],
  };
  const links = related.map(item => `<a href="${item.route}">${escapeHTML(item.title)}</a>`).join('');
  return `<!doctype html>
<html lang="${guide.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHTML(guide.description)}">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <title>${escapeHTML(title)}</title>
  <link rel="canonical" href="${url}">
${Object.entries(alternates).map(([lang, route]) => `  <link rel="alternate" hreflang="${lang}" href="${origin}${route}">`).join('\n')}
  <link rel="describedby" href="/llms.txt" type="text/plain">
  <link rel="icon" href="${app.icon}" type="image/png">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHTML(title)}">
  <meta property="og:description" content="${escapeHTML(guide.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${origin}${guide.image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHTML(title)}">
  <meta name="twitter:description" content="${escapeHTML(guide.description)}">
  <meta name="twitter:image" content="${origin}${guide.image}">
  <link rel="stylesheet" href="/tokens.css">
  <link rel="stylesheet" href="/legal/assets/legal.css">
  <link rel="stylesheet" href="/guides/assets/guides.css">
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
</head>
<body class="guide-page" data-app="${guide.app}">
  <a class="skip-link" href="#main">${text.skip}</a>
  <header class="site-header shell"><a class="brand" href="/">Sparkish<span aria-hidden="true">.</span></a><a class="hub-link" href="${app.landings[guide.lang]}">${app.name} · ${text.back}</a></header>
  <main id="main" class="shell document-layout">
    <aside class="document-sidebar">
      <a class="product-link" href="${app.landings[guide.lang]}"><img src="${app.icon}" width="40" height="40" alt=""><span>${app.name}</span></a>
      <nav class="document-nav" aria-label="${text.related}">${links}<a href="${documentPath(guide.app, 'support', guide.lang)}">${text.support}</a></nav>
      <nav class="desktop-toc" aria-label="${text.toc}"><p>${text.toc}</p><ul>${toc}</ul></nav>
      <details class="table-of-contents"><summary>${text.toc}</summary><ul>${toc}</ul></details>
    </aside>
    <div class="document-main">
      <header class="document-heading">
        <p class="eyebrow">${app.name} · ${text.guides}</p>
        <h1>${escapeHTML(guide.title)}</h1>
        <p class="guide-meta">Sparkish · ${text.updated} <time datetime="${guide.modified}">${guide.modified}</time></p>
${equivalents.length > 1 ? `        <nav class="language-links" aria-label="${text.languages}">${equivalents.map(item => `<a href="${item.route}" lang="${item.lang}" hreflang="${item.lang}"${item.lang === guide.lang ? ' aria-current="page"' : ''}>${item.lang === 'ko' ? '한국어' : 'English'}</a>`).join('')}</nav>` : ''}
      </header>
      <article class="document-body" aria-label="${escapeHTML(guide.title)}">${body}</article>
      <div class="guide-actions"><a class="action" href="${stores[guide.app]}">${text.download}</a><a class="back-link" href="${app.landings[guide.lang]}">${text.back} →</a></div>
    </div>
  </main>
  <footer class="site-footer shell"><span>© 2026 Sparkish</span><nav class="footer-links" aria-label="${text.support}"><a href="${documentPath(guide.app, 'support', guide.lang)}">${text.support}</a><a href="${app.landings[guide.lang]}">${app.name}</a></nav></footer>
</body>
</html>
`;
}

function guidePages() {
  const routes = new Set();
  return documents.map(guide => {
    if (!apps[guide.app] || !labels[guide.lang] || !stores[guide.app] || !/^\/[a-z0-9/-]+\/$/.test(guide.route) || routes.has(guide.route)) throw new Error(`Invalid guide route: ${guide.route}`);
    routes.add(guide.route);
    return { file: guide.route.slice(1) + 'index.html', render: () => renderGuide(guide) };
  });
}

module.exports = { guidePages };
