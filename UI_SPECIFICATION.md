# RUNACOS UI Specification

## Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `navy-900` | `#081E36` | Footer background |
| `navy-800` | `#0B2C4D` | Primary brand, navbar text, headings, CTA fills |
| `navy-700` | `#0F3A64` | Hover states on primary |
| `navy-600` | `#14487B` | Active states |
| `blue-500` | `#2563EB` | Accent (hero highlight text "Technology & Innovation"), links |
| `blue-100` | `#DBEAFE` | Light accent backgrounds |
| `gray-50` | `#F9FAFB` | Page section alternating backgrounds |
| `gray-100` | `#F3F4F6` | Card hover, input backgrounds |
| `gray-200` | `#E5E7EB` | Borders, dividers |
| `gray-400` | `#9CA3AF` | Placeholder text, secondary text |
| `gray-500` | `#6B7280` | Body secondary text |
| `gray-600` | `#4B5563` | Body text |
| `gray-700` | `#374151` | Emphasis body text |
| `gray-900` | `#111827` | Headings, strong text |
| `white` | `#FFFFFF` | Card backgrounds, page backgrounds |
| `green-500` | `#22C55E` | Success states, resolved status |
| `yellow-500` | `#EAB308` | Warning, in-progress status |
| `red-500` | `#EF4444` | Error, open/urgent status |
| `orange-500` | `#F97316` | Category tags (events) |

### Typography
| Element | Font | Weight | Size (Desktop) | Size (Mobile) |
|---------|------|--------|----------------|---------------|
| **H1 (Hero)** | Merriweather | 800 | 48px / 3rem | 32px / 2rem |
| **H2 (Section)** | Merriweather | 700 | 36px / 2.25rem | 28px / 1.75rem |
| **H3 (Card title)** | Merriweather | 700 | 20px / 1.25rem | 18px / 1.125rem |
| **H4 (Subsection)** | Merriweather | 600 | 18px / 1.125rem | 16px / 1rem |
| **Label (uppercase)** | Inter | 600 | 12px / 0.75rem | 12px / 0.75rem |
| **Body** | Inter | 400 | 16px / 1rem | 14px / 0.875rem |
| **Body small** | Inter | 400 | 14px / 0.875rem | 13px / 0.8125rem |
| **Caption** | Inter | 400 | 12px / 0.75rem | 12px / 0.75rem |

### Spacing
- Section padding: `py-16 md:py-24` (64px / 96px)
- Container max-width: `max-w-7xl` (1280px), `px-4 md:px-6 lg:px-8`
- Card padding: `p-4 md:p-6`
- Card gap (grid): `gap-6 md:gap-8`
- Element spacing: 4px increments (Tailwind scale)

### Border Radius
- Cards: `rounded-lg` (8px)
- Buttons: `rounded-lg` (8px)
- Pill tabs: `rounded-full` (9999px)
- Input fields: `rounded-lg` (8px)
- Images in cards: `rounded-t-lg` (top only)

### Shadows
- Card default: `shadow-sm` → `shadow-md` on hover
- Navbar: `shadow-sm`
- Modal: `shadow-xl`
- Footer: none (solid bg)

---

## Animation Specification (Framer Motion)

### Page Transitions
- **Page enter**: fade in + slide up 20px, duration 0.6s, ease `[0.25, 0.46, 0.45, 0.94]`
- **Page exit**: fade out, duration 0.3s

### Scroll Animations (staggered)
- **Section headers**: fade in + slide up 30px, duration 0.6s, triggered at 20% viewport
- **Cards**: fade in + slide up 40px, stagger 0.1s between siblings, duration 0.5s
- **Stats/numbers**: count-up animation from 0, duration 1.5s
- **Images**: scale from 0.95 → 1.0 + fade in, duration 0.7s

### Micro-interactions
- **Button hover**: scale 1.02, shadow increase, duration 0.2s
- **Card hover**: translateY(-4px) + shadow-md → shadow-lg, duration 0.3s
- **Nav links**: underline slides in from left, duration 0.3s
- **Tab switch**: active indicator slides to new position, content crossfades
- **Form focus**: border color transition + subtle glow, duration 0.2s
- **Toast notifications**: slide in from top-right + fade, duration 0.4s

