# RUNACOS Architecture Design Document

> Version 2.0 | February 2026

---

## 1. System Overview

RUNACOS is a full-stack web application built for the Redeemer's University Association of Computer Science Students. It serves as a membership portal, content management system, payment processor, fault reporting platform, and alumni directory.

### 1.1 Architecture Style

**Monolithic Full-Stack** — The application uses Next.js 14 App Router as both the frontend framework and API backend, deployed as a single unit. This is appropriate for the team size and feature scope, avoiding the operational overhead of microservices.

### 1.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                           │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Public Pages     │  │  Admin Dashboard │  │  Auth Pages  │  │
│  │  (SSR + CSR)      │  │  (CSR)           │  │  (CSR)       │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘  │
│           │                     │                    │          │
├───────────┼─────────────────────┼────────────────────┼──────────┤
│           ▼                     ▼                    ▼          │
│                       API LAYER (Next.js Route Handlers)        │
│                                                                 │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐ ┌────────┐ │
│  │ Content │ │ Members  │ │  Dues   │ │  FRMS    │ │  Auth  │ │
│  │ APIs    │ │ APIs     │ │  APIs   │ │  APIs    │ │  APIs  │ │
│  └────┬────┘ └────┬─────┘ └────┬────┘ └────┬─────┘ └───┬────┘ │
│       │           │            │            │           │      │
├───────┼───────────┼────────────┼────────────┼───────────┼──────┤
│       ▼           ▼            ▼            ▼           ▼      │
│                      SERVICE LAYER                              │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Prisma   │ │ NextAuth │ │ Paystack │ │  Email Services  │  │
│  │ ORM      │ │ v5       │ │ Gateway  │ │  (Resend/Brevo)  │  │
│  └────┬─────┘ └──────────┘ └──────────┘ └──────────────────┘  │
│       │                                                        │
├───────┼────────────────────────────────────────────────────────┤
│       ▼                                                        │
│                      DATA LAYER                                │
│                                                                │
│  ┌──────────┐           ┌──────────────┐                       │
│  │  MySQL   │           │ Vercel Blob  │                       │
│  │ Database │           │ (File Store) │                       │
│  └──────────┘           └──────────────┘                       │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Core Framework

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | **Next.js** | 14.2.23 | App Router, SSR/CSR hybrid, API routes, file-based routing |
| Runtime | **React** | 18.3.1 | Component model, hooks, concurrent features |
| Language | **TypeScript** | 5.x | Type safety, IDE support, refactoring confidence |
| Build | **Turbopack** (dev) | — | Fast dev server |
| Deployment | **Standalone** output | — | Self-contained Docker/Node deployment |

### 2.2 Data & Persistence

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| ORM | **Prisma** 6.3.1 | Type-safe queries, migrations, schema-first design |
| Database | **MySQL** | Relational data model, ACID compliance, broad hosting support |
| File Storage | **Vercel Blob** | Managed object storage, direct upload URLs, CDN delivery |
| Caching | **SWR** (client) | Stale-while-revalidate, automatic revalidation |

### 2.3 Authentication & Security

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Auth | **NextAuth v5** (beta) | First-party Next.js integration, session management |
| Strategy | **JWT** | Stateless, scalable, no session DB lookups |
| Adapter | **PrismaAdapter** | Persist user accounts in MySQL |
| Password | **bcryptjs** | Industry-standard password hashing |
| Middleware | **Next.js Middleware** | Edge-level route protection |

### 2.4 External Services

| Service | Provider | Purpose |
|---------|----------|---------|
| Payments | **Paystack** | Nigerian payment processing (cards, bank transfer, USSD) |
| Transactional Email | **Resend** | Fault status notification emails |
| Bulk Email | **Brevo** (SMTP) | Newsletter, content publication notifications |
| File Storage | **Vercel Blob** | Images, documents, uploads |

### 2.5 Frontend Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **Tailwind CSS** | 3.4.17 | Utility-first styling |
| **Framer Motion** | 12.4.7 | Page transitions, scroll animations, micro-interactions |
| **lucide-react** | 0.474.0 | Icon library (tree-shakeable) |
| **TipTap** | 2.11.5 | Rich text editor (admin content creation) |
| **sonner** | 1.7.4 | Toast notifications |
| **date-fns** | 4.1.0 | Date formatting and manipulation |
| **html2canvas** | — | Client-side receipt/card image generation |
| **zod** | 3.24.2 | Runtime schema validation |

