# Sparkish static site design system

## AquaTick — Quiet Companion, 2026-09-12

The user selected the first displayed Quiet Companion mockup after a Safari design audit and explicitly requested a fresh redesign. This replaces the previous AquaTick Workbench/card-count contract. The source target is `exec-20c1c373-bf59-45df-a6d7-65b464c3415e.png`; the audit and concept mapping live in the current task's `aquatick-design-review/redesign-context.md` artifact.

### Direction

Warm paper, quiet mint, navy ink, the original watercolor kitten, and real product imagery. A broad split hero on desktop leads into alternating product stories. Type and whitespace create hierarchy; avoid a repeated feature-card inventory. Supporting language pages share layout and behavior with natural localized copy.

- Hero: a two-line daily-care promise, concise explanation, one filled App Store action, a quiet outlined tour action (inline on mobile), compatibility, real Home screenshot and original cat.
- `#features`: real Home quick-add detail and a short explanation of quick logging and up to 6 favorites.
- Watch: a mint band, accurate wrist-logging copy, a real screen capture. Never draw a new watch UI and present it as the product.
- `#screens`: two actual screenshots, Cup Vault and History, with concise explanations and full-size image links. Supporting English screenshots on other locales must be identified as English.
- `#privacy`: no account, optional Health, calm resting-cat illustration, native disclosure for storage, sync, subscriptions, ads and analytics.
- `#pricing`: Pro benefits and the app as the authoritative source for local subscription pricing, without repeated or unverified fixed dollar amounts.
- Close: a concise download reminder and compact footer with support, privacy, terms and Pro.

### Product truth

Native AquaTick source is the implementation authority for current features. Marketing images are visual references, not authority for feature claims.

- iOS 26.0+; iPhone and Apple Watch. No Android, visionOS or aquarium claims.
- No AquaTick account is required; Apple Health is optional.
- Home and saved cups support quick water logging; favorites cap is 6.
- The small Quick Add widget supports +200/+300 logging; Home/Grass widgets and Live Activity/Dynamic Island must not all be described as interactive loggers. Live Activity/Dynamic Island show progress.
- Pro includes ad removal and optional iCloud hydration-record sync. Cup photos stay on-device. The previous “ad-free only” claim is stale.
- RevenueCat supplies localized subscription prices in the app. Do not assert a dollar price based on old website copy.
- RevenueCat, Google Mobile Ads, Firebase Analytics and Crashlytics are used. Do not claim that every kind of data stays on device or that analytics is completely anonymous. Keep the published Privacy Policy link; do not imply the website is a legal audit.

Source references: native `Constant.homePresetLimit` (6), `KitSettings.swift`, `SubscriptionPaywallViewController.swift`, `AquaTickQuickAddWidget.swift`, Live Activity Swift source, `docs/PRODUCT_ANALYTICS.md` and `RevenueCatSubscriptionAdapter.swift`.

### Runtime tokens and typography

`site-src/styles/aquatick/01-foundation-header.css` contains AquaTick's scoped overrides after importing the unchanged shared `/tokens.css`.

| Role | Value |
| --- | --- |
| Paper | `--paper: #fcfaf6` |
| Near-white surface | `--cream: #fffefd` |
| Ink | `--ink: #102e3c` |
| Body secondary | `--muted: #5c6f78` |
| Mint action | `--water-accent: #087f78` |
| Action hover | `--accent-hover: #066a65` |
| Pale mint section | `--mint-soft: #e8f4ef` |
| Divider | `--line: #d9e2df` |
| Focus | `--color-focus: #075d9c` |
| Handwritten annotation | `--color-note: #607e8b` |

Display: Avenir Next / Trebuchet MS / sans-serif, weight 700. Body: native system sans, normally weight 400. Decorative notes: Bradley Hand / Segoe Print / cursive, localized system text for KO/JA. No italic headings. Hero 28–96px responsive; section headings 32–50px; body 17–24px depending on role; footer and secondary labels 12–15px.

Content width is 1200px, header 1280px. Desktop hero is asymmetric; below 850px it stacks with a focused full screenshot. Screenshots retain their aspect ratios. The focused Home quick-add detail uses an intentional crop, and full-size original links are available below. All image-bearing grid tracks use `minmax(0, 1fr)`.

### Interaction and accessibility

- Use native `<details>` for language/mobile navigation and privacy disclosure.
- Menu closes on selected link, outside click, and Escape. Escape returns focus to summary.
- No account, backend, demo controls or fake app interactions on the marketing page.
- Primary buttons are mint with light text. Links and summaries have visible keyboard focus and usable tap areas.
- A skip link reaches `#main`; headings and images have meaningful semantics.
- Anchors clear the sticky header. No autoplay, parallax or scrolling reveals; reduced-motion disables smooth scrolling and transitions.
- Verify 320, 375, 414, 768px and desktop in Safari, including menu and disclosure states and localized label wrapping.
- Do not substitute a passing source check for visual verification.

### Asset policy

Reuse the original app icon and high-resolution native cat. Product screens must be genuine captures and clearly localized or labelled. Generated resting-cat/leaf artwork is decorative only and must not claim product behavior. Keep provenance beside new assets. Never use generated phone/watch UI as an actual screenshot. No generated metric claims, reviews or testimonials.

### Build ownership

Editable templates: `site-src/templates/aquatick/{en,ko,ja}/index.html`.
CSS partials: `site-src/styles/aquatick/*.css`, ordered by existing manifest.
JS partials: `site-src/scripts/aquatick/*.js`, ordered by existing manifest.
Build with `npm run build:css`, `npm run build:js`, `npm run generate`; verify with `npm run check` and the menu behavioral check.

## Other Sparkish products

Sparkish hub, Korea Map Link, and KINETTO retain their existing layouts, source ownership and values. The shared `tokens.css` file and their dedicated styles are unchanged by this AquaTick redesign. Do not propagate AquaTick's mint/paper overrides into these products.
