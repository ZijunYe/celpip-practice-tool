"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p className="text-neutral-600 text-sm mb-4">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg border border-neutral-300 px-4 py-2 hover:bg-neutral-50"
      >
        Try again
      </button>
    </div>
  );
}
