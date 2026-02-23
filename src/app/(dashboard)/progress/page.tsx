import { createClient } from "@/lib/supabase/server";
import { getActivityByDate } from "@/lib/db/analytics";
import { ProgressView } from "@/features/progress/ProgressView";

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const initialActivity = await getActivityByDate(user.id, year, month);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Progress</h1>
      <p className="text-neutral-600 mb-6">
        Click a date to see practice sessions for that day.
      </p>
      <ProgressView
        initialYear={year}
        initialMonth={month}
        initialActivity={initialActivity}
      />
    </div>
  );
}
