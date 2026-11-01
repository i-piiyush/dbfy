import type { Metadata } from "next";
import { ClerkFailed, ClerkLoading } from "@clerk/nextjs";
import LandingExperience from "@/components/LandingExperience";

export const metadata: Metadata = {
  title: "DBFY — Make your database schema make sense",
  description: "Design database schemas visually, connect fields, and copy generated SQL or Prisma code.",
};

export default function HomePage() {
  return (
    <div className="landing-route">
      <LandingExperience />
      <ClerkLoading>
        <main aria-busy="true" aria-live="polite" className="fixed inset-0 z-[100] grid min-h-screen place-items-center bg-canvas px-4 text-ink">
          <div role="status" className="text-center">
            <div className="relative mx-auto grid size-20 place-items-center border-[3px] border-ink bg-acid shadow-[5px_5px_0_var(--palette-ink)]">
              <span className="text-2xl font-black tracking-[-0.1em]">DBFY</span>
              <span aria-hidden="true" className="absolute -right-3 -top-3 size-6 animate-spin border-[3px] border-ink border-t-transparent bg-pink" />
            </div>
            <p className="mt-7 font-mono text-xs font-black uppercase tracking-[0.2em]">Loading DBFY</p>
            <div aria-hidden="true" className="mx-auto mt-3 h-2 w-40 overflow-hidden border-2 border-ink bg-paper">
              <div className="neo-loader-progress h-full bg-brand" />
            </div>
          </div>
        </main>
      </ClerkLoading>
      <ClerkFailed>
        <main className="fixed inset-0 z-[100] grid min-h-screen place-items-center bg-canvas px-4 text-center text-ink">
          <div className="border-[3px] border-ink bg-paper p-7 shadow-[6px_6px_0_var(--palette-ink)]">
            <p className="font-mono text-xs font-black uppercase tracking-widest">DBFY couldn’t finish loading</p>
            <a href="/" className="mt-5 inline-flex border-2 border-ink bg-acid px-4 py-2 text-xs font-black uppercase shadow-[3px_3px_0_var(--palette-ink)]">Try again</a>
          </div>
        </main>
      </ClerkFailed>
    </div>
  );
}
