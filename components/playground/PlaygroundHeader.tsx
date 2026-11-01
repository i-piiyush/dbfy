import { ChevronRight, Command, Plus } from "lucide-react";

export default function PlaygroundHeader({ onNewProject }: { onNewProject: () => void }) {
  return (
    <header className="flex h-[72px] items-center justify-between border-b-[3px] border-ink px-5 sm:px-8 lg:px-12">
      <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
        <span className="md:hidden font-black text-black">DBFY<span className="text-brand">.</span></span>
        <ChevronRight size={15} className="md:hidden" />
        <span className="hidden md:inline">Workspace</span>
        <ChevronRight size={15} />
        <span className="text-black">Projects</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-1.5 border-2 border-ink bg-white px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider sm:flex"><Command size={12} /> Your workspace</span>
        <button type="button" onClick={onNewProject} className="inline-flex items-center gap-2 border-[2px] border-ink bg-pink px-3 py-2 text-xs font-black shadow-[3px_3px_0_var(--palette-ink)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--palette-ink)] sm:px-4 sm:text-sm">
          <Plus size={16} strokeWidth={3} />
          <span className="hidden sm:inline">New project</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>
    </header>
  );
}
