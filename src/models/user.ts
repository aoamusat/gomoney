import { Schema, model, Document } from "mongoose";

export interface UserInterface extends Document {
  username: string;
  password: string;
  role: "admin" | "user";
}

const userSchema = new Schema<UserInterface>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], required: true },
});

export const User = model<UserInterface>("User", userSchema);
