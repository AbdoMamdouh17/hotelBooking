import Joi, { ObjectSchema } from "joi";
import { isValidObjectId } from "../../middlware/validation.middlware.js";
export const createReservation: ObjectSchema = Joi.object({
  roomId: Joi.string().custom(isValidObjectId).required(),
  userId: Joi.string().custom(isValidObjectId).required(),
  checkInDate: Joi.date().min("now").required(),
  checkOutDate: Joi.date().greater(Joi.ref("checkInDate")).required(),
}).required();
//updateReservation
export const updateReservation: ObjectSchema = Joi.object({
  id: Joi.string().custom(isValidObjectId).required(),
  checkInDate: Joi.date().min("now"),
  checkOutDate: Joi.date().greater(Joi.ref("checkInDate")),
  room: Joi.string().custom(isValidObjectId),
}).required();

// cancelReservation
export const cancelReservation: ObjectSchema = Joi.object({
  id: Joi.string().custom(isValidObjectId).required(),
}).required();

//payForReservation
export const payForReservation: ObjectSchema = Joi.object({
  id: Joi.string().custom(isValidObjectId).required(),
}).required();
