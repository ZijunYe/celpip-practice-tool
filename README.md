# CELPIP Practice Tool

A production-ready web app for CELPIP Level 10+ practice, focusing on **Speaking** and **Writing**, with AI scoring and progress analytics.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Supabase** (Auth, Postgres, Storage)
- **TailwindCSS**

## Local development

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for local Supabase)

### 1. Clone and install

```bash
git clone <repo-url>
cd celpip-practice-tool
npm install
```

### 2. Supabase (local)

Install the Supabase CLI if needed:

```bash
# macOS
brew install supabase/tap/supabase
```

Initialize and start local Supabase:

```bash
supabase init
supabase start
```

Apply migrations:

```bash
supabase db push
```

Get your local API URL and anon key:

```bash
supabase status
```

Use the **API URL** and **anon key** in your env file.

### 3. Environment

Copy the example env and fill in values from `supabase status`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` — API URL (e.g. `http://127.0.0.1:54321`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon key from `supabase status`
- `OPENAI_API_KEY` — optional; if omitted, the app uses **mock** AI responses

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up or sign in to use the dashboard, Speaking, and Writing modules.

## Database schema

The migration `supabase/migrations/00001_initial_schema.sql` creates:

- **users** — app profile (id, email, created_at); synced with auth
- **speaking_sessions** — question_text, transcript, audio_url, score, feedback, created_at
- **writing_sessions** — task_type (task1_email, task2_survey), question_text, answer_text, score, feedback, grammar_corrections (jsonb), created_at
- **practice_stats** — per-user: total_speaking_attempts, total_writing_attempts, avg_score, last_practice_date

RLS ensures users can only access their own data. If the migration fails on the `storage` section (e.g. local Supabase version), create the bucket `speaking-audio` manually in the Supabase Dashboard (Storage) and set it to public; then add RLS policies for upload/read by `auth.uid()`.

## Project structure

```
src/
  app/           # App Router: (auth), (dashboard), layout, page
  components/    # Shared UI and layout
  features/      # auth, speaking, writing, progress
  lib/           # supabase, ai, db
  types/         # Shared TypeScript types
```

## Features

- **Auth**: Sign up / Sign in with Supabase Auth; protected dashboard routes
- **Speaking**: CELPIP-style prompts, browser recording, upload to Storage, transcription (mock or API), AI scoring with breakdown and feedback
- **Writing**: Task 1 (Email) and Task 2 (Survey), prompt generation, editor with word count, auto-save, AI scoring and grammar corrections
- **Progress**: Dashboard with score trend, Speaking vs Writing breakdown, weakness summary; calendar view and session list by date

## Scripts

- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run start` — start production server
- `npm run lint` — run ESLint
