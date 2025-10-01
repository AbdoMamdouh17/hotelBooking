import { Types, Schema, Document, model } from "mongoose";

export interface Itoken extends Document {
  user: Types.ObjectId;
  token: string;
  expiredAt: String;
  isValid: boolean;
}
const tokenSchema = new Schema<Itoken>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    token: { type: String, required: true },
    expiredAt: { type: String },
    isValid: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export const Token = model<Itoken>("Token", tokenSchema);
