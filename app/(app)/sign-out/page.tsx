"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SignOutPage() {
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut({ redirectUrl: "/sign-in" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <section className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
          <LogOut size={20} aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-xl font-semibold tracking-tight text-zinc-900">Log out?</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">You can sign back in whenever you return.</p>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="mt-6 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-wait disabled:opacity-60"
        >
          {isSigningOut ? "Logging out…" : "Log out"}
        </button>
        <Link href="/project" className="mt-3 inline-flex text-sm font-medium text-zinc-600 hover:text-zinc-900">
          Cancel
        </Link>
      </section>
    </main>
  );
}
