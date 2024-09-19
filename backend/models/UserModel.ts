import { model, Schema } from "mongoose";
import mongoose from 'mongoose';

export interface IUser {
  _id:any
  name: string;
  email: string;
  password: string;
  profilePicture: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: [true, "provide email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "provide password"],
    },
    profilePicture: {
      type: String,
      default: "",
    },
    // Ensure _id is of type ObjectId
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(), // Automatically set _id if not provided
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUser>("Users", userSchema);