---

## 3. Application Structure

### 3.1 Directory Architecture

```
runacos/
├── prisma/
│   ├── schema.prisma          # Database schema (18 models)
│   └── seed.ts                # Initial data seeding
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout (providers, fonts, metadata)
│   │   ├── not-found.tsx      # 404 page
│   │   │
│   │   ├── login/             # Authentication
│   │   │   ├── page.tsx
│   │   │   └── LoginContent.tsx
│   │   │
│   │   ├── (site)/            # Public site layout group
│   │   │   ├── layout.tsx     # Navbar + Footer wrapper
│   │   │   ├── page.tsx       # Homepage
│   │   │   │
│   │   │   ├── (public)/      # Public content pages
│   │   │   │   ├── about/
│   │   │   │   ├── alumni/
│   │   │   │   ├── articles/  + [slug]/
│   │   │   │   ├── contact/
│   │   │   │   ├── events/    + [slug]/
│   │   │   │   ├── executives/
│   │   │   │   ├── news/      + [slug]/
│   │   │   │   ├── past-questions/
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── membership/    # Registration flow
│   │   │   ├── dues/          # Payment + receipts
│   │   │   │   ├── pay/
│   │   │   │   └── receipt/   + [reference]/
│   │   │   └── frms/          # Fault reporting
│   │   │       ├── report/
│   │   │       └── track/     + [referenceId]/
│   │   │
│   │   ├── admin/             # Admin dashboard (protected)
│   │   │   ├── layout.tsx     # Auth guard + admin layout
│   │   │   ├── AdminLayoutClient.tsx
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── alumni/
│   │   │   ├── articles/      + new/ + [id]/edit/
│   │   │   ├── events/        + new/ + [id]/edit/
│   │   │   ├── executives/
│   │   │   ├── frms/          + [id]/
│   │   │   ├── members/
│   │   │   ├── news/          + new/ + [id]/edit/
│   │   │   ├── pages/
│   │   │   ├── past-questions/ + new/ + [id]/edit/
│   │   │   ├── payments/
│   │   │   ├── settings/
│   │   │   └── users/
│   │   │
│   │   └── api/               # API route handlers
│   │       ├── auth/[...nextauth]/
│   │       ├── alumni/
│   │       ├── articles/      + [id]/
│   │       ├── contact/       + [id]/
│   │       ├── dashboard/
│   │       ├── dues/          + [id]/ + receipt/[reference]/
│   │       ├── events/        + [id]/ + [id]/register/
│   │       ├── executives/    + [id]/
│   │       ├── frms/          + [id]/ + categories/ + report/ + track/[referenceId]/
│   │       ├── members/       + [id]/
│   │       ├── membership/    + register/ + check/ + pay/ + verify/[reference]/ + card/[memberId]/
│   │       ├── news/          + [id]/
│   │       ├── newsletter/
│   │       ├── pages/         + [slug]/
│   │       ├── past-questions/ + [id]/ + [id]/download/
│   │       ├── paystack/      + initialize/ + webhook/
│   │       ├── settings/
│   │       ├── upload/
│   │       └── users/         + [id]/
│   │
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, ConditionalLayout
│   │   ├── home/              # Homepage sections
│   │   ├── ui/                # Shared UI (MotionWrapper, PageHero)
│   │   ├── providers/         # React context providers
│   │   ├── membership/        # MembershipCard
│   │   ├── news/              # NewsCard
│   │   └── dues/              # DuesReceipt
│   │
│   ├── lib/                   # Shared utilities
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── email.ts           # Resend transactional email
│   │   ├── brevo.ts           # Brevo bulk email
│   │   ├── upload.ts          # Vercel Blob upload
│   │   ├── utils.ts           # Formatting, slugify, etc.
│   │   ├── constants.ts       # App constants, nav links
│   │   ├── level.ts           # Student level computation
│   │   ├── reference-id.ts    # FRMS reference generation
│   │   ├── page-registry.ts   # Dynamic page config
│   │   └── validations/       # Zod schemas
│   │       ├── membership.ts
│   │       ├── frms.ts
│   │       ├── content.ts
│   │       ├── past-questions.ts
│   │       ├── contact.ts
│   │       └── users.ts
│   │
│   ├── hooks/                 # React hooks
│   │   ├── useDebounce.ts
│   │   └── useMediaQuery.ts
│   │
│   └── types/                 # TypeScript definitions
│       ├── index.ts
│       └── next-auth.d.ts
│
├── middleware.ts               # Route protection
├── tailwind.config.ts          # Design system tokens
├── next.config.js              # Next.js configuration
├── package.json
└── .env.example
```

