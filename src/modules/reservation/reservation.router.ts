import express from "express";
import { Router } from "express";
import { isAuthenticated } from "../../middlware/authentication.middlware.js";
import { isAuthorized } from "../../middlware/authorization.middlware.js";
import { validation } from "../../middlware/validation.middlware.js";
import * as reservationSchema from "./reservation.schema.js";
import * as reservationController from "./reservation.controller.js";

const router: Router = Router();

// crud
router.post(
  "/createReservation",
  isAuthenticated,
  validation(reservationSchema.createReservation),
  reservationController.createReservation
);
//update reservation
router.patch(
  "/updateReservation/:id",
  isAuthenticated,
  validation(reservationSchema.updateReservation),
  reservationController.updateReservation
);
// cancel reservation
router.patch(
  "/cancelReservation/:id",
  isAuthenticated,
  validation(reservationSchema.cancelReservation),
  reservationController.cancelReservation
);
// الدفع
router.post(
  "/pay/:id",
  isAuthenticated,
  validation(reservationSchema.payForReservation),
  reservationController.payForReservation
);

//webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  reservationController.reservationWebhook
);

export default router;
