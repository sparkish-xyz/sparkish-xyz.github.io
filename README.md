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
| `/` | Sparkish portfolio hub (AquaTick, KINETTO, and AlarmCrew) |
| `/aquatick/` | AquaTick language detector / chooser |
| `/aquatick/ko/`, `/aquatick/en/`, `/aquatick/ja/` | Localized AquaTick landings |
| `/ko/`, `/en/`, `/ja/` | Legacy stubs → redirect to `/aquatick/ko|en|ja/` |
| `/assets/*` | Legacy mirror of `/aquatick/assets/*` (same files, not a redirect) |
| `/kinetto/` | KINETTO English canonical landing page |
| `/kinetto/ko/`, `/kinetto/ja/` | KINETTO Korean and Japanese landing pages |
| `/alarmcrew/` | AlarmCrew Korean canonical landing page |
| `/alarmcrew/en/`, `/alarmcrew/ja/` | AlarmCrew English and Japanese landing pages |
| `/legal/`, `/legal/ko/`, `/legal/ja/` | Localized app support and legal document index |
| `/aquatick/privacy/` | AquaTick's original English privacy policy |
| `/aquatick/en/terms/`, `/aquatick/ko/terms/`, `/aquatick/ja/terms/` | Apple Standard EULA information |
| `/aquatick/en/support/`, `/aquatick/ko/support/`, `/aquatick/ja/support/` | Localized AquaTick support |
| `/kinetto/privacy/`, `/kinetto/terms/`, `/kinetto/support/` | KINETTO English documents (also under `/kinetto/ko/` and `/kinetto/ja/`) |
| `/alarmcrew/privacy/`, `/alarmcrew/terms/`, `/alarmcrew/support/` | AlarmCrew Korean documents |
| `/alarmcrew/delete-account/` | Korean and English account/data deletion instructions |

AquaTick hreflang **x-default** is `https://sparkish-xyz.github.io/aquatick/`.

All landing-page support and policy links now open this project's static HTML.
The shared document layout includes app navigation, a section contents list,
available-language links, keyboard access, mobile layout, and print styles. It
requires no JavaScript, API calls, or new dependencies. Authored source and
migration details live in `site-src/legal/`; run `npm run generate` after editing.
Original policy languages and effective dates are retained. AquaTick's terms
page links to its existing Apple Standard EULA on Apple's official website.

### AlarmCrew landing page

AlarmCrew targets friends building a shared morning routine. Its story is shared wake-up status → personal alarm settings → finding friends → practical FAQ → platform availability. The user chose a friendly black/orange direction; the page uses an alternating Split Studio layout, the original app icon, three actual iOS screens localized in Korean/English/Japanese, and one decorative generated morning illustration.

As of **October 1, 2026**, the user confirmed the iOS app is publicly released. The hero and release section link to `https://apps.apple.com/app/id6812283770`. Android remains in preparation for Google Play; no Android store button is shown. The product source is `/Users/byunghak/Documents/vscode_workspace/AlarmCrew`. Source code, rather than older PRD plans, establishes the 8-character Crew invites, separate friend/Crew membership, personal alarms, five-minute snooze, and wake-up status. Rankings, gift alarms, and guaranteed waking are not advertised.

Edit `site-src/templates/alarmcrew/` and run `npm run generate`, then `npm run check` and `npx playwright test tests/alarmcrew.spec.ts`. Product tokens are namespaced `--ac-*` in `/tokens.css`; page CSS/JS are snapshot templates copied by the existing generator. Change launch status consistently across all three pages, the hub, JSON-LD, `llms.txt`, and route tests. App release and website publishing are separate: this change prepares committed static output for the existing GitHub Pages workflow.

See `alarmcrew/assets/README.md` for screenshot provenance and the illustration prompt. The page adds no analytics, signup forms, third-party font requests, or runtime dependencies.

### KINETTO release status

KINETTO source lives in `site-src/templates/kinetto/` and is published at `/kinetto/`, `/kinetto/ko/`, and `/kinetto/ja/`. It is an iOS coming-soon landing page; Android is planned for later. It has no signup form, email collection, or store button.

The story follows private running records → anonymous Crew growth → Cheer and Relay → privacy → FAQ → launch status. The Pulse Trail palette and product claims follow KINETTO’s PRD, glossary, privacy rules, and landing specification. The icon and three Runner images are copied unchanged from KINETTO’s iOS assets (`AppIcon.appiconset/AppIcon.png` and `FeatureOnboarding/Resources/onboarding-runner-01…03.png`). The run summary is a labelled concept with sample data, not a screenshot or a real activity record.

Edit `site-src/templates/kinetto/`, run `npm run generate`, then `npm run check`. Safari was used for this delivery’s desktop/mobile visual review, locale navigation, and native menu/FAQ keyboard interaction. No client JavaScript or new dependencies were added.

### AquaTick motion landing page

The October 4 redesign combines a restrained two-line headline, overlapping native app captures, a floating navigation capsule, a native-scroll logging close-up, a dark Watch chapter, and keyboard-accessible Cup Vault / History tabs. The desktop hero stays in view while the headline recedes and the captures spread and enlarge; its curved foreground keeps the download action visible. It uses real localized screen captures and user-requested screen recordings. Smaller viewports and reduced-motion users get a regular vertical story. Static HTML remains complete without JavaScript.

Author new styles in `site-src/styles/aquatick/07-scroll-story.css`, behavior in `site-src/scripts/aquatick/05-scroll-story.js`, and content in the three existing localized templates. GSAP 3.14.2 is pinned and served locally from the JS manifest; update instructions are in `site-src/scripts/aquatick/vendor/NOTICE.md`. Run `npm run build:css`, `npm run build:js`, `npm run generate`, `npm run check`, and `npm test`. The asset provenance is in `aquatick/assets/landing/README.md`.

### AquaTick language preference

`localStorage.aquaLangPref` (`ko` | `en` | `ja`) is a **UX-only**, same-origin preference for the language chooser. It is not authentication and can be changed by any script on this origin.

## Local preview

```bash
python3 tools/serve-static.py
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
python3 tools/serve-static.py &
npm run capture:local
npm run capture:deployed
```

Captures are generated under `design-review-screenshots/<phase>/` and are intentionally gitignored.
The capture script only accepts `http://127.0.0.1:8080` / `localhost:8080` or `sparkish-xyz.github.io` URLs via `TARGET_URL`.

## CI

GitHub Actions (`.github/workflows/test.yml`) runs `npm test` on push/PR to `main`.
