"use server";

import { createClient } from "@/lib/supabase/server";
import {
  createSpeakingSession,
  getSpeakingSession,
  updateSpeakingSession,
} from "@/lib/db/speaking";
import {
  upsertPracticeStatsForSpeaking,
} from "@/lib/db/stats";
import {
  generateSpeakingPrompt,
  transcribeAudio,
  scoreSpeaking,
} from "@/lib/ai";

export async function startSpeakingSession(): Promise<
  { sessionId: string; questionText: string } | { error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const prompt = await generateSpeakingPrompt();
  const session = await createSpeakingSession({
    user_id: user.id,
    question_text: prompt,
  });
  if (!session) return { error: "Failed to create session" };
  return { sessionId: session.id, questionText: prompt };
}

export async function saveSpeakingAudio(
  sessionId: string,
  formData: FormData
): Promise<{ audioUrl: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const file = formData.get("audio") as File | null;
  if (!file) return { error: "No audio file" };

  const ext = "webm";
  const path = `${user.id}/${sessionId}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("speaking-audio")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) return { error: uploadError.message };

  const { data: urlData } = supabase.storage
    .from("speaking-audio")
    .getPublicUrl(path);
  const audioUrl = urlData.publicUrl;

  await updateSpeakingSession(sessionId, user.id, { audio_url: audioUrl });
  return { audioUrl };
}

export async function transcribeAndScoreSpeaking(
  sessionId: string
): Promise<
  | { transcript: string; score: number; feedback: string; improvements: string[]; breakdown: { content: number; coherence: number; vocabulary: number; grammar: number }; band: number }
  | { error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const session = await getSpeakingSession(sessionId, user.id);
  if (!session) return { error: "Session not found" };

  const audioUrl = session.audio_url;
  if (!audioUrl) return { error: "No audio uploaded" };

  const transcript = await transcribeAudio(audioUrl);
  await updateSpeakingSession(sessionId, user.id, { transcript });

  const result = await scoreSpeaking(transcript, session.question_text);
  await updateSpeakingSession(sessionId, user.id, {
    score: result.score,
    feedback: result.feedback,
  });
  await upsertPracticeStatsForSpeaking(user.id, result.score);

  return {
    transcript,
    score: result.score,
    feedback: result.feedback,
    improvements: result.improvements,
    breakdown: result.breakdown,
    band: result.band,
  };
}
