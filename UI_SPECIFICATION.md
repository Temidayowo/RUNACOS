# RUNACOS UI Specification v2.0

> Updated: February 2026 | Design System for the Redeemer's University Association of Computer Science Students platform.

---

## 1. Design Tokens

### 1.1 Color Palette

#### Primary Brand
| Token | Value | Usage |
|-------|-------|-------|
| `navy-800` | `#0B2C4D` | Primary brand, headings, CTA fills, card highlights |
| `navy-900` | `#081E36` | Footer background, deep emphasis |
| `navy-950` | `#051425` | Deepest brand tone |
| `midnight` | `#040D19` | Hero sections, admin sidebar |
| `electric` | `#3B82F6` | Accents, active indicators, links, highlights |
| `cyan` | `#06B6D4` | Secondary accent, gradient endpoints |

#### Navy Scale
| Token | Value |
|-------|-------|
| `navy-50` | `#E8EEF4` |
| `navy-100` | `#C5D4E3` |
| `navy-200` | `#9FB8D0` |
| `navy-300` | `#799CBD` |
| `navy-400` | `#5C87AE` |
| `navy-500` | `#3F729F` |
| `navy-600` | `#376491` |
| `navy-700` | `#2D5280` |
| `navy-800` | `#0B2C4D` |
| `navy-900` | `#081E36` |

#### Surface / Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| `surface-0` | `#FFFFFF` | Cards, content containers, modal backgrounds |
| `surface-1` | `#F8FAFC` | Page section backgrounds, subtle alternation |
| `surface-2` | `#F1F5F9` | Hover states, input backgrounds |
| `surface-3` | `#E2E8F0` | Borders, dividers, separators |

#### Feedback Colors
| Token | Value | Usage |
|-------|-------|-------|
| `green-500` | `#22C55E` | Success, verified, resolved, published |
| `amber-500` | `#F59E0B` | Warning, pending, in-progress |
| `rose-500` | `#F43F5E` | Error, open/urgent, danger actions |
| `gray-400` | `#9CA3AF` | Closed, archived, disabled |

#### Gradients
| Name | Definition | Usage |
|------|-----------|-------|
| `gradient-hero` | `135deg: midnight → navy-800 → navy-900` | Hero sections, full-screen backgrounds |
| `gradient-accent` | `135deg: electric → cyan` | Primary CTA buttons, accent fills |
| `gradient-card-shine` | `105deg: transparent → white/20 → transparent` | Card hover highlights |

### 1.2 Typography

#### Font Families
| Family | Font | Usage |
|--------|------|-------|
| `font-sans` | **Inter** | Body text, labels, descriptions |
| `font-heading` | **Space Grotesk** | Headlines, titles, section headings |
| `font-mono` | **JetBrains Mono** | Data, reference IDs, code, stats, timestamps |

#### Type Scale
| Element | Font | Weight | Desktop Size | Mobile Size |
|---------|------|--------|-------------|-------------|
| H1 (Hero) | Space Grotesk | 800 | 4.5rem (72px) | 2.5rem (40px) |
| H2 (Section) | Space Grotesk | 700 | 2.5rem (40px) | 1.875rem (30px) |
| H3 (Card title) | Space Grotesk | 600 | 1.25rem (20px) | 1.125rem (18px) |
| H4 (Subsection) | Space Grotesk | 600 | 1.125rem (18px) | 1rem (16px) |
| Section Label | Inter (uppercase) | 600 | 0.75rem (12px) | 0.75rem (12px) |
| Body | Inter | 400 | 1rem (16px) | 0.875rem (14px) |
| Body Small | Inter | 400 | 0.875rem (14px) | 0.8125rem (13px) |
| Caption / Mono Data | JetBrains Mono | 500 | 0.75rem (12px) | 0.75rem (12px) |

### 1.3 Spacing

