# Design System — BPEDK Coursework Site

## Philosophy

Academic paper aesthetic meets modern web. Prefer **quiet authority** over flashy effects. Warm editorial tone in Ukrainian. Research framing on every page — this is a scholarly project, not a product landing page.

When choosing between UX enhancement and methodology improvement, prefer methodology unless the UX issue threatens data validity or completion rates.

## Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Headings | `Source Serif 4`, Georgia, serif | 700–750 | h1–h4, paper titles, story titles |
| Body | `Source Serif 4`, Georgia, serif | 400 | Paragraphs, prose text |
| UI / Nav | `Inter`, system-ui, sans-serif | 600–800 | Buttons, badges, labels, nav, metadata |
| Monospace | `monospace` | — | Blind codes (`grk`, `pkd`, etc.), small tags |

### Type scale

- h1: `clamp(2rem, 5vw, 3.6rem)` — letter-spacing `-0.02em`
- h2: `clamp(1.5rem, 3vw, 2.4rem)`
- h3: `clamp(1.2rem, 2vw, 1.6rem)`
- h4: `1.05rem`
- Body: `16px` / `line-height: 1.65`
- UI text: `0.72–0.88rem`, uppercase with `letter-spacing: 0.08–0.18em`
- `text-wrap: balance` on all headings

## Color Tokens

### Core palette (`shared.css`)

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--bg` | `#f8f7f2` | `#0d1117` | Page background |
| `--bg-2` | `#f0eee6` | `#131820` | Alternate background |
| `--bg-3` | `#e8e5db` | `#1a2230` | Tertiary background |
| `--surface` | `#ffffff` | `rgba(19,26,38,0.92)` | Card / paper surface |
| `--surface-glass` | `rgba(255,255,255,0.72)` | `rgba(19,26,38,0.78)` | Frosted surfaces |
| `--ink` | `##1a1c20` | `#e6e1d8` | Primary text |
| `--ink-2` | `#3f4450` | `#b8b2a6` | Secondary text |
| `--ink-3` | `#6e7480` | `#8a8478` | Muted text |
| `--ink-4` | `#9ba2b0` | `#5e5a52` | Placeholder text |
| `--accent` | `#0c2340` | `#8bbcff` | Primary brand |
| `--accent-warm` | `#c8410a` | `#ff8c5a` | Warm accent |
| `--accent-warm-2` | `#e8873a` | `#ffb380` | Warm accent light |
| `--edu` | `#1a56a0` | `#60a5fa` | Educators theme (blue) |
| `--par` | `#6b21a8` | `#c084fc` | Parents theme (purple) |
| `--line` | `rgba(12,35,64,0.10)` | `rgba(139,188,255,0.10)` | Borders / dividers |
| `--line-strong` | `rgba(12,35,64,0.18)` | `rgba(139,188,255,0.18)` | Strong borders |
| `--danger` | `#ba1a1a` | `#f87171` | Errors / warnings |
| `--success` | `#15803d` | `#4ade80` | Success states |
| `--warning` | `#b45309` | `#fbbf24` | Caution states |

### Landing page palette (`landing.css`)

Overrides core palette with warmer academic tones:
- `--landing-bg`: `#f7f4ec` (light) / `#0b111a` (dark)
- `--landing-accent`: `#002147` (light) / `#8bbcff` (dark)
- `--landing-danger`: `#a5342f` (light) / `#ff9a8c` (dark)
- Background has 48px animated grid pattern (`landing-grid-drift` 42s infinite)

### Story theme colors (9 unique palettes)

Each story page has its own color theme defined via CSS custom properties:

| Class | Title color | Drop cap | BG gradient A | BG gradient B |
|-------|------------|----------|---------------|---------------|
| `.story-thanks` (T1) | `#14532d` | `#15803d` | green `rgba(34,197,94,0.08)` | sky `rgba(56,189,248,0.06)` |
| `.story-oak` (T2) | `#4a2810` | `#92400e` | amber `rgba(180,83,9,0.08)` | lime `rgba(132,204,22,0.06)` |
| `.story-kitten` (T3) | `#7e1d56` | `#db2777` | pink `rgba(244,114,182,0.08)` | blue `rgba(59,130,246,0.06)` |
| `.story-bread` (T4) | `#7c2d12` | `#b45309` | orange `rgba(251,146,60,0.08)` | yellow `rgba(250,204,21,0.06)` |
| `.story-pie` (T5) | `#7f1d1d` | `#dc2626` | red `rgba(248,113,113,0.08)` | amber `rgba(251,191,36,0.06)` |
| `.story-apple` (T6) | `#365314` | `#65a30d` | lime `rgba(132,204,22,0.08)` | orange `rgba(249,115,22,0.06)` |
| `.story-fox-seed` (T7) | `#7c2d12` | `#c2410c` | orange `rgba(249,115,22,0.08)` | amber `rgba(251,191,36,0.06)` |
| `.story-sun/cloud` (T8) | `#1e3a8a` | `#2563eb` | yellow `rgba(250,204,21,0.08)` | sky `rgba(125,211,252,0.06)` |
| `.story-sun-bunny` (T9) | `#0f3d5a` | `#0ea5e9` | amber `rgba(251,191,36,0.08)` | sky `rgba(14,165,233,0.06)` |

