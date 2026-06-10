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
