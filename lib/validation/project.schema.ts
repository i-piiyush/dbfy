import { z } from "zod";

export const renameProjectSchema = z.object({
  projectId: z.string().regex(/^[a-f\d]{24}$/i, "Project ID must be valid."),
  projectName: z.string().trim().min(1, "Project name cannot be empty.").max(100, "Project names must be 100 characters or fewer."),
}).strict();

export const deleteProjectSchema = z.object({
  projectId: z.string().regex(/^[a-f\d]{24}$/i, "Project ID must be valid."),
}).strict();
