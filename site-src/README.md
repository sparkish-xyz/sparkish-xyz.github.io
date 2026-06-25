# Static Site Source

This directory owns the source contracts for the static GitHub Pages generator and asset builders.

- `generated-files.json` lists the text outputs copied by `tools/generate-site.cjs` from `templates/`.
- `routes.json` groups the current public route families without changing any URLs.
- `templates/` contains the committed snapshot sources for generated HTML and text files.
- `styles/*/manifest.json` and `scripts/aquatick/manifest.json` define the CSS/JS partials, output paths, and template output paths used by `tools/build-css.cjs`, `tools/build-js.cjs`, and `tools/verify-built-assets.cjs`.
- `data/assets.json` drives the AquaTick legacy image mirror policy, its read-only checker, and its syncer.

Sitemap alternates and route inventories are covered by the Playwright route contract tests, and `npm run verify:generated` keeps committed generated text files in lockstep with the templates.
