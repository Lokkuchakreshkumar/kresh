# DESIGN.md — Kresh Design System

This document captures every design decision, token, font, color, animation, image, and component pattern used across the Kresh homepage (`/` route). It serves as the single source of truth for maintaining visual consistency and is intended to be installed as a skill for AI agents working on Kresh.

---

## 1. Design Philosophy

Kresh's visual identity rests on five core pillars:

| Pillar | Description |
|---|---|
| **Dark-First Minimalism** | Near-black backgrounds with extremely sparse use of color. White is the primary text color. The interface breathes through negative space, not decoration. |
| **Liquid Glass Physicality** | Inspired by Apple's WWDC Liquid Glass. UI elements use SVG displacement maps (`feDisplacementMap`) to physically refract content underneath them, creating depth without skeuomorphism. |
| **Typographic Contrast** | Two hero fonts with dramatically different personalities (a heavy grotesque and a delicate cursive) are set side-by-side to create visual tension and memorability. |
| **Alive Interfaces** | Every section has motion: letter-by-letter blur reveals, auto-cycling 3D cylinders, infinite marquees, GSAP-driven tilt/magnetism on cards, and a glass sphere that slides on the theme toggle. |
| **Developer-Native Aesthetic** | Monospace terminal prompts, `$` prefixes, copy-to-clipboard interactions, and `kresh install` commands treat the homepage itself as a CLI preview. |

### Design Rules (Strictly Enforced)

- **Never use letter spacing** (`tracking-tight`, `tracking-wide`, etc. are forbidden on body content and headings).
- **No placeholder images** — every image is a real asset.
- **Try-catch every interaction** — animations and DOM access are wrapped to prevent production crashes.
- **Files stay lean** — CSS and component code is split across multiple files, no single file should be bloated.

---

## 2. Color System

### 2.1 Dark Mode (Default — `:root`)

| Token | Value | Usage |
|---|---|---|
| `--background` | `#0F1115` | Page background — elegant dark slate grey |
| `--foreground` | `#ededed` | Base body text |
| `--kresh-green` | `#2ecc71` | Brand accent — terminal `$` prompt, active indicators, selection highlight |
| `--glass-bg` | `rgba(255,255,255,0.03)` | Glass panel fill — barely visible white |
| `--glass-border` | `rgba(255,255,255,0.08)` | Glass panel border — subtle white edge |
| `--text-primary` | `#ffffff` | Headings, nav links, strong text |
| `--text-secondary` | `#9ca3af` | Muted body copy, placeholders, descriptions (Tailwind gray-400) |
| `--border-color` | `rgba(255,255,255,0.1)` | Dividers, header border, card borders |
| `--glow-color` | `255, 255, 255` | RGB triplet for radial glow effects (spotlight, border glow) |

### 2.2 Light Mode (`.light` class on `<html>`)

| Token | Value | Usage |
|---|---|---|
| `--background` | `#f7faf7` | Page background — warm off-white with green undertone |
| `--foreground` | `#1c1e1c` | Base body text |
| `--kresh-green` | `#2ecc71` | Same brand accent (unchanged) |
| `--glass-bg` | `rgba(0,0,0,0.03)` | Inverted glass — barely visible dark |
| `--glass-border` | `rgba(0,0,0,0.08)` | Inverted glass border |
| `--text-primary` | `#1c1e1c` | Headings, nav links |
| `--text-secondary` | `#4b5563` | Muted body copy (Tailwind gray-600) |
| `--border-color` | `rgba(0,0,0,0.15)` | Dividers, borders |
| `--glow-color` | `0, 0, 0` | Dark glow for light backgrounds |

### 2.3 Accent & Specialty Colors

| Color | Hex / Value | Where Used |
|---|---|---|
| Kresh Green | `#2ecc71` | Terminal prompt `$`, active user dot, selection highlight, focus rings |
| CircleStack Layer 1 | `#00f2fe` → `#8a2be2` → `#ff0844` | "Application" cylinder — cyan-violet-red radial gradient |
| CircleStack Layer 2 | `#2b1055` → `#ff512f` → `#4facfe` → `#00f2fe` | "Kresh" cylinder — deep purple to coral to blue |
| CircleStack Layer 3 | `#ff9a9e` → `#fecfef` → `#a18cd1` | "Model" cylinder — soft pink to lavender |
| Bento Card BG | `#030303` | Near-black card backgrounds |
| Bento Background Dark | `#08070b` | MagicBento grid background context |

