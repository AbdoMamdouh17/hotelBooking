import { Router } from "express";
import { validation } from "../../middlware/validation.middlware.js";
import * as authController from "./auth.controller.js";
import * as authSchema from "./auth.schema.js";
const router: Router = Router();
//register
router.post(
  "/register",
  validation(authSchema.register),
  authController.register
);
//login
router.post("/login", validation(authSchema.login), authController.login);
//send forgwt code
router.patch(
  "/forgetPassword",
  validation(authSchema.forgetCode),
  authController.forgetCode
);
// reset password
router.patch(
  "/resetPassword",
  validation(authSchema.resetPassword),
  authController.resetPassword
);
// logout
router.get("/logout", authController.logout);
// refresh token
router.get("/refresh", authController.refreshToken);

export default router;
