import { Request, Response, NextFunction, RequestHandler } from "express";

// نعرف نوع الـ controller
type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (controller: AsyncController): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    return controller(req, res, next).catch((error) => next(error));
  };
};