| Context | Value |
|---------|-------|
| Container | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| Section vertical | `py-16 md:py-24` |
| Card padding | `p-4 sm:p-5` or `p-6` |
| Grid gap | `gap-4` (sm) / `gap-6` (md) / `gap-8` (lg) |
| Element spacing | 4px increments (Tailwind spacing scale) |

### 1.4 Border Radius

| Element | Value |
|---------|-------|
| Cards | `rounded-xl` (12px) |
| Buttons | `rounded-[10px]` or `rounded-full` (pills) |
| Inputs | `rounded-[10px]` |
| Badges | `rounded-md` (6px) |
| Avatars / Logo | `rounded-xl` (12px) |
| Images in cards | `rounded-xl` (12px) |

### 1.5 Shadows

| Context | Value |
|---------|-------|
| Card default | `shadow-sm` |
| Card hover | `shadow-card-hover` (0 8px 30px rgba(59,130,246,0.08)) |
| Navbar (scrolled) | `shadow-sm` |
| Modal | `shadow-2xl` |
| CTA hover | `shadow-glow-blue` (0 8px 30px rgba(59,130,246,0.25)) |

---

## 2. Animation Specification

### 2.1 Page Transitions (Framer Motion)

| Animation | Properties |
|-----------|-----------|
| Page enter | `opacity: 0→1, y: 20→0`, duration `0.6s`, ease `[0.25, 0.46, 0.45, 0.94]` |
| Page exit | `opacity: 1→0`, duration `0.3s` |
| Navbar enter | `y: -80→0`, duration `0.6s`, spring ease |

### 2.2 Scroll Animations (Staggered)

| Element | Animation | Timing |
|---------|-----------|--------|
| Section headers | Fade up 30px | `0.6s`, triggered at viewport entry |
| Card grids | Fade up 40px | Stagger `0.1s` between siblings |
| Stats counters | Count from 0 | `1.5s`, triggered once on view |
| Images | Scale 0.98→1 + fade | `0.5s` |
| Hero text | Word-by-word reveal | Stagger `0.05s` |
| Admin sidebar links | Slide from left 20px | Stagger `0.05s` |

### 2.3 Micro-interactions

| Element | Hover | Active |
|---------|-------|--------|
| Buttons | `scale(1.02)`, shadow increase | `scale(0.98)` |
| Cards | `translateY(-2px)` to `(-6px)`, shadow elevation | — |
| Nav links | Underline indicator slides (spring layout) | — |
| Tab switch | Active indicator animates to position | — |
| Inputs | Border color + ring glow transition | — |
| Arrows | `translateX(+4px)` slide right | — |

### 2.4 Tailwind Keyframe Animations

| Name | Effect | Duration |
|------|--------|----------|
| `fadeIn` | Opacity 0→1 | 0.6s |
| `fadeUp` | Opacity + Y(-30px→0) | 0.6s |
| `fadeDown` | Opacity + Y(20px→0) | 0.5s |
| `slideLeft` | Opacity + X(-30px→0) | 0.5s |
| `slideRight` | Opacity + X(30px→0) | 0.5s |
| `scaleIn` | Opacity + scale(0.9→1) | 0.4s |
| `shimmer` | Background gradient shift | 2s infinite |
| `float` | Y(-10px) oscillation | 3s infinite |
| `pulseDot` | Scale + opacity pulse | 2s infinite |
| `glowDrift` | Multi-point drift | 8s infinite |

### 2.5 Loading States

| Context | Pattern |
|---------|---------|
| Page loading | `Loader2` spinning icon, `text-electric` |
| Skeleton screens | Shimmer gradient, 2s infinite loop |
| Submit buttons | Text → spinner → success message |
| Tab content | `AnimatePresence mode="wait"` crossfade |

### 2.6 Reduced Motion

All animations respect `@media (prefers-reduced-motion: reduce)` — animations are disabled for users who prefer reduced motion.

---

## 3. Component Specifications

