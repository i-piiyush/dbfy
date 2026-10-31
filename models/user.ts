
import { IUser } from "@/types/userModel.type";
import mongoose, { Schema, Model } from "mongoose";



const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    versionKey: false,
  }
);

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

export default User;
