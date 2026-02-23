import { createClient } from "@/lib/supabase/server";
import type { WritingSession, WritingSessionInsert } from "@/types/database";

export async function createWritingSession(
  insert: WritingSessionInsert
): Promise<WritingSession | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writing_sessions")
    .insert({
      user_id: insert.user_id,
      task_type: insert.task_type,
      question_text: insert.question_text,
      answer_text: insert.answer_text ?? "",
      score: insert.score ?? null,
      feedback: insert.feedback ?? null,
      grammar_corrections: insert.grammar_corrections ?? null,
    })
    .select()
    .single();

  if (error) return null;
  return data as WritingSession;
}

export async function getWritingSession(
  sessionId: string,
  userId: string
): Promise<WritingSession | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writing_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data as WritingSession;
}

export async function updateWritingSession(
  sessionId: string,
  userId: string,
  updates: Partial<
    Pick<
      WritingSession,
      "answer_text" | "score" | "feedback" | "grammar_corrections"
    >
  >
): Promise<WritingSession | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writing_sessions")
    .update(updates)
    .eq("id", sessionId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) return null;
  return data as WritingSession;
}

export async function getWritingSessionsByUserAndDate(
  userId: string,
  dateStr: string
): Promise<WritingSession[]> {
  const supabase = await createClient();
  const start = `${dateStr}T00:00:00.000Z`;
  const end = `${dateStr}T23:59:59.999Z`;
  const { data, error } = await supabase
    .from("writing_sessions")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as WritingSession[];
}

export async function getWritingSessionsByUser(
  userId: string,
  limit = 50
): Promise<WritingSession[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writing_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as WritingSession[];
}
