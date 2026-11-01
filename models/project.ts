
import type { IProject } from "@/types/project";
import mongoose, { Schema, Model } from "mongoose";

const ReferencesSchema = new Schema(
  {
    tableId: { type: String, required: true },
    fieldId: { type: String, required: true },
  },
  { _id: false },
);

const TableDataFieldSchema = new Schema(
  {
    fieldId: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, default: null },
    isPK: { type: Boolean, required: true },
    isUnique: { type: Boolean, required: true },
    isNullable: { type: Boolean, required: true },
    generatedId: { type: String, enum: ["autoincrement", "uuid"] },
    references: { type: ReferencesSchema, default: undefined },
  },
  { _id: false },
);

const TableDataSchema = new Schema(
  {
    tableId: { type: String, required: true },
    name: { type: String, required: true },
    fields: { type: [TableDataFieldSchema], default: [] },
  },
  { _id: false },
);

const ProjectSchema = new Schema<IProject>(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    tableData: { type: [TableDataSchema], default: [] },
    userID: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ProjectSchema.index({ userID: 1, projectName: 1 }, { unique: true });

// Keep the registered model name so Mongoose continues using the existing `fields` collection.
const Project: Model<IProject> =
  mongoose.models.Field ||
  mongoose.model<IProject>("Field", ProjectSchema);

export default Project;