### 3.1 Navbar

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [R logo] Redeemer's University    Home About News Events Articles       │
│          ASSOC. OF COMPUTING      Past Questions Executives Alumni      │
│          STUDENTS                 Contact  [Resources ▼]  [Membership] │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Height**: 72px
- **Position**: Fixed top-0, z-50
- **Background (default)**: White, `border-b border-surface-3/50`
- **Background (hero pages)**: Transparent → glassmorphism on scroll (`backdrop-blur-xl bg-white/80`)
- **Logo**: Mask-image technique with navy-800 / white toggle based on scroll state
- **Nav links**: `text-[13px] font-medium`, color toggles between `text-gray-700` and `text-white/90`
- **Active indicator**: 2px electric blue bar below active link, animated with `layoutId`
- **Resources dropdown**: Hover-triggered, `rounded-xl border bg-white shadow-lg`, contains:
  - Pay Dues → `/dues/pay`
  - Generate Receipt → `/dues/receipt`
  - Past Questions → `/past-questions`
  - Report an Issue → `/frms/report`
- **CTA button**: "Membership", `rounded-full bg-gradient-accent`, glow on hover
- **Mobile**: Hamburger → slide-in drawer from right (300px wide, spring animation)
- **Mobile menu**: Full nav links + Resources section + "Become a Member" CTA

### 3.2 Footer

```
┌──────────────────────────────────────────────────────────────────────┐
│  navy-900 background                                                 │
│                                                                      │
│  [R] RUNACOS            Quick Links      Resources      Connect      │
│  Description text...    Home             Past Questions  Twitter/X   │
│                         About Us         Articles        Instagram   │
│                         News             Pay Dues        LinkedIn    │
│                         Events           Generate Receipt Email Us   │
│                         Contact          Report an Issue             │
│                                          Constitution                │
│──────────────────────────────────────────────────────────────────────│
│  RUNACOS v2.0.0              Privacy Policy · Terms of Service       │
└──────────────────────────────────────────────────────────────────────┘
```

- **Background**: `navy-900`
- **Text**: White (headings), `navy-300` (links), `navy-400` (descriptions)
- **Grid**: 4-column (lg) → 2-column (sm) → 1-column (mobile)
- **Bottom bar**: `border-t border-white/10`, `font-mono text-[10px]`

### 3.3 PageHero

