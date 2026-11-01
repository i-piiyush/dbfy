export default function ProjectStats({ projectCount, tableCount, loading }: {
  projectCount: number;
  tableCount: number;
  loading: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="min-w-[108px] border-[2px] border-ink bg-white p-3 shadow-[4px_4px_0_var(--palette-ink)] sm:min-w-[126px] sm:p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Projects</p>
        <p className="mt-1 text-3xl font-black tracking-[-0.06em]">{loading ? "—" : projectCount.toString().padStart(2, "0")}</p>
      </div>
      <div className="min-w-[108px] border-[2px] border-ink bg-acid p-3 shadow-[4px_4px_0_var(--palette-ink)] sm:min-w-[126px] sm:p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-700">Tables</p>
        <p className="mt-1 text-3xl font-black tracking-[-0.06em]">{loading ? "—" : tableCount.toString().padStart(2, "0")}</p>
      </div>
    </div>
  );
}
