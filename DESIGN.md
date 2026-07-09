# Sparkish Static Site Design System

AquaTick product direction changed: the AquaTick landing page redesign is allowed under this contract. The target is premium close Flighty grammar adapted to AquaTick's teal water and cat identity. Korea Map Link and the Sparkish hub are unchanged under this plan.

Loaded frontend reference: `references/design/README.md` for the design system gate and non generic premium surface rules.

## 1. Atmosphere & Identity

### AquaTick

Light editorial canvas, precise floating proof chips, glossy app demo depth, and selective dark teal bands for the hero and final CTA. Keep AquaTick friendly through `--water-accent`, cat motifs, hydration language, and soft rounded controls. Flighty grammar means confident spacing, live status surfaces, big calm type, layered cards, and status chips, not Flighty logos, routes, aircraft graphics, or brand claims.

Product fact: logging buttons live on app Home Quick Add (+200/+300), Cup Vault favorites on Home Quick Add, and Apple Watch; widgets, Live Activity, and Dynamic Island are glance/status only.

Locked decisions:

| Decision | Value |
|---|---|
| Fidelity | premium close |
| Copy | headline rewrite only |
| Atmosphere | light plus teal |
| AquaTick scope | redesign allowed |
| Hub and KMB | unchanged under this plan |

Band map:

| Flighty band | AquaTick band |
|---|---|
| Preflight | proof |
| At airport | mood plus judgment |
| After | film |
| Social | testimonials |
| Download | final cta |

### Sparkish Hub

Unchanged under this plan. Keep the compact app catalog look and existing token values.

### Korea Map Link

Unchanged under this plan. Keep the travel utility frame, blue actions, route green signals, Kakao and Naver colors, phone screenshot frames, and existing token values.

## 2. Color Tokens

### AquaTick

| Role | Token | Value | Usage |
|---|---|---|---|
| Ink navy | `--ink` | `#0D2138` | Body text, headings |
| Paper white | `--paper` | `#F7FAFC` | Light canvas |
| Surface | `--cream` | `#FFFFFF` | Cards, header, content sheets |
| Water accent | `--water-accent` | `#00AD9E` | Primary CTA, proof state, progress |
| Aqua alias | `--aqua` | `var(--water-accent)` | Existing accent alias |
| Bright teal | `--aqua-bright` | `#00B8A6` | Hover, chip glow |
| Dark band | `--band-dark` | `#061B2E` | Hero and final CTA premium bands |
| Dark band teal | `--band-teal` | `#063F46` | Teal gradient stop in dark bands |
| Floating chip surface | `--chip-surface` | `rgba(255, 255, 255, 0.82)` | Floating proof and status chip |
| Floating chip border | `--chip-border` | `rgba(0, 173, 158, 0.24)` | Chip rim |
| Muted text | `--muted` | `#4A6270` | Secondary copy |
| Line | `--line` | `rgba(13, 33, 56, 0.12)` | Borders, dividers |
| Fine border | `--fine-border` | `rgba(13, 33, 56, 0.12)` | Existing fine borders |
| Coral | `--coral` | `#E63B59` | Small cat or warning accents only |
| Mint tint | `--yellow` | `#E6F5F2` | Soft proof tint |
| Shadow 1 | `--shadow-soft` | `0 8px 16px rgba(13, 33, 56, 0.08)` | Small cards |
| Shadow 2 | `--shadow-card` | `0 18px 42px rgba(13, 33, 56, 0.12)` | Fact and film cards |
| Shadow 3 | `--shadow-float` | `0 28px 70px rgba(6, 27, 46, 0.22)` | App demo and floating chips |

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
| Editorial hero h1 | `clamp(3.25rem, 9vw, 7.4rem)`, `line-height: 0.92`, `font-weight: 900`, `letter-spacing: -0.07em` | Flighty scale hero with AquaTick headline rewrite |
| Section title | `clamp(2.2rem, 5vw, 4.8rem)`, `line-height: 0.96`, `font-weight: 900`, `letter-spacing: -0.055em` | Proof, judgment, film, testimonials, FAQ |
| Card title | `clamp(1.2rem, 2vw, 1.65rem)`, `line-height: 1.08`, `font-weight: 850` | Fact, judgment, film cards |
| Body | `1.05rem`, `line-height: 1.48`, `font-weight: 600` | Main copy |
| Small label | `0.78rem`, `line-height: 1.1`, `font-weight: 800`, `letter-spacing: 0.08em`, uppercase | Status chip, proof labels |

Hub and Korea Map Link typography are unchanged under this plan.

## 4. Spacing & Layout

