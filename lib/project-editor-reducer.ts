import type { ProjectEditorAction, ProjectEditorState } from "@/types/project-editor";

export const initialProjectEditorState: ProjectEditorState = {
  schemaOpen: false,
  copied: false,
  saving: false,
  projectName: "",
  projectLoading: true,
  projectLoadError: "",
  savedTablesSnapshot: null,
  schemaFormat: "sql",
};

/** Applies one focused editor transition while keeping related flags in sync. */
export function projectEditorReducer(
  state: ProjectEditorState,
  action: ProjectEditorAction,
): ProjectEditorState {
  switch (action.type) {
    case "project-loaded":
      return {
        ...state,
        projectName: action.projectName,
        projectLoading: false,
        projectLoadError: "",
        savedTablesSnapshot: action.tablesSnapshot,
      };
    case "project-load-failed":
      return { ...state, projectLoading: false, projectLoadError: action.message };
    case "schema-panel":
      return { ...state, schemaOpen: action.open };
    case "schema-format":
      return { ...state, schemaFormat: action.format, copied: false, schemaOpen: true };
    case "copied":
      return { ...state, copied: action.value };
    case "saving":
      return { ...state, saving: action.value };
    case "saved":
      return { ...state, saving: false, savedTablesSnapshot: action.tablesSnapshot };
  }
}
