# Static Site Source

This directory owns the source contracts for the static GitHub Pages generator and asset builders.

- `generated-files.json` lists the text outputs copied by `tools/generate-site.cjs` from `templates/`.
- `routes.json` groups the current public route families without changing any URLs.
- `templates/` contains the committed snapshot sources for generated HTML and text files.
- `styles/*/manifest.json` and `scripts/aquatick/manifest.json` define the CSS/JS partials, output paths, and template output paths used by `tools/build-css.cjs`, `tools/build-js.cjs`, and `tools/verify-built-assets.cjs`.
- `data/assets.json` drives the AquaTick legacy image mirror policy, its read-only checker, and its syncer.

Sitemap alternates and route inventories are covered by the Playwright route contract tests, and `npm run verify:generated` keeps committed generated text files in lockstep with the templates.

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

## AlarmCrew

Korean is canonical at `/alarmcrew/`; English and Japanese live under `/alarmcrew/en/` and `/alarmcrew/ja/`. Source snapshots are in `templates/alarmcrew/`, including product CSS/JS. The generator copies these through `generated-files.json`. Real screens and generated decorative artwork are in `alarmcrew/assets/` with provenance beside them.

App Store availability was confirmed by the user on 2026-10-01. Keep release status, App Store links, the hub, structured data and `llms.txt` consistent when changing it. Android remains in preparation. A browser that disables JavaScript can still read all content, use language links and native FAQ disclosures; JavaScript only adds language-menu dismissal.