### AquaTick

| Pattern | Contract |
|---|---|
| Page padding | `clamp(18px, 4vw, 48px)` inline |
| Narrow content | `max-width: 720px` |
| Standard content | `max-width: 980px` |
| Wide hero/demo | `max-width: 1120px` |
| Section rhythm | `clamp(64px, 10vw, 132px)` vertical |
| Card gap | `clamp(16px, 3vw, 28px)` |
| Radius | `--r-card: 24px`, `--r-control: 999px`, `--r-panel: 36px` |
| Breakpoints | `720px` and `980px` remain the layout pivots |

Responsive notes:

| Width | Rule |
|---|---|
| 375 | Single column, sticky header keeps Download visible, chips can stack below demo |
| 768 | Hero can split only if h1 height stays within budget, content width uses `720px` |
| 1280 | Use `980px` content and `1120px` hero/demo, don't stretch text lines |

JA hero budget: existing test remains, h1 height must be `<=150px` at `720px` unless a new budget is documented in the implementation plan.

Hub keeps `main` max width `720px`. Korea Map Link keeps `--max: 1120px`, `--max-legal: 720px`, hero split until `980px`, and compact mobile rules at `560px`.

## 5. Components

All AquaTick components use transform, opacity, and filter only for motion. Focus states must be visible.

### `site-header`

Sticky. Left brand, right anchors plus Download. Default uses translucent paper or dark band tint over hero. Hover raises link contrast and adds soft teal chip fill. Focus uses a `2px` teal outline with `2px` offset. Active presses `translateY(1px)`.

### `btn-primary` and `btn-secondary`

Primary uses `--water-accent` fill with navy text. Secondary uses white or `--chip-surface` with navy text and teal border. Hover lifts `translateY(-1px)` and deepens shadow. Focus uses teal outline. Active returns to `translateY(1px)` with lower shadow.

### `floating-proof` and `status-chip`

Small rounded glassy chips on `--chip-surface`, `--chip-border`, and `--shadow-float`. Status chip may show hydration state text, streak, or reminder status. Hover only when interactive: slight lift and brighter teal rim. Focus matches buttons. Active presses down.

### `fact-card`

Count contract: 4. White surface, bold number or proof label, short text, one teal detail. Hover lifts only if card links or toggles. Focus only if interactive. No extra cards without plan update.

### `app-demo`

Preserve existing `demo-*` IDs and routes. The demo may be framed as a premium app surface with teal progress, cat detail, floating status chips, and deep shadow. Don't rename demo IDs, remove routes, or replace the hydration demo contract.

### `judgment-card`

Mood plus judgment cards explain the hydration decision. Default is white card with one status accent. Hover lift only if interactive. Focus ring required if clickable. Active press mirrors buttons.

### `film-card`

Count contract: 5, vault included. Use darker or high contrast media card treatment with teal highlights. Hover may lift media cards and sharpen filter if clickable. Focus visible. Active press allowed.

### `quote`

Real user or neutral product quote only. No fake celebrity quotes. Surface can be white or dark band inset. Keep quote copy short and source honest.

### `faq-item`

Native details or existing disclosure pattern. Default collapsed with clear title. Hover adds teal tint. Focus ring required on summary. Active press is subtle `translateY(1px)` if styled.

### `final-cta`

Dark teal premium band using `--band-dark`, `--band-teal`, `--water-accent`, and `--shadow-float`. Include headline, short body, primary Download, and secondary route if present. Hover/focus/active states follow button rules.

Hub and Korea Map Link components are unchanged under this plan.

## 6. Motion & Interaction

Use only `transform`, `opacity`, and `filter` for animation. No layout animation. No decorative non interactive motion. No scroll theatrics unless tied to readable state change.

Global reduced motion rule: `prefers-reduced-motion: reduce` disables animation, transition, smooth scroll, and scripted decorative motion.

Allowed AquaTick motion:

| Motion | Contract |
|---|---|
| Button/chip hover | `transform 140ms ease`, opacity or filter only |
| Active press | `translateY(1px)` |
| Demo progress | existing progress state may animate with transform or opacity only when possible |
| Card hover | lift only for interactive cards |

Korea Map Link and hub motion are unchanged under this plan.

## 7. Must Not Have

- Flighty logos, aircraft marks, route visuals, copied app UI, copied copy, or IP claims.
- New dependencies.
- Hub redesign or Korea Map Link redesign.
- Fake celebrity quotes.
- Broken `demo-*` IDs or routes.
- CSS, HTML, or JavaScript changes as part of this DESIGN.md task.
- Decorative non interactive motion.
