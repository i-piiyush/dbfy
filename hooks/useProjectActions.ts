"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { projectApi } from "@/lib/api/project-api";
import type { PlaygroundAction, PlaygroundState } from "@/types/playground";

type ActionState = Pick<
  PlaygroundState,
  "creating" | "newProjectName" | "projectToRename" | "renameDraft" | "renaming" | "projectToDelete" | "deleting"
>;

/** Owns project mutations and reports their outcomes through reducer actions. */
export function useProjectActions(
  state: ActionState,
  dispatch: React.Dispatch<PlaygroundAction>,
) {
  const router = useRouter();

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.creating) return;
    dispatch({ type: "create-started" });
    try {
      const result = await projectApi.create(state.newProjectName);
      if (result.status < 200 || result.status >= 300 || !result.data.success || !result.data.data) {
        dispatch({
          type: "create-failed",
          message: result.data.success ? "The new project could not be opened." : result.data.message,
        });
        return;
      }
      router.push(`/p/${result.data.data.id}`);
    } catch {
      dispatch({ type: "create-failed", message: "Could not create your project. Check your connection and try again." });
    } finally {
      dispatch({ type: "create-finished" });
    }
  }

  async function renameProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state.projectToRename || state.renaming) return;
    dispatch({ type: "rename-started" });
    try {
      const result = await projectApi.rename(state.projectToRename._id, state.renameDraft);
      if (result.status < 200 || result.status >= 300 || !result.data.success || !result.data.data) {
        dispatch({
          type: "rename-failed",
          message: result.data.success ? "The project could not be renamed." : result.data.message,
        });
        return;
      }
      dispatch({ type: "project-renamed", ...result.data.data });
    } catch {
      dispatch({ type: "rename-failed", message: "Could not rename this project. Check your connection and try again." });
    } finally {
      dispatch({ type: "rename-finished" });
    }
  }

  async function deleteProject() {
    if (!state.projectToDelete || state.deleting) return;
    dispatch({ type: "delete-started" });
    try {
      const result = await projectApi.delete(state.projectToDelete._id);
      if (result.status < 200 || result.status >= 300 || !result.data.success) {
        dispatch({
          type: "delete-failed",
          message: result.data.success ? "The project could not be deleted." : result.data.message,
        });
        return;
      }
      dispatch({ type: "project-deleted", id: state.projectToDelete._id });
    } catch {
      dispatch({ type: "delete-failed", message: "Could not delete this project. Check your connection and try again." });
    } finally {
      dispatch({ type: "delete-finished" });
    }
  }

  return { createProject, renameProject, deleteProject };
}
