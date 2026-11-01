import type { SchemaTable } from "@/types/schema";

/** Mongoose document shape. The model name remains `Field` for collection compatibility. */
export type IProject = {
  projectName: string;
  tableData: SchemaTable[];
  createdAt: Date;
  updatedAt: Date;
  userID: string;
};

/** Project card payload; table schemas stay on the project detail endpoint. */
export type ProjectSummary = {
  _id: string;
  projectName: string;
  tableCount: number;
  createdAt: string;
  updatedAt: string;
};

export type SavedProject = {
  _id: string;
  projectName: string;
  tableData: SchemaTable[];
  createdAt: string;
  updatedAt: string;
};
