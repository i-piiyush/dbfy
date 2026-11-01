import type { PlaygroundAction, PlaygroundState } from "@/types/playground";

export const initialPlaygroundState: PlaygroundState = {
  projects: [],
  search: "",
  loading: true,
  error: "",
  createOpen: false,
  newProjectName: "",
  creating: false,
  createError: "",
  projectToRename: null,
  renameDraft: "",
  renaming: false,
  renameError: "",
  projectToDelete: null,
  deleting: false,
  deleteError: "",
};

/** Keeps project list changes and dialog lifecycles in one place. */
export function playgroundReducer(
  state: PlaygroundState,
  action: PlaygroundAction,
): PlaygroundState {
  switch (action.type) {
    case "search-changed":
      return { ...state, search: action.value };
    case "projects-loaded":
      return { ...state, projects: action.projects, loading: false, error: "" };
    case "projects-failed":
      return { ...state, loading: false, error: action.message };
    case "projects-retry":
      return { ...state, loading: true, error: "" };
    case "create-opened":
      return { ...state, createOpen: true, newProjectName: "", createError: "" };
    case "create-closed":
      return { ...state, createOpen: false };
    case "create-name-changed":
      return { ...state, newProjectName: action.value };
    case "create-started":
      return { ...state, creating: true, createError: "" };
    case "create-failed":
      return { ...state, createError: action.message };
    case "create-finished":
      return { ...state, creating: false };
    case "rename-opened":
      return { ...state, projectToRename: action.project, renameDraft: action.project.projectName, renameError: "" };
    case "rename-closed":
      return { ...state, projectToRename: null };
    case "rename-draft-changed":
      return { ...state, renameDraft: action.value };
    case "rename-started":
      return { ...state, renaming: true, renameError: "" };
    case "rename-failed":
      return { ...state, renameError: action.message };
    case "project-renamed":
      return {
        ...state,
        projects: state.projects.map((project) => project._id === action.id
          ? { ...project, projectName: action.projectName, updatedAt: action.updatedAt }
          : project),
        projectToRename: null,
      };
    case "rename-finished":
      return { ...state, renaming: false };
    case "delete-opened":
      return { ...state, projectToDelete: action.project, deleteError: "" };
    case "delete-closed":
      return { ...state, projectToDelete: null };
    case "delete-started":
      return { ...state, deleting: true, deleteError: "" };
    case "delete-failed":
      return { ...state, deleteError: action.message };
    case "project-deleted":
      return {
        ...state,
        projects: state.projects.filter((project) => project._id !== action.id),
        projectToDelete: null,
      };
    case "delete-finished":
      return { ...state, deleting: false };
  }
}
