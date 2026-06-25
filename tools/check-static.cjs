const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function hasFile(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function missingPaths(paths) {
  return paths.filter((relativePath) => !hasFile(relativePath));
}

function reportGroup(label, paths) {
  const missing = missingPaths(paths);

  if (missing.length === 0) {
    return true;
  }

  console.error(`[check-static] Missing ${label}:`);
  for (const relativePath of missing) {
    console.error(`- ${relativePath}`);
  }

  return false;
}

const requiredRootFiles = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'app-ads.txt',
  'package.json',
  'package-lock.json',
  'playwright.config.ts',
  'tsconfig.json',
];

const requiredRouteFiles = [
  'en/index.html',
  'ja/index.html',
  'ko/index.html',
  'aquatick/index.html',
  'aquatick/en/index.html',
  'aquatick/ja/index.html',
  'aquatick/ko/index.html',
  'korea-map-link/index.html',
  'korea-map-link/en/index.html',
  'korea-map-link/fr/index.html',
  'korea-map-link/ja/index.html',
  'korea-map-link/ko/index.html',
  'korea-map-link/privacy/index.html',
  'korea-map-link/support/index.html',
  'korea-map-link/zh-Hans/index.html',
  'korea-map-link/zh-Hant/index.html',
];

const requiredAssetFiles = [
  'assets/aquatick-app-icon.png',
  'assets/cat-empty.png',
  'assets/cat-hero.png',
  'assets/cat-thirsty.png',
  'assets/screenshot-iphone-home.png',
  'assets/screenshot-iphone-history.png',
  'assets/screenshot-iphone-settings.png',
  'assets/screenshot-watch-home.png',
  'aquatick/assets/aquatick-app-icon.png',
  'aquatick/assets/aquatick-site.css',
  'aquatick/assets/aquatick-site.js',
  'aquatick/assets/cat-empty.png',
  'aquatick/assets/cat-hero.png',
  'aquatick/assets/cat-thirsty.png',
  'aquatick/assets/screenshot-iphone-home.png',
  'aquatick/assets/screenshot-iphone-history.png',
  'aquatick/assets/screenshot-iphone-settings.png',
  'aquatick/assets/screenshot-watch-home.png',
  'korea-map-link/assets/app-icon.png',
  'korea-map-link/assets/kmb-site.css',
  'korea-map-link/assets/screenshot-home.png',
  'korea-map-link/assets/screenshot-onboarding.png',
  'korea-map-link/assets/screenshot-place-detail.png',
  'korea-map-link/assets/screenshot-resolve.png',
  'korea-map-link/assets/screenshot-taxi.png',
];

let hasFailure = false;

hasFailure = !reportGroup('root files', requiredRootFiles) || hasFailure;
hasFailure = !reportGroup('route files', requiredRouteFiles) || hasFailure;
hasFailure = !reportGroup('asset files', requiredAssetFiles) || hasFailure;

if (hasFailure) {
  process.exit(1);
}

console.log('[check-static] Required root, route, and asset files are present.');