### 2.4 Theme Switching Mechanism

- Theme is persisted in `localStorage` under key `theme` (values: `'light'` or `'dark'`).
- An inline `<script>` in `<head>` reads `localStorage` before first paint to prevent FOUC.
- The `.light` class is toggled on `<html>` via `document.documentElement.classList`.
- Both `<html>` and `<body>` carry `suppressHydrationWarning` to tolerate browser extension attribute injections.

---

## 3. Typography

### 3.1 Font Stack

| Role | Font Family | Source | Weight | CSS Class / Variable |
|---|---|---|---|---|
| **Body / UI** | Geist Sans | `next/font/google` | Variable | `--font-geist-sans`, `font-sans` |
| **Code / Mono** | Geist Mono | `next/font/google` | Variable | `--font-geist-mono`, `font-mono` |
| **Hero — Bold Words** | Schibsted Grotesk | Google Fonts | 900 (Black) | `.schibsted-grotesk-hero` |
| **Hero — Cursive Words** | Playwrite GB J | Google Fonts | 300 (Light) | `.playwrite-gb-j-hero` |
| **Terminal / CLI** | DotGothic16 | Google Fonts | 400 | `.dotgothic16-regular` |
| **Display / Serif** | Playfair Display | Google Fonts | 400–900 | `--font-serif-display` (registered but not actively used on `/`) |

### 3.2 Hero Typography Pattern

The hero headline "Install Skills and Publish Skills." uses a **dual-font interleaving** technique:

```
Install        → Schibsted Grotesk 900, 5xl/6xl
Skills         → Playwrite GB J 300, 4xl/5xl
and            → Schibsted Grotesk 900, 5xl/6xl
Publish        → Schibsted Grotesk 900, 5xl/6xl
Skills.        → Playwrite GB J 300, 4xl/5xl
```

Each word is wrapped in a `<BlurText>` component that animates letter-by-letter from blur+offset to crisp+positioned using Framer Motion.

### 3.3 Text Size Scale (Used on `/`)

| Size | Where |
|---|---|
| `text-[9px]` | Theme toggle labels ("Dark" / "Light") |
| `text-[10px]` | Ctrl+K badge, bento card labels |
| `text-xs` | Section labels ("WORKS WITH", "Intelligence Schema"), footer links |
| `text-sm` | Nav links, search input, session username, button text |
| `text-base` | Terminal command text (DotGothic16) |
| `text-lg` | Hero subtitle ("AI Knows More With Kresh.") |
| `text-xl` | Logo wordmark "kresh", bento card titles, CircleStack active label |
| `text-3xl` | Section heading "The Ecosystem Structure", CircleStack right-side title |
| `text-4xl` → `text-5xl` | Hero cursive words (responsive) |
| `text-5xl` → `text-6xl` | Hero grotesque words (responsive) |

---

## 4. Glass Effect System

### 4.1 Global SVG Refraction Filter

A hidden SVG in `<body>` defines the `#glass-refraction` filter used across the entire app:

```xml
<filter id="glass-refraction" x="-20%" y="-20%" width="140%" height="140%">
  <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" />
  <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.3 0" />
  <feDisplacementMap in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G" />
  <feGaussianBlur stdDeviation="12" />
</filter>
```

This creates a frosted-glass distortion: a subtle fractal noise map shifts pixels by 3px via displacement, then blurs with a 12px Gaussian.

### 4.2 Glass Utility Classes

**`glass`** — Flat glass panel (used on search bar, command box, buttons):
```css
background-color: var(--glass-bg);        /* rgba(255,255,255,0.03) */
backdrop-filter: url(#glass-refraction);
border: 1px solid var(--glass-border);     /* rgba(255,255,255,0.08) */
```

**`glass-sphere`** — 3D physical sphere (used on theme toggle):
```css
background: rgba(255,255,255,0.02);
backdrop-filter: blur(2px) url(#glass-refraction);
box-shadow:
  inset 0 2px 6px rgba(255,255,255,0.6),   /* top light catch */
  inset 0 -2px 6px rgba(0,0,0,0.45),        /* bottom shadow */
  0 2px 8px rgba(0,0,0,0.25);               /* drop shadow */
border: 1px solid rgba(255,255,255,0.5);
```

The sphere also has two internal specular highlights:
- **Top-left**: `radial-gradient(circle, rgba(255,255,255,0.95) → transparent)` rotated -30°
- **Bottom-right**: `radial-gradient(circle, rgba(255,255,255,0.4) → transparent)`

