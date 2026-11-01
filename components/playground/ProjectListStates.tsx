import { Box, Plus, TriangleAlert } from "lucide-react";

export function ProjectLoadingState() {
  return (
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2].map((item) => <div key={item} className="h-[220px] animate-pulse border-[3px] border-ink/20 bg-white/60" />)}
    </div>
  );
}

export function ProjectErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mt-8 border-[3px] border-ink bg-coral p-6 shadow-[6px_6px_0_var(--palette-ink)] sm:p-8">
      <div className="flex items-start gap-3">
        <TriangleAlert size={22} strokeWidth={2.5} />
        <div className="flex-1">
          <h3 className="font-black">The list is taking a nap.</h3>
          <p className="mt-1 text-sm font-medium">{message}</p>
          <button onClick={onRetry} className="mt-4 border-2 border-ink bg-white px-4 py-2 text-xs font-black shadow-[3px_3px_0_var(--palette-ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--palette-ink)]">Try again</button>
        </div>
      </div>
    </div>
  );
}

export function ProjectEmptyState({ search, onCreate }: { search: string; onCreate: () => void }) {
  return (
    <div className="mt-8 border-[3px] border-ink bg-lemon px-5 py-12 text-center shadow-[6px_6px_0_var(--palette-ink)] sm:py-16">
      <span className="mx-auto grid size-14 place-items-center border-[3px] border-ink bg-white shadow-[3px_3px_0_var(--palette-ink)]"><Box size={25} strokeWidth={2.5} /></span>
      <h3 className="mt-5 text-2xl font-black tracking-[-0.05em]">{search ? "No matches, bestie." : "It’s giving blank canvas."}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-neutral-600">{search ? "Try another name and we’ll find the right one." : "Your first project is one click away. Start sketching your next big idea."}</p>
      {!search && <button type="button" onClick={onCreate} className="mt-6 inline-flex items-center gap-2 border-[2px] border-ink bg-acid px-4 py-3 text-sm font-black shadow-[4px_4px_0_var(--palette-ink)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--palette-ink)]"><Plus size={17} strokeWidth={3} /> Create your first project</button>}
    </div>
  );
}