```
┌─────────────────────────────────────────────────────────────────┐
│  gradient-hero background (midnight → navy-800)                  │
│  bg-grid-dots-light overlay                                      │
│                                                                  │
│  Home / Page Name  (breadcrumb, mono, navy-400)                  │
│                                                                  │
│  Page Heading Text  (Space Grotesk, 4xl, white, gradient span)  │
│  Subtitle description text  (navy-300, max-w-2xl)               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

- **Height**: `py-20 md:py-28`
- **Breadcrumb**: `font-mono text-xs text-navy-400`
- **Heading**: `font-heading text-4xl md:text-5xl font-extrabold text-white`
- **Gradient text span**: `bg-gradient-to-r from-electric to-cyan bg-clip-text text-transparent`
- **Content**: Dynamically loaded from `SiteSetting` (editable in admin)

### 3.4 Buttons

| Variant | Class Pattern |
|---------|--------------|
| Primary | `bg-navy-800 text-white rounded-[10px] shadow-sm hover:shadow-glow-sm hover:saturate-110 active:scale-[0.98]` |
| Accent | `bg-gradient-accent text-white rounded-full shadow-sm hover:shadow-glow-blue hover:scale-[1.02]` |
| Secondary | `border-[1.5px] border-navy-800 text-navy-800 hover:bg-navy-50` |
| Ghost | `text-navy-800 hover:bg-surface-1` |
| Danger | `bg-rose-500 text-white hover:bg-rose-600` |

- **Sizes**: `sm` (px-3 py-1.5 text-xs), `md` (px-4 py-2.5 text-sm), `lg` (px-6 py-3 text-base)
- **All**: `transition-all duration-200`, `font-medium`
- **Disabled**: `opacity-50 cursor-not-allowed`
- **Loading**: Spinner icon replaces text, button disabled

### 3.5 Cards

```
┌──────────────────────────────┐
│  ┌──────────────────────────┐│
│  │     Cover Image          ││
│  │     (16:10 or 21:9)      ││
│  └──────────────────────────┘│
│  Tag Badge      Date (mono)  │
│  **Title (Space Grotesk)**   │
│  Excerpt text line-clamp-2   │
│  Read More →                 │
└──────────────────────────────┘
```

- **Container**: `bg-surface-0 border border-surface-3 rounded-xl shadow-sm`
- **Hover**: `translateY(-2px)`, `shadow-card-hover`, image `scale(1.03)`
- **Image**: `aspect-[16/10] object-cover rounded-t-xl`
- **Title**: `font-heading font-semibold text-gray-900`
- **Excerpt**: `text-sm text-gray-500 line-clamp-2`
- **Read More**: `text-electric font-medium text-sm`, arrow slides right on hover

### 3.6 Event List Item

```
┌────────────────────────────────────────────────────────┐
│ ┌────────┐                                     →       │
│ │  MMM   │  Event Title                                │
│ │  DD    │  Description line-clamp-1                   │
│ │  YYYY  │  📍 Location    🕐 Time                     │
│ └────────┘                                             │
└────────────────────────────────────────────────────────┘
```

- **Date block**: `bg-navy-800 text-white`, `w-20 sm:w-24`
- **Month**: `font-mono text-xs uppercase text-navy-300`
- **Day**: `font-heading text-2xl font-bold`
- **Year**: `font-mono text-[10px] text-navy-400`
- **Meta**: `text-xs text-gray-400` with lucide icons (MapPin, Clock)

### 3.7 Filter / Pill Tabs

```
  [Upcoming]  Past Events
   ^^^^^^^^
   active: navy-800 bg, white text, rounded-full, shadow
   inactive: text-gray-600, hover:bg-surface-2, rounded-full