### 4.3 Glass Component (`<Glass>`)

The `Glass` React component wraps children with:
1. The `glass` CSS utility
2. A `border border-white/10` specular edge overlay
3. A horizontal `via-white/20` gradient line along the top edge simulating a rim light

---

## 5. Animation System

### 5.1 BlurText (Hero Reveal)

- **Library**: Framer Motion (`motion/react`)
- **Trigger**: IntersectionObserver (fires once when element scrolls into view)
- **Sequence per letter**: `blur(10px) + opacity(0) + y(50px)` → `blur(5px) + opacity(0.5)` → `blur(0px) + opacity(1) + y(0)`
- **Stagger**: 60ms between words, 50ms base delay
- **Duration**: 0.35s per step

### 5.2 Marquee (Works With logos)

- **Technique**: Pure CSS `translate3d(0) → translate3d(-50%)` on a doubled logo strip
- **Duration**: 40 seconds linear infinite
- **GPU**: `will-change: transform; backface-visibility: hidden;`
- **Fade edges**: CSS `mask-image` linear gradients (left/right) + `backdrop-blur-md` overlays
- **Interaction**: `animation-play-state: paused` on `.marquee-container:hover`

### 5.3 CircleStack (3D Cylinders)

- **Auto-cycle**: `setInterval` every 2500ms rotating through 3 layers
- **Active cylinder**: Lifts -10px, border brightens to `white/80`, glow shadow appears
- **Inactive**: Pushes down, fills with `#0a0a0c`, border dims to `white/30`
- **Grain overlay**: Inline SVG `feTurbulence` noise texture with `mix-blend-color-dodge`
- **Text inside oval**: Playwrite GB J font, fades in with `scale(0.95) → scale(1)` over 700ms

### 5.4 MagicBento (Card Grid)

- **Library**: GSAP
- **Spotlight**: A 800px radial gradient div (`mix-blend-mode: screen`) follows the mouse across the section
- **Border glow**: CSS `::after` pseudo-element with `radial-gradient` tracking `--glow-x/y` custom properties
- **Tilt**: `rotateX/Y ±6°` with `transformPerspective: 1000px` on mouse move
- **Magnetism**: Cards drift 4% toward the cursor position
- **Click ripple**: Spawned `div` with GSAP `scale(0→1) + opacity(1→0)` over 0.8s
- **Particles**: Pre-computed pool of 12 `4px` glowing dots, animated with random drift and pulsing opacity
- **Mobile**: All animations disabled below 768px breakpoint

### 5.5 Theme Toggle (Glass Sphere)

- **Slide**: `translateX(0px) ↔ translateX(50px)` with `cubic-bezier(0.25, 1, 0.5, 1)` spring
- **Duration**: 500ms
- **Icon transition**: Scale `0.75 → 1.0` + opacity `0 → 1` over 300ms
- **Text slide**: `translateX(±2px)` fade in/out over 300ms
- **Hover**: `scale(1.02)`, Active press: `scale(0.98)`

---

## 6. Component Inventory

### 6.1 Layout Components

| Component | File | Description |
|---|---|---|
| `RootLayout` | `src/app/layout.js` | Loads Geist fonts, injects theme script, embeds SVG refraction filter |
| `Header` | `src/components/layout/Header.jsx` | Fixed navbar: logo, nav links (Registry, Docs), search bar, session controls, ThemeToggle |
| `Footer` | `src/components/layout/Footer.jsx` | 6-column grid: logo, Product/Resources/Community/Company links, email signup |

### 6.2 UI Components

| Component | File | Description |
|---|---|---|
| `Glass` | `src/components/ui/Glass.jsx` | Wrapper with `glass` class + specular edge + rim light |
| `GlassCard` | `src/components/ui/GlassCard.jsx` | Extends Glass with padding, hover lift (`-translate-y-1`), shadow |
| `Button` | `src/components/ui/Button.jsx` | 4 variants: `primary`, `outline`, `glass`, `ghost` — all `rounded-full` pills |
| `Badge` | `src/components/ui/Badge.jsx` | 5 color variants: default, green, blue, purple, orange |
| `BlurText` | `src/components/ui/BlurText.jsx` | Animated text reveal with IntersectionObserver + Framer Motion |
| `CircleStack` | `src/components/ui/CircleStack.jsx` | 3D cylinder stack with auto-cycling layers |
| `MagicBento` | `src/components/ui/MagicBento.jsx` | Interactive bento grid with spotlight, tilt, magnetism, particles |
| `ThemeToggle` | `src/components/ui/ThemeToggle.jsx` | 3D glass sphere toggle for light/dark mode |

