import mongoose, { Document, model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
export interface IRoom extends Document {
  roomId: number;
  price: number;
  type: "single" | "double" | "suite";
  isAvailable: boolean;
  description?: string;
  images: { url: string; id: string }[];
}
export const roomSchema = new Schema<IRoom>(
  {
    roomId: { type: Number, required: true, unique: true },
    price: { type: Number, min: 0, required: true },
    type: { type: String, enum: ["single", "double", "suite"], required: true },
    isAvailable: { type: Boolean, default: true },
    description: { type: String },
    images: [
      {
        url: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
  },
  { timestamps: true, strictQuery: true }
);
roomSchema.plugin(mongoosePaginate);
// query helper for paginate

export const Room = model<IRoom, mongoose.PaginateModel<IRoom>>(
  "Room",
  roomSchema
);
