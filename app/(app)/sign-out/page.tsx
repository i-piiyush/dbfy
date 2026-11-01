"use client";

import { useClerk } from "@clerk/nextjs";
import { ArrowLeft, Database, LogOut } from "lucide-react";
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
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-canvas px-4 py-10 text-ink">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-50" style={{ backgroundImage: "radial-gradient(var(--palette-grid) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
      <section className="relative w-full max-w-md border-[3px] border-ink bg-paper p-7 text-center shadow-[7px_7px_0_var(--palette-ink)] sm:p-9">
        <Link href="/playground" className="absolute left-4 top-4 grid size-9 place-items-center border-2 border-ink bg-acid shadow-[2px_2px_0_var(--palette-ink)]" aria-label="Return to workspace">
          <Database size={17} strokeWidth={3} />
        </Link>
        <div className="mx-auto grid size-14 place-items-center border-[3px] border-ink bg-coral shadow-[3px_3px_0_var(--palette-ink)]">
          <LogOut size={23} strokeWidth={3} aria-hidden="true" />
        </div>
        <p className="mt-6 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-brand">DBFY / Your workspace</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.07em]">Log out?</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm font-medium leading-6 text-neutral-600">You can sign back in whenever you return.</p>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 border-[3px] border-ink bg-acid px-4 py-3.5 text-sm font-black shadow-[5px_5px_0_var(--palette-ink)] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_var(--palette-ink)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-60"
        >
          {isSigningOut ? "Logging out..." : "Log out"}
        </button>
        <Link href="/playground" className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide underline decoration-2 underline-offset-4 hover:text-brand">
          <ArrowLeft size={14} strokeWidth={3} /> Cancel and return to workspace
        </Link>
      </section>
    </main>
  );
}
