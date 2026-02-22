# RUNACOS — Modernistic UI Specification v2.0

> **A 5-Star, CS-Inspired Design System for the Redeemer's University Association of Computing Students**

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design DNA — CS Visual Language](#2-design-dna)
3. [Evolved Color System](#3-evolved-color-system)
4. [Typography System](#4-typography-system)
5. [Spacing & Grid](#5-spacing--grid)
6. [Component Library](#6-component-library)
7. [Motion & Animation System](#7-motion--animation-system)
8. [Page Layouts](#8-page-layouts)

---

## 1. Design Philosophy

### Core Principles

| Principle | Description |
|---|---|
| **Algorithmic Precision** | Every element placed with mathematical intent — golden ratio spacing, 8px grid alignment, pixel-perfect symmetry |
| **Data-Forward** | Information density of a terminal, elegance of a design studio |
| **Living Interfaces** | Subtle ambient motion — nothing static, everything breathes |
| **Depth Without Clutter** | Layered glass surfaces, not drop-shadow soup |
| **CS Identity** | The design itself should feel like it was built by computer scientists — structured, logical, beautiful |

### Signature Visual Motifs

- **Circuit-trace decorative lines** — thin `1px` animated lines that trace paths like a PCB board, used as section dividers and border accents
- **Terminal/monospace accents** — dates, stats, reference IDs, and badges rendered in monospace font (`JetBrains Mono`) for a code-native feel
- **Grid-dot backgrounds** — subtle dot-grid pattern (`radial-gradient`) on section backgrounds evoking graph paper / coordinate planes
- **Syntax-highlight badges** — status badges styled like code tokens (green for strings, blue for keywords, orange for warnings)
- **Binary/hex micro-details** — faint watermark patterns using binary or hex values as pure decoration
- **Cursor blink accent** — a blinking `|` cursor animation used next to live/active status indicators

---

## 2. Design DNA — CS Visual Language

### Background Textures

```
/* Dot-grid pattern */
.bg-grid-dots {
  background-image: radial-gradient(circle, rgba(11,44,77,0.07) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Circuit-trace lines — decorative SVG borders */
.circuit-border {
  border-image: url('/patterns/circuit-trace.svg') 1 fill;
}

/* Binary watermark */
.bg-binary {
  background-image: url('/patterns/binary-fade.svg');
  background-repeat: repeat;
  opacity: 0.02;
}
```

### Monospace Accents

Anywhere a "data value" appears (dates, IDs, stats counters, version numbers, reference codes), it should be rendered in:

```
font-family: 'JetBrains Mono', 'Fira Code', monospace;
font-size: 0.8em;
letter-spacing: 0.02em;
color: var(--navy-600);
```

### Glassmorphism (Selective Use)

Used for: Navbar (scrolled state), floating action panels, modal overlays, hero overlay cards.

```
backdrop-filter: blur(20px) saturate(180%);
background: rgba(255, 255, 255, 0.72);
border: 1px solid rgba(255, 255, 255, 0.3);
```

---

## 3. Evolved Color System

### Primary Palette

| Token | Hex | Usage |
|---|---|---|
| `--midnight` | `#040D19` | Darkest background, hero overlays |
| `--navy-900` | `#081E36` | Footer, dark sections |
| `--navy-800` | `#0B2C4D` | Primary brand, headings, CTA buttons |
| `--navy-600` | `#376491` | Secondary text on dark, icon color |
| `--navy-100` | `#C5D4E3` | Light borders, subtle backgrounds |

### Accent Palette

| Token | Hex | Usage |
|---|---|---|
| `--electric` | `#3B82F6` | Primary accent — links, active states, focus rings |
| `--cyan` | `#06B6D4` | Secondary accent — badges, highlights, hover glows |
| `--emerald` | `#10B981` | Success states, active/online indicators |
| `--amber` | `#F59E0B` | Warnings, pending states |
| `--rose` | `#F43F5E` | Errors, destructive actions, urgent badges |

### Surface & Neutral Palette

| Token | Hex | Usage |
|---|---|---|
| `--surface-0` | `#FFFFFF` | Primary card surface |
| `--surface-1` | `#F8FAFC` | Page background (very subtle warmth) |
| `--surface-2` | `#F1F5F9` | Inset areas, code blocks, secondary cards |
| `--surface-3` | `#E2E8F0` | Borders, dividers |
| `--text-primary` | `#0F172A` | Headings |
| `--text-secondary` | `#475569` | Body text |
| `--text-tertiary` | `#94A3B8` | Captions, timestamps, placeholders |

### Gradient Tokens

```
--gradient-hero: linear-gradient(135deg, #040D19 0%, #0B2C4D 50%, #1E3A5F 100%);
--gradient-accent: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
--gradient-card-shine: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
--gradient-glow: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59,130,246,0.06), transparent 40%);
```

---

## 4. Typography System

### Font Stack

| Role | Font | Fallback |
|---|---|---|
| **Display / Headings** | `Space Grotesk` | `Inter`, `system-ui`, `sans-serif` |
| **Body** | `Inter` | `system-ui`, `sans-serif` |
| **Mono / Data** | `JetBrains Mono` | `Fira Code`, `monospace` |

> **Note:** Replacing Merriweather (serif) with **Space Grotesk** — a geometric sans-serif with a technical, modern feel that better aligns with a CS identity while remaining highly legible.

### Type Scale (Fluid)

| Token | Size (mobile → desktop) | Weight | Line Height | Usage |
|---|---|---|---|---|
| `display-xl` | `2.5rem → 4.5rem` | 700 | 1.1 | Hero headline only |
| `display-lg` | `2rem → 3rem` | 700 | 1.15 | Page titles |
| `heading-1` | `1.75rem → 2.25rem` | 600 | 1.2 | Section headings |
| `heading-2` | `1.5rem → 1.75rem` | 600 | 1.25 | Sub-section headings |
| `heading-3` | `1.25rem → 1.375rem` | 600 | 1.3 | Card titles |
| `body-lg` | `1.0625rem → 1.125rem` | 400 | 1.6 | Lead paragraphs |
| `body` | `0.9375rem → 1rem` | 400 | 1.6 | Default body |
| `body-sm` | `0.8125rem → 0.875rem` | 400 | 1.5 | Captions, metadata |
| `mono` | `0.8125rem → 0.875rem` | 500 | 1.4 | Data values, code |
| `label` | `0.6875rem → 0.75rem` | 600 | 1.2 | Section labels, overlines (uppercase, tracking-widest) |

### Section Header Pattern

Every major section on every page follows this exact pattern:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ‹ LABEL ›              ← label / uppercase     │
│  ─── (2px accent line, 40px wide)               │
│  Section Heading         ← heading-1            │
│  Supporting subtext      ← body-lg / tertiary   │
│                                                 │
└─────────────────────────────────────────────────┘
```

The accent line uses `--gradient-accent` and animates width from `0 → 40px` on scroll-enter.

---

## 5. Spacing & Grid

### 8px Base Grid

All spacing uses multiples of 8px:

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Micro-gaps (icon-to-text) |
| `space-2` | 8px | Inline element spacing |
| `space-3` | 12px | Compact padding |
| `space-4` | 16px | Default padding |
| `space-6` | 24px | Card internal padding |
| `space-8` | 32px | Section internal gaps |
| `space-12` | 48px | Between content blocks |
| `space-16` | 64px | Section padding (mobile) |
| `space-24` | 96px | Section padding (desktop) |
| `space-32` | 128px | Hero vertical padding |

### Container

```
max-width: 1280px (80rem)
padding-x: 16px (mobile) → 24px (sm) → 32px (lg)
```

### Grid System

```
12-column grid (desktop)
gap: 24px (default) → 32px (loose)
```

### Page Layouts Use:

| Layout | Columns |
|---|---|
| **Full-width hero** | 12 cols, edge-to-edge |
| **Content + sidebar** | 8 + 4 cols |
| **Card grid** | 3 x 4 cols (desktop) → 2 cols (tablet) → 1 col (mobile) |
| **Article prose** | 8 cols centered (max-w-3xl) |
| **Dashboard** | Sidebar (280px fixed) + fluid content |

---

## 6. Component Library

### 6.1 Navbar

```
┌─────────────────────────────────────────────────────────────┐
│  [RUNACOS Logo]    Home  About  News  Events  Articles      │
│                    Past Questions  Executives  Contact       │
│                                        [Membership ▸]  ☰   │
└─────────────────────────────────────────────────────────────┘
```

**Behavior:**
- **Default (top):** Transparent background, white text on dark hero pages
- **Scrolled:** Glassmorphism effect — `backdrop-blur(20px)`, semi-transparent white, subtle bottom border
- **Sticky** with smooth background transition (0.3s ease)
- Logo: Geometric/minimalist logomark + "RUNACOS" in Space Grotesk bold
- Active link: underline with `--electric` color, 2px thickness, offset 4px below text
- "Membership" CTA: pill button with `--gradient-accent` background
- Mobile: full-screen overlay menu with staggered fade-in items, dark background

### 6.2 Cards

#### News/Article Card

```
┌──────────────────────────────────────┐
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  │         IMAGE                │    │
│  │         (16:9 ratio)         │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────┐                            │
│  │ TAG  │  ← syntax-highlight style  │
│  └──────┘                            │
│  Article Title Here                  │
│  Two-line excerpt of the article...  │
│                                      │
│  ┌──┐  Author Name  ·  Jan 15       │
│  │AV│  ← avatar         ↑ monospace │
│  └──┘                                │
└──────────────────────────────────────┘
```

**Styling:**
- `border: 1px solid var(--surface-3)`
- `border-radius: 12px`
- On hover: card lifts (`translateY(-4px)`), subtle blue glow at bottom edge (`box-shadow: 0 8px 30px rgba(59,130,246,0.12)`)
- Image: `object-fit: cover` with subtle zoom on hover (scale 1.03, overflow hidden)
- Tag badge: monospace font, colored background matching category

#### Event Card

```
┌──────────────────────────────────────┐
│                                      │
│  ┌────────┐                          │
│  │ MAR    │  Event Title Here        │
│  │  15    │  Description excerpt...  │
│  │ 2026   │                          │
│  └────────┘  📍 Location             │
│              🕐 10:00 AM             │
│                                      │
│  ─────────────────────────────────   │
│  ● 42 registered     [Register →]   │
│                                      │
└──────────────────────────────────────┘
```

**Date block:** Navy background, white text, stacked `month/day/year` in monospace. Slight rounded corners.

#### Stat Card

```
┌──────────────────────────┐
│  ┌────┐                  │
│  │ 🎓 │ ← icon in       │
│  └────┘   accent circle  │
│                          │
│  1,247                   │
│  ← counter (mono, 2xl)  │
│  Active Members          │
│  ← label (sm, tertiary) │
│                          │
│  ↑ 12% from last year   │
│  ← trend (emerald)      │
└──────────────────────────┘
```

**Counter:** Animated count-up on scroll-enter, monospace font, large size. Accent icon sits in a `48x48` circle with light tinted background.

### 6.3 Buttons

| Variant | Style |
|---|---|
| **Primary** | `--navy-800` bg, white text, `border-radius: 10px`, hover: lighten + lift 1px |
| **Accent** | `--gradient-accent` bg, white text, hover: saturate + glow shadow |
| **Secondary** | Transparent bg, `--navy-800` border (1.5px), hover: fill with navy-50 |
| **Ghost** | No border, text-only, hover: surface-2 bg |
| **Danger** | `--rose` bg, white text, hover: darken |
| **Icon Button** | `40x40`, rounded-full, surface-2 bg, centered icon |

All buttons: `font-weight: 500`, `padding: 10px 20px`, `transition: all 0.2s ease`.
Focus: `outline: 2px solid var(--electric)`, `outline-offset: 2px`.

### 6.4 Badges (Syntax-Highlight Style)

| Type | Colors | Example |
|---|---|---|
| **Keyword** | blue-100 bg / blue-700 text | `Published`, `Active` |
| **String** | emerald-100 bg / emerald-700 text | `Resolved`, `Approved` |
| **Warning** | amber-100 bg / amber-700 text | `Pending`, `Review` |
| **Error** | rose-100 bg / rose-700 text | `Rejected`, `Critical` |
| **Comment** | gray-100 bg / gray-600 text | `Draft`, `Archived` |

All badges: monospace font, `border-radius: 6px`, `padding: 2px 8px`, `font-size: 0.75rem`.

### 6.5 Forms

```
┌──────────────────────────────────┐
│  Label *                         │
│  ┌──────────────────────────┐    │
│  │  Placeholder text...     │    │
│  └──────────────────────────┘    │
│  Helper text or validation msg   │
└──────────────────────────────────┘
```

- Input: `border-radius: 10px`, `border: 1.5px solid var(--surface-3)`, `padding: 12px 16px`
- Focus: border transitions to `--electric`, `ring: 3px` with `rgba(59,130,246,0.1)`
- Error: border → `--rose`, helper text → rose, shake animation (subtle 3px horizontal)
- Label: `font-weight: 500`, `margin-bottom: 6px`, required asterisk in rose color

### 6.6 Footer

```
┌─────────────────────────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  (navy-900 background)   │
│                                                                 │
│  [RUNACOS]              Quick Links     Resources    Connect    │
│  Brief tagline          Home            Past Qs      Twitter    │
│  about the              About           Articles     Instagram  │
│  association.           News            Constitution LinkedIn   │
│                         Events          FRMS         Email      │
│                         Contact                                 │
│                                                                 │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ (circuit-trace divider) ─ ─ ─ ─ ─ ─ ─  │
│                                                                 │
│  © 2026 RUNACOS · RUN             Privacy · Terms · Sitemap    │
│  Built with ♥ by CS Students      v2.0.0  ← monospace         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

- Background: `--navy-900` with subtle dot-grid overlay (`opacity: 0.03`)
- Text: `--navy-100` for links, `--navy-300` for body
- Hover links: white with underline slide-in animation
- Divider: SVG circuit-trace line pattern, `opacity: 0.15`
- Version number in monospace, subtle tertiary color

---

## 7. Motion & Animation System

### Principles

| Principle | Rule |
|---|---|
| **Purposeful** | Every animation communicates state change or hierarchy |
| **Fast** | Nothing over 0.5s except page transitions and hero |
| **Interruptible** | All transitions can be cancelled mid-way |
| **Accessible** | Honors `prefers-reduced-motion` — degrades to instant |

### Scroll-Triggered Animations

| Element | Animation | Duration | Delay Pattern |
|---|---|---|---|
| Section heading | Fade up + line width grow | 0.6s | — |
| Cards in grid | Fade up + scale from 0.97 | 0.5s | Stagger 0.08s per card |
| Stat counters | Count-up from 0 | 1.2s | 0.1s after visible |
| Images | Fade in + slight zoom out (1.05 → 1.0) | 0.7s | — |
| Lists | Slide in from left | 0.4s | Stagger 0.05s per item |

### Micro-interactions

| Element | Trigger | Animation |
|---|---|---|
| Button | Hover | `scale(1.02)`, shadow intensify, 0.15s |
| Button | Click/Active | `scale(0.98)`, 0.1s |
| Card | Hover | `translateY(-4px)`, glow shadow, 0.25s |
| Link | Hover | Underline slides in from left, 0.2s |
| Nav link | Active | Bottom border morphs in, 0.2s |
| Input | Focus | Border color fade, ring expand, 0.2s |
| Toggle | Switch | Thumb slides with spring physics, 0.3s |
| Badge | Appear | Pop in with `scale(0 → 1)`, 0.2s |
| Toast | Enter | Slide in from top-right + fade, 0.3s |
| Toast | Exit | Slide out + fade, 0.2s |

### Page Transitions

```
Exit:  opacity 1 → 0, translateY(0 → -8px), 0.2s ease-in
Enter: opacity 0 → 1, translateY(12px → 0), 0.4s ease-out
```

### Hero Carousel

- Slide transition: crossfade (0.8s) with Ken Burns effect (slow zoom 1.0 → 1.08 over 8s)
- Text overlay: staggered word reveal with subtle upward motion
- Progress indicator: thin line at bottom that fills over slide duration

### Ambient / Decorative

- **Cursor blink:** next to "live" indicators — `opacity` toggle every 0.8s
- **Floating elements:** hero decorative shapes float with `translateY(±8px)` over 6s, ease-in-out
- **Dot-grid pulse:** on hero, a radial glow slowly drifts across the dot-grid background

---

## 8. Page Layouts

---

### 8.1 HOME PAGE ( `/` )

**Goal:** Immediate impact, communicate competence, drive engagement.

```
┌─────────────────────────────────────────────────────────────────┐
│ [NAVBAR — transparent, overlaying hero]                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ███████████████████████████████████████████████████████████████ │
│  ██                                                          ██ │
│  ██             HERO SECTION (100vh)                          ██ │
│  ██                                                          ██ │
│  ██   gradient-hero bg + dot-grid overlay                    ██ │
│  ██   + animated circuit-trace SVG lines                     ██ │
│  ██                                                          ██ │
│  ██   ‹ WELCOME TO RUNACOS ›                                 ██ │
│  ██                                                          ██ │
│  ██   Shaping the Future of                                  ██ │
│  ██   Computing Excellence                                   ██ │
│  ██   ← display-xl, staggered word reveal                    ██ │
│  ██                                                          ██ │
│  ██   Empowering computer science students at                ██ │
│  ██   Redeemer's University through innovation...            ██ │
│  ██                                                          ██ │
│  ██   [Become a Member ▸]  [Explore ↓]                       ██ │
│  ██   ← accent gradient    ← ghost/outline                  ██ │
│  ██                                                          ██ │
│  ██   ┌──────┐ ┌──────┐ ┌──────┐                            ██ │
│  ██   │●  500│ │●  25 │ │●  12 │  ← floating stat pills     ██ │
│  ██   │Membrs│ │Event │ │Execs │  (glassmorphism cards)      ██ │
│  ██   └──────┘ └──────┘ └──────┘                            ██ │
│  ██                                                          ██ │
│  ██   ────────────────── (progress bar for carousel) ─────── ██ │
│  ███████████████████████████████████████████████████████████████ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  QUICK ACCESS CARDS (surface-1 bg + dot-grid)                   │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  📰 News     │ │  📅 Events   │ │  📝 Articles  │           │
│  │              │ │              │ │              │             │
│  │  Stay up to  │ │  Don't miss  │ │  Learn from  │            │
│  │  date with...│ │  upcoming... │ │  our curated.│            │
│  │              │ │              │ │              │             │
│  │  [View →]    │ │  [View →]    │ │  [View →]    │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  📚 Past Qs  │ │  🔧 FRMS     │ │  🏛️ Execs    │           │
│  │              │ │              │ │              │             │
│  │  Access past │ │  Report a    │ │  Meet the    │            │
│  │  questions...│ │  facility... │ │  leadership..│            │
│  │              │ │              │ │              │             │
│  │  [View →]    │ │  [View →]    │ │  [View →]    │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                 │
│  Each card: icon in a 48px accent-tinted circle,                │
│  hover lifts card + icon circle pulses,                         │
│  circuit-trace top border accent                                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LATEST NEWS (white bg)                                         │
│                                                                 │
│  ‹ LATEST NEWS ›                                                │
│  ──                                                             │
│  What's Happening                                               │
│  Stay connected with RUNACOS updates                            │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │  IMAGE   │  │  IMAGE   │  │  IMAGE   │                      │
│  │          │  │          │  │          │                       │
│  │ [Tag]    │  │ [Tag]    │  │ [Tag]    │                      │
│  │ Title    │  │ Title    │  │ Title    │                      │
│  │ Excerpt  │  │ Excerpt  │  │ Excerpt  │                      │
│  │ 📅 Date  │  │ 📅 Date  │  │ 📅 Date  │                     │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                 │
│                   [View All News →]                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  UPCOMING EVENTS (surface-1 bg)                                 │
│                                                                 │
│  ‹ UPCOMING EVENTS ›                                            │
│  ──                                                             │
│  Don't Miss Out                                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐            │
│  │ ┌────┐                                          │            │
│  │ │MAR │  Hackathon 2026                          │            │
│  │ │ 15 │  Join the biggest coding competition...  │            │
│  │ └────┘  📍 CS Lab  🕐 9:00 AM                   │            │
│  │                          ● 89 going  [RSVP →]   │            │
│  ├─────────────────────────────────────────────────┤            │
│  │ ┌────┐                                          │            │
│  │ │APR │  Tech Talk: AI & Ethics                  │            │
│  │ │ 02 │  A deep dive into responsible AI...      │            │
│  │ └────┘  📍 Auditorium  🕐 2:00 PM               │            │
│  │                          ● 45 going  [RSVP →]   │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                 │
│                  [See All Events →]                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STATS SECTION (navy-800 bg + dot-grid overlay)                 │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ 🎓       │  │ 📅       │  │ 📰       │  │ 🏆       │       │
│  │  500+    │  │  25+     │  │  120+    │  │  15+     │        │
│  │ Members  │  │ Events   │  │ Articles │  │ Awards   │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                 │
│  Counter numbers in mono font, animated count-up                │
│  Each stat card: glass surface on dark bg                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  NEWSLETTER SECTION (white bg)                                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐            │
│  │  gradient-accent border-left (3px)              │            │
│  │                                                 │            │
│  │  ‹ STAY IN THE LOOP ›                           │            │
│  │  Subscribe to Our Newsletter                    │            │
│  │  Get updates delivered to your inbox.           │            │
│  │                                                 │            │
│  │  ┌──────────────────────────┐ [Subscribe ▸]     │            │
│  │  │  your@email.com          │                   │            │
│  │  └──────────────────────────┘                   │            │
│  │                                                 │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                 │
│  The subscribe card: subtle gradient bg (surface-1 → white),    │
│  left accent border with gradient, form inline on desktop       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.2 ABOUT PAGE ( `/about` )

```
┌─────────────────────────────────────────────────────────────────┐
│ [NAVBAR]                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PAGE HERO (compact, 40vh)                                      │
│  navy-800 bg + dot-grid overlay                                 │
│                                                                 │
│  Breadcrumb: Home / About                  ← monospace, sm      │
│                                                                 │
│  About RUNACOS                             ← display-lg, white  │
│  Our mission, vision, and story            ← body-lg, navy-200  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  MISSION & VISION (white bg)                                    │
│                                                                 │
│  ┌───────────────────────┐  ┌───────────────────────┐           │
│  │  ◎ Our Mission        │  │  ◉ Our Vision         │           │
│  │                       │  │                       │           │
│  │  Full mission text... │  │  Full vision text...  │           │
│  │                       │  │                       │           │
│  │  accent-left-border   │  │  cyan-left-border     │           │
│  └───────────────────────┘  └───────────────────────┘           │
│                                                                 │
│  Two columns on desktop, stacked on mobile.                     │
│  Each card: left border (3px) with respective accent color.     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  OUR STORY — TIMELINE (surface-1 bg)                            │
│                                                                 │
│  ‹ OUR JOURNEY ›                                                │
│  ──                                                             │
│  The RUNACOS Story                                              │
│                                                                 │
│          ●─── 2018: Founded by passionate CS students            │
│          │                                                      │
│          ●─── 2019: First Hackathon — 50 participants            │
│          │                                                      │
│          ●─── 2020: Launched digital platform                    │
│          │                                                      │
│          ●─── 2021: 200+ active members milestone                │
│          │                                                      │
│          ●─── 2024: FRMS system launched                         │
│          │                                                      │
│          ●─── 2026: 500+ members and growing                    │
│                                                                 │
│  Timeline: vertical line (2px, gradient-accent),                │
│  dots are 12px circles with accent fill,                        │
│  each milestone animates in on scroll (alternating sides)       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CORE VALUES (white bg)                                         │
│                                                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                       │
│  │ 💡   │  │ 🤝   │  │ 🔬   │  │ 🌍   │                       │
│  │Innov.│  │Collab│  │Resrch│  │Impact│                        │
│  │      │  │      │  │      │  │      │                        │
│  │ text │  │ text │  │ text │  │ text │                        │
│  └──────┘  └──────┘  └──────┘  └──────┘                        │
│                                                                 │
│  4-column grid, icon in accent circle,                          │
│  hover: icon rotates 5deg + card glows                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.3 NEWS LISTING ( `/news` )

```
┌─────────────────────────────────────────────────────────────────┐
│ [NAVBAR]                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PAGE HERO (compact, 30vh)                                      │
│  Home / News                                                    │
│  News & Updates                                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FILTER BAR (sticky below navbar on scroll)                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  [All] [Announcements] [Academic] [Events] [General]   │    │
│  │  ← pill tabs                                           │    │
│  │                                                        │    │
│  │  ┌──────────────────────────┐  Sort: [Latest ▾]        │    │
│  │  │  🔍 Search articles...   │                          │    │
│  │  └──────────────────────────┘                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Surface-2 bg, rounded-xl, padding 16px.                        │
│  Pill tabs from component library.                              │
│  Becomes sticky with glassmorphism when scrolled past.          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FEATURED ARTICLE (if pinned)                                   │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐      │
│  │  ┌────────────────────┐                               │      │
│  │  │                    │  ‹ FEATURED ›                  │      │
│  │  │     LARGE IMAGE    │                               │      │
│  │  │     (hero crop)    │  Article Title Here            │      │
│  │  │                    │  That Spans Two Lines          │      │
│  │  │                    │                               │      │
│  │  │                    │  Excerpt paragraph text...     │      │
│  │  │                    │                               │      │
│  │  │                    │  📅 Jan 15, 2026 · 5 min read │      │
│  │  │                    │                               │      │
│  │  │                    │  [Read Article →]              │      │
│  │  └────────────────────┘                               │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                 │
│  Full-width card, 2 columns (image left, content right),        │
│  gradient border on left side.                                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  NEWS GRID                                                      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │  [card]  │  │  [card]  │  │  [card]  │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │  [card]  │  │  [card]  │  │  [card]  │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                 │
│  3-col grid → 2-col tablet → 1-col mobile                      │
│  Cards use the News/Article Card component                      │
│  Staggered scroll-in animation                                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PAGINATION                                                     │
│                                                                 │
│  [← Prev]  1  2  [3]  4  5  ...  12  [Next →]                  │
│                                                                 │
│  Active page: accent bg, white text, rounded-lg                 │
│  Hover: surface-2 bg                                            │
│  Monospace page numbers                                         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.4 NEWS DETAIL ( `/news/[slug]` )

```
┌─────────────────────────────────────────────────────────────────┐
│ [NAVBAR]                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ARTICLE HERO                                                   │
│                                                                 │
│  Home / News / Article Title                 ← breadcrumb       │
│                                                                 │
│  [Tag Badge]                                                    │
│  Article Title That Can                      ← display-lg       │
│  Span Multiple Lines                                            │
│                                                                 │
│  ┌──┐  Author Name · Published Jan 15, 2026 · 5 min read       │
│  │AV│  ← monospace dates                                        │
│  └──┘                                                           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │              FULL-WIDTH COVER IMAGE                      │    │
│  │              (16:9, max-h-[480px])                       │    │
│  │              rounded-xl, subtle shadow                   │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
├──────────────────────────────────┬──────────────────────────────┤
│                                  │                              │
│  ARTICLE CONTENT (8 cols)        │  SIDEBAR (4 cols)            │
│  max-w-3xl                       │                              │
│                                  │  ┌────────────────────┐      │
│  Rich text prose with            │  │ TABLE OF CONTENTS  │      │
│  prose-custom styling.           │  │                    │      │
│                                  │  │  1. Introduction   │      │
│  Headings, paragraphs,           │  │  2. Background     │      │
│  images, blockquotes,            │  │  3. Key Points     │      │
│  code blocks (syntax-            │  │  4. Conclusion     │      │
│  highlighted).                   │  │                    │      │
│                                  │  │  ← active item has │      │
│  Pull quotes styled with         │  │  left accent bar   │      │
│  left accent border and          │  └────────────────────┘      │
│  italic serif font.             │                              │
│                                  │  ┌────────────────────┐      │
│  Images within article:          │  │ SHARE              │      │
│  rounded-lg, subtle shadow,      │  │                    │      │
│  optional caption in gray.       │  │  🔗  📋  🐦  📧    │      │
│                                  │  │  Copy Share Tweet   │      │
│                                  │  └────────────────────┘      │
│                                  │                              │
│                                  │  ┌────────────────────┐      │
│                                  │  │ RELATED ARTICLES   │      │
│                                  │  │                    │      │
│                                  │  │  • Article title   │      │
│                                  │  │  • Article title   │      │
│                                  │  │  • Article title   │      │
│                                  │  └────────────────────┘      │
│                                  │                              │
│  Sidebar: sticky (top: 100px)    │  Sidebar cards:              │
│                                  │  surface-1 bg, rounded-xl    │
│                                  │                              │
├──────────────────────────────────┴──────────────────────────────┤
│ [FOOTER]                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.5 EVENTS LISTING ( `/events` )

```
┌─────────────────────────────────────────────────────────────────┐
│ [NAVBAR]                                                        │
├─────────────────────────────────────────────────────────────────┤
│  PAGE HERO (compact)                                            │
│  Events & Happenings                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  VIEW TOGGLE + FILTERS                                          │
│                                                                 │
│  [📅 Calendar] [≡ List]    [Upcoming] [Past]    🔍 Search...    │
│  ← view toggle               ← time filter                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EVENTS LIST / GRID                                             │
│                                                                 │
│  ── March 2026 ──────────────── ← month separator (mono)        │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐            │
│  │  Event Card (full-width list style)             │            │
│  └─────────────────────────────────────────────────┘            │
│  ┌─────────────────────────────────────────────────┐            │
│  │  Event Card                                     │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                 │
│  ── April 2026 ──────────────── ← month separator               │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐            │
│  │  Event Card                                     │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                 │
│  Events grouped by month with a divider label.                  │
│  Each event card: horizontal layout with date block on left.    │
│  Past events: slightly muted (opacity 0.7) with "Past" badge.  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.6 EVENT DETAIL ( `/events/[slug]` )

```
┌─────────────────────────────────────────────────────────────────┐
│ [NAVBAR]                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  COVER IMAGE (full-width, 50vh, parallax scroll)           │ │
│  │                                                            │ │
│  │  Overlay gradient (bottom: navy-900 → transparent)         │ │
│  │                                                            │ │
│  │  ┌────────┐                                                │ │
│  │  │ MAR    │  Event Title                  ← display-lg     │ │
│  │  │  15    │  Subtitle or tagline                           │ │
│  │  │ 2026   │                                                │ │
│  │  └────────┘  [Register Now ▸]  [Add to Calendar]           │ │
│  │              ← accent CTA      ← ghost button              │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
├──────────────────────────────────┬──────────────────────────────┤
│                                  │                              │
│  EVENT DETAILS (8 cols)          │  INFO SIDEBAR (4 cols)       │
│                                  │                              │
│  Rich description text...        │  ┌────────────────────┐      │
│                                  │  │ EVENT INFO         │      │
│  Agenda / schedule section       │  │                    │      │
│                                  │  │  📅 Mar 15, 2026   │      │
│  Speaker profiles if any         │  │  🕐 9:00 AM - 5PM  │      │
│                                  │  │  📍 CS Lab Block B │      │
│                                  │  │  👥 89 / 120 spots │      │
│                                  │  │                    │      │
│                                  │  │  ████████████░░░   │      │
│                                  │  │  74% full          │      │
│                                  │  │  ← capacity bar    │      │
│                                  │  │                    │      │
│                                  │  │  [Register ▸]      │      │
│                                  │  └────────────────────┘      │
│                                  │                              │
│                                  │  ┌────────────────────┐      │
│                                  │  │ SHARE EVENT        │      │
│                                  │  │  🔗  📋  🐦        │      │
│                                  │  └────────────────────┘      │
│                                  │                              │
│                                  │  Sidebar: sticky             │
│                                  │                              │
├──────────────────────────────────┴──────────────────────────────┤
│ [FOOTER]                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.7 EXECUTIVES PAGE ( `/executives` )

```
┌─────────────────────────────────────────────────────────────────┐
│ [NAVBAR]                                                        │
├─────────────────────────────────────────────────────────────────┤
│  PAGE HERO                                                      │
│  Meet Our Executive Council                                     │
│  The student leaders driving RUNACOS forward                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PRESIDENT FEATURE (full-width spotlight)                       │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐      │
│  │                                                       │      │
│  │  ┌──────────┐  ‹ PRESIDENT ›                          │      │
│  │  │          │                                         │      │
│  │  │  PHOTO   │  Full Name                              │      │
│  │  │  (1:1    │  Department of Computer Science         │      │
│  │  │  circle  │                                         │      │
│  │  │  crop)   │  "Inspirational quote from the          │      │
│  │  │          │   president about the association..."   │      │
│  │  │          │                                         │      │
│  │  └──────────┘  🐦 📧 🔗  ← social links               │      │
│  │                                                       │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                 │
│  Special card: larger, gradient border, subtle glow.            │
│  Photo has accent ring border.                                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EXECUTIVE GRID                                                 │
│                                                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │   ┌────┐   │  │   ┌────┐   │  │   ┌────┐   │               │
│  │   │FOTO│   │  │   │FOTO│   │  │   │FOTO│   │               │
│  │   └────┘   │  │   └────┘   │  │   └────┘   │               │
│  │            │  │            │  │            │                │
│  │  Name      │  │  Name      │  │  Name      │               │
│  │  V. Pres.  │  │  Secretary │  │  Treasurer │               │
│  │            │  │            │  │            │                │
│  │  🐦 📧     │  │  🐦 📧     │  │  🐦 📧     │               │
│  └────────────┘  └────────────┘  └────────────┘                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │   ...      │  │   ...      │  │   ...      │               │
│  └────────────┘  └────────────┘  └────────────┘                │
│                                                                 │
│  3-col grid, each card: centered layout, circular photo         │
│  (120px), name + position, social icons.                        │
│  Hover: photo scales slightly, card lifts.                      │
│  Click: expand to modal/detail with full bio.                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.8 PAST QUESTIONS ( `/past-questions` )

```
┌─────────────────────────────────────────────────────────────────┐
│ [NAVBAR]                                                        │
├─────────────────────────────────────────────────────────────────┤
│  PAGE HERO                                                      │
│  Past Questions Repository                                      │
│  Access previous exam questions to prepare better               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FILTER SECTION                                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Course Code ▾    Level ▾    Semester ▾    Year ▾        │    │
│  │  ← dropdown        ← dropdown                          │    │
│  │                                                         │    │
│  │  🔍 Search by course code or title...                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Dropdowns: custom styled, rounded-lg, with smooth open        │
│  animation. Filter bar: surface-2 bg, sticky on scroll.         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  QUESTIONS TABLE / LIST                                         │
│                                                                 │
│  ┌────────┬──────────────────────┬────────┬────────┬─────────┐ │
│  │ CODE   │ COURSE TITLE         │ LEVEL  │ YEAR   │ ACTION  │ │
│  │ ← mono │                      │        │ ← mono │         │ │
│  ├────────┼──────────────────────┼────────┼────────┼─────────┤ │
│  │CSC301  │ Data Structures      │ 300    │ 2024   │ [↓ PDF] │ │
│  │CSC205  │ Computer Arch.       │ 200    │ 2024   │ [↓ PDF] │ │
│  │CSC401  │ Compiler Design      │ 400    │ 2023   │ [↓ PDF] │ │
│  │CSC102  │ Intro to Programming │ 100    │ 2023   │ [↓ PDF] │ │
│  └────────┴──────────────────────┴────────┴────────┴─────────┘ │
│                                                                 │
│  Table: clean borders, alternating row bg (white / surface-1).  │
│  Course codes in monospace + accent color.                      │
│  Download button: icon + text, accent style.                    │
│  On mobile: collapses to card-list layout.                      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.9 MEMBERSHIP ( `/membership` )

```
┌─────────────────────────────────────────────────────────────────┐
│ [NAVBAR]                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HERO (gradient-hero bg)                                        │
│                                                                 │
│  Join RUNACOS                                  ← display-lg     │
│  Become part of the largest CS community       ← body-lg        │
│  at Redeemer's University                                       │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │  [Register →]    │  │  [Verify Status] │                     │
│  │  ← accent CTA    │  │  ← secondary     │                    │
│  └──────────────────┘  └──────────────────┘                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  BENEFITS GRID                                                  │
│                                                                 │
│  ‹ WHY JOIN? ›                                                  │
│  ──                                                             │
│  Member Benefits                                                │
│                                                                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐      │
│  │ 📚        │ │ 🏆        │ │ 🤝        │ │ 💼        │      │
│  │ Academic  │ │ Competi-  │ │ Network-  │ │ Career    │      │
│  │ Resources │ │ tions     │ │ ing       │ │ Support   │      │
│  │           │ │           │ │           │ │           │      │
│  │ Access to │ │ Particip- │ │ Connect   │ │ CV review │      │
│  │ past Qs,  │ │ ate in    │ │ with      │ │ mock      │      │
│  │ study...  │ │ hackath...│ │ peers...  │ │ interview │      │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘      │
│                                                                 │
│  Cards: surface-0 bg, hover glow, icon in 56px accent circle.  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  REGISTRATION FORM (surface-1 bg)                               │
│                                                                 │
│  ‹ REGISTER ›                                                   │
│  ──                                                             │
│  Become a Member                                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Step indicator:  ① Personal  ─  ② Academic  ─  ③ Pay  │    │
│  │  ← active step: accent fill, completed: emerald check  │    │
│  │                                                         │    │
│  │  ┌───────────────────┐  ┌───────────────────┐           │    │
│  │  │ Full Name *       │  │ Email Address *    │           │    │
│  │  │ ┌───────────────┐ │  │ ┌───────────────┐ │           │    │
│  │  │ │               │ │  │ │               │ │           │    │
│  │  │ └───────────────┘ │  │ └───────────────┘ │           │    │
│  │  └───────────────────┘  └───────────────────┘           │    │
│  │                                                         │    │
│  │  ┌───────────────────┐  ┌───────────────────┐           │    │
│  │  │ Matric Number *   │  │ Phone Number      │           │    │
│  │  │ ┌───────────────┐ │  │ ┌───────────────┐ │           │    │
│  │  │ │               │ │  │ │               │ │           │    │
│  │  │ └───────────────┘ │  │ └───────────────┘ │           │    │
│  │  └───────────────────┘  └───────────────────┘           │    │
│  │                                                         │    │
│  │                    [Next Step →]                         │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Form card: surface-0, rounded-xl, padding-8.                   │
│  Multi-step with smooth slide transition between steps.         │
│  Progress bar fills with gradient-accent.                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.10 MEMBERSHIP CARD ( `/membership/card/[id]` )

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Centered on page, dark gradient bg (midnight → navy-900)       │
│  with floating particles / dot-grid animation                   │
│                                                                 │
│  ┌───────────────────────────────────────────────────┐          │
│  │  MEMBERSHIP CARD (credit-card proportions 85.6mm  │          │
│  │  × 53.98mm, scaled up for display)                │          │
│  │                                                   │          │
│  │  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │          │
│  │  │                                             │  │          │
│  │  │  [RUNACOS LOGO]          ‹ MEMBER ›         │  │          │
│  │  │                                             │  │          │
│  │  │  ┌──────┐                                   │  │          │
│  │  │  │      │  STUDENT NAME                     │  │          │
│  │  │  │ FOTO │  CSC/2022/001     ← monospace     │  │          │
│  │  │  │      │  Level 300                        │  │          │
│  │  │  └──────┘                                   │  │          │
│  │  │                                             │  │          │
│  │  │  Valid: 2025/2026 Session                   │  │          │
│  │  │                                             │  │          │
│  │  │  ▒▒▒▒▒▒▒▒▒▒  ← barcode / QR code           │  │          │
│  │  │  REF: MEM-2026-A7F3   ← monospace ID       │  │          │
│  │  │                                             │  │          │
│  │  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │          │
│  │                                                   │          │
│  │  Card: gradient bg (navy-800 → navy-600),         │          │
│  │  circuit-trace watermark, holographic shimmer      │          │
│  │  effect on hover (gradient shine sweeps across).   │          │
│  │                                                   │          │
│  └───────────────────────────────────────────────────┘          │
│                                                                 │
│  [Download as PNG]  [Share]                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.11 CONTACT PAGE ( `/contact` )

```
┌─────────────────────────────────────────────────────────────────┐
│ [NAVBAR]                                                        │
├─────────────────────────────────────────────────────────────────┤
│  PAGE HERO                                                      │
│  Get in Touch                                                   │
│  We'd love to hear from you                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────┬──────────────────────────────┐    │
│  │                          │                              │    │
│  │  CONTACT FORM (7 cols)   │  CONTACT INFO (5 cols)       │    │
│  │                          │                              │    │
│  │  ┌──────┐  ┌──────┐     │  ┌──────────────────────┐    │    │
│  │  │Name *│  │Email*│     │  │  📧 Email             │    │    │
│  │  └──────┘  └──────┘     │  │  runacos@run.edu.ng   │    │    │
│  │                          │  │  ← monospace          │    │    │
│  │  ┌──────────────────┐    │  └──────────────────────┘    │    │
│  │  │ Subject *        │    │                              │    │
│  │  └──────────────────┘    │  ┌──────────────────────┐    │    │
│  │                          │  │  📍 Location          │    │    │
│  │  ┌──────────────────┐    │  │  CS Department,       │    │    │
│  │  │                  │    │  │  Redeemer's University│    │    │
│  │  │  Message *       │    │  └──────────────────────┘    │    │
│  │  │  (textarea,      │    │                              │    │
│  │  │   6 rows)        │    │  ┌──────────────────────┐    │    │
│  │  │                  │    │  │  🕐 Office Hours      │    │    │
│  │  └──────────────────┘    │  │  Mon-Fri: 9AM - 5PM  │    │    │
│  │                          │  │  ← monospace times    │    │    │
│  │  [Send Message ▸]        │  └──────────────────────┘    │    │
│  │                          │                              │    │
│  │                          │  ── Social Links ──          │    │
│  │                          │  🐦  📷  💼  📧              │    │
│  │                          │                              │    │
│  └──────────────────────────┴──────────────────────────────┘    │
│                                                                 │
│  Form side: surface-0 card, rounded-xl.                         │
│  Info side: surface-1 bg, contact cards with icon accent.       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.12 FRMS — REPORT FAULT ( `/frms/report` )

```
┌─────────────────────────────────────────────────────────────────┐
│ [NAVBAR]                                                        │
├─────────────────────────────────────────────────────────────────┤
│  PAGE HERO                                                      │
│  Report a Facility Issue                                        │
│  Help us maintain campus infrastructure                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  Step:  ① Location  ─  ② Details  ─  ③ Review           │    │
│  │                                                         │    │
│  │  Building *                                             │    │
│  │  ┌───────────────────────────────┐                      │    │
│  │  │ Select building...         ▾  │                      │    │
│  │  └───────────────────────────────┘                      │    │
│  │                                                         │    │
│  │  Room / Location *                                      │    │
│  │  ┌───────────────────────────────┐                      │    │
│  │  │ e.g., Room 204, Lab B        │                      │    │
│  │  └───────────────────────────────┘                      │    │
│  │                                                         │    │
│  │  Category *                                             │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │⚡Electric│ │🚿Plumb. │ │🪑Furnit. │ │🔧Other   │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  │  ← selectable pill buttons (pick one)                   │    │
│  │                                                         │    │
│  │  Priority                                               │    │
│  │  ◉ Low  ◉ Medium  ◉ High  ◉ Critical                   │    │
│  │  ← radio group styled as colored pills                  │    │
│  │  (green / amber / orange / rose)                        │    │
│  │                                                         │    │
│  │  Description *                                          │    │
│  │  ┌───────────────────────────────┐                      │    │
│  │  │                               │                      │    │
│  │  │                               │                      │    │
│  │  └───────────────────────────────┘                      │    │
│  │                                                         │    │
│  │  📎 Attach Photos (drag & drop or click)                │    │
│  │  ┌───────────────────────────────┐                      │    │
│  │  │  ┌─────┐  ┌─────┐            │                      │    │
│  │  │  │ img │  │ img │  + Add     │                      │    │
│  │  │  └─────┘  └─────┘            │                      │    │
│  │  └───────────────────────────────┘                      │    │
│  │                                                         │    │
│  │  [← Back]            [Submit Report ▸]                  │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.13 FRMS — TRACK FAULT ( `/frms/track` )

```
┌─────────────────────────────────────────────────────────────────┐
│ [NAVBAR]                                                        │
├─────────────────────────────────────────────────────────────────┤
│  PAGE HERO                                                      │
│  Track Your Report                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SEARCH BAR                                                     │
│                                                                 │
│  ┌─────────────────────────────────────────────┐                │
│  │  🔍 Enter reference ID (e.g., FLT-2026-A3) │  [Track →]     │
│  └─────────────────────────────────────────────┘                │
│  Reference ID input: monospace font, auto-uppercase.            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RESULT (after search)                                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  REF: FLT-2026-A3F7                    [In Progress 🔵]│    │
│  │  ← monospace                            ← status badge │    │
│  │                                                         │    │
│  │  ── Status Timeline ──                                  │    │
│  │                                                         │    │
│  │  ✅  Submitted          Jan 15, 2026  10:32 AM          │    │
│  │  │                      ← monospace timestamps          │    │
│  │  ✅  Acknowledged       Jan 15, 2026  02:15 PM          │    │
│  │  │                                                      │    │
│  │  🔵  In Progress        Jan 16, 2026  09:00 AM          │    │
│  │  │   Assigned to maintenance team.                      │    │
│  │  │                                                      │    │
│  │  ○  Resolved            ← pending (grayed out)          │    │
│  │                                                         │    │
│  │  ── Details ──                                          │    │
│  │  Category: Electrical  │  Priority: High                │    │
│  │  Location: Lab B, Room 204                              │    │
│  │  Description: Power outlet not working...               │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Timeline: vertical line (2px, gradient), step dots colored     │
│  by status (emerald = done, electric = active, gray = pending). │
│  Timestamps in monospace.                                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.14 ARTICLES PAGE ( `/articles` )

Same layout structure as **News Listing (8.3)** but with these differences:

- Section label: `‹ KNOWLEDGE BASE ›`
- Filter categories: `[All] [Tutorials] [Research] [Career] [Tools]`
- Cards include: estimated read time, difficulty badge (`Beginner` / `Intermediate` / `Advanced`)
- Featured article section can include a "Series" indicator for multi-part articles

---

### 8.15 LOGIN PAGE ( `/login` )

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Full-screen split layout                                       │
│                                                                 │
│  ┌──────────────────────────┬──────────────────────────────┐    │
│  │                          │                              │    │
│  │  LEFT PANEL (visual)     │  RIGHT PANEL (form)          │    │
│  │  navy-900 bg             │  white bg                    │    │
│  │  + dot-grid overlay      │                              │    │
│  │  + animated circuit      │  [RUNACOS Logo]              │    │
│  │    trace lines           │                              │    │
│  │                          │  Welcome Back                │    │
│  │  ┌─────────────────┐     │  Sign in to your account     │    │
│  │  │                 │     │                              │    │
│  │  │  RUNACOS LOGO   │     │  Email                       │    │
│  │  │  (large, white) │     │  ┌────────────────────┐      │    │
│  │  │                 │     │  │                    │      │    │
│  │  └─────────────────┘     │  └────────────────────┘      │    │
│  │                          │                              │    │
│  │  "Where Code Meets       │  Password                    │    │
│  │   Community"             │  ┌────────────────────┐      │    │
│  │                          │  │              [👁]   │      │    │
│  │  Floating decorative     │  └────────────────────┘      │    │
│  │  elements:               │                              │    │
│  │  < / > code brackets     │  □ Remember me               │    │
│  │  { } curly braces        │                              │    │
│  │  λ lambda symbol         │  [Sign In ▸]  (full-width)   │    │
│  │  01 binary digits        │                              │    │
│  │  ← floating animation    │  Forgot password?            │    │
│  │                          │                              │    │
│  └──────────────────────────┴──────────────────────────────┘    │
│                                                                 │
│  Mobile: full-screen form only, dark bg at top with small logo. │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.16 ADMIN DASHBOARD ( `/admin` )

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│ ┌──────────┬────────────────────────────────────────────────────┐
│ │          │  ┌────────────────────────────────────────────────┐│
│ │ SIDEBAR  │  │ Top bar: 🔍 Search...    🔔 Notif   [AV] Name ││
│ │ (280px)  │  └────────────────────────────────────────────────┘│
│ │          │                                                    │
│ │ [LOGO]   │  ‹ DASHBOARD ›                                     │
│ │          │  Welcome back, Admin                               │
│ │ ──────── │                                                    │
│ │          │  STAT CARDS ROW                                    │
│ │ 📊 Dash  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────┐│
│ │ 📰 News  │  │👥 Members│ │📰 News   │ │📅 Events │ │🔧 FRMS││
│ │ 📝 Artic │  │   523    │ │   47     │ │   12     │ │   8   ││
│ │ 📅 Event │  │ +12 new  │ │ +3 draft │ │ 2 today  │ │ 3 open││
│ │ 🔧 FRMS  │  │ ↑ trend  │ │          │ │          │ │ ← rose││
│ │ 📚 PastQ │  └──────────┘ └──────────┘ └──────────┘ └───────┘│
│ │ 👥 Membr │                                                    │
│ │ 🖼 Carou │  ┌─────────────────────┬──────────────────────┐   │
│ │ 👤 Execs │  │                     │                      │   │
│ │ 📬 Conta │  │  RECENT ACTIVITY    │  QUICK ACTIONS       │   │
│ │ 👤 Users │  │  (feed/timeline)    │                      │   │
│ │ ⚙ Setti │  │                     │  [+ New Article]     │   │
│ │          │  │  • New member reg.  │  [+ New Event]       │   │
│ │ ──────── │  │    2 min ago        │  [+ Upload PQ]       │   │
│ │          │  │  • FRMS #A3F7       │  [View Reports]      │   │
│ │ v2.0.0   │  │    resolved         │                      │   │
│ │ ← mono   │  │    15 min ago       │                      │   │
│ │          │  │  • New event        │                      │   │
│ │          │  │    created          │                      │   │
│ │          │  │    1 hour ago       │                      │   │
│ │          │  │                     │                      │   │
│ │          │  └─────────────────────┴──────────────────────┘   │
│ │          │                                                    │
│ └──────────┴────────────────────────────────────────────────────┘
│                                                                 │
│  Sidebar: navy-900 bg, fixed position, white text/icons.        │
│  Active item: accent-left-border (3px, electric), bg lighten.   │
│  Collapsible on tablet (icons only, 64px width).                │
│  Stat cards: surface-0, subtle left border color-coded.         │
│  Activity feed: timeline style with relative timestamps.        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.17 ADMIN CRUD PAGES (News, Articles, Events, Past Questions, etc.)

All admin list pages follow this consistent pattern:

```
┌──────────┬──────────────────────────────────────────────────────┐
│ SIDEBAR  │                                                      │
│          │  Page Title                      [+ Create New ▸]    │
│          │                                                      │
│          │  ┌──────────────────────────────────────────────┐    │
│          │  │ 🔍 Search...   [Status ▾]  [Date ▾]  [Sort] │    │
│          │  └──────────────────────────────────────────────┘    │
│          │                                                      │
│          │  ┌──────────────────────────────────────────────┐    │
│          │  │ ☐ │ Title          │ Status  │ Date    │ ··· │    │
│          │  ├───┼────────────────┼─────────┼─────────┼─────┤    │
│          │  │ ☐ │ Article name   │ [Pub] ● │ Jan 15  │ ··· │    │
│          │  │ ☐ │ Another one    │ [Drf] ● │ Jan 12  │ ··· │    │
│          │  │ ☐ │ Third entry    │ [Pub] ● │ Jan 10  │ ··· │    │
│          │  └──────────────────────────────────────────────┘    │
│          │                                                      │
│          │  Showing 1-10 of 47    [← Prev]  1  2  3  [Next →]  │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

- Table: clean, minimal borders (`border-bottom` only per row)
- Status: syntax-highlight badges
- Actions (`···`): dropdown menu with Edit, Delete, Duplicate
- Bulk actions: checkbox select + floating action bar at bottom
- Empty state: centered illustration + CTA

**Create/Edit pages:**

```
┌──────────┬──────────────────────────────────────────────────────┐
│ SIDEBAR  │                                                      │
│          │  ← Back to [Items]          [Save Draft] [Publish ▸] │
│          │                                                      │
│          │  ┌──────────────────────────────┬──────────────────┐ │
│          │  │                              │                  │ │
│          │  │  EDITOR (8 cols)             │  META (4 cols)   │ │
│          │  │                              │                  │ │
│          │  │  Title                       │  Status          │ │
│          │  │  ┌────────────────────┐      │  [Published ▾]   │ │
│          │  │  │                    │      │                  │ │
│          │  │  └────────────────────┘      │  Category        │ │
│          │  │                              │  [Select... ▾]   │ │
│          │  │  Content (TipTap editor)     │                  │ │
│          │  │  ┌────────────────────┐      │  Cover Image     │ │
│          │  │  │ B I U 🔗 📷 H1 H2 │      │  ┌──────────┐   │ │
│          │  │  ├────────────────────┤      │  │  Upload   │   │ │
│          │  │  │                    │      │  │  or drag  │   │ │
│          │  │  │                    │      │  └──────────┘   │ │
│          │  │  │  Rich text area    │      │                  │ │
│          │  │  │                    │      │  Slug            │ │
│          │  │  │                    │      │  ┌──────────┐   │ │
│          │  │  └────────────────────┘      │  │ auto-gen │   │ │
│          │  │                              │  └──────────┘   │ │
│          │  │                              │  ← monospace    │ │
│          │  └──────────────────────────────┴──────────────────┘ │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

- Editor toolbar: minimal, icon-based, surface-2 bg
- Slug field: auto-generated, monospace, editable
- Sidebar meta: sticky on scroll
- Save/Publish: top-right, accent gradient for publish

---

### 8.18 ADMIN — FRMS MANAGEMENT ( `/admin/frms` )

```
┌──────────┬──────────────────────────────────────────────────────┐
│ SIDEBAR  │                                                      │
│          │  Facility Reports                                     │
│          │                                                      │
│          │  STATUS OVERVIEW CHIPS                                │
│          │  [All: 47] [Open: 8 🔴] [In Progress: 12 🔵]         │
│          │  [Resolved: 24 🟢] [Closed: 3 ⚫]                    │
│          │                                                      │
│          │  ┌──────────────────────────────────────────────┐    │
│          │  │ REF       │ Issue      │ Priority│ Status   │    │
│          │  ├───────────┼────────────┼─────────┼──────────┤    │
│          │  │ FLT-A3F7  │ Power out  │ 🔴 High │ [Open]   │    │
│          │  │ FLT-B2C1  │ Leak       │ 🟡 Med  │ [Prog.]  │    │
│          │  │ FLT-C9D4  │ Chair brk  │ 🟢 Low  │ [Done]   │    │
│          │  └──────────────────────────────────────────────┘    │
│          │                                                      │
│          │  REF IDs: monospace, clickable → detail view          │
│          │  Priority: color-coded dot + text                     │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

---

### 8.19 CONSTITUTION / PRIVACY / TERMS (Legal Pages)

```
┌─────────────────────────────────────────────────────────────────┐
│ [NAVBAR]                                                        │
├─────────────────────────────────────────────────────────────────┤
│  PAGE HERO (compact)                                            │
│  Constitution / Privacy Policy / Terms                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┬──────────────────────────────────────┐    │
│  │                  │                                      │    │
│  │  TABLE OF        │  DOCUMENT CONTENT                    │    │
│  │  CONTENTS        │  (prose-custom styling)              │    │
│  │  (sticky)        │                                      │    │
│  │                  │  Article I: Name                     │    │
│  │  I. Name         │  The association shall be known as...│    │
│  │  II. Objectives  │                                      │    │
│  │  III. Members    │  Article II: Objectives              │    │
│  │  IV. Officers    │  The objectives of the association...│    │
│  │  V. Meetings     │                                      │    │
│  │  ...             │  ...                                 │    │
│  │                  │                                      │    │
│  │  Active section  │  Article headings: heading-2          │    │
│  │  highlighted     │  Section numbers: monospace           │    │
│  │  with left bar   │  Last updated: badge at top           │    │
│  │                  │                                      │    │
│  └──────────────────┴──────────────────────────────────────┘    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [FOOTER]                                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary: Design Language at a Glance

| Element | Treatment |
|---|---|
| **Backgrounds** | `surface-1` (#F8FAFC) with dot-grid overlay pattern |
| **Dark sections** | `gradient-hero` with circuit-trace SVG + dot-grid |
| **Cards** | `surface-0`, `border-radius: 12px`, `1px border`, hover lift + glow |
| **Typography** | Space Grotesk (headings) + Inter (body) + JetBrains Mono (data) |
| **Data values** | Always monospace — dates, IDs, stats, codes, versions |
| **Section headers** | Label (uppercase, tracked) → accent line → heading → subtext |
| **Buttons** | 10px radius, 500 weight, scale micro-interaction |
| **Badges** | Syntax-highlight style, monospace, 6px radius |
| **Animations** | Scroll-triggered fade-up + stagger, micro-interactions on hover/click |
| **Navbar** | Transparent → glassmorphism on scroll |
| **Admin sidebar** | Navy-900, fixed, collapsible, accent active indicator |
| **CS identity** | Circuit traces, dot grids, monospace accents, code-bracket decor, binary watermarks |

---

*This specification is designed to be implemented incrementally. Each section can be tackled independently. Start with the design tokens (colors, typography, spacing), then components, then page-by-page.*
