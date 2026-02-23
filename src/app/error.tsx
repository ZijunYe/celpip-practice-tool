"use client";

import { useEffect } from "react";

export default function Error({
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
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p className="text-neutral-600 text-sm mb-4 text-center max-w-md">
        {error.message}
      </p>
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
