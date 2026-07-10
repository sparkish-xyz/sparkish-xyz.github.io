# Sparkish Static Site Design System

AquaTick product direction changed: the AquaTick landing page redesign is allowed under this contract. The target is a soft cream paper canvas with sky-blue primary actions, white rounded cards, pastel blue decorative blobs, navy text, and friendly hydration + cat energy. Korea Map Link and the Sparkish hub are unchanged under this plan.

Loaded frontend references: `references/design/README.md`, `references/perfection/README.md`, and `references/typescript/README.md` for the design-system gate, frontend quality gate, and strict test-edit rules.

## 1. Atmosphere & Identity

### AquaTick

Soft cream paper canvas, sky-blue primary actions, white rounded cards, pastel blue decorative blobs, and navy text. The page should feel like a friendly hydration + cat app, not an aquarium product and not a broad health dashboard.

Product facts unchanged: Home Quick Add logs +200/+300, Cup Vault favorites max 5, Apple Watch logging, widgets/Live Activity/Dynamic Island are glance-only, no account, Health is optional, no selling. Pro is $0.99/mo or $5.99/yr for ad-free only. AquaTick is iOS 26.0+ with Apple Watch support; no visionOS, no Google Play, no aquarium.

Locked section order: sticky header → hero (headline with accent word, pills, App Store CTA, iPhone+Watch mockups) → `#features` with 4 `.summary-card` → `#screens` with 6 `.core-feature-card` cards (home/widget, watch, vault, history, live activity, health; vault image required) → `#privacy` with 4 `.privacy-col` columns + third-party disclosure → `#pricing` dual CTA + Pro card → multi-column footer.

Locked decisions:

| Decision | Value |
|---|---|
| Canvas | soft cream paper `#F7F4EE` |
| Primary | sky blue `#3B9EFF` |
| Layout | centered, mobile-first |
| Cards | white, soft shadow, rounded |
| Decorative | pastel blue blobs only |
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
| Surface | `--cream` | `#FFFFFF` | Cards, header, phone surfaces |
| Water accent | `--water-accent` | `#3B9EFF` | Primary CTA, chips, focus |
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

Font stack stays Apple system: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif`.

### AquaTick Scale

| Role | Value | Usage |
|---|---|---|
| Hero h1 | `clamp(2.9rem, 11vw, 6.6rem)`, `line-height: 0.96`, `font-weight: 900`, `letter-spacing: -0.06em` | Centered hero |
| Section title | `clamp(2rem, 6vw, 4.2rem)`, `line-height: 1`, `font-weight: 900`, `letter-spacing: -0.05em` | Features, screens, privacy, pricing |
| Card title | `clamp(1.12rem, 2vw, 1.5rem)`, `line-height: 1.12`, `font-weight: 850` | Summary, core feature, privacy, pricing cards |
| Body | `1.05rem`, `line-height: 1.5`, `font-weight: 600` | Main copy |
| Small label | `0.78rem`, `line-height: 1.1`, `font-weight: 800`, `letter-spacing: 0.08em`, uppercase | Chips and labels |

Hub and Korea Map Link typography are unchanged under this plan.

## 4. Spacing & Layout

### AquaTick

| Pattern | Contract |
|---|---|
| Page padding | `clamp(18px, 4vw, 48px)` inline |
| Narrow content | `max-width: 720px` |
| Standard content | `max-width: 980px` |
| Hero/screens | `max-width: 1120px` |
| Section rhythm | `clamp(64px, 10vw, 120px)` vertical |
| Card gap | `clamp(16px, 3vw, 28px)` |
| Radius | `--r-card: 24px`, `--r-control: 999px`, `--r-panel: 36px` |
| Breakpoints | `720px` and `980px` remain layout pivots |

Responsive notes:

| Width | Rule |
|---|---|
| 375 | Single column, centered hero, CTA buttons stack, first screen card visible |
| 768 | Hero can split into copy plus iPhone+Watch if readable; JA h1 height budget is `<=280px` for the new centered hero contract |
| 1280 | Use `980px` content and `1120px` hero/screens, don't stretch text lines |

Hub keeps `main` max width `720px`. Korea Map Link keeps `--max: 1120px`, `--max-legal: 720px`, hero split until `980px`, and compact mobile rules at `560px`.

## 5. Components

All AquaTick components use transform, opacity, and filter only for motion. Focus states must be visible.

### `site-header`

Sticky. Left brand, right anchors plus App Store. Translucent cream/white surface, subtle border, compact mobile wrapping. Hover adds a soft sky-blue chip fill. Focus uses a `2px` sky-blue outline with `2px` offset. Active presses `translateY(1px)`.

### `btn-primary` and `btn-secondary`

Primary uses `--water-accent` fill with navy or white text per contrast. Secondary uses `--chip-surface` with navy text and sky-blue border. Hover lifts `translateY(-1px)` and deepens shadow. Focus uses sky-blue outline. Active presses down.

### `hero-visual` / iPhone+Watch mockups

Rounded iPhone frame plus Apple Watch mockup with white rim, dark inner frame, screenshot image, and soft float shadow. No app-demo controls in the landing redesign.

### `summary-card`

Count contract: 4 in `#features`. White surface, rounded card, short title/body, one small sky-blue detail. No extra summary cards without plan update.

### `core-feature-card`

Count contract: 6 in `#screens`: home/widget, watch, vault, history, live activity, health. Vault card must include an image whose `src` contains `screenshot-iphone-vault`. Cards use phone-like image radius, white body, and a narrow-screen grid/strip with first card visible.

### `privacy-col`

Count contract: 4 in `#privacy`, followed by clear third-party disclosure. Copy must keep no account, Health optional, no selling, and glance-only widgets/Live Activity/Dynamic Island honest.

### `pricing-card`

`#pricing` includes dual CTA plus one Pro card. Pro copy is ad-free only and must state `$0.99/mo` and `$5.99/yr`.

### `site-footer`

Multi-column footer. Uses `--band-dark`, `--band-blue`, `--water-accent`, and `--shadow-float` when a dark band is needed.

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
- More than 4 `#features .summary-card` cards or more than 6 `#screens .core-feature-card` cards.
