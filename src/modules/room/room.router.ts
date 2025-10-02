import { Router } from "express";
import { isAuthenticated } from "../../middlware/authentication.middlware.js";
import { validation } from "../../middlware/validation.middlware.js";
import { isAuthorized } from "../../middlware/authorization.middlware.js";
import * as roomController from "./room.controller.js";
import * as roomSchema from "./room.schema.js";
import { fileUpload } from "../../utils/fileUpload.js";
const router: Router = Router();
//create room
router.post(
  "/createRoom",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().array("images", 5),
  validation(roomSchema.createRoom),
  roomController.createRoom
);
// get all room
router.get("/getAllRoom", isAuthenticated, roomController.getAllRoom);
//update room
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().array("images", 5),
  validation(roomSchema.updateRoom),
  roomController.updateRoom
);

export default router;
