# sparkish-xyz.github.io

Static GitHub Pages site for **Sparkish** apps.

## Structure

```
/
├── index.html              # Sparkish app catalog (hub)
├── robots.txt
├── sitemap.xml
├── llms.txt
├── app-ads.txt             # AdMob domain root (must stay here)
├── assets/                 # Legacy mirror of AquaTick assets (old /assets/ URLs)
├── ko/ en/ ja/             # Legacy redirect stubs → /aquatick/ko|en|ja/
└── aquatick/
    ├── index.html          # AquaTick language chooser + auto-redirect
    ├── ko/ en/ ja/         # Localized landing pages
    └── assets/             # AquaTick images (canonical paths)
└── korea-map-link/
    ├── index.html          # Language chooser → en/ko/ja/zh-*
    ├── en/ ko/ ja/ zh-Hans/ zh-Hant/
    ├── privacy/ support/   # App Store legal pages (English)
    ├── assets/             # App icon + screenshots
    └── firebase.json       # Optional deploy to korea-map-link.web.app
```

When AquaTick images change, update **`aquatick/assets/`** and copy the same files into **`assets/`** (legacy mirror).

## URLs

| Path | Purpose |
|------|---------|
| `/` | Sparkish portfolio hub (one app card: AquaTick) |
| `/aquatick/` | AquaTick language detector / chooser |
| `/aquatick/ko/`, `/aquatick/en/`, `/aquatick/ja/` | Localized AquaTick landings |
| `/ko/`, `/en/`, `/ja/` | Legacy stubs → redirect to `/aquatick/ko|en|ja/` |
| `/assets/*` | Legacy mirror of `/aquatick/assets/*` (same files, not a redirect) |
| `/korea-map-link/` | Korea Map Link chooser |
| `/korea-map-link/en/` … | Localized landings |
| `/korea-map-link/privacy/` | Privacy Policy (App Store) |
| `/korea-map-link/support/` | Support (App Store) |

AquaTick hreflang **x-default** is `https://sparkish-xyz.github.io/aquatick/`.

### AquaTick language preference

`localStorage.aquaLangPref` (`ko` | `en` | `ja`) is a **UX-only**, same-origin preference for the language chooser. It is not authentication and can be changed by any script on this origin.

## Local preview

```bash
python3 -m http.server 8080
# Hub: http://127.0.0.1:8080/
# AquaTick KO: http://127.0.0.1:8080/aquatick/ko/
```

## Tests

```bash
npm test
```

Runs Playwright route checks against `http://127.0.0.1:8080` (starts `python3 -m http.server` automatically).

## Design review (optional)

Requires a local server (absolute `/aquatick/assets/` paths):

```bash
python3 -m http.server 8080 &
npm run capture:local
TARGET_URL="https://sparkish-xyz.github.io/aquatick/ko/" npm run capture:deployed
```

`capture:local` only accepts `http://127.0.0.1:8080` / `localhost:8080` or `sparkish-xyz.github.io` URLs via `TARGET_URL`.

## CI

GitHub Actions (`.github/workflows/test.yml`) runs `npm test` on push/PR to `main`.