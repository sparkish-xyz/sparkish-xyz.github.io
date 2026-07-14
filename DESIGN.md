# Sparkish Static Site Design System

AquaTick product direction changed: the AquaTick landing page redesign is allowed under this contract. The target is a soft cream paper canvas with sky-blue primary actions, navy text, and friendly hydration + cat energy arranged as a screenshot-led Workbench. The rhythm is left-biased and product-led: compact navigation, real app captures, natural-height cards, and a statement close. Korea Map Link and the Sparkish hub are unchanged under this plan.

Loaded frontend references: `references/design/README.md`, `references/perfection/README.md`, and `references/typescript/README.md` for the design-system gate, frontend quality gate, and strict test-edit rules.

## 1. Atmosphere & Identity

### AquaTick

Soft cream paper canvas, sky-blue primary actions, subtly blue-tinted surfaces, and navy text. The page should feel like a friendly hydration + cat app, not an aquarium product and not a broad health dashboard. Real product screenshots and the product cat carry the visual proof; CSS must not redraw iPhone, Watch, browser, or IDE chrome around them.

Product facts unchanged: Home Quick Add logs +200/+300, Cup Vault favorites max 5, Apple Watch logging, widgets/Live Activity/Dynamic Island are glance-only, no account, Health is optional, no selling. Pro is $0.99/mo or $5.99/yr for ad-free only. AquaTick is iOS 26.0+ with Apple Watch support; no visionOS, no Google Play, no aquarium.

Locked section order: compact sticky header → hero (headline with accent word, proof chips, App Store CTA, iPhone+Watch screenshot figures) → `#features` with 4 `.summary-card` → `#screens` with 6 natural-height `.core-feature-card` cards (home/widget, watch, vault, history, live activity, health; vault image required) → `#privacy` with 4 `.privacy-col` facts + connected third-party disclosure → `#pricing` CTA + natural-height Pro card → statement footer with compact grouped links.

Locked decisions:

| Decision | Value |
|---|---|
| Canvas | soft cream paper `#F7F4EE` |
| Primary | sky blue `#3B9EFF` |
| Layout | left-biased Workbench, mobile-first; hero split only at `980px` |
| Cards | natural height, varied spans, restrained tinted surfaces; no universal top stripe |
| Decorative | product cat only; no standalone hero blobs |
| Pricing | Pro is $0.99/mo or $5.99/yr, ad-free only |
| Must not claim | aquarium, Google Play, visionOS |
| Hub and KMB | unchanged under this plan |

### Sparkish Hub

Unchanged under this plan. Keep the compact app catalog look and existing token values.

### Korea Map Link

Unchanged under this plan. Keep the travel utility frame, blue actions, route green signals, Kakao and Naver colors, phone screenshot frames, and existing token values.

## 2. Color Tokens

### AquaTick

| Role | Token | Value | Usage |
|---|---|---|---|
| Ink navy | `--ink` | `#0D2138` | Body text, headings |
| Cream paper | `--paper` | `#F7F4EE` | Page background |
| Surface | `--cream` | `oklch(99% 0.006 245)` | Cards, header, screenshot grounds |
| Water accent | `--water-accent` | `#3B9EFF` | Primary CTA, chips, focus |
| Strong accent | `--color-accent-strong` | `oklch(57% 0.18 250)` | Accent text and focus ring |
| Accent ink | `--color-accent-ink` | `oklch(23% 0.06 250)` | Text on sky-blue actions |
| Aqua alias | `--aqua` | `#3B9EFF` | Existing accent alias |
| Bright aqua | `--aqua-bright` | `#6BB6FF` | Subtle gradients, hover |
| Deep navy band | `--band-dark` | `#0B2A4A` | Pricing/footer band background |
| Blue band stop | `--band-blue` | `#123A66` | Replaces `--band-teal` usage for AquaTick |
| Muted text | `--muted` | `#5A6B7D` | Secondary copy |
| Line | `--line` | `rgba(13, 33, 56, 0.12)` | Borders, dividers |
| Fine border | `--fine-border` | `rgba(13, 33, 56, 0.12)` | Existing fine borders |
| Chip surface | `--chip-surface` | `rgba(255, 255, 255, 0.84)` | Pills, header |
| Chip border | `--chip-border` | `rgba(59, 158, 255, 0.28)` | Pills, secondary CTA |
| Coral | `--coral` | `#E85A7A` | Tiny cat status accent only |
| Theme color | `theme-color` | `#3B9EFF` | Browser theme/meta color |
| Shadow soft | `--shadow-soft` | `0 8px 20px rgba(13, 33, 56, 0.08)` | Header, small pills |
| Shadow card | `--shadow-card` | `0 18px 42px rgba(13, 33, 56, 0.12)` | Feature and screen cards |
| Shadow float | `--shadow-float` | `0 28px 70px rgba(6, 27, 46, 0.20)` | Phone mockup, final CTA |

