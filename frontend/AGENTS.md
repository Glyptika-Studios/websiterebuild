# Next.js 15 Coding Guide & Patterns

This repository contains a modern Next.js 15 application utilizing the App Router, React 19, TypeScript, and Tailwind CSS v4. When working on this codebase, adhere to the following architectural guidelines:

---

## 1. Directory Structure

All frontend files reside in the `frontend/` folder:
- **`src/app/`**: Next.js App Router folders.
  - `(public)/`: Publicly accessible pages.
  - `admin/`: CMS admin pages.
  - `admin/(protected)/`: Protected admin layouts and views.
  - `api/`: Route Handlers (no Hono, no Edge Functions; raw Serverless Next.js API routes).
- **`src/components/`**: Modular components.
  - `layout/`: Global elements (Header, Footer, Navigation).
  - `ui/`: Design primitives.
  - `public/` & `admin/`: Section-specific layouts.
- **`src/lib/`**: Utilities, Supabase instances, validation, and actions.
  - `supabase/`: Auth clients for server/client context.
  - `validators/`: Zod input schemas for forms and API routes.

---

## 2. Server Components vs. Client Components

- **Server Components (Default)**: Use for data fetching, SEO layout metadata, and initial page structures.
- **Client Components (`"use client"`)**: Keep restricted to components requiring user interaction (forms with `react-hook-form`, Framer Motion animations, media players, modals, etc.).
- **Data Fetching**: Fetch data in Server Components or API routes where possible. Avoid calling internal Next.js API routes (`/api/...`) from Server Components; query the database directly or use standard server actions instead.

---

## 3. Styling & Tailwind CSS v4

- Tailwind CSS v4 is used with postCSS. 
- Custom styles are imported in `src/app/globals.css`.
- Avoid arbitrary inline utility abuse. Create clean components with Tailwind utility groupings and use `clsx` + `tailwind-merge` for class resolution.

---

## 4. Supabase SSR Auth

- **Server Client**: Use the `createServerClient` helper from `@supabase/ssr` (inside `src/lib/supabase/server.ts`) to read/write auth sessions in server components, API routes, and middleware.
- **Browser Client**: Use `createBrowserClient` (inside `src/lib/supabase/client.ts`) for interactive client-side operations.
- **Session Protection**: Admin pages `/admin/*` are protected server-side via Next.js Middleware in `src/middleware.ts`. Do not rely solely on client-side state checks.

---

## 5. Security Principles

1. **API Guarding**: Every admin Route Handler under `api/admin/*` must call `requireAuth()` as its very first operation. Return `401 Unauthorized` if no session exists.
2. **Schema Validation**: Validate any request payload with Zod schemas from `src/lib/validators/` before doing database writes.
3. **No Secrets in Client**: Never prefix secret keys with `NEXT_PUBLIC_`. Keep them in `.env.local` to remain strictly server-side.