```

- **Padding**: `px-4 py-2`
- **Font**: `text-sm font-medium`
- **Transition**: Background and text color `duration-200`

### 3.8 Badges / Status Indicators

| Variant | Style |
|---------|-------|
| `badge-keyword` | Blue bg, syntax-highlight style |
| `badge-string` | Green bg |
| `badge-warning` | Amber bg |
| `badge-error` | Rose bg |
| `badge-comment` | Gray bg |

- **Font**: `font-mono text-[11px] font-medium`
- **Padding**: `px-2.5 py-1`
- **Border radius**: `rounded-md`

### 3.9 Form Inputs

- **Style**: `rounded-[10px] border-[1.5px] border-surface-3 bg-surface-0 text-sm`
- **Focus**: `ring-[3px] ring-electric/10 border-electric`
- **Error**: `border-rose-400 ring-rose-500/10`
- **Placeholder**: `text-gray-400`
- **Label**: `text-sm font-medium text-gray-700 mb-1.5`

### 3.10 Receipt Component

```
┌──────────────────────────────────────┐
│  [RUNACOS logo]   PAYMENT RECEIPT    │
│  Redeemer's University Association   │
│  of Computer Science Students        │
├──────────────────────────────────────┤
│  ✓ VERIFIED   or   ⏳ PENDING       │
│  (green/amber banner)               │
├──────────────────────────────────────┤
│  Member Name    │  Member ID         │
│  Matric Number  │  Department        │
│  Session        │  Amount            │
│  Payment Ref    │  Date              │
│  Method         │  Verified At       │
├──────────────────────────────────────┤
│  This receipt is computer generated  │
│  and is valid without a signature    │
│  runacos.org                         │
└──────────────────────────────────────┘
```

- **Background**: White with subtle pattern
- **Header**: Navy gradient with white text
- **Status banner**: Green (verified) or amber (pending)
- **Grid**: 2-column key-value pairs with `border-b border-dashed`
- **Download**: `html2canvas` capture to PNG

### 3.11 Alumni Card

```
┌──────────────────────────┐
│  [Photo circle]          │
│  👑 Former Executive     │
│  (badge if applicable)   │
│                          │
│  Full Name               │
│  Department              │
│  Class of YYYY           │
└──────────────────────────┘
```

- **Photo**: `w-20 h-20 rounded-full object-cover border-2 border-surface-3`
- **Executive badge**: `Crown` icon with amber accent
- **Name**: `font-heading font-semibold`
- **Department**: `text-sm text-gray-500`
- **Class year**: `font-mono text-xs text-gray-400`

### 3.12 Glassmorphism

| Variant | Style |
|---------|-------|
| `.glass` | `backdrop-blur-xl bg-white/72 border border-white/30 shadow-glass` |
| `.glass-dark` | `backdrop-blur-xl bg-navy-900/80 border border-white/10` |

---

## 4. Page Specifications

### 4.1 Home Page (`/`)

**Hero Section** — Full-screen carousel (HeroSection component)
- Carousel slides with image/video/Lottie backgrounds
- `min-h-screen` with gradient overlay
- Title + subtitle + CTA buttons per slide
- Auto-play 8s with manual navigation dots
- Background Ken Burns effect on images

**Quick Access Cards** — 6-card grid
- Cards: Pay Dues, Report Issue, Become a Member, Past Questions, Track Report, Contact
- Each: Gradient icon box + title + description
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Hover: lift + shadow + icon scale

**Latest News** — Fetched from `/api/news?status=PUBLISHED`
- 3-card grid with NewsCard component
- "View All News" link
- Skeleton loading state

**Upcoming Events** — Fetched from `/api/events?status=PUBLISHED&type=upcoming`
- Event list items with date blocks
- "View All Events" link

**Stats Section** — Animated counters
- `bg-navy-800 text-white`, full-width
- 4 stat counters: Members, Events, Projects, Awards
- `AnimatedCounter` with count-up on viewport entry

**Newsletter Section** — Subscription form
- Input + subscribe button
- Connected to `POST /api/newsletter`
- Success toast on subscribe

### 4.2 News Page (`/news`)

- `PageHero` with "news" slug
- Pill tab filters: All News, Academics, Events, Student Life
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Pagination with page numbers
- Loading: Spinner
- Empty state: Newspaper icon + "No news found"

### 4.3 News Detail (`/news/[slug]`)

- Back link with arrow
- Category badge + author + formatted date
- Cover image: `aspect-[21/9] rounded-xl`
- Content: `prose-custom` max-w-4xl
- Slide-up animation

### 4.4 Events Page (`/events`)

- `PageHero` with "events" slug
- Tabs: "Upcoming" / "Past Events"
- Dynamic fetch: `/api/events?status=PUBLISHED&type=${tab}`
- Event list items with date blocks
- Loading spinner + error + empty states
- `AnimatePresence mode="wait"` for tab transitions

### 4.5 Event Detail (`/events/[slug]`)

- Back link → `/events`
- Cover image: `aspect-[21/9]` with fallback gradient
- Content: Title + description paragraphs
- Sidebar: Date, Time, Location, Registered attendees
- Sidebar cards: `border-surface-3 bg-surface-0 rounded-xl shadow-sm`

### 4.6 Articles Page (`/articles`)

- Same pattern as News page
- Category filter tabs
- Grid of article cards
- Pagination

### 4.7 Executives Page (`/executives`)

- `PageHero` with "executives" slug
- Grid of executive cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Card: Photo (96px circle), name, position, bio truncated
- Hover: scale + shadow, icon overlay
- Click: Detail modal with full info

### 4.8 Alumni Page (`/alumni`)

- `PageHero` with "alumni" slug
- Grid of alumni cards
- Former executives shown first with `Crown` badge
- Search input for filtering
- Loading / empty states

### 4.9 Past Questions (`/past-questions`)

- `PageHero` with "past-questions" slug
- Search bar + department filter dropdown
- Grid of PQ cards with file icon, title, course, year, download count
- Download button per card
- Pagination

### 4.10 Membership Registration (`/membership`)

- Multi-step form (3 steps)
- Step 1: Personal info (name, email, phone, matric)
- Step 2: Academic info (admission year, level, department, faculty, state, semester, session, passport upload)
- Step 3: Review all fields
- Step indicator: numbered circles with connecting lines
- `AnimatePresence` slide transitions between steps
- Success: Member ID display + links to Pay Dues and Download Card

### 4.11 Pay Dues (`/dues/pay`)

- Member lookup: Email or matric number input
- Displays: Member info, computed level, current session, dues amount
- Past payments table (session, amount, status, date)
- "Pay Now" button → Paystack redirect
- Loading / error / not-found states

### 4.12 Receipt Page (`/dues/receipt/[reference]`)

- DuesReceipt component with download
- Status display (verified/pending/failed)
- "Download Receipt" button (html2canvas)
- Link to pay more dues

### 4.13 FRMS Report (`/frms/report`)

- Multi-step form (3 steps)
- Step 1: Personal info
- Step 2: Fault details (category, location, description, file upload)
- Step 3: Review & submit
- Success: Reference ID display (FRMS-YYYY-XXXXXX) + track link

### 4.14 FRMS Track (`/frms/track/[referenceId]`)

- Status badge (color-coded)
- Vertical timeline with status history
- Pulse animation on current status
- Fault details: category, location, description, attachment
- Admin notes display

### 4.15 Contact Page (`/contact`)

- 2-column: Form left, info right
- Form: Name, email, subject, message textarea
- Info cards: Address, email, phone with icons
- Toast on successful submission

### 4.16 Login Page (`/login`)

- Split screen: Left navy gradient branding, right white form
- Form: Email, password, sign-in button
- Error toast on failed login
- Redirect to `/admin` on success

---

## 5. Admin Interface Specifications

### 5.1 Admin Layout

```
┌────────────┬─────────────────────────────────────────────┐
│  Sidebar   │ Topbar: [Search] [Notifications] [User ▼]  │
│  (w-64)    ├─────────────────────────────────────────────┤
│            │                                             │
│ [R] RUNACOS│  Main Content Area                          │
│ Admin Panel│  (p-4 md:p-6)                               │
│            │                                             │
│ Dashboard  │                                             │
│ Pages      │                                             │
│ Executives │                                             │
│ FRMS       │                                             │
│ News       │                                             │
│ Events     │                                             │
│ Articles   │                                             │
│ Past Q.    │                                             │
│ Members    │                                             │
│ Payments   │                                             │
│ Alumni     │                                             │
│ Contact    │                                             │
│ Users      │                                             │
│            │                                             │
│ ─────────  │                                             │
│ Settings   │                                             │
│ v2.0.0     │                                             │
└────────────┴─────────────────────────────────────────────┘
```

- **Sidebar**: `bg-midnight text-white w-64`, fixed, collapsible on mobile
- **Active link**: `bg-electric/10 text-electric` with dot indicator
- **Topbar**: `bg-surface-0 h-16 border-b`, search bar, notification bell, user dropdown
- **User menu**: Name + email + sign out (rose-600)
- **Mobile**: Hamburger toggle, backdrop overlay

### 5.2 Admin Dashboard (`/admin`)

- KPI cards: Total Members, Published News, Published Events, Open Faults
- Payment Overview: Total Revenue (formatted Naira), Paid This Session, Alumni Count
- Recent Activity tables
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` layout