### Sparkish Hub Tokens

Unchanged under this plan. Keep the existing AquaTick linked hub tokens: `--ink #0D2138`, `--paper #F7FAFC`, `--cream #FFFFFF`, `--water-accent #00AD9E`, `--aqua var(--water-accent)`, `--navy #0A1F38`, `--muted #4A6270`, `--line rgba(13, 33, 56, 0.12)`, `--shadow-soft 0 8px 16px rgba(13, 33, 56, 0.08)`, and `--shadow-card 0 4px 12px rgba(13, 33, 56, 0.06)`.

### Korea Map Link Tokens

Unchanged under this plan.

| Role | Token | Value | Usage |
|---|---|---|---|
| Text primary | `--ink` | `#0f172a` | Body text, headings |
| Page background | `--paper` | `#f8fafc` | Main page background |
| Surface | `--surface` | `#ffffff` | Cards, buttons, footer |
| Blue tint surface | `--surface-soft` | `#eef5ff` | Active language, hero badge |
| Mint surface | `--surface-mint` | `#ecfdf9` | Existing mint utility surface |
| Primary blue | `--blue` | `#246bfe` | Main CTA |
| Deep blue | `--blue-deep` | `#1557d1` | Hero badge text, active language |
| Route green | `--route` | `#0f8a7a` | Route status dot |
| Route tint | `--route-soft` | `#dff5f0` | Route status halo |
| Taxi yellow | `--taxi` | `#ffd84d` | Taxi utility accent |
| Kakao yellow | `--kakao` | `#fee500` | Kakao pill |
| Naver green | `--naver` | `#03c75a` | Naver pill |
| Orange | `--orange` | `#f97316` | Existing utility accent |
| Muted text | `--muted` | `#64748b` | Lead text, captions |
| Border | `--line` | `rgba(15, 23, 42, 0.12)` | Cards, header, dividers |
| Strong border | `--line-strong` | `rgba(15, 23, 42, 0.18)` | Stronger dividers |
| Phone frame | raw value | `#111820` | Screenshot device border |

## 3. Typography

Display roles use `"Avenir Next", "Trebuchet MS", ui-sans-serif, sans-serif`; body copy stays on `-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif`. This keeps Korean and Japanese body rendering native while giving Latin display roles a distinct product voice.

### AquaTick Scale

| Role | Value | Usage |
|---|---|---|
| Hero h1 | `clamp(2.6rem, 9vw, 5.6rem)`, `line-height: 0.98`, `font-weight: 900`, `letter-spacing: -0.055em` | Left-biased hero; Korean stays within 3 lines at `768px` |
| Section title | `clamp(2rem, 5vw, 3.8rem)`, `line-height: 1.02`, `font-weight: 900`, `letter-spacing: -0.045em` | Features, screens, privacy, pricing |
| Card title | `clamp(1.12rem, 2vw, 1.5rem)`, `line-height: 1.12`, `font-weight: 850` | Summary, core feature, privacy, pricing cards |
| Body | `1.05rem`, `line-height: 1.5`, `font-weight: 600` | Main copy |
| Small label | `0.78rem`, `line-height: 1.1`, `font-weight: 800` | Proof chips only; non-ordinal section labels are forbidden |

Korean and Japanese text use `word-break: keep-all` with safe overflow wrapping. Display headings keep `min-width: 0` and `overflow-wrap: anywhere` only as a last-resort overflow guard. Every clickable label stays on one rendered line.

Hub and Korea Map Link typography are unchanged under this plan.