### Loading States
- **Skeleton screens**: shimmer gradient animation, infinite loop
- **Page spinner**: rotating RUNACOS logo or pulsing dots
- **Submit buttons**: text → spinner → checkmark sequence

### Hero-specific
- **Hero text**: letter-by-letter reveal or word-by-word fade-in, stagger 0.05s
- **Hero CTA buttons**: bounce-in after text completes, stagger 0.15s
- **Floating elements**: gentle parallax on scroll, subtle up/down float animation

---

## Component Specifications

### Navbar
```
┌─────────────────────────────────────────────────────────────────┐
│ [R logo] RUNACOS              Home  About  Executives  News &  │
│ ASSOC. OF COMPUTER            Events  Resources  Contact  🔍    │
│ SCIENCE STUDENTS                              [Join Association]│
└─────────────────────────────────────────────────────────────────┘
```
- **Height**: 72px desktop, 64px mobile
- **Background**: white, `shadow-sm`, sticky top-0
- **Logo**: Dark navy circle with white "R" + text block
- **Nav links**: Inter 500, 14px, gray-600, hover: navy-800, active: navy-800 with 2px bottom border (blue-500)
- **Search icon**: `Search` from lucide-react, 20px, gray-500
- **CTA button**: "Join Association", navy-800 bg, white text, rounded-lg, px-4 py-2
- **Mobile**: Hamburger icon → slide-in drawer from right
- **Animation**: Navbar slides down on page load, links fade in staggered

### Footer
```
┌─────────────────────────────────────────────────────────────────┐
│  navy-900 background                                            │
│                                                                 │
│  [R] RUNACOS          Quick Links     Resources    Contact Us   │
│  Description text...  About Us        Dept Handbook  📍 Address │
│                       Executive       Past Questions ✉️ Email   │
│  [fb][tw][ig][li]     News & Events   Project DB    📞 Phone   │
│                       Academic Cal    e-Library                  │
│                       Student Portal  Course Materials           │
│                                                                 │
│─────────────────────────────────────────────────────────────────│
│  © 2025 RUNACOS          Privacy Policy · Terms · Cookie Policy │
└─────────────────────────────────────────────────────────────────┘
```
- **Background**: navy-900
- **Text**: white (headings), gray-300 (body/links)
- **Columns**: 4-column grid desktop, 2-col tablet, 1-col mobile
- **Social icons**: 32px circles, navy-700 bg, white icons, hover: blue-500 bg
- **Bottom bar**: border-t border-navy-700, py-4
- **Animation**: Fade in on scroll into view

### NewsCard / EventCard / ArticleCard
```
┌──────────────────────────┐
│  ┌──────────────────────┐│
│  │     Cover Image      ││
│  │     (16:10 ratio)    ││
│  └──────────────────────┘│
│  📅 Oct 15, 2023 · 🏷 Tag│
│  **Card Title Here That  │
│  Can Wrap Two Lines**    │
│                          │
│  Excerpt text truncated  │
│  to 2-3 lines max...    │
│                          │
│  Read More →             │
└──────────────────────────┘
```
- **Container**: white bg, rounded-lg, shadow-sm, border border-gray-100
- **Image**: aspect-[16/10], object-cover, rounded-t-lg
- **Date**: gray-500, 12px, with calendar icon
- **Category tag**: colored pill badge (blue for Academic, orange for Events, green for Student Life)
- **Title**: Merriweather 700, 18px, navy-800, line-clamp-2
- **Excerpt**: Inter 400, 14px, gray-500, line-clamp-3
- **Read More**: blue-500, 14px, 600 weight, with arrow icon → slides right on hover
- **Hover**: translateY(-4px), shadow-md, image subtle scale 1.05
- **Animation**: Fade up on scroll, stagger in grid

### Button
| Variant | Style |
|---------|-------|
| **Primary** | bg-navy-800, text-white, hover: bg-navy-700, active: bg-navy-600 |
| **Secondary** | border-2 border-navy-800, text-navy-800, hover: bg-navy-50 |
| **Ghost** | text-navy-800, hover: bg-gray-100 |
| **Danger** | bg-red-500, text-white, hover: bg-red-600 |
- Sizes: `sm` (px-3 py-1.5 text-sm), `md` (px-5 py-2.5 text-sm), `lg` (px-6 py-3 text-base)
- All: rounded-lg, font-medium, transition-all duration-200, hover scale-[1.02]
- Disabled: opacity-50, cursor-not-allowed
- Loading: spinner icon replaces text

