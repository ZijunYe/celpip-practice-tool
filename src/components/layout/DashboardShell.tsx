"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/features/auth/actions";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/speaking", label: "Speaking" },
  { href: "/writing", label: "Writing" },
  { href: "/progress", label: "Progress" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-56 border-b md:border-b-0 md:border-r border-neutral-200 p-4 flex flex-row md:flex-col gap-4">
        <Link href="/dashboard" className="font-semibold text-lg">
          CELPIP Practice
        </Link>
        <nav className="flex gap-4 md:flex-col">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                pathname === href || pathname.startsWith(href + "/")
                  ? "text-neutral-900 font-medium"
                  : "text-neutral-500 hover:text-neutral-700"
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="mt-auto">
          <button
            type="submit"
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            Sign out
          </button>
        </form>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
