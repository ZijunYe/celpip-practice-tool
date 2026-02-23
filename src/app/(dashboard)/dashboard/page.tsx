import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPracticeStats } from "@/lib/db/stats";
import { getScoreTrend } from "@/lib/db/analytics";
import { ScoreTrendChart } from "@/features/progress/components/ScoreTrendChart";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [stats, scoreTrend] = await Promise.all([
    getPracticeStats(user.id),
    getScoreTrend(user.id, 30),
  ]);

  const totalSpeaking = stats?.total_speaking_attempts ?? 0;
  const totalWriting = stats?.total_writing_attempts ?? 0;
  const avgScore = stats?.avg_score ?? null;
  const totalSessions = totalSpeaking + totalWriting;
  const weaknessSummary =
    totalSessions === 0
      ? "Complete a Speaking or Writing practice to see your weakness summary."
      : avgScore != null && avgScore < 9
        ? `Your average score is ${avgScore.toFixed(1)}. Aim for Band 9+ by practicing regularly.`
        : "Keep up the good work. Focus on areas where you scored lower in recent attempts.";

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p className="text-neutral-600 mb-6">
        Welcome. Start with Speaking or Writing practice, or view your progress.
      </p>

      <div className="grid gap-6 mb-8">
        <div className="rounded-lg border border-neutral-200 p-4">
          <h2 className="font-medium mb-2">Average score trend</h2>
          <ScoreTrendChart data={scoreTrend} />
        </div>
        <div className="rounded-lg border border-neutral-200 p-4">
          <h2 className="font-medium mb-2">Speaking vs Writing</h2>
          <div className="flex gap-6">
            <div>
              <p className="text-2xl font-semibold">{totalSpeaking}</p>
              <p className="text-sm text-neutral-500">Speaking attempts</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{totalWriting}</p>
              <p className="text-sm text-neutral-500">Writing attempts</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 p-4">
          <h2 className="font-medium mb-2">Summary</h2>
          <p className="text-sm text-neutral-600">{weaknessSummary}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/speaking"
          className="rounded-lg border border-neutral-200 px-6 py-4 hover:bg-neutral-50"
        >
          <span className="font-medium">Speaking</span>
          <p className="text-sm text-neutral-500 mt-1">Record and get scored</p>
        </Link>
        <Link
          href="/writing"
          className="rounded-lg border border-neutral-200 px-6 py-4 hover:bg-neutral-50"
        >
          <span className="font-medium">Writing</span>
          <p className="text-sm text-neutral-500 mt-1">Task 1 & 2 practice</p>
        </Link>
        <Link
          href="/progress"
          className="rounded-lg border border-neutral-200 px-6 py-4 hover:bg-neutral-50"
        >
          <span className="font-medium">Progress</span>
          <p className="text-sm text-neutral-500 mt-1">Calendar & analytics</p>
        </Link>
      </div>
    </div>
  );
}