### 3.2 Route Groups

Next.js route groups organize the application without affecting URL structure:

| Group | Purpose | Layout |
|-------|---------|--------|
| `(site)` | All public-facing pages | Navbar + Footer |
| `(public)` | Content pages within site | Inherited from `(site)` |
| `admin` | Admin dashboard | Sidebar + Topbar |

---

## 4. Data Architecture

### 4.1 Entity-Relationship Diagram

```
┌──────────┐     ┌───────────┐     ┌──────────────┐
│   User   │────<│  Account   │     │   Session    │
│ (Admin/  │     │ (OAuth)    │     │              │
│  Staff)  │     └───────────┘     └──────────────┘
└────┬─────┘
     │ assigned to
     ▼
┌──────────┐     ┌───────────────┐
│  Fault   │────<│ FaultStatus   │
│          │     │ History       │
│          │     └───────────────┘
│          │────>┌───────────────┐
│          │     │ FaultCategory │
└──────────┘     └───────────────┘

┌──────────┐     ┌───────────────┐
│  Member  │────<│ DuesPayment   │
│          │     └───────────────┘
│          │────>┌───────────────┐
│          │     │  Executive    │
└──────────┘     └───────────────┘

┌──────────┐  ┌──────────┐  ┌──────────┐
│   News   │  │  Event   │  │ Article  │
│          │  │          │  │          │
└──────────┘  └────┬─────┘  └──────────┘
                   │
                   ▼
              ┌──────────────┐
              │ EventReg     │
              └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ PastQuestion │  │ Contact      │  │ Newsletter   │
│              │  │ Submission   │  │ Subscriber   │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐
│ SiteSetting  │  (key-value store)
└──────────────┘
```

### 4.2 Database Models (18 total)

#### Core Authentication
- **User** — Admin/staff accounts with email/password, role-based access
- **Account** — OAuth provider data (NextAuth)
- **Session** — Session tokens (NextAuth)

#### Membership & Payments
- **Member** — Student profiles with academic details, admission year, alumni status
- **DuesPayment** — Per-session payment records with Paystack integration
- **Executive** — Leadership council, linked to Member records

#### Content Management
- **News** — News articles with draft/publish workflow
- **Event** — Events with dates, location, registration
- **EventRegistration** — Event attendee records
- **Article** — Long-form articles with categories

#### Fault Management (FRMS)
- **Fault** — Issue reports with reference IDs, status tracking, staff assignment
- **FaultCategory** — Categorization of fault types
- **FaultStatusHistory** — Complete audit trail of status changes

#### Utilities
- **PastQuestion** — Exam question files with download tracking
- **ContactSubmission** — Contact form entries
- **NewsletterSubscriber** — Email list management
- **SiteSetting** — Runtime configuration (key-value pairs)

### 4.3 Key Constraints & Indexes

| Model | Constraint | Type |
|-------|-----------|------|
| Member | `email` | Unique |
| Member | `matricNumber` | Unique |
| Member | `memberId` | Unique |
| DuesPayment | `paymentRef` | Unique |
| DuesPayment | `(memberId, academicSession)` | Composite Unique |
| Executive | `memberId` | Unique |
| News/Event/Article | `slug` | Unique |
| Fault | `referenceId` | Unique |
| User | `email` | Unique |
| NewsletterSubscriber | `email` | Unique |

---

## 5. Authentication & Authorization

### 5.1 Authentication Flow

