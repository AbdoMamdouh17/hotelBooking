import { Document, model, Schema, Types } from "mongoose";

export interface IReservation extends Document {
  room: Types.ObjectId;
  user: Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  transactionId?: string;
}
export const reservationSchema = new Schema<IReservation>(
  {
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    totalPrice: { type: Number, required: true },

    transactionId: { type: String },
  },

  { timestamps: true }
);
export const Reservation = model<IReservation>(
  "Reservation",
  reservationSchema
);
