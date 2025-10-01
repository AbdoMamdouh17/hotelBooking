import { Document } from "mongoose";
export interface Iuser extends Document {
    userName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    role: "user" | "admin";
    gender: "male" | "female";
    forgetCode?: string;
    profileImage?: {
        url: string;
        id: string;
    };
}
export declare const User: import("mongoose").Model<Iuser, {}, {}, {}, Document<unknown, {}, Iuser, {}, {}> & Iuser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=user.model.d.ts.map