Glyptika Website — Rebuild Master Specification
---
Why a clean rebuild
The original codebase had fundamental architectural problems that cannot be patched: credentials
in source code, an unauthenticated admin creation endpoint, a KV blob store used as a database,
and a deployment system that was entirely non-functional due to duplicate JSON keys. Patching these
would cost more time than starting fresh, and a trainee team touching that code would spread the
bad patterns further. This document specifies what the new site must be.
---
1. Architecture decision
Frontend: Next.js 15 (App Router) — not Vite + React
The original site was a Vite SPA. That caused two real problems for a company website:
SEO: A Vite SPA serves a blank HTML shell. Search engines see nothing until JavaScript runs.
Every page on glyptika.com — Insights, Team, Careers, Products — needs to be indexed. Next.js
serves fully rendered HTML on first load, which is what search engines and social media link
previews need.
No separate backend needed: Next.js Route Handlers (in `app/api/`) replace Hono + Supabase
Edge Functions entirely. The frontend and API live in one codebase, one deployment, one repo.
This is simpler for a team of three trainees than managing a separate Edge Function project.
Backend: Next.js Route Handlers (built in, no Hono)
Every API endpoint is a `route.ts` file inside `app/api/`. They are serverless functions that
Vercel runs automatically. No separate server. No Hono. No Deno. No Edge Function project to
manage. The team only needs to know Next.js.
Database: Supabase Postgres (proper tables with RLS)
Keep Supabase for the database — it is a real Postgres instance, the team already has an account,
and the free tier is sufficient for a company website (500 MB database, 1 GB file storage, 50,000
auth MAUs). The difference from the original is that the new site uses real relational tables
with RLS policies, not a single KV blob table.
Auth: Supabase Auth + `@supabase/ssr`
Supabase Auth handles sessions. The `@supabase/ssr` package is the official way to use Supabase
Auth with Next.js. Sessions are stored in httpOnly cookies set server-side — not localStorage,
not sessionStorage. This means the admin token is never accessible to JavaScript on the page.
File storage: Supabase Storage
Same as the original — works well for images and videos. Keep it.
Email: Resend
Same as the original — clean API, generous free tier (3,000 emails/month), used for the proposal
form.
Hosting: Vercel
Same as the original. Next.js is built by Vercel, so deployment is one command. Free Hobby tier
is sufficient for a company site.
---
2. Tech stack summary
Concern	Choice	Notes
Framework	Next.js 15, App Router, TypeScript	SSR/SSG, file-based routing, API routes built in
Styling	Tailwind CSS	Configured at build time — not committed as a static file
Database	Supabase Postgres	Real tables, RLS enabled
Auth	Supabase Auth + `@supabase/ssr`	httpOnly cookies, server-side session
File storage	Supabase Storage	Images, videos, music
Email	Resend	Proposal form emails
Hosting	Vercel	Auto-deploys on push to main
Validation	Zod	Schema validation on every API route input
Forms	React Hook Form	Client-side form state
Animation	Framer Motion	Page transitions, scroll effects
Packages removed from original: Hono, `@jsr/supabase\_\_supabase-js`, react-dnd,
embla-carousel-react (Next.js Image handles most carousel needs), all versioned Vite aliases.
No wildcard versions in package.json. Every dependency is pinned to an exact or caret version.
---
3. Project structure
```
glyptika/
├── app/
│   ├── (public)/               # Public-facing pages
│   │   ├── page.tsx            # Home /
│   │   ├── insights/
│   │   │   ├── page.tsx        # /insights
│   │   │   └── \[id]/page.tsx   # /insights/:id
│   │   ├── team/page.tsx
│   │   ├── careers/page.tsx
│   │   ├── xplor/page.tsx
│   │   ├── ims/page.tsx
│   │   ├── products/page.tsx
│   │   └── request-proposal/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   └── (protected)/        # Route group with auth middleware
│   │       ├── layout.tsx      # Checks session — redirects to login if not found
│   │       ├── dashboard/page.tsx
│   │       ├── posts/page.tsx
│   │       ├── projects/page.tsx
│   │       ├── team/page.tsx
│   │       ├── careers/page.tsx
│   │       ├── users/page.tsx
│   │       ├── xplor/page.tsx
│   │       ├── ims/page.tsx
│   │       ├── contact-settings/page.tsx
│   │       ├── media/page.tsx
│   │       ├── music/page.tsx
│   │       └── audit-logs/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signin/route.ts
│   │   │   └── signout/route.ts
│   │   ├── posts/
│   │   │   ├── route.ts          # GET all
│   │   │   ├── featured/route.ts
│   │   │   └── \[id]/route.ts     # GET by id
│   │   ├── admin/
│   │   │   ├── posts/route.ts        # POST
│   │   │   ├── posts/\[id]/route.ts   # PUT, DELETE
│   │   │   ├── projects/...
│   │   │   ├── positions/...
│   │   │   ├── team/...
│   │   │   ├── users/...
│   │   │   ├── media/route.ts
│   │   │   ├── music/route.ts
│   │   │   ├── page-content/\[page]/route.ts
│   │   │   ├── xplor/route.ts
│   │   │   ├── ims/route.ts
│   │   │   ├── contact-settings/route.ts
│   │   │   └── audit-logs/route.ts
│   │   ├── projects/...           # Public GET
│   │   ├── positions/...          # Public GET
│   │   ├── team/...               # Public GET
│   │   ├── linkedin-posts/...     # Public GET
│   │   ├── xplor/route.ts
│   │   ├── ims/route.ts
│   │   ├── contact-settings/route.ts
│   │   ├── send-proposal/route.ts
│   │   └── health/route.ts
│   ├── layout.tsx              # Root layout — Header, Footer, Music player
│   └── not-found.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── ui/                     # shadcn/ui primitives (installed via CLI)
│   ├── public/                 # Public page sections
│   │   ├── Hero.tsx
│   │   ├── Stats.tsx
│   │   ├── CustomSections.tsx
│   │   ├── MediaCarousel.tsx
│   │   └── ...
│   ├── admin/                  # Admin UI components
│   │   ├── Sidebar.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── MediaUploader.tsx
│   │   ├── PermissionsEditor.tsx
│   │   └── ...
│   └── BackgroundMusic.tsx
├── lib/
│   ├── supabase/
│   │   ├── server.ts           # createServerClient() for Route Handlers and Server Components
│   │   └── client.ts           # createBrowserClient() for Client Components
│   ├── auth.ts                 # requireAuth() — used by every admin Route Handler
│   ├── audit.ts                # logAction() — called after every admin write
│   └── validators/             # Zod schemas for every API route
│       ├── posts.ts
│       ├── team.ts
│       └── ...
├── middleware.ts               # Next.js middleware — protects /admin/\* routes globally
├── .env.local                  # Never committed
├── .gitignore                  # Includes .env\*, dist/, .next/, node\_modules/
└── vercel.json                 # Security headers + rewrites
```
---
4. Security architecture
This is the non-negotiable foundation. Every other feature is built on top of this.
4.1 Environment variables
All secrets live in `.env.local` (never committed). The `.gitignore` includes `.env\*` by default
with Next.js. Variables:
```
NEXT\_PUBLIC\_SUPABASE\_URL=
NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=
SUPABASE\_SERVICE\_ROLE\_KEY=     # Server-side only — never in client code
RESEND\_API\_KEY=                # Server-side only
```
`NEXT\_PUBLIC\_` prefix means the variable is safe to expose to the browser. The anon key is safe
to expose — it is designed for public use. The service role key and Resend key are never prefixed
with `NEXT\_PUBLIC\_` and never touch client-side code.
4.2 Admin session — httpOnly cookies
`@supabase/ssr` sets the session token in an httpOnly cookie on the server. The token is never
in JavaScript memory, never in localStorage, never in sessionStorage. It cannot be stolen by XSS.
4.3 Middleware route protection
`middleware.ts` runs before every request to `/admin/\*`. It checks for a valid Supabase session
using `createServerClient()`. If no valid session exists, it redirects to `/admin/login`.
This is a server-side redirect — the admin page HTML is never sent to an unauthenticated user.
```ts
// middleware.ts — simplified
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(...)
  const { data: { session } } = await supabase.auth.getSession()
  if (!session \&\& request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}
export const config = { matcher: \['/admin/:path\*'] }
```
4.4 API route auth guard
Every admin API route (`app/api/admin/...`) calls `requireAuth()` as its first line.
No exceptions. `requireAuth()` reads the session from the cookie using `createServerClient()`.
If no valid session: returns 401 immediately. If valid session: returns the user object.
```ts
// lib/auth.ts
export async function requireAuth(request: Request) {
  const supabase = createServerClient(...)
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  return session.user
}

// app/api/admin/posts/route.ts
export async function POST(request: Request) {
  const user = await requireAuth(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  // ... rest of handler
}
```
4.5 Input validation
Every API route that accepts a body validates it with a Zod schema before doing anything with it.
Invalid input returns 400 with the validation error. This prevents malformed data from reaching
the database.
4.6 Admin user creation
There is no public signup endpoint. Admin users can only be created by an existing authenticated
admin through the `/admin/users` page. The backend route for this is under `/api/admin/users`
which requires auth (see 4.4). There is no equivalent of the original `/admin/signup` endpoint.
4.7 Permission checks
Each admin user has a permissions object in the database. Protected admin pages check the
authenticated user's permissions server-side and return 403 if the user does not have access to
that section.
4.8 CORS
Next.js Route Handlers on Vercel only accept requests from the same origin by default. No CORS
configuration needed — and no wildcard origin like the original.
4.9 Supabase RLS
Row Level Security is enabled on every table. Public tables (posts, team, positions, etc.) have
a policy that allows `SELECT` for the anon role. All write operations go through the service role
(server-side only) or authenticated admin sessions.
4.10 vercel.json security headers
```json
{
  "headers": \[
    {
      "source": "/(.\*)",
      "headers": \[
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' data: https://\*.supabase.co; media-src 'self' https://\*.supabase.co; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'" }
      ]
    }
  ]
}
```
---
5. Database schema
Real Postgres tables, not a KV store. Supabase generates typed clients from these automatically.
```sql
-- Blog posts and LinkedIn posts
CREATE TABLE posts (
  id          UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),
  type        TEXT NOT NULL CHECK (type IN ('blog', 'linkedin')),
  title       TEXT NOT NULL,
  excerpt     TEXT,
  content     TEXT,
  category    TEXT,
  date        DATE NOT NULL DEFAULT CURRENT\_DATE,
  image\_url   TEXT,
  tags        TEXT\[] DEFAULT '{}',
  featured    BOOLEAN DEFAULT FALSE,
  author\_id   UUID REFERENCES auth.users(id),
  url         TEXT,           -- LinkedIn post URL
  media\_url   TEXT,           -- LinkedIn post thumbnail
  created\_at  TIMESTAMPTZ DEFAULT now(),
  updated\_at  TIMESTAMPTZ DEFAULT now()
);

-- Portfolio projects / products
CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),
  title       TEXT NOT NULL,
  content     TEXT,
  category    TEXT,
  date        DATE DEFAULT CURRENT\_DATE,
  image\_url   TEXT,
  media       JSONB DEFAULT '\[]',   -- \[{url, type: 'image'|'video'}]
  tags        TEXT\[] DEFAULT '{}',
  featured    BOOLEAN DEFAULT FALSE,
  created\_at  TIMESTAMPTZ DEFAULT now(),
  updated\_at  TIMESTAMPTZ DEFAULT now()
);

-- Job postings
CREATE TABLE positions (
  id                UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),
  title             TEXT NOT NULL,
  department        TEXT NOT NULL,
  location          TEXT NOT NULL,
  employment\_type   TEXT NOT NULL,
  description       TEXT,
  responsibilities  TEXT\[] DEFAULT '{}',
  requirements      TEXT\[] DEFAULT '{}',
  active            BOOLEAN DEFAULT TRUE,
  created\_at        TIMESTAMPTZ DEFAULT now(),
  updated\_at        TIMESTAMPTZ DEFAULT now()
);

-- Team members
CREATE TABLE team\_members (
  id            UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),
  name          TEXT NOT NULL,
  role          TEXT NOT NULL,
  bio           TEXT,
  image\_url     TEXT,
  linkedin\_url  TEXT,
  display\_order INT DEFAULT 0,
  created\_at    TIMESTAMPTZ DEFAULT now(),
  updated\_at    TIMESTAMPTZ DEFAULT now()
);

-- Team page grid layout settings
CREATE TABLE team\_layout (
  id                INT PRIMARY KEY DEFAULT 1,
  columns\_mobile    INT DEFAULT 2,
  columns\_tablet    INT DEFAULT 3,
  columns\_desktop   INT DEFAULT 4,
  columns\_xl        INT DEFAULT 5
);

-- Admin users (extends Supabase auth.users)
CREATE TABLE admin\_users (
  id                UUID PRIMARY KEY REFERENCES auth.users(id),
  name              TEXT NOT NULL,
  roll\_no           TEXT NOT NULL UNIQUE,
  role              TEXT NOT NULL,
  employment\_type   TEXT DEFAULT 'Full-time',
  email             TEXT NOT NULL UNIQUE,
  permissions       JSONB NOT NULL DEFAULT '{}',
  created\_at        TIMESTAMPTZ DEFAULT now()
  -- NOTE: no password field. passwords live in Supabase Auth only.
);

-- CMS: dynamic page sections (home, services, xplor, ims hero/custom content)
CREATE TABLE page\_content (
  page        TEXT PRIMARY KEY,   -- 'home' | 'services' | 'xplor' | 'ims'
  content     JSONB NOT NULL DEFAULT '{}',
  updated\_at  TIMESTAMPTZ DEFAULT now()
);

-- XPLOR product-specific data
CREATE TABLE xplor\_data (
  id          INT PRIMARY KEY DEFAULT 1,
  content     JSONB NOT NULL DEFAULT '{}',
  updated\_at  TIMESTAMPTZ DEFAULT now()
);

-- IMS product-specific data
CREATE TABLE ims\_data (
  id          INT PRIMARY KEY DEFAULT 1,
  content     JSONB NOT NULL DEFAULT '{}',
  updated\_at  TIMESTAMPTZ DEFAULT now()
);

-- Contact settings (footer, proposal form)
CREATE TABLE contact\_settings (
  id        INT PRIMARY KEY DEFAULT 1,
  email1    TEXT,
  email2    TEXT,
  phone1    TEXT,
  phone2    TEXT,
  address   TEXT,
  services  TEXT\[] DEFAULT '{}',
  socials   JSONB DEFAULT '{}',
  updated\_at TIMESTAMPTZ DEFAULT now()
);

-- Background music config
CREATE TABLE music\_config (
  id          INT PRIMARY KEY DEFAULT 1,
  track\_url   TEXT,
  volume      INT DEFAULT 50,
  updated\_at  TIMESTAMPTZ DEFAULT now()
);

-- Audit log
CREATE TABLE audit\_logs (
  id          UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),
  user\_id     UUID REFERENCES auth.users(id),
  user\_email  TEXT NOT NULL,
  user\_name   TEXT NOT NULL,
  action      TEXT NOT NULL,
  entity      TEXT,
  entity\_id   TEXT,
  metadata    JSONB,
  created\_at  TIMESTAMPTZ DEFAULT now()
);
```
---
6. Rendering strategy per page
Next.js lets you choose how each page is rendered. This matters for SEO and performance.
Page	Strategy	Reason
Home `/`	ISR (revalidate: 60s)	Content changes occasionally, needs SEO
Insights `/insights`	ISR (revalidate: 60s)	Post list needs SEO, refreshes on new posts
Blog post `/insights/:id`	ISR (revalidate: 300s)	Mostly static per post
Team `/team`	ISR (revalidate: 300s)	Changes rarely
Careers `/careers`	ISR (revalidate: 60s)	Position listings need SEO
XPLOR `/xplor`	ISR (revalidate: 300s)	Product page, changes rarely
IMS `/ims`	ISR (revalidate: 300s)	Product page, changes rarely
Products `/products`	ISR (revalidate: 60s)	Portfolio changes occasionally
Request Proposal	SSR or client	Form page, no indexing needed
All `/admin/\*`	Client-side (CSR)	Behind auth, never indexed
ISR = Incremental Static Regeneration. The page is pre-rendered at build time and regenerated in
the background when the revalidation period expires. Users always get a fast static response.
---
7. Public website — complete feature list
Global (every page)
Header: logo, nav links (Home, Insights, Team, Careers, XPLOR, IMS, Products), "Request Proposal" CTA
Footer: logo, nav links, social links (LinkedIn, Instagram, Discord), contact info from admin settings, copyright
Background music player: ambient audio, volume control, persists across navigation, track managed by admin
All pages have correct `<title>`, `<meta description>`, and Open Graph tags for SEO
Home (`/`)
Hero — headline, subheadline, CTA, background video or animated element
Stats bar — animated counters (values set by admin)
Services overview — card grid
Custom sections — admin-created, freeform sections with optional media
Contact teaser
Insights (`/insights`)
Featured post — large hero card, pinned by admin
Category filter — filter posts by category
Post grid — blog posts + LinkedIn post cards merged by date
Newsletter email capture form — submits via Resend
Blog Post (`/insights/:id`)
Title, date, author, category, tags, featured image
Rich text content: paragraphs, bullet lists, numbered lists, headings, text alignment
Related posts (3 cards, same category)
Open Graph metadata for link previews
Team (`/team`)
Member cards: photo, name, role, bio, LinkedIn link
Grid column layout is admin-configurable per breakpoint
Careers (`/careers`)
Animated stat counters
Department filter tabs
Expandable position cards: title, department, location, type, description, responsibilities, requirements
XPLOR (`/xplor`)
Hero with background video (admin-uploadable)
Core value proposition cards (admin-editable)
Who uses XPLOR cards (admin-editable)
Three module panels: NEO, ADORNO, APICE — click to expand details + media carousel
Media carousel (admin-managed images/videos)
Custom sections (admin-created)
CTA
IMS (`/ims`)
Hero with background video (admin-uploadable)
Why it wins — differentiator cards
Core features cards
System modules breakdown
Pricing section
FAQ accordion
Media carousel
Custom sections
CTA
Products (`/products`)
Project grid cards: image, title, category, tags, description
Click card → modal with full details + media carousel
Featured projects shown first
Request Proposal (`/request-proposal`)
Contact info block (from admin settings)
Form: Name, Email, Phone, Company, Services (checkboxes from admin settings), Message
Submit → sends email via Resend → success/error state
---
8. Admin CMS — complete feature list
All admin pages are server-side auth-gated via Next.js middleware before any HTML is sent.
The admin layout sidebar shows only the sections the logged-in user has permission to access.
Login (`/admin/login`)
Email + password form
On success: session set in httpOnly cookie by server
Redirect to `/admin/dashboard`
Dashboard (`/admin/dashboard`)
Overview stats: total posts, projects, team members, open positions
Recent activity from audit log
Quick links to each section
Blog Posts (`/admin/posts`)
List all blog posts and LinkedIn posts
Create / edit / delete blog posts: Title, excerpt, content (rich text editor), category, date, featured image, tags, featured toggle
Create / edit / delete LinkedIn posts: URL, title, optional content, optional thumbnail, tags
Projects (`/admin/projects`)
CRUD for portfolio projects
Fields: title, description, category, date, featured image, media gallery (images + videos), tags, featured toggle
Media Library (`/admin/media`)
Upload images and videos (multi-file)
File size limits: images warn >5 MB / reject >20 MB; video warn >50 MB / reject >200 MB
Browse and copy URL for use in other content
Delete files
Background Music (`/admin/music`)
Upload a single audio track (replaces current)
Set volume (0–100)
Delete current track
Careers — Positions (`/admin/careers`)
CRUD for job postings
Fields: title, department, location, employment type, description, responsibilities list, requirements list
Team (`/admin/team`)
Add / edit / delete team members
Fields: name, role, bio, photo (upload), LinkedIn URL, display order
Layout settings: columns per breakpoint (mobile / tablet / desktop / xl)
Users (`/admin/users`)
List all admin users
Create new admin user: name, roll no (used as initial password), role, employment type, email
Per-user permissions: Careers / Blog Posts / Projects / LinkedIn Posts / Media / Team / Home / Services / XPLOR / IMS
Edit permissions
Delete users (cannot delete self)
Page Content — Home (`/admin/page-content/home`)
Edit hero headline, subheadline, stats values
Add / edit / remove / reorder custom sections: title, rich text body, optional image or video
Page Content — XPLOR (`/admin/xplor`)
Edit hero text and background video
Edit core value proposition cards: icon name, heading, description
Edit "Who uses XPLOR" cards
Edit module details: NEO / ADORNO / APICE — name, description, features list
Manage XPLOR media carousel items
Page Content — IMS (`/admin/ims`)
Edit hero text, description, background video
Edit "Why it wins" cards
Edit core features
Edit modules list
Edit pricing content
Edit FAQ: add / remove / reorder question–answer pairs
Manage IMS media carousel items
Contact Settings (`/admin/contact-settings`)
Primary and secondary email
Primary and secondary phone
Address
Services list (drives the checkboxes on the proposal form)
Social links: LinkedIn, Instagram, Discord
Audit Logs (`/admin/audit-logs`)
Table: timestamp, user name, user email, action, entity affected
Summary stats: actions by type, most active users
Export to CSV
---
9. API — all endpoints
All write endpoints require a valid session (verified server-side). Read endpoints are public.
Auth
`POST /api/auth/signin`
`POST /api/auth/signout`
Blog / LinkedIn Posts
`GET /api/posts` — supports `?category=\&type=\&page=`
`GET /api/posts/featured`
`GET /api/posts/\[id]`
`POST /api/admin/posts`
`PUT /api/admin/posts/\[id]`
`DELETE /api/admin/posts/\[id]`
Projects
`GET /api/projects`
`GET /api/projects/featured`
`GET /api/projects/\[id]`
`POST /api/admin/projects`
`PUT /api/admin/projects/\[id]`
`DELETE /api/admin/projects/\[id]`
Positions
`GET /api/positions`
`GET /api/positions/\[id]`
`POST /api/admin/positions`
`PUT /api/admin/positions/\[id]`
`DELETE /api/admin/positions/\[id]`
Team
`GET /api/team`
`GET /api/team/layout`
`POST /api/admin/team`
`PUT /api/admin/team/\[id]`
`DELETE /api/admin/team/\[id]`
`POST /api/admin/team/upload`
`PUT /api/admin/team/layout`
Media & Music
`POST /api/admin/media/upload`
`DELETE /api/admin/media`
`GET /api/music`
`POST /api/admin/music`
`DELETE /api/admin/music`
Page Content
`GET /api/page-content/\[page]`
`PUT /api/admin/page-content/\[page]`
`GET /api/xplor`
`PUT /api/admin/xplor`
`GET /api/ims`
`PUT /api/admin/ims`
Admin Users
`GET /api/admin/users`
`POST /api/admin/users`
`PUT /api/admin/users/\[id]`
`DELETE /api/admin/users/\[id]`
Contact & Email
`GET /api/contact-settings`
`PUT /api/admin/contact-settings`
`POST /api/send-proposal`
Audit & Health
`GET /api/admin/audit-logs`
`GET /api/health`
---
10. What is deliberately not being rebuilt
The original Vite alias mess in vite.config — gone, Next.js handles this
The KV store table — replaced by proper schema
Hono and Supabase Edge Functions — replaced by Next.js Route Handlers
The `src/deployment/` folder inside the frontend source — was non-functional, replaced by a
simple GitHub Action that runs `npm run build` and deploys to Vercel automatically
`AdminSetupPage` — replaced by admin user creation inside `/admin/users`
The `autoSetupAdmin` useEffect that logged credentials to every visitor's browser console
All decorative animated background components (FloatingHexagons, OrbitingRings, DataStream,
HolographicBorder) — rebuilt only if the design explicitly calls for them
The duplicate `AdminDashboard.tsx` / `AdminDashboardNew.tsx` situation — one dashboard only
---
11. Cost at launch
Service	Plan	Monthly cost
Vercel	Hobby (free)	$0
Supabase	Free tier	$0
Resend	Free (3,000 emails/month)	$0
Total		$0
Supabase free tier gives: 500 MB database, 1 GB file storage, 50,000 auth MAUs, 500,000 Edge
Function invocations (not used in new architecture). The 7-day inactivity pause does not apply
to production sites with regular traffic. Upgrade to Supabase Pro ($25/month) when:
the database exceeds 400 MB, or storage exceeds 800 MB, or the site goes weeks without traffic.
Vercel Hobby is sufficient for a company website. Upgrade to Vercel Pro ($20/month) if you need
preview deployments for branches, more bandwidth, or team collaboration features.