## 4. Spacing & Layout

### AquaTick

| Pattern | Contract |
|---|---|
| Page padding | `clamp(16px, 4vw, 48px)` inline |
| Narrow content | `max-width: 720px` |
| Standard content | `max-width: 980px` |
| Hero/screens | `max-width: 1120px` |
| Section rhythm | alternates `clamp(64px, 9vw, 112px)` with compact proof transitions; not every section is centered or padded identically |
| Card gap | `clamp(16px, 3vw, 32px)` |
| Radius | `--r-card: 12px`, `--r-control: 999px`, `--r-panel: 20px` |
| Breakpoints | `720px` expands supporting grids; `980px` is the only hero split pivot |

Responsive notes:

| Width | Rule |
|---|---|
| 320 / 375 / 414 | Compact one-row closed header, single-column left-biased hero, one-line CTA labels, first screen card visible, no horizontal scroll |
| 768 | Hero remains one column; H1 is `<=3` lines; screenshots form a compact side-by-side proof row |
| 1280 | Hero splits at `980px`; use `980px` content and `1120px` hero/screens without stretching copy lines |

Hub keeps `main` max width `720px`. Korea Map Link keeps `--max: 1120px`, `--max-legal: 720px`, hero split until `980px`, and compact mobile rules at `560px`.

## 5. Components

All AquaTick components use transform, opacity, and filter only for motion. Focus states must be visible.

### `site-header`

Hallmark N1b adapted for a consumer app. Desktop: brand, exactly three core anchors, language links, and one App Store CTA. Mobile: brand + one-line App Store CTA + native `<details>` disclosure; section, support, and language destinations live inside its panel. The closed header is one row and no taller than `76px`. Focus uses a `2px` sky-blue outline with `2px` offset. Active presses `translateY(1px)`.

### `btn-primary` and `btn-secondary`

Primary uses `--water-accent` fill with navy or white text per contrast. Secondary uses `--chip-surface` with navy text and sky-blue border. Hover lifts `translateY(-1px)` and deepens shadow. Focus uses sky-blue outline. Active presses down.

### `hero-visual` / product screenshots

Two semantic `<figure class="product-shot">` elements show the real iPhone and Apple Watch screenshots. A figure may use one hairline border and a restrained shadow, but no shell padding, fake bezel, dark device background, control dots, or redrawn chrome. No app-demo controls in the landing redesign.

### `summary-card`

Count contract: 4 in `#features`. Wider 2×2 composition at desktop with natural-height cards and varied surface treatment. No universal accent stripe and no extra summary cards without plan update.

### `core-feature-card`

Count contract: 6 in `#screens`: home/widget, watch, vault, history, live activity, health. Vault card must include an image whose `src` contains `screenshot-iphone-vault`. Image cards wrap screenshots in semantic `figure.product-shot` elements with a hairline only. Cards use `align-items: start`, natural height, and asymmetric desktop spans; the first card remains visible on narrow screens.

### `privacy-col`

Count contract: 4 in `#privacy`, followed by a clear `.third-party` disclosure panel styled directly on that class. Copy must keep no account, Health optional, no selling, and glance-only widgets/Live Activity/Dynamic Island honest.

### `pricing-card`

`#pricing` includes one primary App Store CTA plus one natural-height Pro card. Pro copy is ad-free only and must state `$0.99/mo` and `$5.99/yr`.

### `site-footer`

Hallmark Ft5 Statement. A large localized closing sentence leads, followed by the brand and three compact grouped link lists using the actual `.footer-columns` contract. Each group stacks its links with clear spacing; copyright stays attached to the footer meta row. Uses `--band-dark`, `--band-blue`, and `--water-accent` without an oversized empty band.

Hub and Korea Map Link components are unchanged under this plan.

## 6. Motion & Interaction

Use only `transform`, `opacity`, and `filter` for animation. No layout animation. No decorative non-interactive motion. No scroll theatrics.

Global reduced motion rule: `prefers-reduced-motion: reduce` disables animation, transition, smooth scroll, and scripted decorative motion.

Allowed AquaTick motion:

| Motion | Contract |
|---|---|
| Button/link hover | `transform 140ms ease`, opacity or filter only |
| Active press | `translateY(1px)` |
| Card hover | lift only for links or interactive cards |

