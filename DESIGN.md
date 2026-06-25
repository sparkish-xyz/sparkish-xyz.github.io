# Sparkish Static Site Design System

This is a no-redesign contract for the current static site. Refactors must preserve the existing visual language across AquaTick, Korea Map Link, and the Sparkish hub. Don't add new colors, layouts, typography, copy, assets, dependencies, or interaction patterns unless the product direction changes first.

## 1. Atmosphere & Identity

Sparkish feels small, playful, and useful. The hub presents a compact app catalog with AquaTick's friendly teal, navy, coral, and white system. AquaTick feels like a cheerful habit coach with a cat motif, rounded white cards, teal action surfaces, coral badges, and light sticker details. Korea Map Link feels more travel utility focused, with blue app actions, route green signals, Kakao and Naver service colors, phone screenshot frames, and clear step cards.

## 2. Color

### Shared Contract

Use only colors already present in `index.html`, `aquatick/assets/aquatick-site.css`, and `korea-map-link/assets/kmb-site.css`. Product pages may keep their own token names because the visual systems intentionally differ.

### Sparkish Hub And AquaTick Tokens

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Text primary | `--ink` | `#0D2138` | Body text, headings |
| Page background | `--paper` | `#F7FAFC` | Hub and AquaTick page background |
| Surface | `--cream` | `#FFFFFF` | Header, cards, sections |
| Warm surface | `--warm-surface` | `#F7FAFC` | AquaTick alternate surface |
| Hero surface | `--hero-surface` | `#FFFFFF` | AquaTick hero start |
| Inset surface | `--inset-surface` | `#FFFFFF` | AquaTick demo cards |
| Action teal | `--water-accent` | `#00AD9E` | Primary CTA, progress fill, hub theme color |
| Action teal alias | `--aqua` | `var(--water-accent)` | Aqua accent alias |
| Bright teal | `--aqua-bright` | `#00B8A6` | AquaTick accent variant |
| Blue accent | `--lavender-accent` | `#335E8C` | AquaTick secondary accent |
| Coral accent | `--coral` | `#E63B59` | Badges, final CTA, quote author |
| Coral soft | `--coral-soft` | `rgba(230, 59, 89, 0.14)` | Soft coral tint |
| Mint chip | `--yellow` | `#E6F5F2` | Proof chips, cat stickers, final CTA button |
| Navy | `--navy` | `#0A1F38` | CTA text, dark film section |
| Muted text | `--muted` | `#4A6270` | Secondary copy |
| Progress track | `--progress-track` | `rgba(13, 33, 56, 0.14)` | Hydration progress track |
| Border | `--line`, `--fine-border` | `rgba(13, 33, 56, 0.12)` | Dividers, cards |
| Sticker border | `--sticker-border` | `rgba(13, 33, 56, 0.13)` | Sticker and card outlines |

### Korea Map Link Tokens

| Role | Token | Value | Usage |
|------|-------|-------|-------|
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
| White text | raw value | `#ffffff` | Primary blue button text |
| Kakao text | raw value | `#111111` | Kakao pill text |
| Naver text | raw value | `#047843` | Naver pill text |

## 3. Typography

### Font Stack

| Product | Stack |
|---------|-------|
| Sparkish hub | `-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif` |
| AquaTick | `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif` |
| Korea Map Link | `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif` |

### Scale

| Product | Token Or Selector | Value | Usage |
|---------|-------------------|-------|-------|
| Hub | `--big` | `clamp(2.2rem, 8vw, 3.2rem)` | Main title |
| Hub | `--body` | `1.05rem`, `line-height: 1.48` | Body text |
| AquaTick | `--big` | `2.8rem`, then `3.5rem` at `720px` | Hero heading |
| AquaTick | `--title` | `2rem`, then `2.35rem` at `720px` | Section headings |
| AquaTick | `--body` | `1.05rem`, `line-height: 1.48` | Body text |
| Korea Map Link | `--big` | `clamp(2.7rem, 7vw, 5.8rem)` | Hero heading |
| Korea Map Link | `--title` | `clamp(2rem, 4.4vw, 3.4rem)` | Section headings |
| Korea Map Link | `--body` | `1.05rem`, `line-height: 1.5` | Body text |

Rules: keep the heavy, rounded Apple system feel. Headings use `font-weight: 900`. Supporting text is usually `600` to `800`. Letter spacing stays at `0` in product pages, while the hub uses tight tracking on brand and headings.

## 4. Spacing & Layout

### Shared Patterns

