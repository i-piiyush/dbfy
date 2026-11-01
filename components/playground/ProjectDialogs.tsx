import type { FormEvent } from "react";
import { motion } from "motion/react";
import { ChevronRight, Pencil, Sparkles, Trash2, TriangleAlert } from "lucide-react";
import NeoDialog from "@/components/ui/NeoDialog";
import type { ProjectSummary } from "@/types/project";

type ProjectDialogsProps = {
  createOpen: boolean;
  newProjectName: string;
  creating: boolean;
  createError: string;
  onCreateNameChange: (value: string) => void;
  onCreateClose: () => void;
  onCreateSubmit: (event: FormEvent<HTMLFormElement>) => void;
  projectToRename: ProjectSummary | null;
  renameDraft: string;
  renaming: boolean;
  renameError: string;
  onRenameDraftChange: (value: string) => void;
  onRenameClose: () => void;
  onRenameSubmit: (event: FormEvent<HTMLFormElement>) => void;
  projectToDelete: ProjectSummary | null;
  deleting: boolean;
  deleteError: string;
  onDeleteClose: () => void;
  onDeleteConfirm: () => void;
};

export default function ProjectDialogs(props: ProjectDialogsProps) {
  return (
    <>
      {props.createOpen && (
        <NeoDialog open title="Create project" onClose={props.onCreateClose} closeDisabled={props.creating} unframed>
          <motion.form initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.18 }} onSubmit={props.onCreateSubmit} className="w-full max-w-md border-[3px] border-ink bg-canvas p-5 shadow-[8px_8px_0_var(--palette-ink)] sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 border-2 border-ink bg-acid px-2 py-1 text-[9px] font-black uppercase tracking-widest"><Sparkles size={11} /> Fresh start</span>
                <h2 className="mt-3 text-2xl font-black tracking-[-0.05em]">Name your project</h2>
                <p className="mt-1 text-sm font-medium text-neutral-600">Give this schema a name and let’s get cooking.</p>
              </div>
              <button type="button" disabled={props.creating} onClick={props.onCreateClose} aria-label="Close" className="border-2 border-ink bg-white px-2 py-1 font-black disabled:opacity-50">×</button>
            </div>
            <label htmlFor="new-project-name" className="text-xs font-black uppercase tracking-wider">Project name</label>
            <input id="new-project-name" autoFocus required maxLength={100} value={props.newProjectName} onChange={(event) => props.onCreateNameChange(event.target.value)} placeholder="e.g. Snack tracker" className="mt-2 w-full border-2 border-ink bg-white px-3 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand" />
            {props.createError && <p role="alert" className="mt-3 border-2 border-ink bg-coral px-3 py-2 text-xs font-bold">{props.createError}</p>}
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" disabled={props.creating} onClick={props.onCreateClose} className="border-2 border-ink bg-white px-4 py-2.5 text-xs font-black disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={props.creating || !props.newProjectName.trim()} className="inline-flex items-center gap-2 border-2 border-ink bg-pink px-4 py-2.5 text-xs font-black shadow-[3px_3px_0_var(--palette-ink)] disabled:cursor-wait disabled:opacity-50">{props.creating ? "Creating…" : "Create project"}<ChevronRight size={15} strokeWidth={3} /></button>
            </div>
          </motion.form>
        </NeoDialog>
      )}

      {props.projectToRename && (
        <NeoDialog open title="Rename project" onClose={props.onRenameClose} closeDisabled={props.renaming} unframed>
          <motion.form initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.18 }} onSubmit={props.onRenameSubmit} className="w-full max-w-md border-[3px] border-ink bg-canvas p-5 shadow-[8px_8px_0_var(--palette-ink)] sm:p-7">
            <div className="mb-5">
              <span className="inline-flex items-center gap-1.5 border-2 border-ink bg-violet px-2 py-1 text-[9px] font-black uppercase tracking-widest"><Pencil size={11} /> Rename project</span>
              <h2 className="mt-3 text-2xl font-black tracking-[-0.05em]">Give it a new name.</h2>
            </div>
            <label htmlFor="rename-project-name" className="text-xs font-black uppercase tracking-wider">Project name</label>
            <input id="rename-project-name" autoFocus required maxLength={100} value={props.renameDraft} onChange={(event) => props.onRenameDraftChange(event.target.value)} className="mt-2 w-full border-2 border-ink bg-white px-3 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand" />
            {props.renameError && <p role="alert" className="mt-3 border-2 border-ink bg-coral px-3 py-2 text-xs font-bold">{props.renameError}</p>}
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" disabled={props.renaming} onClick={props.onRenameClose} className="border-2 border-ink bg-white px-4 py-2.5 text-xs font-black disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={props.renaming || !props.renameDraft.trim()} className="inline-flex items-center gap-2 border-2 border-ink bg-violet px-4 py-2.5 text-xs font-black shadow-[3px_3px_0_var(--palette-ink)] disabled:cursor-wait disabled:opacity-50">{props.renaming ? "Renaming..." : "Save name"}<ChevronRight size={15} strokeWidth={3} /></button>
            </div>
          </motion.form>
        </NeoDialog>
      )}

      {props.projectToDelete && (
        <NeoDialog open title="Delete project" onClose={props.onDeleteClose} closeDisabled={props.deleting} unframed>
          <motion.section initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.18 }} className="w-full max-w-md border-[3px] border-ink bg-canvas p-5 text-ink shadow-[8px_8px_0_var(--palette-ink)] sm:p-7">
            <div className="flex size-11 items-center justify-center border-[3px] border-ink bg-coral shadow-[3px_3px_0_var(--palette-ink)]"><TriangleAlert size={21} strokeWidth={2.8} /></div>
            <h2 id="delete-project-title" className="mt-5 text-2xl font-black tracking-[-0.05em]">Delete “{props.projectToDelete.projectName}”?</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-neutral-600">This permanently removes the project and its saved tables. There is no undo.</p>
            {props.deleteError && <p role="alert" className="mt-3 border-2 border-ink bg-coral px-3 py-2 text-xs font-bold">{props.deleteError}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" disabled={props.deleting} onClick={props.onDeleteClose} className="border-2 border-ink bg-white px-4 py-2.5 text-xs font-black shadow-[2px_2px_0_var(--palette-ink)] disabled:opacity-50">Keep project</button>
              <button type="button" disabled={props.deleting} onClick={props.onDeleteConfirm} className="inline-flex items-center gap-2 border-2 border-ink bg-pink px-4 py-2.5 text-xs font-black shadow-[3px_3px_0_var(--palette-ink)] disabled:cursor-wait disabled:opacity-50"><Trash2 size={14} />{props.deleting ? "Deleting..." : "Yes, delete"}</button>
            </div>
          </motion.section>
        </NeoDialog>
      )}
    </>
  );
}
