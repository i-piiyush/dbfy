import axios from "axios";
import type { ApiResponse } from "@/types/api-response";
import type { ProjectSummary } from "@/types/project";
import type { SavedProject } from "@/types/project";
import type { SchemaTable } from "@/types/schema";

export type CreatedProject = { id: string; projectName: string };
export type RenamedProject = { id: string; projectName: string; updatedAt: string };
export type DeletedProject = { id: string };
export type SavedProjectResult = { projectName: string; tableCount: number };

/** Keep project HTTP details out of the page and action hooks. */
export const projectApi = {
  list: () => axios.get<ApiResponse<ProjectSummary[]>>("/api/get-projects", {
    validateStatus: () => true,
  }),

  get: (projectId: string) => axios.get<ApiResponse<SavedProject>>(
    `/api/fetch-table/${encodeURIComponent(projectId)}`,
    { validateStatus: () => true },
  ),

  create: (projectName: string) => axios.post<ApiResponse<CreatedProject>>(
    "/api/create-project",
    { projectName },
    { validateStatus: () => true },
  ),

  rename: (projectId: string, projectName: string) => axios.patch<ApiResponse<RenamedProject>>(
    "/api/rename-project",
    { projectId, projectName },
    { validateStatus: () => true },
  ),

  delete: (projectId: string) => axios.delete<ApiResponse<DeletedProject>>("/api/delete-project", {
    data: { projectId },
    validateStatus: () => true,
  }),

  save: (projectId: string, tableData: SchemaTable[]) => axios.post<ApiResponse<SavedProjectResult>>(
    "/api/save-project",
    { projectId, tableData },
    { validateStatus: () => true },
  ),
};
