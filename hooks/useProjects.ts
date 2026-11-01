"use client";

import { useCallback, useEffect } from "react";
import { projectApi } from "@/lib/api/project-api";
import type { PlaygroundAction } from "@/types/playground";

/** Loads the workspace list on entry and exposes the same request for retries. */
export function useProjects(dispatch: React.Dispatch<PlaygroundAction>) {
  const loadProjects = useCallback(async () => {
    try {
      const result = await projectApi.list();
      if (result.status < 200 || result.status >= 300 || !result.data.success) {
        dispatch({
          type: "projects-failed",
          message: result.data.success ? "Could not load your projects right now." : result.data.message,
        });
        return;
      }
      dispatch({ type: "projects-loaded", projects: result.data.data ?? [] });
    } catch {
      dispatch({ type: "projects-failed", message: "Could not reach your workspace. Check your connection and try again." });
    }
  }, [dispatch]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  return { loadProjects };
}
