# AquaTick landing imagery — October 4, 2026

The motion redesign uses localized native UI, a real screen recording, and one decorative generated background. All app data shown is synthetic screenshot-fixture data.

- `{ko,en,ja}/home.png`, `home-after.png`, `history.png`: captured in this session from local AquaTick **1.2.5 (142)** on the dedicated AquaTick Amplitude QA iPhone 17 / iOS 27 simulator, using `-AquaTickScreenshotMode` with the matching `-AppleLanguages` and `-AppleLocale`. Home is 1.55L; after one real +200mL tap, it is 1.75L. Images are raw 1206×2622 captures saved by mobile MCP, with no UI drawn or generated.
- `{ko,en,ja}/vault.png`: unchanged native captures from `AquaTick/screenshots/app-store-20261004/raw/iphone/{ko,en-US,ja}_vault.png`, also version 1.2.5 (142) with screenshot fixtures.
- `{ko,en,ja}/watch.png`: unchanged 416×496 localized native exports from `AquaTick/fastlane/screenshots/{ko,en-US,ja}/APP_WATCH_SERIES_10_01_home.png`. These are pre-existing Watch captures, not a claim of the current iPhone build's Watch UI.
- `{ko,en,ja}/quick-add.mp4`: genuine recordings of a +200mL tap in the above screenshot mode. Encoded H.264, 604px wide, 30fps, no audio, fast-start metadata. Trimmed to about 1.8s before the action and held on the final recorded frame for 1.5s. Playback is explicitly requested by the visitor and has native controls. The website does not record real water intake.
- `water-light.webp`: decorative 1536×1024 image, generated with the built-in image tool on October 4, 2026; quality-85 WebP, about 67 KiB. Original: `/Users/byunghak/.codex/generated_images/01a10487-6301-7a52-88b7-3a6a119c6598/exec-f767084f-d6f4-4b49-b7b8-421c64d9dccf.png`.

Generation prompt: Premium macro photographic background of crystal-clear water in pale mint and warm off-white; broad subtle ripples and caustic reflections concentrated toward the lower third and edges; clean pale negative space in the upper half and center; soft morning studio light, no objects, leaves, text, logos, interface, phone or border. The frame contains only the water surface, no basin rim.

Native repository: `/Users/byunghak/Documents/xcode_workspace/MiniProjects/AquaTick`. Original screen recordings and session captures are under `/tmp/aquatick-motion-captures/`; delivered optimized assets are all stored in this folder.

The original cat and resting-cat assets below remain in use. The leaf asset remains available for older references but is not used by the new composition.

---

## Previous capture provenance (September 12, 2026)

# AquaTick landing imagery

Updated 2026-09-12 for Quiet Companion.

- `en/home.png`, `en/vault.png`, `en/history.png`, `ko/home.png`, `ja/home.png`: actual AquaTick 1.2.2 (127) simulator captures, 1206×2622. Built from the current native source and launched with its Debug screenshot mode and in-memory sample records on iPhone 17 Pro. Captured and visually verified through mobile MCP. These are sample data, not personal records or generated UI.
- `en/watch.png`: raw English Watch Home capture, 416×496, reused unchanged from `fastlane/screenshots/en-US/APP_WATCH_SERIES_10_01_home.png` in the AquaTick native repo. The Fastlane screenshot generator copies this target directly from the raw Watch capture and validates its size; it does not add a promotional composition. This is an existing capture, not a new capture of build 127.
- `cat-hero.png`: official native `CatHydrationHero.imageset/cat-hydration-hero@3x.png`, 1024×900. Existing brand art, reused unchanged.
- `cat-resting.png`: generated decorative illustration in the selected concept's style, 1560×1008, white RGB background. CSS multiply blends it into the page.
- `leaf-edge.png`: generated decorative branch, 992×1586, white RGB background. CSS multiply blends it into the page.

Only decorative art is generated. Product screenshots are actual app UI. Korean/Japanese pages identify English supporting screenshots. The quick-add section displays each locale's complete Home capture at its native aspect ratio, and the gallery links to complete raw captures.

### Web delivery variants

The decorative `cat-hero.webp`, `leaf-edge.webp`, and `cat-resting.webp` files are
lossless WebP encodings of their adjacent PNG originals. Localized templates use
these smaller files; PNG source assets and full-size screenshot links are retained.
Regenerate after changing an original with `cwebp -lossless -z 9 input.png -o output.webp`.
