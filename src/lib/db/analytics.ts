import { createClient } from "@/lib/supabase/server";

export interface ScoreTrendPoint {
  date: string;
  avgScore: number;
  count: number;
}

export async function getScoreTrend(
  userId: string,
  days: number = 30
): Promise<ScoreTrendPoint[]> {
  const supabase = await createClient();
  const start = new Date();
  start.setDate(start.getDate() - days);
  const startStr = start.toISOString().slice(0, 10);

  const [speaking, writing] = await Promise.all([
    supabase
      .from("speaking_sessions")
      .select("score, created_at")
      .eq("user_id", userId)
      .not("score", "is", null)
      .gte("created_at", startStr),
    supabase
      .from("writing_sessions")
      .select("score, created_at")
      .eq("user_id", userId)
      .not("score", "is", null)
      .gte("created_at", startStr),
  ]);

  const byDate: Record<string, { sum: number; count: number }> = {};
  const add = (score: number, created_at: string) => {
    const date = created_at.slice(0, 10);
    if (!byDate[date]) byDate[date] = { sum: 0, count: 0 };
    byDate[date].sum += score;
    byDate[date].count += 1;
  };
  (speaking.data ?? []).forEach((r) => add(r.score as number, r.created_at));
  (writing.data ?? []).forEach((r) => add(r.score as number, r.created_at));

  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { sum, count }]) => ({
      date,
      avgScore: Math.round((sum / count) * 10) / 10,
      count,
    }));
}

export async function getActivityByDate(
  userId: string,
  year: number,
  month: number
): Promise<Record<string, { speaking: number; writing: number }>> {
  const supabase = await createClient();
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);

  const [speaking, writing] = await Promise.all([
    supabase
      .from("speaking_sessions")
      .select("created_at")
      .eq("user_id", userId)
      .gte("created_at", startStr)
      .lte("created_at", endStr + "T23:59:59.999Z"),
    supabase
      .from("writing_sessions")
      .select("created_at")
      .eq("user_id", userId)
      .gte("created_at", startStr)
      .lte("created_at", endStr + "T23:59:59.999Z"),
  ]);

  const byDate: Record<string, { speaking: number; writing: number }> = {};
  const ensure = (d: string) => {
    if (!byDate[d]) byDate[d] = { speaking: 0, writing: 0 };
  };
  (speaking.data ?? []).forEach((r) => {
    const d = r.created_at.slice(0, 10);
    ensure(d);
    byDate[d].speaking += 1;
  });
  (writing.data ?? []).forEach((r) => {
    const d = r.created_at.slice(0, 10);
    ensure(d);
    byDate[d].writing += 1;
  });
  return byDate;
}
