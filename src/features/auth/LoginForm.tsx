"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { login } from "./actions";

export function LoginForm() {
  const [state, formAction] = useFormState(
    async (_: unknown, formData: FormData) => {
      return await login(formData);
    },
    null as { error?: string } | null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full max-w-sm">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <label className="flex flex-col gap-1">
        <span className="text-sm text-neutral-600">Email</span>
        <input
          type="email"
          name="email"
          required
          className="border rounded px-3 py-2"
          placeholder="you@example.com"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm text-neutral-600">Password</span>
        <input
          type="password"
          name="password"
          required
          className="border rounded px-3 py-2"
        />
      </label>
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      <button
        type="submit"
        className="bg-neutral-900 text-white rounded px-4 py-2 hover:bg-neutral-800"
      >
        Sign in
      </button>
      <p className="text-sm text-neutral-500">
        No account? <Link href="/signup" className="underline">Sign up</Link>
      </p>
    </form>
  );
}
