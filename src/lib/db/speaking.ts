import { createClient } from "@/lib/supabase/server";
import type { SpeakingSession, SpeakingSessionInsert } from "@/types/database";

export async function createSpeakingSession(
  insert: SpeakingSessionInsert
): Promise<SpeakingSession | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("speaking_sessions")
    .insert({
      user_id: insert.user_id,
      question_text: insert.question_text,
      transcript: insert.transcript ?? null,
      audio_url: insert.audio_url ?? null,
      score: insert.score ?? null,
      feedback: insert.feedback ?? null,
    })
    .select()
    .single();

  if (error) return null;
  return data as SpeakingSession;
}

export async function getSpeakingSession(
  sessionId: string,
  userId: string
): Promise<SpeakingSession | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("speaking_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data as SpeakingSession;
}

export async function updateSpeakingSession(
  sessionId: string,
  userId: string,
  updates: Partial<Pick<SpeakingSession, "transcript" | "audio_url" | "score" | "feedback">>
): Promise<SpeakingSession | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("speaking_sessions")
    .update(updates)
    .eq("id", sessionId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) return null;
  return data as SpeakingSession;
}

export async function getSpeakingSessionsByUserAndDate(
  userId: string,
  dateStr: string
): Promise<SpeakingSession[]> {
  const supabase = await createClient();
  const start = `${dateStr}T00:00:00.000Z`;
  const end = `${dateStr}T23:59:59.999Z`;
  const { data, error } = await supabase
    .from("speaking_sessions")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as SpeakingSession[];
}

export async function getSpeakingSessionsByUser(
  userId: string,
  limit = 50
): Promise<SpeakingSession[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("speaking_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as SpeakingSession[];
}
