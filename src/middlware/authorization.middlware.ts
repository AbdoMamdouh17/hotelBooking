import { Request, Response, NextFunction } from "express";
export const isAuthorized = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new Error("User not authenticated", { cause: 401 }));
    }
    if (!roles.includes(req.user.role)) {
      return next(new Error("Not Authorized!", { cause: 403 }));
    }
    next();
  };
};