### 5.3 Admin Data Tables (Common Pattern)

- Header: Page title + description + "Create New" button
- Filters: Search input + category/status dropdowns
- Table: `border border-surface-3 rounded-xl overflow-hidden`
- Header row: `bg-surface-1 text-xs font-mono uppercase text-gray-500`
- Data rows: `border-t border-surface-3 hover:bg-surface-1`
- Status badges with color coding
- Action buttons: View, Edit, Delete
- Pagination at bottom
- Mobile: Responsive card view with hidden columns

### 5.4 Admin Form Pages (News/Events/Articles Create/Edit)

- Rich text editor (TipTap) for content
- Cover image upload with preview
- Status dropdown (Draft/Published/Archived)
- Category/author fields
- Save as Draft / Publish buttons
- `sonner` toast on success/error

### 5.5 Admin Payments (`/admin/payments`)

- Session filter dropdown
- Status filter (All/Pending/Verified/Failed)
- Table: Member, Matric, Session, Amount, Status, Date, Actions
- "Map Payment" modal: Member search + session + amount
- "Export CSV" button
- Verify button for pending payments

### 5.6 Admin Alumni (`/admin/alumni`)

- Search input
- Filter tabs: All Members / Alumni / Eligible
- Table: Name, Email, Matric, Admission Year, Level (computed), Alumni status
- Toggle alumni button per row
- "Auto-Detect Eligible" button
- Stats cards at top

