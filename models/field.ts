
import { IField } from "@/types/fieldModel.type";
import mongoose, { Schema, Model } from "mongoose";



const FieldSchema = new Schema<IField>(
  {
    fieldName: {
      type: String,
      required: true,
      trim: true,
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Field: Model<IField> =
  mongoose.models.Field ||
  mongoose.model<IField>("Field", FieldSchema);

export default Field;