```
User → Login Page → POST /api/auth/callback/credentials
                          │
                          ▼
                   NextAuth Credentials Provider
                          │
                   bcrypt.compare(password, hash)
                          │
                          ▼
                   JWT Token Created
                   (id, name, email, role)
                          │
                          ▼
                   Set HTTP-only Cookie
                          │
                          ▼
                   Redirect → /admin
```

### 5.2 Authorization Matrix

| Route Pattern | Required Role | Enforcement |
|--------------|--------------|-------------|
| `/admin/*` | Any authenticated | Middleware redirect |
| `/admin/users` | ADMIN only | Middleware redirect |
| `POST/PUT/DELETE /api/news` | Any authenticated | API route check |
| `PATCH /api/alumni` | Any authenticated | Middleware |
| `PATCH /api/dues/[id]` | Any authenticated | Middleware |
| `GET /api/events` (public) | None | Open |
| `POST /api/membership/register` | None | Open |
| `POST /api/frms/report` | None | Open |

### 5.3 Middleware Architecture

```typescript
// middleware.ts — runs at the edge
auth((req) => {
  // 1. Check if route is protected
  // 2. Verify authentication via JWT
  // 3. Check role-based access
  // 4. Redirect or return 401
})

// Matcher: only runs on specified patterns
matcher: ["/admin/:path*", "/api/users/:path*", "/api/dues/:path*", ...]
```

---

## 6. Payment Architecture

### 6.1 Paystack Payment Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client   │     │  API     │     │ Paystack │     │ Webhook  │
│ /dues/pay │     │ /api/dues│     │  Gateway │     │ Handler  │
└─────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
      │                │                │                │
      │  POST (email,  │                │                │
      │  session)      │                │                │
      │───────────────>│                │                │
      │                │                │                │
      │                │  Create        │                │
      │                │  DuesPayment   │                │
      │                │  (PENDING)     │                │
      │                │                │                │
      │                │  Initialize    │                │
      │                │  Transaction   │                │
      │                │───────────────>│                │
      │                │                │                │
      │                │  auth_url +    │                │
      │                │  access_code   │                │
      │                │<───────────────│                │
      │                │                │                │
      │  Redirect to   │                │                │
      │  Paystack      │                │                │
      │<───────────────│                │                │
      │                │                │                │
      │  User pays on  │                │                │
      │  Paystack page │                │                │
      │───────────────────────────────>│                │
      │                │                │                │
      │                │                │  charge.success│
      │                │                │  webhook       │
      │                │                │───────────────>│
      │                │                │                │
      │                │                │  Verify HMAC   │
      │                │                │  SHA-512       │
      │                │                │                │
      │                │                │  Update        │
      │                │                │  DuesPayment   │
      │                │                │  → VERIFIED    │
      │                │                │                │
      │  Callback to   │                │                │
      │  /dues/receipt/ │                │                │
      │  {reference}   │                │                │
      │<──────────────────────────────│                │
```

### 6.2 Payment Reference Format

```
{PREFIX}-{SESSION}-{NANOID}
Example: RUNACOS-2025_2026-abc123xyz
```

- **PREFIX**: Configurable via `SiteSetting.paystack_prefix`
- **SESSION**: Academic session with `/` replaced by `_`
- **NANOID**: 10-character random ID

### 6.3 Payment States

| Status | Description |
|--------|------------|
| `PENDING` | Payment initiated, awaiting Paystack |
| `VERIFIED` | Webhook confirmed successful payment |
| `FAILED` | Payment failed or timed out |

Manual verification by admin also supported (sets `paymentMethod: "MANUAL"`).

---

## 7. Email Architecture

### 7.1 Dual Email Strategy

```
                    ┌───────────────────────┐
                    │   Email Dispatcher     │
                    └───────┬───────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
     ┌────────▼────────┐       ┌──────────▼──────────┐
     │   Resend API    │       │   Brevo SMTP        │
     │ (Transactional) │       │   (Bulk/Newsletter) │
     └────────┬────────┘       └──────────┬──────────┘
              │                           │
     ┌────────▼────────┐       ┌──────────▼──────────┐
     │ Fault Status    │       │ Content Publication  │
     │ Notifications   │       │ Notifications        │
     │                 │       │                      │
     │ → Individual    │       │ → Subscribers        │
     │   fault         │       │ → Members            │
     │   reporters     │       │ → Alumni             │
     └─────────────────┘       └──────────────────────┘
