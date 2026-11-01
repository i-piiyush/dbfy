import { Database } from "lucide-react";

/** Keeps the workspace frame responsive while its project list loads. */
export default function PlaygroundLoading() {
  return (
    <main aria-busy="true" aria-live="polite" className="grid min-h-screen place-items-center bg-canvas px-4 text-ink">
      <div className="text-center">
        <div className="relative mx-auto grid size-20 place-items-center border-[3px] border-ink bg-acid shadow-[5px_5px_0_var(--palette-ink)]">
          <Database size={34} strokeWidth={3} />
          <span aria-hidden="true" className="absolute -right-3 -top-3 size-6 animate-spin border-[3px] border-ink border-t-transparent bg-pink" />
        </div>
        <p className="mt-7 font-mono text-xs font-black uppercase tracking-[0.2em]">Loading your projects</p>
        <div className="mx-auto mt-3 h-2 w-40 overflow-hidden border-2 border-ink bg-paper">
          <div className="neo-loader-progress h-full bg-brand" />
        </div>
      </div>
    </main>
  );
}
