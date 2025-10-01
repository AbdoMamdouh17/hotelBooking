import { Router } from "express";
import { validation } from "../../middlware/validation.middlware";
import * as authController from "./auth.controller";
import * as authSchema from "./auth.schema";
const router = Router();
//register
router.post("/register", validation(authSchema.register), authController.register);
export default router;
//# sourceMappingURL=auth.router.js.map