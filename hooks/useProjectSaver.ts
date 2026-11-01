"use client";

import { projectApi } from "@/lib/api/project-api";
import type { ProjectEditorAction } from "@/types/project-editor";
import type { SchemaTable } from "@/types/schema";

type ProjectSaverOptions = {
  projectId: string;
  tables: SchemaTable[];
  saving: boolean;
  hasUnsavedChanges: boolean;
  confirm: (options: { title: string; description: string; confirmLabel?: string; cancelLabel?: string }) => Promise<boolean>;
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, options?: { duration?: number }) => void;
    info: (message: string, duration?: number) => void;
  };
  dispatch: React.Dispatch<ProjectEditorAction>;
};

/** Saves the current canvas and updates the snapshot only after success. */
export function useProjectSaver({
  projectId,
  tables,
  saving,
  hasUnsavedChanges,
  confirm,
  toast,
  dispatch,
}: ProjectSaverOptions) {
  return async function saveTables() {
    if (saving || !hasUnsavedChanges) return;
    if (tables.length === 0) {
      const confirmed = await confirm({
        title: "Save an empty canvas?",
        description: "This will remove all saved tables from this project.",
        confirmLabel: "Save empty canvas",
      });
      if (!confirmed) return;
    }

    const submittedTables = structuredClone(tables);
    const submittedSnapshot = JSON.stringify(submittedTables);
    dispatch({ type: "saving", value: true });
    try {
      const result = await projectApi.save(projectId, submittedTables);
      const payload = result.data;
      if (result.status < 200 || result.status >= 300 || !payload.success) {
        dispatch({ type: "saving", value: false });
        const details = payload.success ? [] : payload.errors ?? [];
        const visibleDetails = details.slice(0, 5);
        const remainingCount = details.length - visibleDetails.length;
        const errorMessage = [
          payload.message,
          ...visibleDetails,
          ...(remainingCount > 0 ? [`And ${remainingCount} more validation issue(s).`] : []),
        ].join(" • ");
        toast.error(errorMessage, { duration: 8000 });
        return;
      }

      toast.success(payload.message);
      dispatch({ type: "saved", tablesSnapshot: submittedSnapshot });
    } catch {
      dispatch({ type: "saving", value: false });
      toast.error("Could not save the project because the server returned an invalid response or could not be reached.");
    }
  };
}
