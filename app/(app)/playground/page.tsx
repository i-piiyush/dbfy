"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Show, UserButton } from "@clerk/nextjs";
import {
  Box,
  CalendarDays,
  ChevronRight,
  Command,
  Database,
  FolderKanban,
  Plus,
  Search,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { response } from "@/types/response.type";
import type { FormEvent } from "react";

type Project = {
  _id: string;
  projectName: string;
  tableData: { tableId: string; name: string; fields: unknown[] }[];
  createdAt: string;
  updatedAt: string;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : dateFormatter.format(date);
}

export default function PlaygroundPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (creating) return;
    setCreating(true);
    setCreateError("");
    try {
      const result = await axios.post<response<{ id: string; projectName: string }>>(
        "/api/create-project",
        { projectName: newProjectName },
        { validateStatus: () => true },
      );
      if (result.status < 200 || result.status >= 300 || !result.data.success || !result.data.data) {
        setCreateError(result.data.success ? "The new project could not be opened." : result.data.message);
        return;
      }
      router.push(`/p/${result.data.data.id}`);
    } catch {
      setCreateError("Couldn’t create your project. Check your connection and try again.");
    } finally {
      setCreating(false);
    }
  }

  function openCreateDialog() {
    setNewProjectName("");
    setCreateError("");
    setCreateOpen(true);
  }

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await axios.get<response<Project[]>>("/api/get-projects", {
        validateStatus: () => true,
      });
      if (result.status < 200 || result.status >= 300 || !result.data.success) {
        setError(result.data.success ? "Couldn’t load your projects right now." : result.data.message);
        return;
      }
      setProjects(result.data.data ?? []);
    } catch {
      setError("Couldn’t reach your workspace. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) => project.projectName.toLowerCase().includes(query));
  }, [projects, search]);

  const totalTables = projects.reduce((count, project) => count + project.tableData.length, 0);

  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#171717]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[260px] shrink-0 flex-col border-r-[3px] border-black bg-[#f7f4ed] p-5 md:flex lg:p-6">
          <Link href="/playground" className="flex items-center gap-3" aria-label="DBFY workspace home">
            <span className="grid size-11 place-items-center border-[3px] border-black bg-[#c9ff55] shadow-[3px_3px_0_#171717]">
              <Database size={21} strokeWidth={2.7} />
            </span>
            <span className="text-xl font-black tracking-[-0.07em]">DBFY<span className="text-[#7156ff]">.</span></span>
          </Link>

          <div className="mt-12">
            <p className="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Your space</p>
            <Link href="/playground" className="flex items-center gap-3 border-[2px] border-black bg-[#c9ff55] px-3 py-3 text-sm font-extrabold shadow-[3px_3px_0_#171717]">
              <FolderKanban size={18} strokeWidth={2.5} />
              Projects
              <span className="ml-auto rounded-full border-2 border-black bg-white px-2 py-0.5 text-[10px] font-black">{projects.length}</span>
            </Link>
            <button type="button" onClick={openCreateDialog} className="mt-3 flex w-full items-center gap-3 border-2 border-transparent px-3 py-3 text-left text-sm font-bold transition hover:border-black hover:bg-white">
              <Plus size={18} strokeWidth={2.5} />
              New project
            </button>
          </div>

          <div className="mt-auto border-t-2 border-black pt-5">
            <div className="mb-4 flex items-center gap-2 text-xs font-bold text-neutral-600">
              <span className="size-2 rounded-full border border-black bg-[#c9ff55]" />
              All systems looking good
            </div>
            <Show when="signed-in">
              <div className="flex items-center gap-3 border-2 border-black bg-white p-3 shadow-[3px_3px_0_#171717]">
                <UserButton />
                <span className="text-xs font-extrabold">Your account</span>
              </div>
              <Link href="/sign-out" className="mt-3 block px-1 text-xs font-bold underline decoration-2 underline-offset-4 hover:text-[#7156ff]">Log out</Link>
            </Show>
            <Show when="signed-out">
              <Link href="/sign-in" className="block border-2 border-black bg-white p-3 text-sm font-extrabold shadow-[3px_3px_0_#171717]">Sign in to sync</Link>
            </Show>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex h-[72px] items-center justify-between border-b-[3px] border-black px-5 sm:px-8 lg:px-12">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
              <span className="md:hidden font-black text-black">DBFY<span className="text-[#7156ff]">.</span></span>
              <ChevronRight size={15} className="md:hidden" />
              <span className="hidden md:inline">Workspace</span>
              <ChevronRight size={15} />
              <span className="text-black">Projects</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 border-2 border-black bg-white px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider sm:flex"><Command size={12} /> Your workspace</span>
              <button type="button" onClick={openCreateDialog} className="inline-flex items-center gap-2 border-[2px] border-black bg-[#ff8fc7] px-3 py-2 text-xs font-black shadow-[3px_3px_0_#171717] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#171717] sm:px-4 sm:text-sm">
                <Plus size={16} strokeWidth={3} />
                <span className="hidden sm:inline">New project</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-[1180px] px-5 pb-16 pt-9 sm:px-8 sm:pt-12 lg:px-12">
            <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 border-2 border-black bg-[#b9a8ff] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] shadow-[3px_3px_0_#171717]">
                  <Sparkles size={13} strokeWidth={3} />
                  Your ideas, organized
                </div>
                <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.07em] sm:text-6xl">The project<br className="sm:hidden" /> zone<span className="text-[#7156ff]">.</span></h1>
                <p className="mt-4 max-w-lg text-sm font-medium leading-6 text-neutral-600 sm:text-base">Every build you’ve been cooking up, all in one place. Pick a project and keep the good stuff moving.</p>
              </div>
              <div className="flex gap-3">
                <div className="min-w-[108px] border-[2px] border-black bg-white p-3 shadow-[4px_4px_0_#171717] sm:min-w-[126px] sm:p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Projects</p>
                  <p className="mt-1 text-3xl font-black tracking-[-0.06em]">{loading ? "—" : projects.length.toString().padStart(2, "0")}</p>
                </div>
                <div className="min-w-[108px] border-[2px] border-black bg-[#c9ff55] p-3 shadow-[4px_4px_0_#171717] sm:min-w-[126px] sm:p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-700">Tables</p>
                  <p className="mt-1 text-3xl font-black tracking-[-0.06em]">{loading ? "—" : totalTables.toString().padStart(2, "0")}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 border-b-[3px] border-black pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-[-0.04em]">All projects <span className="text-[#7156ff]">({loading ? "…" : filteredProjects.length})</span></h2>
                <p className="mt-1 text-xs font-medium text-neutral-500">Your latest work, served fresh.</p>
              </div>
              <label className="flex h-11 items-center gap-2 border-2 border-black bg-white px-3 shadow-[3px_3px_0_#171717] sm:w-[280px]">
                <Search size={16} strokeWidth={2.5} className="shrink-0" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a project..." className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-neutral-400" />
              </label>
            </div>

            {error ? (
              <div className="mt-8 border-[3px] border-black bg-[#ffb9a9] p-6 shadow-[6px_6px_0_#171717] sm:p-8">
                <div className="flex items-start gap-3">
                  <TriangleAlert size={22} strokeWidth={2.5} />
                  <div className="flex-1">
                    <h3 className="font-black">The list is taking a nap.</h3>
                    <p className="mt-1 text-sm font-medium">{error}</p>
                    <button onClick={() => void loadProjects()} className="mt-4 border-2 border-black bg-white px-4 py-2 text-xs font-black shadow-[3px_3px_0_#171717] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#171717]">Try again</button>
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[0, 1, 2].map((item) => <div key={item} className="h-[220px] animate-pulse border-[3px] border-black/20 bg-white/60" />)}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="mt-8 border-[3px] border-black bg-[#fff1b8] px-5 py-12 text-center shadow-[6px_6px_0_#171717] sm:py-16">
                <span className="mx-auto grid size-14 place-items-center border-[3px] border-black bg-white shadow-[3px_3px_0_#171717]"><Box size={25} strokeWidth={2.5} /></span>
                <h3 className="mt-5 text-2xl font-black tracking-[-0.05em]">{search ? "No matches, bestie." : "It’s giving blank canvas."}</h3>
                <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-neutral-600">{search ? "Try another name and we’ll find the right one." : "Your first project is one click away. Start sketching your next big idea."}</p>
                {!search && <button type="button" onClick={openCreateDialog} className="mt-6 inline-flex items-center gap-2 border-[2px] border-black bg-[#c9ff55] px-4 py-3 text-sm font-black shadow-[4px_4px_0_#171717] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#171717]"><Plus size={17} strokeWidth={3} /> Create your first project</button>}
              </div>
            ) : (
              <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProjects.map((project, index) => {
                  const palette = ["bg-[#b9a8ff]", "bg-[#ffb9a9]", "bg-[#c9ff55]", "bg-[#91e6ff]"];
                  return (
                    <Link key={project._id} href={`/p/${project._id}`} aria-label={`Open ${project.projectName}`} className="flex min-h-[226px] flex-col border-[3px] border-black bg-white text-left shadow-[5px_5px_0_#171717] transition duration-150 hover:-translate-y-1 hover:shadow-[8px_8px_0_#171717] focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#7156ff]">
                      <div className={`flex items-center justify-between border-b-[3px] border-black px-4 py-3 ${palette[index % palette.length]}`}>
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em]"><span className="size-2 rounded-full border border-black bg-white" /> Project #{String(index + 1).padStart(2, "0")}</span>
                        <span aria-hidden="true" className="size-3 rotate-45 border-2 border-black bg-white" />
                      </div>
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <h3 className="line-clamp-2 break-words text-xl font-black leading-tight tracking-[-0.05em]">{project.projectName}</h3>
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-neutral-500">
                          <span className="inline-flex items-center gap-1.5"><Database size={14} strokeWidth={2.5} className="text-black" />{project.tableData.length} {project.tableData.length === 1 ? "table" : "tables"}</span>
                          <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} strokeWidth={2.5} className="text-black" />Updated {formatUpdatedAt(project.updatedAt)}</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between border-t-2 border-dashed border-neutral-300 pt-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Schema project</span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#7156ff]">Saved and synced ✓</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {!loading && !error && projects.length > 0 && (
              <p className="mt-8 text-center text-[11px] font-bold text-neutral-500">That’s the whole lineup — you’re all caught up ✨</p>
            )}
          </div>
        </section>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !creating) setCreateOpen(false);
        }}>
          <form onSubmit={createProject} className="w-full max-w-md border-[3px] border-black bg-[#f7f4ed] p-5 shadow-[8px_8px_0_#171717] sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 border-2 border-black bg-[#c9ff55] px-2 py-1 text-[9px] font-black uppercase tracking-widest"><Sparkles size={11} /> Fresh start</span>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.05em]">Name your project</h2>
                <p className="mt-1 text-sm font-medium text-neutral-600">Give this schema a name and let’s get cooking.</p>
              </div>
              <button type="button" disabled={creating} onClick={() => setCreateOpen(false)} aria-label="Close" className="border-2 border-black bg-white px-2 py-1 font-black disabled:opacity-50">×</button>
            </div>
            <label htmlFor="new-project-name" className="text-xs font-black uppercase tracking-wider">Project name</label>
            <input id="new-project-name" autoFocus required maxLength={100} value={newProjectName} onChange={(event) => setNewProjectName(event.target.value)} placeholder="e.g. Snack tracker" className="mt-2 w-full border-2 border-black bg-white px-3 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#7156ff]" />
            {createError && <p role="alert" className="mt-3 border-2 border-black bg-[#ffb9a9] px-3 py-2 text-xs font-bold">{createError}</p>}
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" disabled={creating} onClick={() => setCreateOpen(false)} className="border-2 border-black bg-white px-4 py-2.5 text-xs font-black disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={creating || !newProjectName.trim()} className="inline-flex items-center gap-2 border-2 border-black bg-[#ff8fc7] px-4 py-2.5 text-xs font-black shadow-[3px_3px_0_#171717] disabled:cursor-wait disabled:opacity-50">{creating ? "Creating…" : "Create project"}<ChevronRight size={15} strokeWidth={3} /></button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
