/* CELPIP Practice Tool: initial schema
   Run with: supabase db push (or supabase migration up) */

-- Enum for writing task type
CREATE TYPE writing_task_type AS ENUM ('task1_email', 'task2_survey');

-- App users profile (optional; auth.users is source of truth)
-- Sync on first login or via trigger if you need app-specific fields
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Speaking practice sessions
CREATE TABLE public.speaking_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL DEFAULT '',
  transcript TEXT,
  audio_url TEXT,
  score DOUBLE PRECISION,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Writing practice sessions
CREATE TABLE public.writing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_type writing_task_type NOT NULL,
  question_text TEXT NOT NULL DEFAULT '',
  answer_text TEXT NOT NULL DEFAULT '',
  score DOUBLE PRECISION,
  feedback TEXT,
  grammar_corrections JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Per-user practice stats (one row per user)
CREATE TABLE public.practice_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_speaking_attempts INT NOT NULL DEFAULT 0,
  total_writing_attempts INT NOT NULL DEFAULT 0,
  avg_score DOUBLE PRECISION,
  last_practice_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: enable
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speaking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_stats ENABLE ROW LEVEL SECURITY;

-- Users: allow read/insert/update own row
CREATE POLICY "Users select own" ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insert own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Speaking sessions: own rows only
CREATE POLICY "Speaking select own" ON public.speaking_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Speaking insert own" ON public.speaking_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Speaking update own" ON public.speaking_sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Speaking delete own" ON public.speaking_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Writing sessions: own rows only
CREATE POLICY "Writing select own" ON public.writing_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Writing insert own" ON public.writing_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Writing update own" ON public.writing_sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Writing delete own" ON public.writing_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Practice stats: own row only
CREATE POLICY "Stats select own" ON public.practice_stats
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Stats insert own" ON public.practice_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Stats update own" ON public.practice_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Storage bucket for speaking audio (run in Dashboard or add migration)
-- Here we create the bucket and policy via SQL if your Supabase version supports it
INSERT INTO storage.buckets (id, name, public)
VALUES ('speaking-audio', 'speaking-audio', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Speaking audio upload own"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'speaking-audio' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Speaking audio read own"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'speaking-audio' AND auth.uid()::text = (storage.foldername(name))[1]
);