Korea Map Link and hub motion are unchanged under this plan.

## 7. Must Not Have

- Aquarium product claims.
- Google Play links or copy.
- visionOS links or copy.
- New dependencies.
- Hub redesign or Korea Map Link redesign.
- App demo, demo controls, sticker script, film-card/fact-card as the new contract.
- CSS-drawn phone, watch, browser, code-window, or IDE chrome.
- Repeated non-ordinal section labels/eyebrows.
- Equal-height card walls, universal card top stripes, or disconnected footer/privacy class names.
- Hero column splitting below `980px` or wrapped clickable labels.
- More than 4 `#features .summary-card` cards or more than 6 `#screens .core-feature-card` cards.

## 8. Exports

### CSS custom properties

The canonical runtime source is [`tokens.css`](tokens.css). AquaTick's compiled stylesheet imports it before all rules:

```css
@import url("/tokens.css");
```

### Tailwind v4 `@theme`

```css
@theme {
  --color-paper: oklch(97% 0.01 80);
  --color-surface: oklch(99% 0.006 245);
  --color-surface-soft: oklch(97% 0.018 245);
  --color-ink: oklch(24% 0.055 250);
  --color-muted: oklch(52% 0.035 250);
  --color-accent: oklch(70% 0.17 250);
  --color-accent-strong: oklch(57% 0.18 250);
  --color-accent-ink: oklch(23% 0.06 250);
  --color-rule: oklch(24% 0.055 250 / 0.12);
  --font-display: "Avenir Next", "Trebuchet MS", ui-sans-serif, sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --radius-card: 12px;
  --radius-pill: 999px;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

### DTCG `tokens.json`

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "paper": { "$value": "oklch(97% 0.01 80)", "$type": "color" },
    "surface": { "$value": "oklch(99% 0.006 245)", "$type": "color" },
    "surface-soft": { "$value": "oklch(97% 0.018 245)", "$type": "color" },
    "ink": { "$value": "oklch(24% 0.055 250)", "$type": "color" },
    "muted": { "$value": "oklch(52% 0.035 250)", "$type": "color" },
    "accent": { "$value": "oklch(70% 0.17 250)", "$type": "color" },
    "accent-strong": { "$value": "oklch(57% 0.18 250)", "$type": "color" },
    "accent-ink": { "$value": "oklch(23% 0.06 250)", "$type": "color" },
    "rule": { "$value": "oklch(24% 0.055 250 / 0.12)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Avenir Next, Trebuchet MS, ui-sans-serif, sans-serif", "$type": "fontFamily" },
    "body": { "$value": "-apple-system, BlinkMacSystemFont, SF Pro Text, system-ui, sans-serif", "$type": "fontFamily" }
  },
  "space": {
    "xs": { "$value": "0.25rem", "$type": "dimension" },
    "sm": { "$value": "0.5rem", "$type": "dimension" },
    "md": { "$value": "1rem", "$type": "dimension" },
    "lg": { "$value": "1.5rem", "$type": "dimension" },
    "xl": { "$value": "2rem", "$type": "dimension" }
  },
  "duration": {
    "fast": { "$value": "140ms", "$type": "duration" },
    "medium": { "$value": "220ms", "$type": "duration" }
  }
}
```

### shadcn/ui CSS variables

```css
:root {
  --background: 97% 0.01 80;
  --foreground: 24% 0.055 250;
  --card: 99% 0.006 245;
  --card-foreground: 24% 0.055 250;
  --popover: 99% 0.006 245;
  --popover-foreground: 24% 0.055 250;
  --primary: 70% 0.17 250;
  --primary-foreground: 23% 0.06 250;
  --secondary: 97% 0.018 245;
  --secondary-foreground: 23% 0.06 250;
  --muted: 97% 0.018 245;
  --muted-foreground: 52% 0.035 250;
  --accent: 70% 0.17 250;
  --accent-foreground: 23% 0.06 250;
  --destructive: 67% 0.18 10;
  --destructive-foreground: 100% 0 0;
  --border: 24% 0.055 250;
  --input: 24% 0.055 250;
  --ring: 57% 0.18 250;
  --radius: 12px;
}
```