| Pattern | Existing Values |
|---------|-----------------|
| Safe area | `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, plus left and right on product pages |
| Header padding | Hub and AquaTick use `14px 18px`; AquaTick mobile uses `8px 10px`; Korea Map Link uses `12px max(18px, calc((100vw - var(--max)) / 2 + 18px))` |
| Card gaps | Hub `20px`; AquaTick commonly `14px`, `16px`, `18px`, `20px`, `24px`; Korea Map Link commonly `12px`, `14px`, `16px`, `24px` |
| Section padding | Hub `48px 18px 72px`; AquaTick sections often `38px` to `54px` vertical; Korea Map Link section rhythm uses `clamp(48px, 8vw, 86px)` |

### Layout Widths And Breakpoints

| Product | Values |
|---------|--------|
| Hub | `main` max width `720px`; mobile cards stack below `480px` |
| AquaTick | Hero max width `1040px`, wider content up to `1080px`, common content max widths `620px`, `720px`, `780px`, `820px`, `980px`; breakpoints at `720px` and `980px` |
| Korea Map Link | `--max: 1120px`; `--max-legal: 720px`; hero two column layout until `980px`; compact mobile rules at `560px` |

### Radius Tokens

| Product | Tokens |
|---------|--------|
| Hub | `--r-card: 16px`, `--r-control: 14px`, `--r-full: 999px` |
| AquaTick | `--r-card: 16px`, `--r-control: 14px`, `--r-16: 16px`, `--r-24: 16px`, `--r-28: 16px`, `--r-32: 24px`, `--r-full: 999px` |
| Korea Map Link | `--r-card: 8px`, `--r-control: 8px`, `--r-pill: 999px` |

## 5. Components

### Site Header

Structure: sticky on product pages, static on the hub. Brand mark plus text on the left, navigation or language controls on the right. Hub and AquaTick use white surfaces with navy text. Korea Map Link uses translucent paper with blur.

States: header links keep rounded tap targets. AquaTick hover fills with teal. Korea Map Link hover uses a soft blue tint.

### Primary Button

Structure: inline flex center alignment, bold label, rounded control radius, minimum touch height.

Variants: AquaTick and hub use teal fill with navy text. Korea Map Link uses blue fill with white text and a secondary white button.

States: active press moves `translateY(1px)`. AquaTick also scales to `0.99`. Focus rings use teal for AquaTick and translucent blue for Korea Map Link.

### Cards

Structure: white or product surface background, one pixel border, product radius, soft shadow, bold title and muted body.

Variants: hub app cards, AquaTick judgment cards, AquaTick fact and FAQ cards, Korea Map Link step cards, FAQ details, contact cards.

### Badges And Pills

Structure: inline flex, pill radius, bold compact text.

Variants: AquaTick uses coral badges, mint chips, route proof chips, and cat sticker cards. Korea Map Link uses blue hero badges, white pills, Naver green pills, and Kakao yellow pills.

### Product Visuals

Structure: AquaTick uses a screenshot inside a rounded iPhone frame with sticker overlays and floating proof cards. Korea Map Link uses a large phone mockup created from the home screenshot, plus screenshot gallery cards with dark phone borders.

### Legal And Utility Content

Structure: Korea Map Link legal pages use the same surface, border, radius, muted copy, and max legal width as marketing pages.

## 6. Motion & Interaction

| Pattern | Existing Values |
|---------|-----------------|
| Reduced motion | `prefers-reduced-motion: reduce` disables animation and transition globally |
| Scroll | Product pages set `scroll-behavior: smooth` |
| AquaTick button press | `transform 120ms ease`, `box-shadow 120ms ease`, active `translateY(1px) scale(0.99)` |
| AquaTick quick add | `transform 80ms ease`, `box-shadow 80ms ease` |
| AquaTick progress fill | `width 260ms cubic-bezier(0.23, 1, 0.32, 1)` |
| Korea Map Link button hover | `translateY(-1px)` |
| Korea Map Link button active | `translateY(1px)` |

Rules: only preserve existing motion. Don't add scroll effects, new easing curves, new hover patterns, or layout changing animation during refactors.

## 7. Depth & Surface

### Strategy

The site uses a mixed strategy of light surfaces, one pixel borders, rounded cards, and soft shadows. Keep the current product split.

| Product | Depth Tokens And Surfaces |
|---------|---------------------------|
| Hub | `--shadow-soft: 0 8px 16px rgba(13, 33, 56, 0.08)`, `--shadow-card: 0 4px 12px rgba(13, 33, 56, 0.06)`, white cards on `#F7FAFC` |
| AquaTick | Same soft and card shadows as hub, plus `0 24px 48px -16px rgba(13, 33, 56, 0.18)` on phone frame, navy film section, white cards, coral CTA section |
| Korea Map Link | `--shadow-soft: 0 18px 44px rgba(15, 23, 42, 0.08)`, `--shadow-small: 0 8px 22px rgba(15, 23, 42, 0.07)`, phone shadow `0 30px 70px rgba(15, 23, 42, 0.22)`, translucent blurred header |

Refactors must keep this depth model. Don't flatten the pages, increase shadow drama, round Korea Map Link cards to AquaTick sizes, or move AquaTick toward the Korea Map Link utility frame.
