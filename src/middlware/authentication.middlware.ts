import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Token } from "../DB/models/token.model.js";
import { User, Iuser } from "../DB/models/user.model.js";
// types/express/index.d.ts (أو أي ملف types.ts في مشروعك)

declare global {
  namespace Express {
    interface Request {
      user?: Iuser; // أو any لو مش عايز تدقق
    }
  }
}
interface TokenPayload {
  email: string;
}

export const isAuthenticated = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers["authorization"] as string | undefined;
    if (!token || !token.startsWith(process.env.BEARER_KEY!)) {
      return next(new Error("valid token is required", { cause: 401 }));
    }
    const parts = token.split(process.env.BEARER_KEY!);
    if (parts.length < 2 || !parts[1]?.trim()) {
      return next(new Error("Token is missing after Bearer", { cause: 401 }));
    }

    token = parts[1].trim();

    // token = token.split(process.env.BEARER_KEY!)[1].trim();

    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as TokenPayload;

    // const tokenDB = await Token.findOne({ token, isValid: true });
    //if (!tokenDB) return next(new Error("In-valid token", { cause: 401 }));

    const user = await User.findOne({ email: payload.email });
    if (!user) return next(new Error("user not found", { cause: 404 }));

    req.user = user;
    return next();
  }
);
// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { Token } from "../DB/models/token.model.js";
// import { User, Iuser } from "../DB/models/user.model.js";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: Iuser;
//     }
//   }
// }

// interface TokenPayload {
//   email: string;
// }

// export const isAuthenticated = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // 1️⃣ احصل على الـ Authorization header
//     const authHeader = req.headers["authorization"];
//     if (!authHeader?.startsWith(process.env.BEARER_KEY!)) {
//       return next(
//         new Error("Authorization header is required", { cause: 401 })
//       );
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       return next(new Error("Token is missing", { cause: 401 }));
//     }

//     // 2️⃣ تحقق من صحة التوكن
//     let payload: TokenPayload;
//     try {
//       payload = jwt.verify(
//         token,
//         process.env.ACCESS_TOKEN_SECRET!
//       ) as TokenPayload;
//     } catch (err) {
//       return next(new Error("Invalid or expired token", { cause: 401 }));
//     }

//     // // 3️⃣ تحقق لو التوكن موجود وصالح في الـ DB
//     // const tokenDB = await Token.findOne({ token, isValid: true });
//     // if (!tokenDB) return next(new Error("In-valid token", { cause: 401 }));

//     // 4️⃣ تحقق من وجود المستخدم
//     const user = await User.findOne({ email: payload.email });
//     if (!user) return next(new Error("User not found", { cause: 404 }));

//     // 5️⃣ خزّن اليوزر في الـ request
//     req.user = user;
//     next();
//   }
// );
