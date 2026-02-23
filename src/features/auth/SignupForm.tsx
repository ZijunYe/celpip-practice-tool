"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { signup } from "./actions";

export function SignupForm() {
  const [state, formAction] = useFormState(
    async (_: unknown, formData: FormData) => {
      return await signup(formData);
    },
    null as { error?: string } | null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full max-w-sm">
      <h1 className="text-2xl font-semibold">Create account</h1>
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
          minLength={6}
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
        Sign up
      </button>
      <p className="text-sm text-neutral-500">
        Already have an account? <Link href="/login" className="underline">Sign in</Link>
      </p>
    </form>
  );
}
