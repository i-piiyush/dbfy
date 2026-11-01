import { Sparkles } from "lucide-react";
import ProjectStats from "@/components/playground/ProjectStats";

export default function PlaygroundHero({ projectCount, tableCount, loading }: {
  projectCount: number;
  tableCount: number;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 border-2 border-ink bg-violet px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] shadow-[3px_3px_0_var(--palette-ink)]">
          <Sparkles size={13} strokeWidth={3} />
          Your ideas, organized
        </div>
        <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.07em] sm:text-6xl">The project<br className="sm:hidden" /> zone<span className="text-brand">.</span></h1>
        <p className="mt-4 max-w-lg text-sm font-medium leading-6 text-neutral-600 sm:text-base">Every build you’ve been cooking up, all in one place. Pick a project and keep the good stuff moving.</p>
      </div>
      <ProjectStats projectCount={projectCount} tableCount={tableCount} loading={loading} />
    </div>
  );
}
