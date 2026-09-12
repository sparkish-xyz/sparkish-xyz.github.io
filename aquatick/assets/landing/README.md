# AquaTick landing imagery

Updated 2026-09-12 for Quiet Companion.

- `en/home.png`, `en/vault.png`, `en/history.png`, `ko/home.png`, `ja/home.png`: actual AquaTick 1.2.2 (127) simulator captures, 1206×2622. Built from the current native source and launched with its Debug screenshot mode and in-memory sample records on iPhone 17 Pro. Captured and visually verified through mobile MCP. These are sample data, not personal records or generated UI.
- `en/watch.png`: raw English Watch Home capture, 416×496, reused unchanged from `fastlane/screenshots/en-US/APP_WATCH_SERIES_10_01_home.png` in the AquaTick native repo. The Fastlane screenshot generator copies this target directly from the raw Watch capture and validates its size; it does not add a promotional composition. This is an existing capture, not a new capture of build 127.
- `cat-hero.png`: official native `CatHydrationHero.imageset/cat-hydration-hero@3x.png`, 1024×900. Existing brand art, reused unchanged.
- `cat-resting.png`: generated decorative illustration in the selected concept's style, 1560×1008, white RGB background. CSS multiply blends it into the page.
- `leaf-edge.png`: generated decorative branch, 992×1586, white RGB background. CSS multiply blends it into the page.

Only decorative art is generated. Product screenshots are actual app UI. Korean/Japanese pages identify English supporting screenshots. The quick-add detail uses CSS clipping of each locale's Home capture, and the gallery links to complete raw captures.
