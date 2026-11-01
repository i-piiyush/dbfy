import type { SchemaFormat } from "@/lib/schema-options";

/** UI state for the project schema editor, separate from canvas state. */
export type ProjectEditorState = {
  schemaOpen: boolean;
  copied: boolean;
  saving: boolean;
  projectName: string;
  projectLoading: boolean;
  projectLoadError: string;
  savedTablesSnapshot: string | null;
  schemaFormat: SchemaFormat;
};

export type ProjectEditorAction =
  | { type: "project-loaded"; projectName: string; tablesSnapshot: string }
  | { type: "project-load-failed"; message: string }
  | { type: "schema-panel"; open: boolean }
  | { type: "schema-format"; format: SchemaFormat }
  | { type: "copied"; value: boolean }
  | { type: "saving"; value: boolean }
  | { type: "saved"; tablesSnapshot: string };