### Filter Tabs (Pill style)
```
[All News]  Academics   Events   Student Life
 ^^^^^^^^
 (active: navy-800 bg, white text, rounded-full)
 (inactive: text-gray-600, hover: bg-gray-100, rounded-full)
```
- **Height**: 36px
- **Padding**: px-4 py-2
- **Active transition**: bg color slides/morphs between tabs
- **Font**: Inter 500, 14px

### Newsletter Section
```
┌─────────────────────────────────────────────┐
│              ✉️ (icon, 48px)                │
│     Subscribe to RUNACOS Weekly             │
│  Get the latest department news, event      │
│  reminders, and academic resources...       │
│                                             │
│  ┌─────────────────────────┐ ┌───────────┐ │
│  │ Enter student email     │ │ Subscribe │ │
│  └─────────────────────────┘ └───────────┘ │
│  We respect your privacy. Unsubscribe...    │
└─────────────────────────────────────────────┘
```
- **Background**: gray-50
- **Icon**: Mail icon from lucide-react, 48px, navy-800
- **Heading**: Merriweather 700, 24px
- **Input + Button inline**: input rounded-l-lg, button rounded-r-lg, navy-800 bg
- **Animation**: Section fades up, input field slides in from left, button from right

### Pagination
```
« Previous  [1]  2  ...  4  Next »
```
- Active page: navy-800 bg, white text, rounded-lg
- Inactive: gray-600 text, hover: bg-gray-100
- Disabled (prev/next): gray-300 text
- Size: 36x36px squares

---

## Page Specifications

---

### 1. HOME PAGE (`/`)

**Hero Section**
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              ESTABLISHED 2005                        │
│                                                      │
│         Empowering the Future of                     │
│      Technology & Innovation                         │
│              (blue-500 highlight)                    │
│                                                      │
│  The official body representing the brilliant minds  │
│  of the Department of Computer Science...            │
│                                                      │
│  [Read Our Constitution]  [Meet the Executives]      │
│   (primary filled)        (secondary outlined)       │
│                                                      │
└──────────────────────────────────────────────────────┘
```
- **Background**: white with subtle gradient or geometric pattern (very faint)
- **Label**: "ESTABLISHED 2005" - uppercase, letter-spacing 3px, blue-500, 12px, 600 weight
- **H1**: Merriweather 800, 48px, "Technology & Innovation" in blue-500
- **Subtitle**: Inter 400, 18px, gray-500, max-w-2xl, mx-auto
- **Buttons**: side by side, gap-4
- **Animation**: Label fades in first → H1 words reveal one by one → subtitle fades up → buttons bounce in
- **Min height**: `min-h-[70vh]`, flex center

**Quick Access Cards Section**
```
  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
  │ 📰   │  │ 📅   │  │ ❓   │  │ 📝   │
  │ News │  │Events│  │ PQ   │  │Report│
  │      │  │      │  │      │  │Fault │
  └──────┘  └──────┘  └──────┘  └──────┘
```
- 4-column grid, cards with icon (lucide, 40px), title, brief description
- Each card: white bg, border, rounded-lg, p-6, hover: shadow-md + border-blue-500
- Animation: Stagger fade up from bottom

**Latest News Section**
```
  — Latest News
  Stay updated with the latest...

  [NewsCard] [NewsCard] [NewsCard]

                           [View All News →]
```
- Section label with em-dash prefix
- 3-column grid of NewsCards
- "View All News →" link aligned right
- Animation: Section header slides in from left, cards stagger up

**Upcoming Events Section**
```
  — Upcoming Events

  [EventCard] [EventCard] [EventCard]

                           [View All Events →]
