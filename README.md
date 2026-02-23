# RUNACOS

**The Redeemer's University Association of Computer Science Students** — A full-stack membership portal, content management system, payment processor, and fault reporting platform.

Built with Next.js 14, Prisma, MySQL, Paystack, and Tailwind CSS.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Payment Integration](#payment-integration)
- [Email Services](#email-services)
- [File Uploads](#file-uploads)
- [Admin Dashboard](#admin-dashboard)
- [Design System](#design-system)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Membership Management
- Free student registration with academic profile (name, matric number, department, faculty, admission year)
- Automatic member ID generation (`RUN-CS-YYYY-XXXX`)
- Level auto-computation from admission year and current academic session
- Downloadable membership card (html2canvas)
- Duplicate prevention (email, matric number)

### Dues Payment System
- Per-session dues payment via **Paystack** (cards, bank transfer, USSD)
- Member lookup by email or matric number
- Payment receipt generation and download
- Payment history per member
- Admin manual payment verification
- Webhook-based automatic payment confirmation

### Content Management
- **News**, **Events**, and **Articles** with rich text editor (TipTap)
- Draft → Published → Archived workflow
- Cover image uploads
- Automatic slug generation
- Category filtering
- Automatic email notifications to subscribers on publish

### Fault Reporting & Management System (FRMS)
- Public fault submission with file attachments
- Unique reference IDs (`FRMS-YYYY-XXXXXX`)
- Status tracking: Open → In Progress → Resolved → Closed
- Staff assignment
- Status change audit trail
- Email notifications on status updates

### Alumni Management
- Track alumni members (graduated students)
- Auto-detection based on admission year
- Public alumni directory
- Former executives highlighted with badge

### Executive Management
- Executive council directory
- Link executives to member records
- Impeachment tracking (date, reason, deactivation)
- Ordered display with drag-to-reorder

### Newsletter & Mailing
- Newsletter subscription from homepage
- Configurable mailing lists (subscribers, members, alumni)
- Automatic emails on content publication
- Brevo SMTP bulk delivery in batches of 50

### Past Questions Repository
- Upload and organize exam papers by department/course/year
- Download tracking with counter
- Search and filter

### Additional Features
- Dynamic page management (editable hero sections)
- Contact form with admin inbox
- Event registration tracking
- Privacy policy and terms of service pages
- Responsive design (mobile-first)
- Animated transitions (Framer Motion)
- Toast notifications (sonner)

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js](https://nextjs.org/) 14.2 (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) 3.4 |
| **Database** | [MySQL](https://www.mysql.com/) via [Prisma](https://www.prisma.io/) 6.3 |
| **Authentication** | [NextAuth.js](https://authjs.dev/) v5 (JWT strategy) |
| **Payments** | [Paystack](https://paystack.com/) |
| **Transactional Email** | [Resend](https://resend.com/) |
| **Bulk Email** | [Brevo](https://www.brevo.com/) (SMTP) |
| **File Storage** | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) |
| **Rich Text** | [TipTap](https://tiptap.dev/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Validation** | [Zod](https://zod.dev/) |
| **Data Fetching** | [SWR](https://swr.vercel.app/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.dev/) |

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **MySQL** 8.0+ (local or remote)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/runacos.git
cd runacos

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration (see Environment Variables section)

# Push database schema
npm run db:push

# Seed initial data (admin account + default settings)
npm run db:seed

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Build for production (Prisma generate + Next.js build) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:generate` | Regenerate Prisma client |

---

## Project Structure

```
runacos/
├── prisma/
│   ├── schema.prisma           # Database schema (18 models)
│   └── seed.ts                 # Initial data seeding
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── not-found.tsx       # 404 page
│   │   ├── login/              # Staff/admin login
│   │   │
│   │   ├── (site)/             # Public site (Navbar + Footer)
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── (public)/       # Content pages
│   │   │   │   ├── about/
│   │   │   │   ├── alumni/
│   │   │   │   ├── articles/   + [slug]/
│   │   │   │   ├── contact/
│   │   │   │   ├── events/     + [slug]/
│   │   │   │   ├── executives/
│   │   │   │   ├── news/       + [slug]/
│   │   │   │   └── past-questions/
│   │   │   ├── membership/     # Registration flow
│   │   │   ├── dues/           # Payment + receipts
│   │   │   └── frms/           # Fault reporting
│   │   │
│   │   ├── admin/              # Admin dashboard (auth required)
│   │   │   ├── page.tsx        # Dashboard overview
│   │   │   ├── alumni/         # Alumni management
│   │   │   ├── articles/       # Article CRUD
│   │   │   ├── events/         # Event CRUD
│   │   │   ├── executives/     # Executive management
│   │   │   ├── frms/           # Fault management
│   │   │   ├── members/        # Member directory
│   │   │   ├── news/           # News CRUD
│   │   │   ├── pages/          # Dynamic page management
│   │   │   ├── past-questions/ # PQ management
│   │   │   ├── payments/       # Payment verification
│   │   │   ├── settings/       # Site configuration
│   │   │   └── users/          # Staff user management
│   │   │
│   │   └── api/                # 42 API route handlers
│   │       ├── auth/           # NextAuth
│   │       ├── alumni/         # Alumni endpoints
│   │       ├── articles/       # Article CRUD
│   │       ├── contact/        # Contact form
│   │       ├── dashboard/      # Admin stats
│   │       ├── dues/           # Payment endpoints
│   │       ├── events/         # Event CRUD
│   │       ├── executives/     # Executive CRUD
│   │       ├── frms/           # Fault management
│   │       ├── members/        # Member management
│   │       ├── membership/     # Registration
│   │       ├── news/           # News CRUD
│   │       ├── newsletter/     # Newsletter subscription
│   │       ├── pages/          # Dynamic pages
│   │       ├── past-questions/ # PQ management
│   │       ├── paystack/       # Payment gateway
│   │       ├── settings/       # Configuration
│   │       ├── upload/         # File uploads
│   │       └── users/          # User management
│   │
│   ├── components/
│   │   ├── layout/             # Navbar, Footer
│   │   ├── home/               # Homepage sections
│   │   ├── ui/                 # Shared UI components
│   │   ├── providers/          # React providers
│   │   ├── membership/         # Membership card
│   │   ├── news/               # News card
│   │   └── dues/               # Receipt component
│   │
│   ├── lib/
│   │   ├── auth.ts             # NextAuth config
│   │   ├── prisma.ts           # Database client
│   │   ├── email.ts            # Resend emails
│   │   ├── brevo.ts            # Brevo bulk emails
│   │   ├── upload.ts           # File upload utility
│   │   ├── utils.ts            # Formatting helpers
│   │   ├── constants.ts        # App constants
│   │   ├── level.ts            # Level computation
│   │   ├── reference-id.ts     # FRMS reference IDs
│   │   └── validations/        # Zod schemas
│   │
│   ├── hooks/                  # useDebounce, useMediaQuery
│   └── types/                  # TypeScript definitions
│
├── middleware.ts                # Route protection
├── tailwind.config.ts           # Design system
├── next.config.js               # Next.js config
├── UI_SPECIFICATION.md          # UI design spec
├── ARCHITECTURE.md              # Architecture document
└── .env.example                 # Environment template
```

---

## Environment Variables

Create a `.env` file from `.env.example`:

```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/runacos"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Admin Seed Account
ADMIN_EMAIL="admin@runacos.org"
ADMIN_PASSWORD="your-admin-password"

# File Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="vercel_blob_xxxxx"

# Payment Gateway (Paystack)
PAYSTACK_SECRET_KEY="sk_test_xxxxx"

# Transactional Email (Resend)
RESEND_API_KEY="re_xxxxx"

# Bulk Email (Brevo) — Optional
BREVO_SMTP_LOGIN="your-brevo-login@smtp-brevo.com"
BREVO_SMTP_KEY="xsmtpsib-xxxxx"
```

| Variable | Required | Description |
|----------|---------|-------------|
| `DATABASE_URL` | Yes | MySQL connection string |
| `NEXTAUTH_URL` | Yes | Application URL |
| `NEXTAUTH_SECRET` | Yes | Secret for JWT signing |
| `ADMIN_EMAIL` | Yes | Default admin email (used during seeding) |
| `ADMIN_PASSWORD` | Yes | Default admin password |
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob storage token |
| `PAYSTACK_SECRET_KEY` | Yes | Paystack API secret key |
| `RESEND_API_KEY` | Yes | Resend email API key |
| `BREVO_SMTP_LOGIN` | No | Brevo SMTP username (for bulk email) |
| `BREVO_SMTP_KEY` | No | Brevo SMTP password |

---

## Database

### Schema Overview

The database contains **18 models**:

| Model | Purpose |
|-------|---------|
| `User` | Admin/staff accounts (ADMIN, STAFF roles) |
| `Account` | OAuth data (NextAuth) |
| `Session` | Session tokens (NextAuth) |
| `Member` | Registered student members |
| `DuesPayment` | Per-session payment records |
| `Executive` | Executive council members |
| `News` | News articles |
| `Event` | Events with dates and location |
| `EventRegistration` | Event attendee registrations |
| `Article` | Long-form articles |
| `Fault` | Fault/issue reports |
| `FaultCategory` | Fault type categories |
| `FaultStatusHistory` | Audit trail for fault status changes |
| `PastQuestion` | Exam question files |
| `ContactSubmission` | Contact form entries |
| `NewsletterSubscriber` | Email newsletter list |
| `SiteSetting` | Key-value runtime configuration |

### Key Relationships

```
Member ──< DuesPayment       (one member, many payments)
Member ──< Executive         (one member, one executive record)
Event ──< EventRegistration  (one event, many registrations)
Fault ──> FaultCategory      (many faults, one category)
Fault ──< FaultStatusHistory (one fault, many status changes)
Fault ──> User               (assigned staff member)
```

### Database Commands

```bash
# Push schema changes to database
npm run db:push

# Seed with default data
npm run db:seed

# Open Prisma Studio GUI
npm run db:studio

# Regenerate Prisma client after schema changes
npm run db:generate
```

### Seeded Data

Running `npm run db:seed` creates:

- Default admin user (from `ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- FRMS fault categories (Electrical, Plumbing, Internet, Furniture, etc.)
- Site settings (academic session, dues amount, mailing preferences)
- Page hero content for all public pages

---

## API Reference

### Public Endpoints (No Auth)

#### Membership

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/membership/register` | Register new member |
| GET | `/api/membership/check?email=&matric=` | Check for duplicates |
| GET | `/api/membership/card/[memberId]` | Get card data |

#### Dues & Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/dues` | Initiate payment (email + session) |
| GET | `/api/dues?email=` | List payments for member |
| GET | `/api/dues/receipt/[reference]` | Get receipt data |
| POST | `/api/paystack/webhook` | Paystack webhook callback |

#### Content

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news?category=&page=&limit=` | List published news |
| GET | `/api/news/[id]` | Get single news (by ID or slug) |
| GET | `/api/events?status=&type=upcoming\|past` | List events |
| GET | `/api/events/[id]` | Get single event |
| POST | `/api/events/[id]/register` | Register for event |
| GET | `/api/articles?category=&page=&limit=` | List articles |
| GET | `/api/articles/[id]` | Get single article |
| GET | `/api/executives` | List active executives |
| GET | `/api/alumni` | List alumni |
| GET | `/api/past-questions?department=&page=` | List past questions |
| GET | `/api/past-questions/[id]/download` | Download file |

#### FRMS (Fault Reporting)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/frms/report` | Submit fault report |
| GET | `/api/frms/track/[referenceId]` | Track fault status |

#### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |
| POST | `/api/newsletter` | Subscribe to newsletter |
| GET | `/api/carousel` | Get homepage slides |
| GET | `/api/pages/[slug]` | Get page hero content |
| GET | `/api/settings` | Get public settings |

### Admin Endpoints (Auth Required)

All admin endpoints require a valid session. Send requests with the session cookie.

#### Content CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/news` | Create news |
| PUT | `/api/news/[id]` | Update news |
| DELETE | `/api/news/[id]` | Delete news |
| POST | `/api/events` | Create event |
| PUT | `/api/events/[id]` | Update event |
| DELETE | `/api/events/[id]` | Delete event |
| POST | `/api/articles` | Create article |
| PUT | `/api/articles/[id]` | Update article |
| DELETE | `/api/articles/[id]` | Delete article |

#### Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/members?search=&page=&limit=` | List members |
| PUT | `/api/members/[id]` | Update member |
| DELETE | `/api/members/[id]` | Delete member |
| PATCH | `/api/alumni` | Toggle alumni status |
| GET | `/api/dues/[id]` | Get payment detail |
| PATCH | `/api/dues/[id]` | Manually verify payment |
| POST | `/api/executives` | Create executive |
| PUT | `/api/executives/[id]` | Update executive |
| DELETE | `/api/executives/[id]` | Delete executive |
| GET/POST | `/api/frms` | List/create faults |
| PUT | `/api/frms/[id]` | Update fault (status, assignment, notes) |
| DELETE | `/api/frms/[id]` | Delete fault |

#### Administration

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/users` | List/create staff users |
| PUT/DELETE | `/api/users/[id]` | Manage users |
| POST | `/api/upload` | Upload files |
| POST | `/api/settings` | Update site settings |
| GET | `/api/dashboard` | Dashboard statistics |
| GET | `/api/newsletter` | List newsletter subscribers |

### Response Format

All API responses follow this structure:

```json
// Success
{
  "data": { ... },
  "message": "Optional success message"
}

// Success (paginated)
{
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 9,
    "totalPages": 12
  }
}

// Error
{
  "error": "Error description",
  "details": [ ... ]  // Optional (validation errors)
}
```

---

## Authentication

### How It Works

- Uses **NextAuth v5** with the **Credentials** provider
- **JWT** session strategy (stateless, no DB session lookups)
- Passwords hashed with **bcryptjs**
- Two roles: `ADMIN` (full access) and `STAFF` (limited)

### Login

Navigate to `/login` and sign in with email/password. The default admin account is created during seeding.

### Route Protection

| Area | Protection |
|------|-----------|
| `/admin/*` | Redirects to `/login` if not authenticated |
| `/admin/users` | Restricted to `ADMIN` role only |
| Admin API routes | Returns 401 if not authenticated |
| Public pages | No authentication required |

### Session

The session object contains:

```typescript
{
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
  }
}
```

---

## Payment Integration

### Paystack Setup

1. Create a [Paystack](https://paystack.com/) account
2. Get your **Secret Key** from the Paystack dashboard
3. Set `PAYSTACK_SECRET_KEY` in `.env`
4. Configure the webhook URL in Paystack dashboard: `https://yourdomain.com/api/paystack/webhook`

### Payment Flow

1. Member looks up their profile on `/dues/pay`
2. System shows current session, dues amount, and payment history
3. Member clicks "Pay Now" → redirected to Paystack checkout
4. On successful payment, Paystack sends a webhook to `/api/paystack/webhook`
5. Webhook verifies HMAC-SHA512 signature and updates payment status
6. Member is redirected to the receipt page

### Payment Reference Format

```
{PREFIX}-{SESSION}-{NANOID}
Example: RUNACOS-2025_2026-a1b2c3d4e5
```

### Admin Payment Management

- View all payments at `/admin/payments`
- Filter by session and status
- Manually verify payments (for bank transfers, cash, etc.)
- Export payment data to CSV

---

## Email Services

### Dual Email System

| Service | Use Case | Configuration |
|---------|----------|--------------|
| **Resend** | Transactional (fault notifications) | `RESEND_API_KEY` |
| **Brevo** | Bulk/newsletter (content notifications) | `BREVO_SMTP_LOGIN` + `BREVO_SMTP_KEY` |

### Automatic Notifications

Emails are sent automatically when:

- **Content published**: New news, event, or article published → email to configured recipients
- **Fault status change**: Status update → email to the fault reporter

### Mailing Configuration

Configure in admin settings (`/admin/settings`):

| Setting | Description |
|---------|-------------|
| Send to Subscribers | Email newsletter subscribers |
| Send to Members | Email registered (non-alumni) members |
| Send to Alumni | Email alumni members |

### Brevo Setup

1. Create a [Brevo](https://www.brevo.com/) account
2. Enable SMTP relay in your Brevo dashboard
3. Get SMTP credentials
4. Set `BREVO_SMTP_LOGIN` and `BREVO_SMTP_KEY` in `.env`

---

## File Uploads

Files are stored in **Vercel Blob** with the following limits:

| Type | Max Size | Formats |
|------|---------|---------|
| Images | 5 MB | JPEG, PNG, GIF, WebP |
| Videos | 50 MB | MP4, WebM |
| Documents | 10 MB | PDF, DOCX, PPTX |

### Upload Endpoint

```
POST /api/upload
Content-Type: multipart/form-data

Body: file (File), type ("image" | "video" | "document" | "json")
Response: { url: "https://..." }
```

---

## Admin Dashboard

### Accessing Admin

1. Navigate to `/login`
2. Sign in with admin credentials
3. You'll be redirected to `/admin`

### Admin Sections

| Section | Path | Description |
|---------|------|-------------|
| Dashboard | `/admin` | Overview statistics, recent activity |
| Pages | `/admin/pages` | Edit page hero content |
| Executives | `/admin/executives` | Manage executive council |
| FRMS | `/admin/frms` | Manage fault reports |
| News | `/admin/news` | Create/edit/publish news |
| Events | `/admin/events` | Create/edit/publish events |
| Articles | `/admin/articles` | Create/edit/publish articles |
| Past Questions | `/admin/past-questions` | Upload/manage exam papers |
| Members | `/admin/members` | View/manage registered members |
| Payments | `/admin/payments` | View/verify dues payments |
| Alumni | `/admin/alumni` | Manage alumni status |
| Contact | `/admin/contact` | View contact form submissions |
| Users | `/admin/users` | Manage staff accounts (ADMIN only) |
| Settings | `/admin/settings` | Site configuration, mailing preferences |

---

## Design System

The application uses a custom design system built on Tailwind CSS. See [UI_SPECIFICATION.md](./UI_SPECIFICATION.md) for the complete specification.

### Key Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Navy-800 | `#0B2C4D` | Primary brand color |
| Electric | `#3B82F6` | Accent, active states |
| Cyan | `#06B6D4` | Secondary accent |
| Midnight | `#040D19` | Hero backgrounds |
| Surface-0 | `#FFFFFF` | Card backgrounds |
| Surface-1 | `#F8FAFC` | Section backgrounds |

### Typography

- **Headings**: Space Grotesk (bold, geometric)
- **Body**: Inter (clean, readable)
- **Data/Code**: JetBrains Mono (monospace)

### Component Patterns

- Cards with `rounded-xl border-surface-3 shadow-sm`
- Buttons with hover scale + shadow elevation
- Page transitions with Framer Motion fade-up
- Scroll-triggered stagger animations
- Glassmorphism navbar on scroll
- Toast notifications via sonner

---

## Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker (Optional)

The `standalone` output mode produces a self-contained build:

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

### Environment Checklist

Before deploying, ensure:

- [ ] `DATABASE_URL` points to production MySQL
- [ ] `NEXTAUTH_URL` matches your domain
- [ ] `NEXTAUTH_SECRET` is a strong random string
- [ ] `PAYSTACK_SECRET_KEY` is your live key (not test)
- [ ] Paystack webhook URL is configured: `https://yourdomain.com/api/paystack/webhook`
- [ ] `BLOB_READ_WRITE_TOKEN` is set
- [ ] `RESEND_API_KEY` is set
- [ ] Database is migrated: `npm run db:push`
- [ ] Database is seeded: `npm run db:seed`

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set all environment variables in the Vercel dashboard under Project Settings > Environment Variables.

---

## Documentation

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | This file — project overview and setup |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, data model, API design, security |
| [UI_SPECIFICATION.md](./UI_SPECIFICATION.md) | Design tokens, component specs, page layouts, animations |
| [.env.example](./.env.example) | Environment variable template |

---

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure `npm run lint` passes
4. Test your changes locally
5. Submit a pull request

### Code Conventions

- TypeScript strict mode
- Zod validation on all API inputs
- Prisma for all database operations
- Tailwind CSS for styling (no inline styles)
- Framer Motion for animations
- lucide-react for icons
- sonner for toast notifications
- `font-heading` for headlines, `font-mono` for data

---

## License

This project is proprietary software developed for the Redeemer's University Association of Computer Science Students (RUNACOS). All rights reserved.
