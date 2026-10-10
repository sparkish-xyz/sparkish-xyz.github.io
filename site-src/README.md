# Static Site Source

This directory owns the source contracts for the static GitHub Pages generator and asset builders.

- `generated-files.json` lists the text outputs copied by `tools/generate-site.cjs` from `templates/`.
- `routes.json` groups the current public route families without changing any URLs.
- `templates/` contains the committed snapshot sources for generated HTML and text files.
- `templates/assets/firebase-config.js` and `templates/assets/site-analytics.js` own shared Firebase Analytics for the hub and nine localized landings. They generate to `/assets/`; collection runs on the production hostname, with explicit local DebugView opt-in via `?analytics_debug=1`.
- `styles/*/manifest.json` and `scripts/aquatick/manifest.json` define the CSS/JS partials, output paths, and template output paths used by `tools/build-css.cjs`, `tools/build-js.cjs`, and `tools/verify-built-assets.cjs`.
- `data/assets.json` drives the AquaTick legacy image mirror policy, its read-only checker, and its syncer.

Sitemap alternates and route inventories are covered by the Playwright route contract tests, and `npm run verify:generated` keeps committed generated text files in lockstep with the templates.

`legal/documents.json` and `legal/content/` own the project-hosted support and legal
documents. `tools/render-legal.cjs` renders them during the same generator run;
`verify:generated` also checks their committed output. See `legal/README.md` for
routes, original language coverage, and migration provenance.

## AquaTick search content

Edit all three localized AquaTick templates plus the language chooser and
`templates/llms.txt` when product facts change. Website locales (en/ko/ja) are
separate from the app's seven supported languages in `MobileApplication.inLanguage`.
Update each affected page's `dateModified` and sitemap `lastmod` together only when
its content changes. Keep pricing, privacy and FAQ answers visible in static HTML;
do not add unverified ratings or reviews to structured data.

The September 2026 content was checked against AquaTick's
`CoreKit/Sources/Constant.swift` (`homePresetLimit = 6`),
`DomainKit/Sources/Entities/WatchCupLayout.swift` (separate six-cup Watch layout),
`Application/Sources/WidgetExtension/AquaTickQuickAddWidget.swift` (logging intent),
and the public App Store listing (free download, seven languages, OS requirements).
The App Store's older five-favorite description needs a separate metadata update;
this repository cannot change that listing. Search Console indexing and real-user
Core Web Vitals must be checked after publishing; local tests do not measure them.

## Product guides and search content

`guides/documents.json` and `guides/content/` own the six authored product guides
(four Korean articles and two English equivalents). `tools/render-guides.cjs`
renders them through the existing generator using the shared document layout.
The stylesheet is in `templates/guides/assets/guides.css`; it also styles the
scoped product facts and guide navigation on all three AquaTick/AlarmCrew landings.
Register new guide routes in `routes.json`, `templates/sitemap.xml` and
`templates/llms.txt`. Add language alternates only for authored equivalents.

The October 4, 2026 guides use public product facts already verified for the
landings. AlarmCrew invite sharing and join steps were also checked against its
iOS `CrewDetailViewController.swift` and `AlarmListViewController.swift`. Real
screens remain clearly labelled as examples; there are no invented ratings,
reviews, subscription prices or unreleased Android downloads.

Run `npm run generate`, `npm run check` and `npm test` after editing.
`tests/guides.spec.ts` covers static reading with JavaScript disabled, metadata,
language alternates, working links/media, product facts and mobile layout.

The crawl policy already allows all bots. Search/AI citations require external
measurement after publishing; this site does not claim crawler visits or AI
recommendations were observed. No analytics or third-party requests were added by
this content update.

## AlarmCrew

Korean is canonical at `/alarmcrew/`; English and Japanese live under `/alarmcrew/en/` and `/alarmcrew/ja/`. Source snapshots are in `templates/alarmcrew/`, including product CSS/JS. The generator copies these through `generated-files.json`. Real screens and generated decorative artwork are in `alarmcrew/assets/` with provenance beside them.

App Store availability was confirmed by the user on 2026-10-01. Keep release status, App Store links, the hub, structured data and `llms.txt` consistent when changing it. Android remains in preparation. A browser that disables JavaScript can still read all content, use language links and native FAQ disclosures; JavaScript adds language-menu dismissal and the progressive scroll story described below.

### AlarmCrew Morning Edition, 2026-10-10

The cream/charcoal/coral redesign uses real locale-matched update previews alongside
localized release screenshots. Preview source and hashes live in
`alarmcrew/assets/{README.md,provenance.json}`. Keep the update-preview labels and
response-record semantics: dismissal does not confirm wakefulness. The new visual
tokens are isolated in the product stylesheet, and the existing JS remains the
native language-disclosure dismissal enhancement.

### AlarmCrew cinematic follow-up

The product CSS contains the cinematic overrides after its static foundation.
`templates/alarmcrew/assets/alarmcrew.js` owns the native language-menu behavior
and GSAP enhancement. The two local vendor files under `alarmcrew/assets/vendor/`
are pinned to the existing GSAP 3.14.2 dependency; their provenance is recorded
there. Do not load AquaTick's product-specific bundle into AlarmCrew.

Run `npm run generate`, `npm run check` and
`npx playwright test tests/alarmcrew.spec.ts tests/alarmcrew-motion.spec.ts`.
Preserve the no-JS fallback and the matchMedia cleanup on preference/size changes.

The English and Japanese hero, Crew and next-alarm images and full-size links
resolve under `alarmcrew/assets/preview/{en,ja}/`. Korean retains the original
`preview/{crew,home}` captures. `tests/alarmcrew.spec.ts` checks every app capture
and full-size preview link for language isolation, not only supporting figures.