In dark mode, story titles and drop caps use bright Tailwind-400/500 shades for contrast.

## Spacing

| Token | Value |
|-------|-------|
| `--space-1`–`--space-20` | 4px through 80px (4px increments, then 16px jumps) |

## Radius

| Token | Value |
|-------|-------|
| `--r-xs` | 2px |
| `--r-sm` | 4px |
| `--r-md` | 8px |
| `--r-lg` | 12px |
| `--r-xl` | 16px |
| `--r-2xl` | 24px |
| `--r-full` | 999px |

## Shadows

| Token | Light | Dark |
|-------|-------|------|
| `--shadow-xs` | `0 1px 2px rgba(12,35,64,0.04)` | `0 1px 2px rgba(0,0,0,0.30)` |
| `--shadow-sm` | `0 1px 3px rgba(12,35,64,0.06), 0 1px 2px rgba(12,35,64,0.04)` | `0 1px 3px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.25)` |
| `--shadow-md` | `0 4px 16px rgba(12,35,64,0.08), 0 2px 4px rgba(12,35,64,0.04)` | `0 4px 16px rgba(0,0,0,0.40), 0 2px 4px rgba(0,0,0,0.25)` |
| `--shadow-lg` | `0 12px 40px rgba(12,35,64,0.10), 0 4px 8px rgba(12,35,64,0.04)` | `0 12px 40px rgba(0,0,0,0.45), 0 4px 8px rgba(0,0,0,0.30)` |
| `--shadow-xl` | `0 24px 60px rgba(12,35,64,0.12), 0 8px 16px rgba(12,35,64,0.06)` | `0 24px 60px rgba(0,0,0,0.50), 0 8px 16px rgba(0,0,0,0.35)` |

## Transitions

| Token | Value |
|-------|-------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-spring` | `cubic-bezier(0.22, 0.9, 0.22, 1)` |
| `--dur-fast` | 150ms |
| `--dur-base` | 250ms |
| `--dur-slow` | 400ms |

## Background Texture

All pages use a subtle noise SVG texture (`--noise`) overlaid with grid lines:
- Grid: 48px × 48px, `--line` color at 10% opacity
- Landing page: animated grid drift (42s linear infinite)
- Story/hub pages: radial gradient overlays at corners (70%/50% and 60%/40% ellipses)

## Components

### Navigation

- **Top bar**: sticky, `height: 72px` (64px mobile), glassmorphism background, `backdrop-filter: blur(16px) saturate(1.2)`, bottom border `--line`
- **Brand**: `Source Serif 4`, 800 weight, accent color
- **Nav links**: Inter, 0.76rem, 700 weight, uppercase, 0.04em letter-spacing, underline animation on hover/active
- **Mobile**: hamburger toggle with 3-line → X animation, dropdown panel
- **Scroll progress**: 3px fixed bar at top, gradient `--accent-warm` → `--accent`

### Cards

- **Base card**: surface bg, `--line` border, `--r-lg` radius, `--shadow-sm`, hover lifts to `--shadow-md` with `translateY(-3px)`
- **Glass card**: `--surface-glass` bg, `backdrop-filter: blur(12px)`, `--shadow-lg`
- **Material card (`mat-card`)**: flex column, `--r-xl` radius, left border accent strip (3px: blue for video, warm-orange for text), hover lifts to `--shadow-lg`
- **Hub action card**: horizontal flex, `translateX(6px)` on hover (slides right)
- **Context card**: centered text, large numeric value in accent color, muted label below
- **Paper card**: white/surface bg, border-radius 2px (landing) or `--r-lg` (shared), subtle bottom shadow
- **Problem card**: red/warning icon + title, description text, external source link

### Buttons

- **Primary**: accent bg, white text, `--shadow-sm`, `translateY(-2px)` on hover
- **Ghost**: transparent bg, `--line` border, hover fills with `--bg-2`
- **Edu/Par**: blue/purple bg variants
- **Danger**: red bg, white text
- **Landing overrides**: sharp corners (`border-radius: 2px`), no transform on hover, dark navy (`#002147`)
- **Survey redirect (`#goNowBtn`)**: full-width, `--r-lg` radius, theme-accent bg, white text
- **In-app browser**: transparent bg, `--line` border (override for WebView environments)
- **Closed home button**: same as goNowBtn but themed
- **Copy button (in-app prompt)**: `--bg-2` bg, accent text, `--r-md` radius

