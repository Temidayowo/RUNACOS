# RUNACOS Website — Full Site Details

**Redeemer's University Association of Computer Science Students**
A full-featured organizational web platform built with Next.js 14.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Public Pages](#public-pages)
4. [Admin Dashboard Pages](#admin-dashboard-pages)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Features In Detail](#features-in-detail)
8. [Email System](#email-system)
9. [File Upload System](#file-upload-system)
10. [Authentication & Roles](#authentication--roles)
11. [Environment Variables](#environment-variables)
12. [Build & Deployment](#build--deployment)

---

## Project Overview

RUNACOS is the official web platform for the Association of Computer Science Students at Redeemer's University, Ede, Nigeria. It serves as a central hub for:

- News, events, and articles publication
- Membership registration and digital membership cards
- Fault Reporting & Management System (FRMS)
- Past exam questions repository
- Alumni management
- Executive and staff directory
- Newsletter and email distribution

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | MySQL via Prisma ORM |
| Authentication | NextAuth.js v5 (Credentials + JWT) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Email | Nodemailer (Gmail SMTP) |
| File Storage | Local / S3-compatible (Cloudflare R2, Tigris) |
| Validation | Zod |
| Data Fetching | SWR |
| UI Components | Lucide React icons, Sonner toasts |
| QR Codes | `qrcode` (generation), `html5-qrcode` (scanning) |
| ID Generation | nanoid |
| Password Hashing | bcryptjs |

---

## Public Pages

### General Pages

| Route | Description |
|---|---|
| `/` | Homepage |
| `/about` | About RUNACOS — organization overview |
| `/contact` | Contact form for public enquiries |
| `/privacy-policy` | Privacy policy |
| `/terms-of-service` | Terms and conditions |
| `/constitution` | RUNACOS constitution document |
| `/voting` | Voting platform (Coming Soon) |

### News & Content

| Route | Description |
|---|---|
| `/news` | News listing with pagination |
| `/news/[slug]` | Individual news article |
| `/articles` | Articles listing with pagination |
| `/articles/[slug]` | Individual article page |
| `/events` | Events listing |
| `/events/[slug]` | Event detail page with registration |

### Community

| Route | Description |
|---|---|
| `/alumni` | Alumni directory |
| `/executives` | Current executive board |
| `/staff` | Staff directory |
| `/past-questions` | Past exam questions (searchable by department, course, year) |

### Membership

| Route | Description |
|---|---|
| `/membership` | 4-step membership registration form |
| `/membership/card/[memberId]` | View & download digital membership card |

### Fault Reporting (FRMS)

| Route | Description |
|---|---|
| `/frms/report` | Submit a fault report |
| `/frms/track` | Track a fault by reference ID |
| `/frms/track/[referenceId]` | View fault status and timeline |

### Newsletter

| Route | Description |
|---|---|
| `/newsletter/unsubscribe` | Unsubscribe from newsletter emails |

---

## Admin Dashboard Pages

All admin pages are protected and require login. Some are ADMIN-role only.

### Dashboard

| Route | Description |
|---|---|
| `/admin` | Main dashboard with KPIs: total faults by status, content counts, members, alumni, unread messages |

### Content Management

| Route | Description |
|---|---|
| `/admin/news` | List, search, and manage news articles |
| `/admin/news/new` | Create new news article |
| `/admin/news/[id]/edit` | Edit existing news article |
| `/admin/articles` | List and manage articles |
| `/admin/articles/new` | Create new article |
| `/admin/articles/[id]/edit` | Edit article |
| `/admin/events` | List and manage events |
| `/admin/events/new` | Create new event |
| `/admin/events/[id]/edit` | Edit event |
| `/admin/events/check-in` | QR code scanner for event attendee check-in |
| `/admin/past-questions` | Manage past questions repository |
| `/admin/past-questions/new` | Upload new past question |
| `/admin/past-questions/[id]/edit` | Edit past question entry |

### Community Management

| Route | Description |
|---|---|
| `/admin/members` | View and manage registered members |
| `/admin/alumni` | Alumni management with auto-detect and CSV import |
| `/admin/executives` | Manage executive board members |
| `/admin/staff` | Manage staff directory |

### System Management

| Route | Description |
|---|---|
| `/admin/users` | User account management (ADMIN only) |
| `/admin/frms` | Fault reports dashboard and listing |
| `/admin/frms/[id]` | Fault detail: update status, assign staff, add notes |
| `/admin/contact` | View and manage contact form submissions |
| `/admin/pages` | Manage dynamic pages |
| `/admin/settings` | Site-wide configuration (academic session, social links, mailing preferences) |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/auth/[...nextauth]` | NextAuth.js handler |

### News
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/news` | Public | List published news |
| POST | `/api/news` | Staff | Create news article |
| GET | `/api/news/[id]` | Public | Get single article |
| PUT | `/api/news/[id]` | Staff | Update article |
| DELETE | `/api/news/[id]` | Staff | Delete article |

### Articles
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/articles` | Public | List published articles |
| POST | `/api/articles` | Staff | Create article |
| GET | `/api/articles/[id]` | Public | Get single article |
| PUT | `/api/articles/[id]` | Staff | Update article |
| DELETE | `/api/articles/[id]` | Staff | Delete article |

### Events
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/events` | Public | List events |
| POST | `/api/events` | Staff | Create event |
| GET | `/api/events/[id]` | Public | Get single event |
| PUT | `/api/events/[id]` | Staff | Update event |
| DELETE | `/api/events/[id]` | Staff | Delete event |
| POST | `/api/events/[id]/register` | Public | Register for event (sends QR code email) |
| GET | `/api/events/[id]/register` | Staff | List event registrations |

### Fault Reporting (FRMS)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/frms/report` | Public | Submit fault report (sends confirmation email) |
| GET | `/api/frms` | Staff | List all fault reports |
| GET | `/api/frms/[id]` | Staff | Get fault detail |
| PUT | `/api/frms/[id]` | Staff | Update fault (status, assignment, notes) |
| DELETE | `/api/frms/[id]` | Staff | Delete fault |
| GET | `/api/frms/track/[referenceId]` | Public | Track fault by reference ID |
| GET | `/api/frms/categories` | Staff | List fault categories |

### Membership
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/membership/register` | Public | Register new member (sends welcome email) |
| POST | `/api/membership/check` | Public | Check for duplicate email/matric number |
| GET | `/api/membership/card/[memberId]` | Public | View membership card data |

### Alumni
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/alumni` | Public / Staff | List alumni (public: active only; `?admin=true`: all with eligibility) |
| PATCH | `/api/alumni` | Staff | Toggle alumni status for a member |
| POST | `/api/alumni/import` | Staff | Bulk import alumni via CSV (matric numbers) |

### Members
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/members` | Staff | List all members |
| PATCH | `/api/members/[id]` | Staff | Update member (e.g. alumni toggle) |

### Newsletter
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/newsletter` | Public | Subscribe to newsletter |
| GET | `/api/newsletter` | Staff | List all subscribers |
| POST | `/api/newsletter/unsubscribe` | Public | Unsubscribe by email |

### Past Questions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/past-questions` | Public | List with filtering (department, course, year, search, pagination) |
| POST | `/api/past-questions` | Staff | Upload past question |
| GET | `/api/past-questions/[id]` | Public | Get single entry |
| PUT | `/api/past-questions/[id]` | Staff | Update entry |
| DELETE | `/api/past-questions/[id]` | Staff | Delete entry |
| GET | `/api/past-questions/[id]/download` | Public | Download file (increments download counter) |

### Executives & Staff
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/executives` | Public | List active executives |
| POST | `/api/executives` | Staff | Add executive |
| PUT | `/api/executives/[id]` | Staff | Update executive |
| DELETE | `/api/executives/[id]` | Staff | Remove executive |
| GET | `/api/staff` | Public | List active staff |
| POST | `/api/staff` | Staff | Add staff member |
| PUT | `/api/staff/[id]` | Staff | Update staff member |
| DELETE | `/api/staff/[id]` | Staff | Remove staff member |

### Contact
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/contact` | Public | Submit contact message |
| GET | `/api/contact` | Staff | List all contact submissions |
| PUT | `/api/contact/[id]` | Staff | Mark as read |
| DELETE | `/api/contact/[id]` | Staff | Delete submission |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | List admin/staff accounts |
| POST | `/api/users` | Admin | Create new user account |
| PUT | `/api/users/[id]` | Admin | Update user |
| DELETE | `/api/users/[id]` | Admin | Delete user |

### Utilities
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/upload` | Public/Staff | Upload file (image, PDF, video, document) |
| POST | `/api/checkin` | Staff | QR check-in for event attendee |
| GET | `/api/checkin` | Staff | Look up registration by ID |
| GET | `/api/dashboard` | Staff | Dashboard statistics |
| GET | `/api/settings` | Public | Get site settings |
| PUT | `/api/settings` | Admin | Update site settings |
| GET | `/api/carousel` | Public | Get carousel/hero image settings |

---

## Database Schema

### User
| Field | Type | Notes |
|---|---|---|
| id | String | Primary key |
| name | String? | |
| email | String | Unique |
| password | String? | bcrypt hashed |
| role | String | Default: `"STAFF"` |
| image | String? | |
| createdAt, updatedAt | DateTime | |

### Member
| Field | Type | Notes |
|---|---|---|
| id | String | Primary key |
| memberId | String | Unique, format: `RUN-CS-YYYY-XXXX` |
| firstName, lastName | String | |
| email | String | Unique, must be `@run.edu.ng` |
| phone | String | |
| matricNumber | String | Unique |
| level | String | 100–500 |
| gender | String | |
| department | String? | |
| faculty | String? | |
| stateOfOrigin | String | |
| admissionYear | Int? | Used for alumni eligibility |
| academicSession | String? | e.g. `2025/2026` |
| semester | String? | First / Second |
| passportUrl | String | |
| isAlumni | Boolean | Default: false |
| alumniSince | DateTime? | |
| createdAt, updatedAt | DateTime | |

### Executive
| Field | Type | Notes |
|---|---|---|
| id | String | Primary key |
| name | String | |
| position | String | |
| image | String? | |
| email | String? | |
| phone | String? | |
| bio | String? | |
| linkedin, twitter, instagram | String? | Social links |
| order | Int | Display order |
| active | Boolean | Default: true |
| memberId | String? | Optional link to Member |
| impeachedAt | DateTime? | |
| impeachReason | String? | |

### Staff
| Field | Type | Notes |
|---|---|---|
| id | String | Primary key |
| name | String | |
| title | String? | |
| specialty | String? | |
| department | String? | |
| email | String? | |
| phone | String? | |
| image | String? | |
| bio | String? | |
| order | Int | |
| active | Boolean | Default: true |

### News / Article
| Field | Type | Notes |
|---|---|---|
| id | String | Primary key |
| title | String | |
| slug | String | Unique, URL-friendly |
| content | LongText | Rich HTML content |
| excerpt | String? | Short preview |
| coverImage | String? | |
| category | String? | |
| author | String? | |
| status | Enum | `DRAFT` / `PUBLISHED` |
| publishedAt | DateTime? | |

### Event
| Field | Type | Notes |
|---|---|---|
| id | String | Primary key |
| title | String | |
| slug | String | Unique |
| description | LongText? | |
| coverImage | String? | |
| location | String? | |
| eventDate | DateTime | |
| endDate | DateTime? | |
| status | Enum | `DRAFT` / `PUBLISHED` |

### EventRegistration
| Field | Type | Notes |
|---|---|---|
| id | String | Primary key, used as QR check-in code |
| eventId | String | FK → Event |
| name | String | |
| email | String | |
| phone | String? | |
| checkedIn | Boolean | Default: false |
| checkedInAt | DateTime? | |

### Fault (FRMS)
| Field | Type | Notes |
|---|---|---|
| id | String | Primary key |
| referenceId | String | Unique, format: `FRMS-YYYY-XXXXXX` |
| name | String | Reporter name |
| email | String | Reporter email |
| phone | String? | |
| location | String | |
| categoryId | String | FK → FaultCategory |
| description | String | |
| fileUrl | String? | Optional attachment |
| status | Enum | `OPEN` / `IN_PROGRESS` / `RESOLVED` / `CLOSED` |
| assignedStaffId | String? | FK → User |
| adminNotes | String? | Internal notes |

### FaultStatusHistory
| Field | Type | Notes |
|---|---|---|
| id | String | Primary key |
| faultId | String | FK → Fault |
| status | String | New status |
| note | String? | Change note |
| changedBy | String? | FK → User |
| createdAt | DateTime | |

### FaultCategory
| Field | Type | Notes |
|---|---|---|
| id | String | Primary key |
| name | String | Unique |
| description | String? | |

### PastQuestion
| Field | Type | Notes |
|---|---|---|
| id | String | Primary key |
| title | String | |
| description | String? | |
| department | String | |
| course | String | |
| year | Int | |
| fileUrl | String | |
| fileName | String | |
| fileSize | Int | Bytes |
| fileType | String | MIME type |
| downloads | Int | Default: 0 |

### NewsletterSubscriber
| Field | Type | Notes |
|---|---|---|
| id | String | Primary key |
| email | String | Unique |
| name | String? | |
| active | Boolean | Default: true |
| subscribedAt | DateTime | |
| unsubscribedAt | DateTime? | |

### ContactSubmission
| Field | Type | Notes |
|---|---|---|
| id | String | Primary key |
| name | String | |
| email | String | |
| subject | String | |
| message | String | |
| isRead | Boolean | Default: false |
| createdAt | DateTime | |

### SiteSetting
| Field | Type | Notes |
|---|---|---|
| id | String | Primary key |
| key | String | Unique setting key |
| value | LongText | Setting value |

**Known setting keys:**
- `academic_session` — e.g. `2025/2026`
- `current_semester` — `First` / `Second`
- `social_twitter` — Twitter/X profile URL
- `social_instagram` — Instagram profile URL
- `social_linkedin` — LinkedIn profile URL
- `mail_to_subscribers` — `"true"` / `"false"`
- `mail_to_members` — `"true"` / `"false"`
- `mail_to_alumni` — `"true"` / `"false"`

---

## Features In Detail

### Membership Registration
- 4-step form: Personal Info → Academic Details → Passport Photo Upload → Review
- Email must be a valid Redeemer's University address (`@run.edu.ng`)
- Duplicate check on email and matric number before submission
- Auto-generated Member ID format: `RUN-CS-YYYY-XXXX`
- Passport photo uploaded to storage before form completion
- Welcome email sent with embedded digital membership card

### Digital Membership Card
- Accessible at `/membership/card/[memberId]`
- Displays: name, matric number, level, department, faculty, member ID, issued date
- Downloadable via `html2canvas`
- Also embedded as an HTML table in the welcome email

### Fault Reporting & Management System (FRMS)
- Public can submit faults with: location, category, description, optional file attachment
- Auto-generates reference ID (format: `FRMS-YYYY-XXXXXX`)
- Confirmation email sent immediately with reference ID and tracking link
- Public tracking page shows fault status and full history timeline
- Admin can: update status, assign staff, add internal notes
- Email notification sent to reporter on every status change
- Status flow: `OPEN` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`

### Event Registration & Check-in
- Public can register for events via the event detail page
- Registration confirmation email includes a QR code (via QR Server API)
- Admin check-in page at `/admin/events/check-in` scans QR codes to mark attendees
- Registrations are tracked per event with check-in timestamps

### Alumni Management
- Alumni status tracked per member (`isAlumni`, `alumniSince`)
- **Auto-detect**: calculates eligibility based on `admissionYear` and the end year of the current academic session (eligible if `sessionEnd - admissionYear >= 4`)
- **CSV import**: admin uploads a CSV of matric numbers; system bulk-marks matching members as alumni and reports not-found matric numbers
- **Manual toggle**: individual alumni status toggle per member

### Newsletter & Email Distribution
- Users can subscribe via any page footer
- Admin configures which groups receive emails: subscribers, active members, alumni
- Bulk email sent in batches of 50 (BCC for recipient privacy)
- All content emails include an unsubscribe link pointing to `/newsletter/unsubscribe`

### Past Questions Repository
- Filterable by department, course, year
- Full-text search
- Paginated listing
- Download counter per file
- Supported formats: PDF, DOCX, PPTX

### Content Publishing
- News, Articles, and Events support `DRAFT` / `PUBLISHED` status
- Only `PUBLISHED` content is shown on the public site
- When content is published, a newsletter email is automatically sent to configured recipients

---

## Email System

All emails use **Gmail SMTP via Nodemailer** (`GMAIL_USER` + `GMAIL_APP_PASSWORD`).

| Email | Trigger | Recipients |
|---|---|---|
| Member welcome | Membership registration | Registrant |
| Fault confirmation | Fault report submitted | Reporter |
| Fault status update | Admin changes fault status | Reporter |
| Event registration | User registers for event | Registrant (includes QR code) |
| Content newsletter | News/article/event published | Configured groups |

Email sending is fire-and-forget (`.catch(console.error)`) so failures do not break the user-facing flow.

---

## File Upload System

**API endpoint:** `POST /api/upload`
- Form fields: `file` (File), `folder` (string)

**Storage providers** (configured via `STORAGE_PROVIDER` env var):
- `local` (default) — files saved to `/public/uploads/`
- `s3` — files uploaded to S3-compatible storage (Cloudflare R2, Tigris, AWS S3)

**Supported file types and limits:**

| Type | Formats | Max Size |
|---|---|---|
| Image | JPEG, PNG, GIF, WebP | 5 MB |
| Video | MP4, WebM | 50 MB |
| Document | PDF, DOCX, PPTX | 10 MB |

**Upload folders:**
- `frms` — fault report attachments (public, no auth required)
- `passports` — member passport photos (public, no auth required)
- `uploads` — admin content uploads (requires authentication)

---

## Authentication & Roles

**Provider:** NextAuth.js v5 with Credentials (email + password)

**Roles:**

| Role | Access |
|---|---|
| `STAFF` | All admin pages except user management |
| `ADMIN` | Full access including user management and all settings |

**Session data available:**
```
session.user {
  id: string
  email: string
  name: string
  role: "STAFF" | "ADMIN"
}
```

**Route protection** (via `middleware.ts`):
- All `/admin/*` routes require authentication
- `/admin/users` requires `ADMIN` role
- Unauthenticated requests are redirected to `/login`

---

## Environment Variables

### Required

| Variable | Description |
|---|---|
| `DATABASE_URL` | MySQL connection string |
| `NEXTAUTH_URL` | Full application URL (e.g. `https://runacos.org`) |
| `NEXTAUTH_SECRET` | Secret for JWT signing |
| `ADMIN_EMAIL` | Initial admin account email (used in seed) |
| `ADMIN_PASSWORD` | Initial admin account password (used in seed) |

### Email (Required for email features)

| Variable | Description |
|---|---|
| `GMAIL_USER` | Gmail address used to send emails |
| `GMAIL_APP_PASSWORD` | Gmail App Password (not account password) |

### File Storage (Required if using S3)

| Variable | Description |
|---|---|
| `STORAGE_PROVIDER` | Set to `s3` to use S3-compatible storage |
| `S3_ENDPOINT` | S3 endpoint URL |
| `S3_ACCESS_KEY_ID` | S3 access key |
| `S3_SECRET_ACCESS_KEY` | S3 secret key |
| `S3_BUCKET` | Bucket name |
| `S3_PUBLIC_URL` | Public base URL for uploaded files |

---

## Build & Deployment

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Generate Prisma client, push schema, seed DB, build Next.js |
| `npm run start` | Start production server |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:migrate` | Create and run a migration |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |

### Build sequence (production)
1. `prisma generate` — generate Prisma client
2. `prisma db push --accept-data-loss` — sync schema to DB
3. `tsx prisma/seed.ts` — seed initial data (admin user, settings, fault categories)
4. `next build` — build the Next.js application

### Docker
Docker and Docker Compose configuration files are included for containerized deployment.

---

*RUNACOS — Redeemer's University Association of Computer Science Students*