### 6.3 Button Variants

| Variant | Style |
|---|---|
| `primary` | `bg-text-primary text-background hover:opacity-90` — solid, high-contrast |
| `outline` | `border border-border-color text-text-primary hover:bg-text-primary/10` — ghost with border |
| `glass` | `glass hover:bg-text-primary/10 text-text-primary` — frosted glass fill |
| `ghost` | `text-text-secondary hover:text-text-primary hover:bg-text-primary/5` — invisible until hovered |

All buttons share: `rounded-full`, `text-sm`, `font-medium`, `transition-all duration-200`, `focus:ring-2 ring-kresh-green/50`.

---

## 7. Image & Asset Inventory

### 7.1 Logo

| File | Path | Format | Usage |
|---|---|---|---|
| `kresh_logo_exact.svg` | `/logo/kresh_logo_exact.svg` | SVG (421KB) | Header and footer logo mark |
| `logo.png` | `/logo/logo.png` | PNG (1.4MB) | Alternate raster logo |

### 7.2 Hero Assets

| File | Path | Usage |
|---|---|---|
| `arrow.png` | `/arrow.png` | Hand-drawn arrow pointing to the terminal command. In light mode, it is inverted via `[html.light_&]:invert` |

### 7.3 "Works With" Scroll Logos

All located in `/scroll/`. Displayed as 64×64px, initially `grayscale opacity-45`, on hover: `grayscale-0 opacity-100 scale-110`.

| File | Brand |
|---|---|
| `chatgpt_logo.png` | ChatGPT |
| `claude_logo.png` | Claude |
| `cursor_logo.png` | Cursor |
| `gemini_logo.png` | Gemini |
| `kimi_logo.png` | Kimi |
| `deepseek_logo.png` | DeepSeek |
| `grok_logo.png` | Grok |
| `meta_logo.png` | Meta AI |
| `Mistral_logo.png` | Mistral |
| `Qwen_logo.png` | Qwen |

### 7.4 Bento Card Background Images

All located in `/Bento/`. Displayed at `opacity: 0.3`, `object-fit: cover`, filling the entire card.

| File | Card Label | Card Title |
|---|---|---|
| `discover.png` | Discover | Templates — Community |
| `knowledge.png` | Knowledge | Docs & Context |
| `design.png` | DESIGN.md | Teach AI your product |
| `skill.png` | SKILLS | APIs • MCPs • Tools • Capabilities |
| `agents.png` | AGENTS.md | Workflows & behaviors |
| `prompt.png` | Prompts | Reusable instructions |

### 7.5 Auth Side Images

| File | Path | Usage |
|---|---|---|
| `signin_side.png` | `/signin_side.png` | Sign-in page side panel image |
| `signup_side.png` | `/signup_side.png` | Sign-up page side panel image |

---

## 8. Page Layout & Section Architecture (`/`)

The homepage follows a strict vertical flow with generous spacing:

```
┌─────────────────────────────────────────────┐
│  Header (fixed, z-50, bg-background)        │
│  Logo · Registry · Docs · Search · Auth · ⚫│
├─────────────────────────────────────────────┤
│                                             │
│  HERO (pt-32, mb-32, max-w-4xl, centered)   │
│  ┌─ Dual-font animated headline ──────────┐ │
│  │ "Install Skills and Publish Skills."    │ │
│  └────────────────────────────────────────┘ │
│  Subtitle: "AI Knows More With Kresh."      │
│  ┌─ Glass terminal box ──────────────────┐  │
│  │ $ kresh install senior-engineer   📋  │  │
│  └───────────────────────────────────────┘  │
│  [Get Started ›]  [Sign In]                 │
│                                             │
├─────────────────────────────────────────────┤
│  WORKS WITH (mb-32, full-width marquee)     │
│  ← ← ← logos scroll infinitely ← ← ←      │
│  Faded edges via CSS mask-image             │
│                                             │
├─────────────────────────────────────────────┤
│  SYSTEM STACK ARCHITECTURE (mb-32)          │
│  ┌──────────┐  ┌──────────────────────────┐ │
│  │ 3D Stack │  │  Layer Title             │ │
│  │ ○ App    │  │  Layer Description       │ │
│  │ ○ Kresh  │  │  ● ○ ○ indicators       │ │
│  │ ○ Model  │  │                          │ │
│  └──────────┘  └──────────────────────────┘ │
│                                             │
├─────────────────────────────────────────────┤
│  INTELLIGENCE SCHEMA (mb-32, max-w-7xl)     │
│  "The Ecosystem Structure"                  │
│  ┌───┬───┬───────┬───┐                      │
│  │   │   │       │   │  Bento grid          │
│  ├───┴───┤       ├───┤  with spotlight,     │
│  │       │       │   │  tilt, magnetism     │
│  │       ├───────┴───┤                      │
│  └───────┴───────────┘                      │
│                                             │
├─────────────────────────────────────────────┤
│  Footer (border-t, 6-col grid, mt-24)       │
│  Logo · Links · Email signup                │
└─────────────────────────────────────────────┘
```

