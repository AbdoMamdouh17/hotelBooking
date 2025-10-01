import { Request, Response, NextFunction, RequestHandler } from "express";
type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const asyncHandler: (controller: AsyncController) => RequestHandler;
export {};
//# sourceMappingURL=asyncHandler.d.ts.map