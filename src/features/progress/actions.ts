"use server";

import { createClient } from "@/lib/supabase/server";
import { getSpeakingSessionsByUserAndDate } from "@/lib/db/speaking";
import { getWritingSessionsByUserAndDate } from "@/lib/db/writing";
import { getActivityByDate } from "@/lib/db/analytics";
import type { SpeakingSession } from "@/types/database";
import type { WritingSession } from "@/types/database";

export async function getSessionsForDate(
  dateStr: string
): Promise<{
  speaking: SpeakingSession[];
  writing: WritingSession[];
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [speaking, writing] = await Promise.all([
    getSpeakingSessionsByUserAndDate(user.id, dateStr),
    getWritingSessionsByUserAndDate(user.id, dateStr),
  ]);
  return { speaking, writing };
}

export async function getActivityForMonth(
  year: number,
  month: number
): Promise<Record<string, { speaking: number; writing: number }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};
  return getActivityByDate(user.id, year, month);
}
