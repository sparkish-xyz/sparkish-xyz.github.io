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
├── aquatick/
    ├── index.html          # AquaTick language chooser + auto-redirect
    ├── ko/ en/ ja/         # Localized landing pages
    └── assets/             # AquaTick images (canonical paths)
└── kinetto/
    ├── index.html          # English canonical landing page
    ├── ko/ ja/             # Korean and Japanese landing pages
    └── assets/             # KINETTO app icon and landing-page CSS
```

When AquaTick images change, update **`aquatick/assets/`** and copy the same files into **`assets/`** (legacy mirror).

## URLs

| Path | Purpose |
|------|---------|
| `/` | Sparkish portfolio hub (two app cards: AquaTick and KINETTO) |
| `/aquatick/` | AquaTick language detector / chooser |
| `/aquatick/ko/`, `/aquatick/en/`, `/aquatick/ja/` | Localized AquaTick landings |
| `/ko/`, `/en/`, `/ja/` | Legacy stubs → redirect to `/aquatick/ko|en|ja/` |
| `/assets/*` | Legacy mirror of `/aquatick/assets/*` (same files, not a redirect) |
| `/kinetto/` | KINETTO English canonical landing page |
| `/kinetto/ko/`, `/kinetto/ja/` | KINETTO Korean and Japanese landing pages |

AquaTick hreflang **x-default** is `https://sparkish-xyz.github.io/aquatick/`.

### KINETTO release status

KINETTO source lives in `site-src/templates/kinetto/` and is published at `/kinetto/`, `/kinetto/ko/`, and `/kinetto/ja/`. It is an iOS coming-soon landing page; Android is planned for later. It has no signup form, email collection, or store button.

The story follows private running records → anonymous Crew growth → Cheer and Relay → privacy → FAQ → launch status. The Pulse Trail palette and product claims follow KINETTO’s PRD, glossary, privacy rules, and landing specification. The icon and three Runner images are copied unchanged from KINETTO’s iOS assets (`AppIcon.appiconset/AppIcon.png` and `FeatureOnboarding/Resources/onboarding-runner-01…03.png`). The run summary is a labelled concept with sample data, not a screenshot or a real activity record.

Edit `site-src/templates/kinetto/`, run `npm run generate`, then `npm run check`. Safari was used for this delivery’s desktop/mobile visual review, locale navigation, and native menu/FAQ keyboard interaction. No client JavaScript or new dependencies were added.

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
npm run capture:deployed
```

Captures are generated under `design-review-screenshots/<phase>/` and are intentionally gitignored.
The capture script only accepts `http://127.0.0.1:8080` / `localhost:8080` or `sparkish-xyz.github.io` URLs via `TARGET_URL`.

## CI

GitHub Actions (`.github/workflows/test.yml`) runs `npm test` on push/PR to `main`.
