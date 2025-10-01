import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";
const userSchema = new Schema({
    userName: { type: String, required: true, min: 3, max: 30 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    forgetCode: { type: String },
    profileImage: { url: { type: String }, id: { type: String } },
    gender: { type: String, enum: ["female", "male"] },
}, { timestamps: true });
userSchema.pre("save", function () {
    if (this.isModified("password")) {
        this.password = bcryptjs.hashSync(this.password, parseInt(process.env.SALT_ROUNDS));
    }
});
export const User = model("User", userSchema);
//# sourceMappingURL=user.model.js.map