```

### 7.2 Bulk Email Flow

1. Content published (news/event/article status → `PUBLISHED`)
2. `getMailingRecipients()` checks SiteSetting flags:
   - `mail_to_subscribers` → Active NewsletterSubscribers
   - `mail_to_members` → Non-alumni Members with email
   - `mail_to_alumni` → Alumni Members with email
3. Deduplicates email addresses
4. `sendBulkEmail()` sends in batches of 50 via Brevo SMTP
5. Fire-and-forget (non-blocking to API response)

### 7.3 Email Configuration

| Variable | Service | Purpose |
|----------|---------|---------|
| `RESEND_API_KEY` | Resend | Transactional emails |
| `BREVO_SMTP_LOGIN` | Brevo | SMTP username |
| `BREVO_SMTP_KEY` | Brevo | SMTP password |

---

## 8. File Storage Architecture

### 8.1 Upload Flow

```
Client → POST /api/upload → Vercel Blob SDK → CDN URL returned
```

### 8.2 File Constraints

| Type | Max Size | Accepted Formats |
|------|---------|-----------------|
| Images | 5 MB | JPEG, PNG, GIF, WebP |
| Videos | 50 MB | MP4, WebM |
| Documents | 10 MB | PDF, DOCX, PPTX |

### 8.3 Storage Locations

| Content | Storage | Access Pattern |
|---------|---------|---------------|
| Member passports | Vercel Blob | Direct URL in Member record |
| News/Event covers | Vercel Blob | Direct URL in content record |
| FRMS attachments | Vercel Blob | Direct URL in Fault record |
| Past question files | Vercel Blob | Download via API route (tracks count) |
| Executive photos | Vercel Blob | Direct URL in Executive record |

---

## 9. API Design

### 9.1 API Conventions

| Aspect | Convention |
|--------|-----------|
| Base path | `/api/{resource}` |
| Single item | `/api/{resource}/[id]` |
| Response format | `{ data?, message?, error?, details? }` |
| Pagination | `{ data: [], pagination: { total, page, limit, totalPages } }` |
| Auth errors | `{ error: "Unauthorized" }` with 401 |
| Validation errors | `{ error: "Validation failed", details: [...] }` with 400 |
| Not found | `{ error: "Not found" }` with 404 |

### 9.2 API Route Map (42 endpoints)

#### Public (No Auth Required)

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/news` | List published news |
| GET | `/api/news/[id]` | Single news (by ID or slug) |
| GET | `/api/events` | List events (with type=upcoming/past filter) |
| GET | `/api/events/[id]` | Single event |
| POST | `/api/events/[id]/register` | Register for event |
| GET | `/api/articles` | List published articles |
| GET | `/api/articles/[id]` | Single article |
| GET | `/api/executives` | List active executives |
| GET | `/api/alumni` | List active alumni |
| GET | `/api/past-questions` | List past questions |
| GET | `/api/past-questions/[id]/download` | Download file |
| POST | `/api/membership/register` | Register new member |
| GET | `/api/membership/check` | Check email/matric existence |
| POST | `/api/dues` | Initiate dues payment |
| GET | `/api/dues` | Lookup payments by email |
| GET | `/api/dues/receipt/[reference]` | Get receipt data |
| POST | `/api/frms/report` | Submit fault report |
| GET | `/api/frms/track/[referenceId]` | Track fault status |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/newsletter` | Subscribe to newsletter |
| GET | `/api/carousel` | Get homepage carousel |
| GET | `/api/pages/[slug]` | Get page content |
| GET | `/api/settings` | Get public settings |
| POST | `/api/paystack/webhook` | Paystack callback |

#### Admin (Auth Required)

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/news` | Create news |
| PUT/DELETE | `/api/news/[id]` | Update/delete news |
| POST | `/api/events` | Create event |
| PUT/DELETE | `/api/events/[id]` | Update/delete event |
| POST | `/api/articles` | Create article |
| PUT/DELETE | `/api/articles/[id]` | Update/delete article |
| POST/PUT/DELETE | `/api/executives/[id]` | Manage executives |
| PATCH | `/api/alumni` | Toggle alumni status |
| GET/PATCH | `/api/dues/[id]` | View/verify payment |
| GET | `/api/members` | List all members |
| PUT/DELETE | `/api/members/[id]` | Update/delete member |
| GET/POST | `/api/frms` | List/create faults |
| PUT/DELETE | `/api/frms/[id]` | Manage faults |
| GET | `/api/frms/categories` | List categories |
| GET | `/api/contact` | List contact messages |
| PUT/DELETE | `/api/contact/[id]` | Manage messages |
| POST | `/api/past-questions` | Upload PQ |
| PUT/DELETE | `/api/past-questions/[id]` | Manage PQ |
| GET/POST | `/api/users` | Manage staff users |
| PUT/DELETE | `/api/users/[id]` | Update/delete users |
| POST | `/api/upload` | Upload files |
| POST | `/api/settings` | Update settings |
| GET | `/api/dashboard` | Dashboard statistics |
| GET | `/api/newsletter` | List subscribers |

