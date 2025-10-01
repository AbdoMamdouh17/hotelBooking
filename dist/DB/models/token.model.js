import { Schema, model } from "mongoose";
const tokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    isValid: { type: Boolean, default: true },
}, { timestamps: true });
export const Token = model("Token", tokenSchema);
//# sourceMappingURL=token.model.js.map