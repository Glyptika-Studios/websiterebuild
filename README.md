## Local Development Setup

### Prerequisites
- Docker Desktop installed and running
  Download: https://www.docker.com/products/docker-desktop/
- Node.js 18+
- Supabase CLI:
  npm install -g supabase

### First-time setup

1. Clone the repo
   git clone <repo-url>
   cd glyptika-backend
   supabase init

2. Link to the cloud Supabase project (one time only)
   supabase login
   supabase link --project-ref <your-project-ref>

3. Start local Supabase
   supabase start
   (Downloads Docker images on first run — takes 5-10 min)

4. Copy the printed local keys into a new .env.local file
   SUPABASE_URL=http://127.0.0.1:54321
   SUPABASE_ANON_KEY=<from supabase start output>
   SUPABASE_SERVICE_ROLE_KEY=<from supabase start output>

5. Open local Supabase Studio
   http://127.0.0.1:54323

### Daily commands

  supabase start          start local Supabase
  supabase stop           stop local Supabase
  supabase db reset       wipe and re-apply all migrations + seed
  supabase status         print local URLs and keys again
  supabase migration new  create a new migration file

### Making schema changes

Never edit tables directly in the dashboard.

1. supabase migration new describe_your_change
2. Write ALTER TABLE SQL in the new migration file
3. supabase db reset  (test locally)
4. git add, commit, push
5. Teammates run: supabase db reset
6. Deploy to cloud: supabase db push

### Pulling cloud schema changes

If someone pushed a migration to cloud that you don't have locally:
  git pull
  supabase db reset
