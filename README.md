# Local Development Setup

## Prerequisites

- Docker Desktop installed and running  
  Download: https://www.docker.com/products/docker-desktop/
- Node.js 18+
- Supabase CLI:

```bash
npm install -g supabase
```

## First-time Setup

1. Clone the repo

```bash
git clone <repo-url>
cd <repo-folder>
```

The repository already contains the Supabase configuration and migrations. Do **not** run:

```bash
supabase init
```

2. Link to the cloud Supabase project (one time only)

```bash
supabase login
supabase link --project-ref <project-ref>
```

3. Start local Supabase

```bash
supabase start
```

Downloads Docker images on first run (typically 5–10 minutes).

4. Copy the printed local keys into a new `.env.local` file

```env
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<from supabase start output>
SUPABASE_SERVICE_ROLE_KEY=<from supabase start output>
```

5. Open local Supabase Studio

```text
http://127.0.0.1:54323
```

## Daily Commands

| Command | Purpose |
|----------|----------|
| `supabase start` | Start local Supabase |
| `supabase stop` | Stop local Supabase |
| `supabase db reset` | Wipe and re-apply all migrations + seed |
| `supabase status` | Print local URLs and keys |
| `supabase migration new <name>` | Create a new migration file |

## Making Schema Changes

Never edit tables directly in the dashboard.

1. Create a migration

```bash
supabase migration new describe_your_change
```

2. Write your SQL changes in the new migration file.

3. Test locally

```bash
supabase db reset
```

4. Commit and push

```bash
git add .
git commit -m "Describe change"
git push
```

5. Teammates apply changes

```bash
git pull
supabase db reset
```

6. Deploy to cloud

```bash
supabase db push
```

## Pulling Teammate Schema Changes

```bash
git pull
supabase db reset
```