### Section Spacing

- Header to first content: `pt-32` (128px)
- Between major sections: `mb-32` (128px)
- Footer margin top: `mt-24` (96px)
- Max content width: `max-w-7xl` (80rem) for bento, `max-w-4xl` (56rem) for hero

---

## 9. Responsive Behavior

| Breakpoint | Changes |
|---|---|
| **Mobile (< 640px)** | Logo text hidden, hero words wrap, buttons stack, bento grid single column |
| **sm (≥ 640px)** | Logo text visible, session controls shown, hero text grows |
| **md (≥ 768px)** | Nav links visible, CircleStack switches to 2-column (stack + text), bento 2-col |
| **lg (≥ 1024px)** | Search bar visible, bento switches to 4-column with spanning cards |

Bento grid responsive layout at `≥ 1024px`:
- Card 3: `grid-column: span 2; grid-row: span 2` (large feature card)
- Card 4: `grid-column: 1 / span 2; grid-row: 2 / span 2` (wide card)
- Card 6: `grid-column: 4; grid-row: 3`

---

## 10. Dependencies & Animation Libraries

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.2.7 | Framework (App Router, Turbopack) |
| `react` | 19.2.4 | UI library |
| `tailwindcss` | ^4 | Utility-first CSS with `@theme inline` |
| `motion` | ^12.40.0 | Framer Motion for BlurText reveal animations |
| `gsap` | ^3.15.0 | GreenSock for MagicBento tilt, magnetism, particles, ripple, spotlight |
| `lucide-react` | ^1.17.0 | Icons: Search, Copy, Check, ChevronRight, Sun, Moon |

---

## 11. Icon Usage

All icons are from `lucide-react`:

| Icon | Size | Where |
|---|---|---|
| `Search` | `w-4 h-4` | Header search bar prefix |
| `Copy` | `w-4 h-4` | Hero terminal copy button (idle) |
| `Check` | `w-4 h-4` | Hero terminal copy button (copied state) |
| `ChevronRight` | `w-4 h-4` | "Get Started" button suffix |
| `Sun` | `w-3.5 h-3.5` | Theme toggle — dark mode indicator |
| `Moon` | `w-3.5 h-3.5` | Theme toggle — light mode indicator |

---

## 12. Interaction Patterns

| Pattern | Behavior |
|---|---|
| **Copy to clipboard** | Click copies `kresh install senior-engineer`, icon swaps to Check (green) for 2s |
| **Keyboard shortcut** | `Ctrl+K` / `Cmd+K` focuses the search input |
| **Logo hover** | Grayscale logos in marquee become full-color + 110% scale on hover |
| **Marquee pause** | Hovering anywhere on the marquee container pauses the scroll |
| **CircleStack click** | Clicking a cylinder manually selects that layer |
| **Bento card hover** | Card tilts toward cursor, drifts magnetically, border glows, particles spawn |
| **Bento card click** | Radial ripple effect from click point |
| **Theme toggle** | Glass sphere slides with spring physics, icons and text cross-fade |
| **Text selection** | Custom selection color: `selection:bg-kresh-green/30` |

---

## 13. Accessibility Notes

- `aria-label` on theme toggle button describes the action
- `aria-hidden="true"` on the decorative SVG refraction filter
- Focus-visible ring on toggle: `focus-visible:ring-1 ring-kresh-green`
- All images have `alt` text
- Semantic `<header>`, `<main>`, `<footer>`, `<nav>` elements
- `<h1>` used once (hero), `<h2>` for section titles