---

## 10. Frontend Architecture

### 10.1 Rendering Strategy

| Page Type | Strategy | Rationale |
|-----------|----------|-----------|
| Homepage | CSR (client components) | Dynamic content, animations |
| Content listing (news, events) | CSR with SWR | Real-time updates, filter state |
| Content detail | CSR with fetch | Dynamic slug resolution |
| Admin pages | CSR | Auth-gated, interactive |
| Static pages (about, privacy) | CSR | Editable via CMS |

### 10.2 State Management

- **Server state**: SWR / `useEffect` + `fetch` for API data
- **Local state**: React `useState` for form data, UI toggles
- **Auth state**: NextAuth `useSession` hook
- **No global state library** — complexity not warranted for current scope

### 10.3 Component Architecture

```
Layout Components (Navbar, Footer, AdminLayout)
    │
    ├── Page Components (NewsContent, EventsContent, etc.)
    │       │
    │       ├── Feature Components (NewsCard, DuesReceipt, etc.)
    │       │
    │       └── UI Components (PageHero, MotionWrapper, etc.)
    │
    └── Provider Components (SessionProvider, Toaster)
```

### 10.4 Animation Architecture

The animation system uses a layered approach:

1. **Page-level**: `PageTransition` wrapper (fade-up on mount)
2. **Section-level**: `AnimateOnScroll` (triggered by IntersectionObserver)
3. **List-level**: `StaggerContainer` + `StaggerItem` (cascading delays)
4. **Element-level**: Framer Motion `whileHover`, `whileTap`
5. **CSS-level**: Tailwind `animate-*` classes for simple loops

---

## 11. Validation Architecture

### 11.1 Validation Strategy

```
Client (form) → API Route (Zod parse) → Prisma (DB constraints)
```

All validation is performed at the API layer using Zod schemas. Client-side validation is minimal (required fields, format hints) — the API is the source of truth.

### 11.2 Validation Schemas

| Schema | File | Fields |
|--------|------|--------|
| Membership Registration | `validations/membership.ts` | Names, email, phone, matric, level, gender, department, faculty, state, admissionYear, passport |
| Fault Report | `validations/frms.ts` | Name, email, phone, location, category, description, file |
| News/Article | `validations/content.ts` | Title, content, excerpt, cover, category, author, status |
| Event | `validations/content.ts` | Title, description, location, dates, cover, status |
| Past Question | `validations/past-questions.ts` | Title, department, course, year, file metadata |
| Contact | `validations/contact.ts` | Name, email, subject, message (10+ chars) |
| User | `validations/users.ts` | Name, email, password (8+ chars), role |

---

## 12. Configuration Architecture

### 12.1 Environment Variables