### 5.7 Admin Settings (`/admin/settings`)

- Sections: General, Academic, Pages, Mailing Preferences
- General: Site name, description, contact info
- Academic: Session, semester, fees
- Pages: Page hero content management
- Mailing: Toggle switches for Send to Subscribers / Members / Alumni
- Save button per section with loading state

---

## 6. Responsive Design

### 6.1 Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Base | < 640px | Single column, mobile nav, stacked cards |
| `sm` | 640px | 2-column grids |
| `md` | 768px | Show desktop elements, 2-3 column grids |
| `lg` | 1024px | Full desktop nav, 3-4 column grids, sidebar |
| `xl` | 1280px | Max container width |

### 6.2 Mobile Adaptations

- Navbar → Hamburger + slide-in drawer
- Admin sidebar → Hidden, toggle with overlay
- Card grids → Single column stack
- Tables → Card-based list view with priority columns
- Hero text → Size reduction ~35%
- Section padding → Reduction ~40%
- Search bars → Full width
- Modals → Full-screen on mobile

---

## 7. Accessibility

- **Focus**: `focus-visible:ring-[3px] ring-electric/10` on all interactive elements
- **Contrast**: WCAG AA minimum (4.5:1 text, 3:1 large text)
- **Motion**: `prefers-reduced-motion` respected, all animations disabled
- **Semantic HTML**: `nav`, `main`, `article`, `section`, `aside`, `footer`
- **Alt text**: All images have meaningful alt text
- **Form labels**: Every input has associated label
- **ARIA**: `aria-label` on icon-only buttons
- **Smooth scroll**: `scroll-behavior: smooth` with reduced-motion override

---

## 8. Icon System

All icons from **lucide-react** library. Common sizes:

| Context | Size |
|---------|------|
| Inline with text | `h-3 w-3` to `h-4 w-4` |
| Card/button icons | `h-5 w-5` |
| Feature icons | `h-6 w-6` |
| Empty state icons | `h-12 w-12` |
| Hero decorative | `h-16 w-16` |

Key icons used:
- Navigation: `Menu`, `X`, `ChevronRight`, `ChevronDown`, `ArrowLeft`, `ArrowRight`
- Content: `Newspaper`, `Calendar`, `FileText`, `FileQuestion`, `Users`
- Actions: `Search`, `Bell`, `LogOut`, `Settings`, `Download`, `Upload`
- Status: `Loader2` (spinning), `Check`, `AlertTriangle`
- Features: `MapPin`, `Clock`, `Mail`, `Phone`, `CreditCard`, `GraduationCap`, `Crown`, `Bug`

---

## 9. Toast Notifications

Using **sonner** library:

| Type | Pattern |
|------|---------|
| Success | `toast.success("Message")` — Green accent |
| Error | `toast.error("Message")` — Red accent |
| Loading | `toast.loading("Message")` — Spinner |

Position: Top-right (`richColors` enabled).
