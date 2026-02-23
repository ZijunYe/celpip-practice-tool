import { createClient } from "@/lib/supabase/server";
import type { PracticeStats } from "@/types/database";

export async function getPracticeStats(userId: string): Promise<PracticeStats | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practice_stats")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data as PracticeStats;
}

export async function upsertPracticeStatsForSpeaking(
  userId: string,
  newScore: number
): Promise<void> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("practice_stats")
    .select("id, total_speaking_attempts, avg_score, last_practice_date")
    .eq("user_id", userId)
    .single();

  const now = new Date().toISOString();
  const totalSpeaking = (existing?.total_speaking_attempts ?? 0) + 1;
  const totalWriting = (existing as PracticeStats | null)?.total_writing_attempts ?? 0;
  const prevAvg = (existing as PracticeStats | null)?.avg_score ?? null;
  const count = totalSpeaking + totalWriting;
  const avg_score =
    prevAvg !== null
      ? (prevAvg * (count - 1) + newScore) / count
      : newScore;

  await supabase.from("practice_stats").upsert(
    {
      user_id: userId,
      total_speaking_attempts: totalSpeaking,
      total_writing_attempts: totalWriting,
      avg_score,
      last_practice_date: now,
      updated_at: now,
    },
    { onConflict: "user_id" }
  );
}

export async function upsertPracticeStatsForWriting(
  userId: string,
  newScore: number
): Promise<void> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("practice_stats")
    .select("id, total_writing_attempts, avg_score, last_practice_date")
    .eq("user_id", userId)
    .single();

  const now = new Date().toISOString();
  const totalWriting = (existing?.total_writing_attempts ?? 0) + 1;
  const totalSpeaking = (existing as PracticeStats | null)?.total_speaking_attempts ?? 0;
  const prevAvg = (existing as PracticeStats | null)?.avg_score ?? null;
  const count = totalSpeaking + totalWriting;
  const avg_score =
    prevAvg !== null
      ? (prevAvg * (count - 1) + newScore) / count
      : newScore;

  await supabase.from("practice_stats").upsert(
    {
      user_id: userId,
      total_speaking_attempts: totalSpeaking,
      total_writing_attempts: totalWriting,
      avg_score,
      last_practice_date: now,
      updated_at: now,
    },
    { onConflict: "user_id" }
  );
}
