import Link from "next/link";
import { ArrowUpRight, Database } from "lucide-react";

export function AuthPageLoader({ mode }: { mode: "sign-in" | "sign-up" }) {
  return (
    <main aria-busy="true" aria-live="polite" className="grid min-h-screen place-items-center bg-canvas px-4 text-ink">
      <div role="status" className="text-center">
        <div className="relative mx-auto grid size-20 place-items-center border-[3px] border-ink bg-acid shadow-[5px_5px_0_var(--palette-ink)]">
          <Database size={34} strokeWidth={3} />
          <span aria-hidden="true" className="absolute -right-3 -top-3 size-6 animate-spin border-[3px] border-ink border-t-transparent bg-pink" />
        </div>
        <p className="mt-7 font-mono text-xs font-black uppercase tracking-[0.2em]">
          Loading {mode === "sign-in" ? "sign in" : "sign up"}
        </p>
        <div aria-hidden="true" className="mx-auto mt-3 h-2 w-40 overflow-hidden border-2 border-ink bg-paper">
          <div className="neo-loader-progress h-full bg-brand" />
        </div>
      </div>
    </main>
  );
}

export function AuthPageLoadError({ mode }: { mode: "sign-in" | "sign-up" }) {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-4 text-ink">
      <div role="alert" className="max-w-sm border-[3px] border-ink bg-paper p-7 text-center shadow-[6px_6px_0_var(--palette-ink)]">
        <p className="font-mono text-xs font-black uppercase tracking-widest">Couldn’t load authentication</p>
        <p className="mt-3 text-sm font-medium text-neutral-600">Check your connection, then try loading this page again.</p>
        <a href={`/${mode}`} className="mt-5 inline-flex border-2 border-ink bg-acid px-4 py-2 text-xs font-black uppercase shadow-[3px_3px_0_var(--palette-ink)]">
          Try again
        </a>
      </div>
    </main>
  );
}

export default function AuthPageShell({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "sign-in" | "sign-up";
}) {
  const isSignIn = mode === "sign-in";

  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden bg-canvas px-4 py-5 text-ink sm:px-8 sm:py-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        style={{ backgroundImage: "radial-gradient(var(--palette-grid) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
      />
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="DBFY home">
          <span className="grid size-9 place-items-center border-[3px] border-ink bg-acid shadow-[3px_3px_0_var(--palette-ink)]">
            <Database size={18} strokeWidth={3} />
          </span>
          <span className="text-xl font-black tracking-[-0.08em]">DBFY<span className="text-brand">.</span></span>
        </Link>
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="inline-flex items-center gap-1.5 border-2 border-ink bg-paper px-3 py-2 text-[10px] font-black uppercase tracking-wide shadow-[3px_3px_0_var(--palette-ink)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--palette-ink)] sm:px-4 sm:text-xs"
        >
          {isSignIn ? "Create an account" : "Sign in"} <ArrowUpRight size={14} strokeWidth={3} />
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center py-12">
        <div className="relative w-full max-w-[500px]">
          <div aria-hidden="true" className="absolute -inset-3 rotate-2 border-[3px] border-ink bg-violet sm:-inset-4" />
          <section className="relative border-[3px] border-ink bg-paper p-4 shadow-[7px_7px_0_var(--palette-ink)] sm:p-7">
            <div className="mb-5 inline-flex items-center border-2 border-ink bg-acid px-2.5 py-1.5 font-mono text-[9px] font-black uppercase tracking-[0.16em] shadow-[2px_2px_0_var(--palette-ink)]">
              {isSignIn ? "Back to building" : "Your schema workspace"}
            </div>
            {children}
          </section>
          <p className="relative mt-6 text-center font-mono text-[9px] font-black uppercase tracking-[0.16em] text-neutral-600">
            DBFY <span className="text-brand">/</span> Database schemas, un-messified.
          </p>
        </div>
      </div>
    </main>
  );
}