```
- Same pattern as news
- Event cards show date prominently (large day number + month)
- Animation: Same stagger pattern

**Featured Articles Section** (same grid pattern)

**Stats/Counter Section**
```
┌───────────────────────────────────────────────┐
│  navy-800 background                          │
│                                               │
│   500+        50+        10+       15+        │
│  Members   Events Held  Projects  Awards      │
│                                               │
└───────────────────────────────────────────────┘
```
- Dark navy background, white text
- Numbers: Merriweather 800, 48px, count-up animation
- Labels: Inter 400, 16px, gray-300
- Animation: Numbers count up from 0 when section enters viewport

**Newsletter Section** (as specified above)

---

### 2. ABOUT PAGE (`/about`)

**Hero**
- Same label style: "ABOUT US" uppercase, blue-500
- H1: "Empowering the Future of **Technology & Innovation**"
- Subtitle + 2 CTA buttons

**About Split Section**
```
┌──────────────────┬─────────────────────────────────┐
│ About RUNACOS    │ — Association Overview           │
│ Description...   │                                  │
│                  │ Body text with bold org name...  │
│ ┌──────────────┐ │                                  │
│ │ QUICK FACTS  │ │ [Image with caption]             │
│ │ Founded 2015 │ │                                  │
│ │ Members 500+ │ │ More body text...                │
│ │ Dept CS      │ │                                  │
│ │ Location Ede │ │                                  │
│ └──────────────┘ │                                  │
│                  │                                  │
│ Get in Touch     │                                  │
│ ✉️ info@...      │                                  │
└──────────────────┴─────────────────────────────────┘
```
- Left sidebar: ~30% width, sticky on scroll
- Quick Facts: gray-50 bg, rounded-lg, p-4, grid of key-value pairs
- Right content: ~70% width, article-style prose
- Animation: Left panel slides in from left, right content fades up

**Vision & Mission Cards**
```
  ┌─────────────────────┐  ┌─────────────────────────┐
  │ 👁 (icon)           │  │ 🎯 (icon)               │
  │                     │  │         navy-800 bg      │
  │ Our Vision          │  │ Our Mission              │
  │ Description text... │  │ Description text...      │
  │ (white bg)          │  │ (white text)             │
  └─────────────────────┘  └─────────────────────────┘
```
- 2-column grid
- Vision: white bg, border, icon in blue-100 circle
- Mission: navy-800 bg, white text, icon in navy-600 circle
- Animation: Cards flip in or scale up from center

**Core Values Section**
```
  — Core Values
  Our values define who we are...

  [Icon] Excellence    [Icon] Innovation
  [Icon] Integrity     [Icon] Community
```
- Grid of value cards with icons, title, description
- Animation: Stagger reveal

---

### 3. NEWS LISTING (`/news`)

**Page Header**
```
  DEPARTMENTAL UPDATES (label)
  News & Announcements (H1)
  Stay informed with the latest... (subtitle)
```
- Centered text, bg-white
- Animation: Fade down from top

**Filter Bar**
```
  [All News] [Academics] [Events] [Student Life]     Sort by: [Newest First ▼]
```
- Left: pill tabs
- Right: sort dropdown
- Animation: Tabs slide in from left, sort slides from right

**News Grid**
- 3-column grid of NewsCards
- Animation: Stagger fade up
- Infinite scroll or pagination at bottom

**Pagination**
- Centered, below grid
- Animation: Fade in after cards load

---

### 4. NEWS DETAIL (`/news/[slug]`)
```
┌──────────────────────────────────────────────┐
│  ← Back to News                              │
│                                              │
│  [Academic] tag                              │
│  **News Title Here**                         │
│  📅 October 15, 2023 · 👤 Author Name       │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │          Cover Image (full width)      │  │
│  │          aspect-[21/9]                 │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Article prose content...                    │
│  (max-w-3xl, mx-auto, prose styling)        │
│                                              │
│  ─────────────────────────────────────────   │
│                                              │
│  Related News                                │
│  [NewsCard] [NewsCard] [NewsCard]            │
└──────────────────────────────────────────────┘
```
- Animation: Image fades in, text slides up, related cards stagger in

---

### 5. EVENTS LISTING (`/events`)
Similar to news but with:
- **Event cards** show large date block: `┌─────┐ │ 15  │ │ OCT │ └─────┘`
- Tabs: Upcoming / Past Events
- Each card shows: location icon + venue, clock icon + time
- Animation: Same stagger pattern

### 6. EVENT DETAIL (`/events/[slug]`)
- Full cover image hero
- Event info sidebar: Date, Time, Location, Category
- Description content area
- Registration CTA button → opens modal form
- Animation: Info cards slide in from right

---

### 7. ARTICLES LISTING (`/articles`)
- Same layout as news
- Filter by category
- Grid of ArticleCards

### 8. ARTICLE DETAIL (`/articles/[slug]`)
- Same layout as news detail
- Reading time estimate shown
- Author card at bottom

---

### 9. EXECUTIVES PAGE (`/executives`)
```
  LEADERSHIP (label)
  Meet Our Executives (H1)

  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ [Photo]  │ │ [Photo]  │ │ [Photo]  │
  │  circle  │ │  circle  │ │  circle  │
  │ Name     │ │ Name     │ │ Name     │
  │ Position │ │ Position │ │ Position │
  └──────────┘ └──────────┘ └──────────┘