| Variable | Required | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | Yes | MySQL connection string |
| `NEXTAUTH_URL` | Yes | App URL for auth callbacks |
| `NEXTAUTH_SECRET` | Yes | JWT signing secret |
| `ADMIN_EMAIL` | Yes | Seed admin account email |
| `ADMIN_PASSWORD` | Yes | Seed admin account password |
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob API access |
| `PAYSTACK_SECRET_KEY` | Yes | Payment processing |
| `RESEND_API_KEY` | Yes | Transactional email |
| `BREVO_SMTP_LOGIN` | No | Bulk email (optional) |
| `BREVO_SMTP_KEY` | No | Bulk email (optional) |

### 12.2 Runtime Configuration (SiteSetting)

Settings stored in database, editable from admin:

| Key | Type | Purpose |
|-----|------|---------|
| `academic_session` | String | Current session (e.g., "2025/2026") |
| `current_semester` | String | Current semester |
| `dues_amount` | Number | Dues per session in Naira |
| `paystack_prefix` | String | Payment reference prefix |
| `mail_to_subscribers` | Boolean | Email subscribers on publish |
| `mail_to_members` | Boolean | Email members on publish |
| `mail_to_alumni` | Boolean | Email alumni on publish |

---

## 13. Security Considerations

### 13.1 Authentication Security

- Passwords hashed with bcryptjs (cost factor 10)
- JWT tokens with configurable expiry
- HTTP-only cookies for session storage
- CSRF protection via NextAuth

### 13.2 API Security

- Middleware-enforced route protection
- Role-based access control (ADMIN/STAFF)
- Zod validation on all inputs (prevents injection)
- Paystack webhook HMAC-SHA512 signature verification

### 13.3 File Upload Security

- MIME type validation (whitelist)
- File size limits enforced
- Files stored on Vercel Blob (isolated from application server)

### 13.4 Data Protection

- Unique constraints prevent duplicate records
- Prisma parameterized queries (SQL injection prevention)
- Sensitive data (passwords) never returned in API responses

---

## 14. Deployment Architecture

### 14.1 Build Pipeline

```
Source → TypeScript Check → Prisma Generate → Next.js Build → Standalone Output
```

### 14.2 Runtime Requirements

| Component | Requirement |
|-----------|------------|
| Node.js | 18+ |
| Database | MySQL 8.0+ |
| File Storage | Vercel Blob account |
| Email | Resend + Brevo accounts |
| Payments | Paystack account |

### 14.3 Build Commands

```bash
npm run build          # Prisma generate + Next.js build
npm run dev            # Development server
npm run db:push        # Push schema to database
npm run db:seed        # Seed initial data
npm run db:studio      # Open Prisma Studio
```

---

## 15. Scalability Considerations

### 15.1 Current Design Decisions

| Decision | Rationale | Future Path |
|----------|-----------|-------------|
| Monolithic | Small team, single deployment | Extract services if needed |
| MySQL | Relational data, ACID | Scale vertically, add read replicas |
| SWR client caching | Reduce API calls | Add Redis cache layer |
| Vercel Blob | Managed, CDN-backed | Migrate to S3 if needed |
| JWT auth | Stateless, no DB lookup | Add refresh tokens, session revocation |

### 15.2 Performance Optimizations

- Prisma singleton prevents connection pool exhaustion
- SWR stale-while-revalidate reduces perceived latency
- Image optimization via Next.js `<Image>` (where used)
- Standalone output minimizes deployment size
- Email sending is fire-and-forget (non-blocking)
- Bulk emails sent in batches of 50

---

## 16. Error Handling Strategy

### 16.1 API Error Responses

```typescript
// Standard error response
{ error: string, details?: any, status: number }

// Patterns:
// 400 - Validation error (Zod)
// 401 - Unauthorized (not logged in)
// 403 - Forbidden (insufficient role)
// 404 - Resource not found
// 500 - Internal server error
```

### 16.2 Client Error Handling

- API errors → `sonner` toast notifications
- Network errors → Retry with SWR or manual retry button
- 404 pages → Custom not-found page
- Loading states → Spinner (Loader2) or skeleton shimmer

---

## 17. Testing Strategy (Recommended)

> Note: Testing infrastructure is not yet implemented. Recommended approach:

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Utility functions, validation schemas |
| Integration | Vitest + Prisma | API routes with test database |
| E2E | Playwright | Critical user flows (registration, payment, login) |
| Component | React Testing Library | Complex form components |
