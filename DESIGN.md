# Sparkish static site design system

## AquaTick — One glass at a time, 2026-10-04

The user approved the proposed modern redesign and explicitly requested scroll choreography. This supersedes Quiet Companion's September no-motion rule. Public references are Apple AirPods Pro (product scale, sequential storytelling) and Dia (warmth and use-case selection), as studied in the current chat. These are structural references, not a pixel-cloning target.

### Direction and page sequence

The October 4 follow-up asks for a stronger resemblance to the supplied references. Product scale now leads: a floating navigation capsule, a restrained two-line promise, three overlapping native app captures, a curved foreground download area, warm near-white, dark green ink, and one deep navy Watch chapter. Large product stage → three-step logging close-up → Watch → selectable Cup Vault / History → privacy → Pro → product facts / guides / FAQ → download. Korean branding uses 물눈금 in the navigation; English and Japanese keep AquaTick. The user rejected the large background wordmark in the next review: do not reintroduce brand lettering behind the product.

- Hero: a short two-line promise at 44–64px on desktop. Genuine localized Home / Vault / History captures sit below it with clear breathing room; a curved foreground carries the download link and tour anchor. Water photography is a subdued texture. The original cat remains in the app captures and closing section.
- `#features`: real before/after captures of logging 200mL in screenshot fixture mode, three readable steps, and an explicitly opened real screen recording. Desktop scroll enlarges and pans the capture to the cup controls, then returns to the updated total. The visual is a crop of the native image, not a replacement app UI. Do not draw replacement app UI or present the website as recording a user's water.
- `#watch`: deep navy background, a larger native localized Watch capture and oversized headline, wrist logging. The Quick Add widget logs water; Live Activity and Dynamic Island show progress only.
- `#screens`: keyboard-operable tabs select real localized Vault / History captures. Without JavaScript, both stories are visible. Large captures extend through the bottom of the gallery panels, with full-size image links always available.
- Privacy, Pro, product reference, guide links and FAQs remain static HTML. No invented reviews, ratings, prices, adoption numbers or health outcomes.

### Product truth

Native source remains the implementation authority. iOS 26.0+ and watchOS 10.0+; iPhone and Apple Watch. No account required. Apple Health is optional and available without Pro. Home favorites are capped at 6; Watch has its own up-to-6-cup layout. Pro removes ads and offers optional iCloud hydration-record sync; cup photos remain on-device. The app supplies current localized monthly/yearly subscription prices. RevenueCat, Google Mobile Ads, Firebase Analytics, Crashlytics and Amplitude are disclosed in the existing privacy content. No blanket all-data-on-device claim.

### Tokens and typography

Shared `/tokens.css` and the older foundation remain intact. Product-specific overrides live under `.aqua-story` in `site-src/styles/aquatick/07-scroll-story.css`:

- Paper `#fafbf8`, surface `#ffffff`, ink `#123c3a`, secondary text `#57716c`.
- Action mint `#087f78`, hero mint `#b2dece`, soft mint `#eaf3ec`, gallery blue `#eaf0f4`, navy `#0b242a`, navy secondary `#b1c9c6`.
- Existing Avenir Next / Trebuchet MS display and native system body stacks; no external fonts. Roman headings; natural Korean/Japanese wrapping.
- Content width up to 1200px; desktop hero heading 44–64px, mobile 28–38px (Japanese 25–34px). No large brand wordmark. The product collage deliberately extends toward the viewport edges.
- Actual screenshots retain their aspect ratios, with restrained rounding and shadows. No fabricated hardware frames.

### Motion and accessibility

- GSAP / ScrollTrigger 3.14.2 are pinned and served locally through the existing JS builder. No third-party runtime requests.
- Desktop at least 900px wide and 760px tall: native scroll drives a 180svh sticky hero (headline recedes, captures spread and enlarge, download remains visible), a 230svh logging chapter with a CSS-sticky scene, before/after crossfade, and active step emphasis. The page always uses native scrolling.
- On smaller or shorter viewports, the story is a regular vertical flow. Video is user-initiated on all devices; no initial video download or autoplay loop.
- Motion uses reversible `gsap.matchMedia` contexts. Changing reduced-motion or viewport resets transforms and removes the tall sticky chapter. Reduced-motion uses readable static content.
- Gallery supports arrow keys, Home/End and a roving tab stop; selecting a panel does not scroll the page. Without JS, show both panels.
- Video uses a native modal dialog, native controls, Escape/close/backdrop dismissal, return focus, and pause on close, page hide or hidden tab. Without JS, its link opens the MP4 directly.
- Retain native language/privacy disclosures, menu dismissal, skip link, visible focus, and static SEO/product answers.

### Asset provenance and build ownership

See `aquatick/assets/landing/README.md`. Home, after-entry, History and recordings were captured from native AquaTick 1.2.5 (142), with synthetic screenshot fixtures; Vault uses the existing October 4 native captures. Watch captures come from the native repository's existing localized raw exports. Decorative water is generated, never product UI.

Edit `site-src/templates/aquatick/{ko,en,ja}/index.html`, CSS/JS partials and manifests. Build with `npm run build:css`, `npm run build:js`, `npm run generate`. Run `npm run check`, `node tools/test-aquatick-menu.cjs`, `npm test`. `tests/aquatick-motion.spec.ts` covers scroll reversal, responsive/reduced-motion cleanup, keyboard tabs, requested video loading and dismissal, and no-JS reading. Verify visually at 320, 375, 414, 768 and desktop; tests do not replace visual review.

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