```
- Profile photos in circles (w-32 h-32), with navy-800 ring on hover
- Name: Merriweather 600, 18px
- Position: Inter 400, 14px, blue-500
- Hover: photo scales 1.05, name color → blue-500
- Animation: Cards pop in with scale + fade, staggered

---

### 10. STAFF PAGE (`/staff`)
- Same as executives but table/list format or grid
- Shows department staff members

---

### 11. CONTACT PAGE (`/contact`)
```
  ┌─────────────────────────────┬────────────────────────┐
  │ Contact Form                │ Contact Information    │
  │                             │                        │
  │ [Name input]                │ 📍 Address             │
  │ [Email input]               │ ✉️ Email               │
  │ [Subject input]             │ 📞 Phone               │
  │ [Message textarea]          │ 🕐 Office Hours        │
  │                             │                        │
  │ [Send Message] button       │ [Map Embed]            │
  │                             │                        │
  └─────────────────────────────┴────────────────────────┘
```
- 2-column layout: form left, info right
- Form fields: gray-50 bg, border, focus: border-blue-500 + ring
- Contact info: icon cards with navy-800 icons
- Animation: Form slides from left, info from right, map fades in

---

### 12. PAST QUESTIONS (`/past-questions`)
```
  ACADEMIC RESOURCES (label)
  Past Questions (H1)

  ┌──────────────────────────────────────────┐
  │ 🔍 [Search input]                       │
  │ [Department ▼] [Course ▼] [Year ▼]      │
  └──────────────────────────────────────────┘

  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ 📄 PDF   │ │ 📄 PDF   │ │ 📄 PDF   │
  │ Title    │ │ Title    │ │ Title    │
  │ Course   │ │ Course   │ │ Course   │
  │ Year     │ │ Year     │ │ Year     │
  │ [⬇ DL]  │ │ [⬇ DL]  │ │ [⬇ DL]  │
  └──────────┘ └──────────┘ └──────────┘
```
- Search + filters at top
- Grid of PQ cards with file type icon, download button
- Download count badge
- Animation: Filter bar slides down, cards stagger in

---

### 13. FRMS REPORT (`/frms/report`)
```
  FAULT REPORTING (label)
  Report a Fault (H1)
  Submit maintenance issues...

  ┌─────────────────────────────────────────┐
  │  Step indicator: [1]──[2]──[3]          │
  │                                         │
  │  Multi-step form:                       │
  │  Step 1: Personal Info (name,email,ph)  │
  │  Step 2: Fault Details (category,loc,   │
  │           description, file upload)     │
  │  Step 3: Review & Submit                │
  │                                         │
  │  [Previous] [Next/Submit]               │
  └─────────────────────────────────────────┘

  ┌─────────────────────────────────────────┐
  │  ✅ Success!                            │
  │  Your Reference ID: FRMS-2024-XXXX     │
  │  Save this ID to track your report.    │
  │  [Track My Report] [Submit Another]     │
  └─────────────────────────────────────────┘
```
- Multi-step with animated step indicator
- File upload with drag-and-drop zone
- Success state with confetti animation
- Animation: Steps slide left/right on navigation

---

### 14. FRMS TRACK (`/frms/track`)
```
  FAULT TRACKING (label)
  Track Your Report (H1)

  ┌─────────────────────────────────────────┐
  │ Enter Reference ID: [FRMS-____-____]    │
  │ [Track Report]                          │
  └─────────────────────────────────────────┘