### Badges

- **Base**: pill shape (`--r-full`), Inter 0.68rem 700 weight, uppercase 0.14em letter-spacing, accent color with tinted bg and border
- **Variants**: `--edu` (blue), `--par` (purple), `--closed` (green/success), `--warn` (amber/warning)
- **Hub pills**: inline-block pills in hub header showing metadata (count, type, methodology)

### Forms / Inputs

- **Field**: label above input, `--line` border, `--r-md` radius, `--shadow-sm` on input
- **Focus**: accent outline, `0 0 0 3px --line` ring
- **Select / Textarea**: same styling, textarea min-height 96px
- **Option tiles**: flex row with checkbox/radio, accent border on select, hover lift
- **Rating selector**: circular buttons, 40px diameter, accent fill on check
- **Status notifications**: error (red tint), ok (green tint), slide-down animation

### Data Display

- **Tables**: separate border-collapse, `--r-md` radius, header uppercase Inter 0.66rem 800 weight, row hover bg tint
- **Badges (table)**: `t-badge` — small inline-flex, uppercase 0.72rem, color-coded (online=green, paper=amber)
- **Group badges**: `g-badge` — parent (purple), educator (blue)
- **Code pills**: monospace, `--bg-2` bg, `--r-sm` radius
- **Mini bars**: horizontal bar charts, 8px height, `--r-full` track, accent/muted fills
- **Comparison chart**: 3-column grid (label, bar, value), 24px height fills
- **Donut/Score rows**: flex with space-between alignment

### Layout Patterns

- **Hero panel**: two-column grid (copy + stats panel), min-height clamp(720px, 100svh - 72px, 980px)
- **12-column grid**: sections use `grid-template-columns: repeat(12, minmax(0, 1fr))`, content spans 2/12
- **Expert panel**: dark accent bg, 2-column (icon + text), white text
- **Materials grid**: 2-column on desktop, single on mobile
- **Context grid**: 3-column on desktop, single on mobile
- **Recommendations grid**: 3-column desktop, single mobile
- **Recognition grid**: 2-column, centered text, large numeric displays
- **Survey closed card**: centered, glass card, success badge, shimmer title animation
- **In-app prompt**: lighter glassy bg override for WebView environments

### Story Page Layout

```
body[class*="story-"]  (flex column, radial gradient bg, noise overlay)
  .story-layout        (max-width 860px, centered, flex:1 pushes footer down)
    .story-header
      .badge            (material type indicator)
      .divider          (1px horizontal rule)
      h1                (story title, per-theme color)
    .story-content      (per-theme gradient bg, --r-2xl radius, deco dots)
      p                 (user-select:none, first-letter drop cap, per-theme colors)
    a.story-home-btn    (pill button, centered, subtle hover lift)
  footer.site-footer    (border-top, centered text)
```

Story content has decorative radial dots (`::before` / `::after`) at corners, 12px diameter, gradient of theme colors.

### Survey Redirect Page

```
body.theme-{educators|parents|video}  (sets --theme-accent)
  .redirect-page        (centered grid, full viewport)
    .redirect-card      (max-width 440px, rise-in animation)
      .badge            (theme-colored)
      h1                (text-shimmer 8s animation)
      .redirect-subtitle
      .redirect-media
        .redirect-gif   (TGS player, clamp size by vmin)
      .redirect-status
        .timer-row      (#timer in accent color, tick animation)
        .progress
          #progressBar  (gradient shimmer 1.8s)
      .redirect-actions
        #goNowBtn       (theme-accent bg, full-width)
      #fallback         (small text, theme-colored link)
```

### 404 Page

- Large error code (5–8rem, 10% opacity accent) behind card
- Error card with rise-in animation
- Error links: flex column, glass bg, hover translateX(4px), icon circles
- Icon bgs: color-mix tints per type (home=warm, hub=accent, edu=blue, par=purple)

## Animations

| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| `rise-in` | 560ms | `--ease-spring` | Cards appearing |
| `fade-up` | 600ms | `--ease-out` | Scroll-triggered sections |
| `tick` | 350ms | `--ease-spring` | Timer digit changes |
| `shimmer` | 1.8s | linear | Progress bar gradient |
| `text-shimmer` | 8s | linear | Title gradient animation |
| `fly-away` | 400ms | `--ease-spring` | Page exit GIF animation |
| `spin` | 0.7s | linear | Button spinner |
| `slide-down` | 240ms | `--ease-out` | Status notifications |
| `pulse-dot` | — | — | Badge dot breathing |
| `skeleton-shimmer` | 1.8s | ease-in-out | Loading placeholders |
| `landing-grid-drift` | 42s | linear | Background grid animation |

