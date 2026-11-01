import Link from "next/link";
import { motion } from "motion/react";
import { CalendarDays, Database, Pencil, Trash2 } from "lucide-react";
import type { ProjectSummary } from "@/types/project";

const cardPalette = ["bg-violet", "bg-coral", "bg-acid", "bg-sky"];
const dateFormatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : dateFormatter.format(date);
}

export default function ProjectCard({ project, index, onRename, onDelete }: {
  project: ProjectSummary;
  index: number;
  onRename: (project: ProjectSummary) => void;
  onDelete: (project: ProjectSummary) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: Math.min(index * 0.035, 0.2), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="flex min-h-[260px] flex-col border-[3px] border-ink bg-paper shadow-[5px_5px_0_var(--palette-ink)]"
    >
      <Link href={`/p/${project._id}`} aria-label={`Open ${project.projectName}`} className="flex flex-1 flex-col focus-visible:outline focus-visible:outline-4 focus-visible:outline-brand">
        <div className={`flex items-center justify-between border-b-[3px] border-ink px-4 py-3 ${cardPalette[index % cardPalette.length]}`}>
          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em]"><span className="size-2 rounded-full border border-ink bg-white" /> Project #{String(index + 1).padStart(2, "0")}</span>
          <span aria-hidden="true" className="size-3 rotate-45 border-2 border-ink bg-white" />
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="line-clamp-2 break-words text-xl font-black leading-tight tracking-[-0.05em]">{project.projectName}</h3>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-neutral-500">
            <span className="inline-flex items-center gap-1.5"><Database size={14} strokeWidth={2.5} className="text-black" />{project.tableCount} {project.tableCount === 1 ? "table" : "tables"}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} strokeWidth={2.5} className="text-black" />Updated {formatUpdatedAt(project.updatedAt)}</span>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between border-t-[2px] border-ink px-4 py-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Schema project</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => onRename(project)} className="inline-flex items-center gap-1.5 border-2 border-ink bg-violet px-2.5 py-1.5 text-[10px] font-black shadow-[2px_2px_0_var(--palette-ink)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"><Pencil size={12} /> Rename</button>
          <button type="button" onClick={() => onDelete(project)} className="inline-flex items-center gap-1.5 border-2 border-ink bg-coral px-2.5 py-1.5 text-[10px] font-black shadow-[2px_2px_0_var(--palette-ink)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"><Trash2 size={12} /> Delete</button>
        </div>
      </div>
    </motion.article>
  );
}
