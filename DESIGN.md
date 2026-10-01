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

## Sparkish hub — Studio, 2026-09-12

The user delegated the design direction and asked to proceed without candidate mockups. The root page is a studio portfolio for AquaTick and KINETTO: a large, left-aligned two-line promise, two product artwork panels, clear release status, a short studio note, and a compact footer. Keep the page focused on product discovery.

- Macrostructure: Portfolio Grid, adapted for two products without unnecessary filters. Nav: N1a with two real anchor destinations. Footer: Ft2.
- Theme: warm near-white paper, dark green ink, original AquaTick mint and KINETTO dark/green product artwork. Avenir Next display and native system body inherit the existing font tokens.
- Root-only color/spacing variables use the `--hub-*` namespace in `tokens.css`. Shared product token values remain unchanged.
- Source: `site-src/templates/index.html`; generated output: `index.html`. Retain the existing static generator and no client JavaScript.
- Art: original AquaTick cat and three existing KINETTO Runner assets, with their natural aspect ratios. No invented product screenshots, reviews, usage counts, or metrics.
- Product links are whole-panel native anchors with explicit accessible names and descriptions. Focus is visible. Release labels distinguish Available now from In the making; KINETTO has no store destination.
- Mobile: one product per row, intact headings and status labels; validate 320, 375, 414, 768 and desktop. Respect reduced motion.
- Footer policy/support links are explicitly labelled AquaTick to avoid presenting its policy as a studio-wide policy.

## Other Sparkish products

AquaTick and KINETTO retain their route ownership, product-specific themes and behavior. Hub styling must not change either product's page styles.

## AlarmCrew — Friends at Seven, 2026-10-01

The user selected friends as the audience and a friendly black/orange mood, and confirmed the iOS app is publicly released. The page's primary action is App Store download; Android remains in preparation. Korean is canonical at `/alarmcrew/`, with English and Japanese at `/alarmcrew/en/` and `/alarmcrew/ja/`. All three share one layout and locale-matched iOS captures.

Split Studio composition: a left-aligned greeting and tactile morning illustration; a warm-paper Crew proof section; dark alarm and friend sections with alternating screenshot positions; native FAQ; platform-specific release actions and an inline studio footer. Nav uses two useful destinations plus a language disclosure. Original screenshot content is preserved; the new illustration is decorative. The build adds no runtime dependencies, analytics, or external fonts.

Source templates are in `site-src/templates/alarmcrew/`; CSS and the small disclosure-dismissal script are generated from templates with the existing site generator. The `--ac-*` tokens in root `tokens.css` are scoped to AlarmCrew. Avenir Next display and the native body stack inherit the site's established typography, with Korean-native fallback. Mobile grids explicitly use `minmax(0, 1fr)`; actual screenshots retain their aspect ratios, and full-size originals are linked.

Product sources: `AlarmCrew/ios/Projects/Features/Sources/{CrewFeature,AlarmFeature,SocialFeature}`, Android store draft copy, and actual release captures. Personal alarms, five-minute snooze, 8-character Crew invites, today's wake-up status and response times, and nickname-based friends are supported claims. Friend following and Crew membership stay distinct. The September PRD's gift/leaderboard promises are not used. Local-time, power, permissions, internet sync, logout, advertising and account controls are explained in the FAQ.

### Exports — AlarmCrew

The full CSS source of truth is the `--ac-*` block in `/tokens.css`. These mappings are portable references; this static site does not depend on Tailwind or shadcn.

```css
/* CSS variables — source roles */
:root {
  --ac-color-night: oklch(17% 0.006 55);
  --ac-color-light: oklch(96% 0.012 75);
  --ac-color-orange: oklch(77% 0.16 60);
  --ac-color-accent-ink: var(--ac-color-night);
  --ac-color-muted: oklch(75% 0.012 65);
  --ac-color-surface: oklch(22% 0.006 55);
  --ac-color-focus: oklch(84% 0.14 70);
}
/* Tailwind v4 — load tokens.css before this mapping */
@theme inline {
  --color-background: var(--ac-color-night);
  --color-foreground: var(--ac-color-light);
  --color-primary: var(--ac-color-orange);
  --color-primary-foreground: var(--ac-color-accent-ink);
  --color-muted-foreground: var(--ac-color-muted);
  --font-display: var(--ac-font-display);
  --font-sans: var(--ac-font-body);
}
/* shadcn/ui — role mapping */
.alarmcrew-theme {
  --background: var(--ac-color-night);
  --foreground: var(--ac-color-light);
  --card: var(--ac-color-surface);
  --card-foreground: var(--ac-color-light);
  --primary: var(--ac-color-orange);
  --primary-foreground: var(--ac-color-accent-ink);
  --muted: var(--ac-color-surface);
  --muted-foreground: var(--ac-color-muted);
  --border: var(--ac-color-rule);
  --ring: var(--ac-color-focus);
  --radius: var(--ac-radius-small);
}
```

```json
{
  "alarmcrew": {
    "color": {
      "$type": "color",
      "background": { "$value": { "colorSpace": "oklch", "components": [0.17, 0.006, 55], "alpha": 1 } },
      "foreground": { "$value": { "colorSpace": "oklch", "components": [0.96, 0.012, 75], "alpha": 1 } },
      "accent": { "$value": { "colorSpace": "oklch", "components": [0.77, 0.16, 60], "alpha": 1 } },
      "accentInk": { "$value": "{alarmcrew.color.background}" },
      "muted": { "$value": { "colorSpace": "oklch", "components": [0.75, 0.012, 65], "alpha": 1 } },
      "surface": { "$value": { "colorSpace": "oklch", "components": [0.22, 0.006, 55], "alpha": 1 } },
      "focus": { "$value": { "colorSpace": "oklch", "components": [0.84, 0.14, 70], "alpha": 1 } }
    }
  }
}
```
