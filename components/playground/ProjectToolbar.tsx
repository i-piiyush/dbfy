import { Search } from "lucide-react";

export default function ProjectToolbar({
  countLabel,
  search,
  onSearchChange,
}: {
  countLabel: string;
  search: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="mt-10 flex flex-col gap-3 border-b-[3px] border-ink pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-black tracking-[-0.04em]">All projects <span className="text-brand">({countLabel})</span></h2>
        <p className="mt-1 text-xs font-medium text-neutral-500">Your latest work, served fresh.</p>
      </div>
      <label className="flex h-11 items-center gap-2 border-2 border-ink bg-white px-3 shadow-[3px_3px_0_var(--palette-ink)] sm:w-[280px]">
        <Search size={16} strokeWidth={2.5} className="shrink-0" />
        <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Find a project..." className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-neutral-400" />
      </label>
    </div>
  );
}
