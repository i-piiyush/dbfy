"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, UserButton } from "@clerk/nextjs";
import { motion } from "motion/react";
import { Database, FolderKanban, LogIn, Plus } from "lucide-react";

type WorkspaceSidebarProps = {
  projectName?: string;
  onNewProject?: () => void;
  onAddTable?: () => void;
};

export default function WorkspaceSidebar({ projectName, onNewProject, onAddTable }: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const inProject = pathname.startsWith("/p/");

  return (
    <motion.aside
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-y-0 left-0 z-40 flex h-screen w-[72px] shrink-0 flex-col border-r-[3px] border-ink bg-canvas px-2 py-4 md:w-64 md:px-5 md:py-6"
    >
      <Link href="/playground" className="flex items-center justify-center gap-3 md:justify-start" aria-label="DBFY workspace home">
        <span className="grid size-11 shrink-0 place-items-center border-[3px] border-ink bg-acid shadow-[3px_3px_0_var(--palette-ink)]">
          <Database size={21} strokeWidth={2.7} />
        </span>
        <span className="hidden text-xl font-black tracking-[-0.07em] md:inline">DBFY<span className="text-brand">.</span></span>
      </Link>

      <div className="mt-10">
        <p className="mb-3 hidden px-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 md:block">Workspace</p>
        <nav className="space-y-2" aria-label="Workspace navigation">
          <Link
            href="/playground"
            title="Projects"
            className={`relative flex items-center justify-center gap-3 border-2 px-2.5 py-3 text-sm font-extrabold md:justify-start md:px-3 ${!inProject ? "border-ink text-ink" : "border-transparent text-ink hover:border-ink hover:bg-paper"}`}
          >
            {!inProject && <motion.span layoutId="workspace-nav-active" className="absolute inset-0 z-0 bg-acid" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <FolderKanban size={18} strokeWidth={2.5} className="relative z-10 shrink-0" />
            <span className="relative z-10 hidden md:inline">Projects</span>
          </Link>

          {inProject ? (
            <button
              type="button"
              disabled={!onAddTable}
              onClick={onAddTable}
              title="Add table"
              className="flex w-full items-center justify-center gap-3 border-2 border-ink bg-ink px-2.5 py-3 text-sm font-extrabold text-paper shadow-[3px_3px_0_var(--palette-purple)] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--palette-purple)] disabled:cursor-wait disabled:opacity-50 md:justify-start md:px-3"
            >
              <Plus size={18} strokeWidth={3} className="shrink-0" />
              <span className="hidden md:inline">Add table</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onNewProject}
              title="New project"
              className="flex w-full items-center justify-center gap-3 border-2 border-transparent px-2.5 py-3 text-sm font-bold text-ink transition hover:border-ink hover:bg-paper md:justify-start md:px-3"
            >
              <Plus size={18} strokeWidth={2.5} className="shrink-0" />
              <span className="hidden md:inline">New project</span>
            </button>
          )}
        </nav>
      </div>

      {inProject && (
        <div className="mt-7 hidden border-[2px] border-ink bg-violet p-3 shadow-[3px_3px_0_var(--palette-ink)] md:block">
          <p className="text-[10px] font-black uppercase tracking-[0.16em]">Now editing</p>
          <p className="mt-1 truncate text-xs font-bold">{projectName || "Your schema"}</p>
          <p className="mt-2 text-[11px] leading-4 text-ink/70">Build tables, connect fields, and export your schema.</p>
        </div>
      )}

      <div className="mt-auto border-t-2 border-ink pt-4">
        <div className="mb-4 hidden items-center gap-2 text-xs font-bold text-neutral-600 md:flex">
          <span className="size-2 rounded-full border border-ink bg-acid" />
          All systems looking good
        </div>
        <Show when="signed-in">
          <div className="flex items-center justify-center gap-3 border-2 border-ink bg-paper p-2.5 shadow-[3px_3px_0_var(--palette-ink)] md:justify-start md:p-3">
            <UserButton />
            <span className="hidden text-xs font-extrabold md:inline">Your account</span>
          </div>
          <Link href="/sign-out" className="mt-3 hidden px-1 text-xs font-bold underline decoration-2 underline-offset-4 hover:text-brand md:block">Log out</Link>
        </Show>
        <Show when="signed-out">
          <Link href="/sign-in" title="Sign in" className="flex items-center justify-center gap-2 border-2 border-ink bg-paper p-2 text-sm font-extrabold shadow-[3px_3px_0_var(--palette-ink)] md:justify-start md:px-3 md:py-2.5"><LogIn size={16} /><span className="hidden md:inline">Sign in</span></Link>
        </Show>
      </div>
    </motion.aside>
  );
}
