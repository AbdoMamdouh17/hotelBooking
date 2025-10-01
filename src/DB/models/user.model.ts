import { Document, Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";
export interface Iuser extends Document {
  userName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: "user" | "admin";
  gender: "male" | "female";
  forgetCode?: string;
  profileImage?: { url: string; id: string };
}
const userSchema = new Schema<Iuser>(
  {
    userName: { type: String, required: true, min: 3, max: 30 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    forgetCode: { type: String },
    profileImage: { url: { type: String }, id: { type: String } },
    gender: { type: String, enum: ["female", "male"] },
  },
  { timestamps: true }
);
userSchema.pre<Iuser>("save", function () {
  if (this.isModified("password")) {
    this.password = bcryptjs.hashSync(
      this.password,
      parseInt(process.env.SALT_ROUNDS!)
    );
  }
});
export const User = model<Iuser>("User", userSchema);