```

### 15. FRMS TRACK RESULT (`/frms/track/[referenceId]`)
```
  Reference: FRMS-2024-XXXX
  Status: [IN PROGRESS] badge

  ┌─────────────────────────────────────────┐
  │ Timeline:                               │
  │  ● Submitted ─── Oct 1, 2023           │
  │  │  Initial report filed               │
  │  ● Assigned ──── Oct 2, 2023           │
  │  │  Assigned to maintenance staff      │
  │  ○ In Progress ─ Oct 3, 2023           │
  │  │  Technician dispatched              │
  │  ○ (Resolved) ── Pending               │
  └─────────────────────────────────────────┘

  Fault Details:
  Category | Location | Description | Attachment
```
- Vertical timeline with animated dots (pulse on current status)
- Status badge with color coding
- Animation: Timeline dots/lines draw in sequentially

---

### 16. ADMIN LAYOUT
```
┌────────┬──────────────────────────────────────┐
│Sidebar │ Topbar: Search | Notifications | User│
│        ├──────────────────────────────────────┤
│ [R]    │                                      │
│ RUNACOS│  Main Content Area                   │
│        │                                      │
│ 📊 Dash│                                      │
│ 🐛 FRMS│                                      │
│ 📰 News│                                      │
│ 📅 Evnt│                                      │
│ 📝 Art │                                      │
│ 📄 PQ  │                                      │
│ 👥 User│                                      │
│        │                                      │
│ ⚙ Set │                                      │
└────────┴──────────────────────────────────────┘
```
- Sidebar: navy-900 bg, w-64, collapsible on mobile
- Active link: bg-navy-700, white text, left border accent
- Topbar: white, h-16, shadow-sm
- Animation: Sidebar links fade in staggered on load

### 17. ADMIN FRMS DASHBOARD
```
  KPI Cards: [Total Faults] [Open] [In Progress] [Resolved]

  Filters: [Status ▼] [Category ▼] [Date Range] [Search]

  ┌──────────────────────────────────────────────────┐
  │ ID    │ Title  │ Category │ Status │ Date │ Actn │
  │ FRMS..│ ...    │ ...      │ [badge]│ ...  │ 👁   │
  └──────────────────────────────────────────────────┘

  Pagination
```
- KPI cards with icon, number (animated count-up), label
- Filterable/searchable table
- Status badges color-coded
- Animation: KPIs count up, table rows fade in

### 18. LOGIN PAGE (`/login`)
```
┌──────────────────────────────────────────────┐
│                                              │
│  Split layout:                               │
│  Left: Navy bg with RUNACOS branding         │
│  Right: Login form                           │
│                                              │
│  ┌──────────┬─────────────────┐              │
│  │ RUNACOS  │  Welcome Back   │              │
│  │ branding │                 │              │
│  │ + tagline│  [Email]        │              │
│  │          │  [Password]     │              │
│  │          │  [Remember me]  │              │
│  │          │  [Sign In]      │              │
│  └──────────┴─────────────────┘              │
└──────────────────────────────────────────────┘
```
- Split screen: left navy-800 with logo, right white with form
- Animation: Left panel slides in, form fields stagger from right

---

### 19. PRIVACY POLICY / TERMS OF SERVICE
- Standard prose layout
- max-w-3xl, mx-auto
- Table of contents sidebar (optional)
- Last updated date

### 20. 404 PAGE
```
  [Large "404" text, navy-800, 120px]
  Page Not Found
  The page you're looking for doesn't exist.
  [Go Home] [Go Back]
```
- Centered, min-h-screen
- Animation: 404 text bounces in, then settles
- Floating geometric shapes in background (subtle)

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| `sm` | 640px | Single column cards |
| `md` | 768px | 2-column grids, show more nav items |
| `lg` | 1024px | 3-column grids, full navbar |
| `xl` | 1280px | Max container width reached |

### Mobile-specific
- Hamburger menu → slide-in drawer
- Cards stack to single column
- Admin sidebar → bottom tab bar or hamburger
- Tables → card-based list view on mobile
- Hero text sizes reduce ~33%
- Section padding reduces ~40%

---

## Accessibility Requirements
- All interactive elements: focus-visible ring (blue-500, 2px offset)
- Color contrast: WCAG AA minimum (4.5:1 for text)
- Animations: respect `prefers-reduced-motion`
- All images: meaningful alt text
- Form fields: proper labels, error messages, aria-describedby
- Skip-to-content link
- Semantic HTML (nav, main, article, section, aside, footer)
