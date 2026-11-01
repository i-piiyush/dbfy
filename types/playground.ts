import type { ProjectSummary } from "@/types/project";

/** List and dialog state for the project workspace page. */
export type PlaygroundState = {
  projects: ProjectSummary[];
  search: string;
  loading: boolean;
  error: string;
  createOpen: boolean;
  newProjectName: string;
  creating: boolean;
  createError: string;
  projectToRename: ProjectSummary | null;
  renameDraft: string;
  renaming: boolean;
  renameError: string;
  projectToDelete: ProjectSummary | null;
  deleting: boolean;
  deleteError: string;
};

export type PlaygroundAction =
  | { type: "search-changed"; value: string }
  | { type: "projects-loaded"; projects: ProjectSummary[] }
  | { type: "projects-failed"; message: string }
  | { type: "projects-retry" }
  | { type: "create-opened" }
  | { type: "create-closed" }
  | { type: "create-name-changed"; value: string }
  | { type: "create-started" }
  | { type: "create-failed"; message: string }
  | { type: "create-finished" }
  | { type: "rename-opened"; project: ProjectSummary }
  | { type: "rename-closed" }
  | { type: "rename-draft-changed"; value: string }
  | { type: "rename-started" }
  | { type: "rename-failed"; message: string }
  | { type: "project-renamed"; id: string; projectName: string; updatedAt: string }
  | { type: "rename-finished" }
  | { type: "delete-opened"; project: ProjectSummary }
  | { type: "delete-closed" }
  | { type: "delete-started" }
  | { type: "delete-failed"; message: string }
  | { type: "project-deleted"; id: string }
  | { type: "delete-finished" };
