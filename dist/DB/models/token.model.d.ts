import { Types, Document } from "mongoose";
export interface Itoken extends Document {
    user: Types.ObjectId;
    token: string;
    expiresAt: Date;
    isValid: boolean;
}
export declare const Token: import("mongoose").Model<Itoken, {}, {}, {}, Document<unknown, {}, Itoken, {}, {}> & Itoken & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=token.model.d.ts.map