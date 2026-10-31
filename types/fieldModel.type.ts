import mongoose from "mongoose";

export type IField = {
 fieldName: string;
  createdAt: Date;
  updatedAt: Date;
  userID: mongoose.Types.ObjectId;
};