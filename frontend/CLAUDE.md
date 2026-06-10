# Glyptika Frontend Rebuild

## Core Commands
- **Start Development**: `npm run dev`
- **Build Production Bundle**: `npm run build`
- **Lint Check**: `npm run lint`

## Architecture Guide
- Framework: **Next.js 15 (App Router)** inside `frontend/src/app`
- Styling: **Tailwind CSS v4** (postCSS configured)
- Backend: Built-in Route Handlers in `src/app/api`
- Database & Auth: **Supabase** via `@supabase/ssr` (httpOnly cookies)
- Scope Rule: Focus strictly on files inside `frontend/` (pages, layouts, actions, UI). Do not modify the top-level `supabase/` migrations or schemas.

For styling, state, and security rules, see `@AGENTS.md`.