Stagger classes: `.stagger-1` (80ms), `.stagger-2` (160ms), `.stagger-3` (240ms), `.stagger-4` (320ms)

## Page Types

| Page | Body Class | CSS Files | SEO |
|------|-----------|-----------|-----|
| Landing (`index.html`) | `landing-page` | shared.css + landing.css | Indexable |
| Hub (`m/index.html`) | `hub-body` | shared.css + m/styles.css | noindex,follow |
| Video (`m/grk/` etc.) | `theme-video` | shared.css + m/styles.css | noindex,follow |
| Story (`m/spb/` etc.) | `story-{theme}` | shared.css + m/styles.css | noindex,follow |
| Survey educators | `theme-educators` | shared.css + survey/survey.css | noindex,follow |
| Survey parents | `theme-parents` | shared.css + survey/survey.css | noindex,follow |
| 404 | `data-page-type="404"` | shared.css | noindex,follow |
| Literature | — | shared.css + literature.css | Indexable |
| Reports | — | shared.css + reports.css | Indexable |
| Data entry | `data-page-type="data-entry"` | shared.css + data-entry.css | Indexable |

## Dark Mode

Two activation paths:
1. `@media (prefers-color-scheme: dark)` — system preference
2. `[data-theme="dark"]` — manual toggle via `localStorage('bpedk-theme')`

Both paths set identical token values. Manual toggle takes precedence. Toggle icon: ☾ (light) / ☀ (dark).

## Accessibility

- `:focus-visible` — 3px accent outline, 2px offset, `--r-sm` radius
- `.skip-link` — absolute positioned, slides in on focus
- `prefers-reduced-motion: reduce` — disables all animations, transitions set to 0.01ms, fade-up elements shown immediately
- Touch targets — min 44px on mobile (`@media max-width: 900px`)
- `-webkit-tap-highlight-color: transparent` on mobile
- `user-select: none` on story paragraphs (copy protection)
- ARIA labels on navigation, theme toggle, buttons

## Print

Nav, back-to-top, scroll progress, toggle hidden. Background forced to white, text to black. Cards lose shadows, get simple 1px borders.

## Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| `> 1100px` | Full desktop: 12-col grid, hero 2-col, multi-col grids |
| `960–1100px` | Tablet: hero collapses to 1-col, grids stack |
| `720–960px` | Mobile nav active, grids → 1-col, reduced padding |
| `480–720px` | Phone: tighter padding, smaller fonts, survey hides subtitle |
| `< 480px` | Small phone: minimal padding, compact nav, reduced tap targets |
| `< 600px height` | Short viewport: smaller GIFs, reduced padding, hidden subtitle |

## File Structure

```
assets/
  shared.css        — Design system tokens, components, layout, animations (1296 lines)
  landing.css       — Landing page overrides, 12-col grid, hero panel (1474 lines)
  literature.css    — Literature page: numbered list, AI note card (140 lines)
  reports.css       — Reports page: grid cards, tables, scan panels (354 lines)
  data-entry.css    — Data entry: forms, option tiles, rating selectors (627 lines)
  shared.js         — Boot: scroll progress, back-to-top, theme toggle, mobile nav, fade-up, smooth anchors (195 lines)
  analytics.js      — GA4 tracking (G-S590QSD215) with custom events
survey/
  survey.css        — Redirect page: timer, progress bar, closed state, in-app prompt (236 lines)
  survey.js         — Timer countdown, random redirect, Telegram WebApp support
m/
  styles.css        — Hub + story page: grid, themes, dark mode per-story (294 lines)
```

## Design Principles

1. **Academic authority** — serif headings, measured line-height, generous whitespace
2. **Warm editorial** — warm backgrounds (`#f8f7f2`, `#f7f4ec`), not sterile white
3. **Subtle depth** — layered shadows, glass surfaces, radial gradient accents
4. **Purposeful motion** — spring easing for entrances, smooth for transitions, shimmer for progress
5. **Theme differentiation** — educators = blue, parents = purple, video = warm orange, stories = unique palettes
6. **Progressive disclosure** — blind codes hide material origin, details/summary for methodology
7. **Mobile-first constraints** — touch targets, reduced padding, single-column layouts under 960px
8. **Dark mode parity** — every token has dark equivalent, not just inverted
9. **Content over chrome** — story pages strip navigation, focus on reading
10. **Consistent metadata** — Inter 0.72rem uppercase for labels, Source Serif for values
