"use server";

import { createClient } from "@/lib/supabase/server";
import {
  createWritingSession,
  getWritingSession,
  updateWritingSession,
} from "@/lib/db/writing";
import { upsertPracticeStatsForWriting } from "@/lib/db/stats";
import { generateWritingPrompt, scoreWriting } from "@/lib/ai";
import type { WritingTaskType } from "@/types/database";

export async function startWritingSession(
  taskType: WritingTaskType
): Promise<{ sessionId: string; questionText: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const prompt = await generateWritingPrompt(taskType);
  const session = await createWritingSession({
    user_id: user.id,
    task_type: taskType,
    question_text: prompt,
    answer_text: "",
  });
  if (!session) return { error: "Failed to create session" };
  return { sessionId: session.id, questionText: prompt };
}

export async function autoSaveWriting(
  sessionId: string,
  answerText: string
): Promise<{ ok: boolean } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const updated = await updateWritingSession(sessionId, user.id, {
    answer_text: answerText,
  });
  return updated ? { ok: true } : { error: "Update failed" };
}

export async function submitWriting(
  sessionId: string
): Promise<
  | {
      score: number;
      band: number;
      feedback: string;
      breakdown: { task_achievement: number; organization: number; vocabulary: number; grammar: number };
      grammar_corrections: Array<{ offset: number; length: number; message: string; suggestion?: string }>;
      improvements: string[];
    }
  | { error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const session = await getWritingSession(sessionId, user.id);
  if (!session) return { error: "Session not found" };

  const result = await scoreWriting(
    session.task_type,
    session.question_text,
    session.answer_text
  );
  await updateWritingSession(sessionId, user.id, {
    score: result.score,
    feedback: result.feedback,
    grammar_corrections: result.grammar_corrections,
  });
  await upsertPracticeStatsForWriting(user.id, result.score);

  return {
    score: result.score,
    band: result.band,
    feedback: result.feedback,
    breakdown: result.breakdown,
    grammar_corrections: result.grammar_corrections,
    improvements: result.improvements,
  };
}
