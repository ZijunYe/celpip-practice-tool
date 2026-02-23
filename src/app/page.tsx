import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-2">CELPIP Practice Tool</h1>
      <p className="text-neutral-600 mb-8 text-center max-w-md">
        Practice for CELPIP Level 10+ — Speaking and Writing with AI feedback.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-800"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="rounded-lg border border-neutral-300 px-6 py-3 hover:bg-neutral-50"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
