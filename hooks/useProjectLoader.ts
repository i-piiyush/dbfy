"use client";

import { useEffect } from "react";
import { projectApi } from "@/lib/api/project-api";
import { buildProjectGraph } from "@/lib/project-flow";
import { useProjectStore } from "@/store/project-store";
import type { ProjectEditorAction } from "@/types/project-editor";

/** Loads a project and restores its tables and graph into the canvas store. */
export function useProjectLoader(projectId: string, dispatch: React.Dispatch<ProjectEditorAction>) {
  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        const result = await projectApi.get(projectId);
        if (!active) return;
        if (result.status < 200 || result.status >= 300 || !result.data.success || !result.data.data) {
          dispatch({
            type: "project-load-failed",
            message: result.data.success ? "The saved project data was missing." : result.data.message,
          });
          return;
        }

        const savedProject = result.data.data;
        const { nodes, edges } = buildProjectGraph(savedProject.tableData);
        useProjectStore.setState({
          tables: savedProject.tableData,
          nodes,
          edges,
          projectError: null,
          newTableToFocus: null,
        });
        dispatch({
          type: "project-loaded",
          projectName: savedProject.projectName,
          tablesSnapshot: JSON.stringify(savedProject.tableData),
        });
      } catch {
        if (active) {
          dispatch({
            type: "project-load-failed",
            message: "Could not connect to this project. Check your connection and try again.",
          });
        }
      }
    }

    void loadProject();
    return () => {
      active = false;
    };
  }, [dispatch, projectId]);
}
