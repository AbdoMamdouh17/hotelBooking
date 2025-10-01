import Joi, { ObjectSchema } from "joi";
import { isValidObjectId } from "../../middlware/validation.middlware.js";
export const createRoom: ObjectSchema = Joi.object({
  roomId: Joi.number().required(),
  price: Joi.number().min(0).required(),
  type: Joi.string().valid("single", "double", "suite").required(),
  isAvailable: Joi.boolean().default(true),
  description: Joi.string().allow("").optional(),
  images: Joi.array().items(
    Joi.object({ url: Joi.string().required(), id: Joi.string().required() })
  ),
}).required();

//updateRoom
export const updateRoom: ObjectSchema = Joi.object({
  id: Joi.string().custom(isValidObjectId).required(),
  roomId: Joi.number(),
  type: Joi.string().valid("single", "double", "suite"),
  price: Joi.number().min(0),
  isAvailable: Joi.boolean(),
  description: Joi.string().allow("").optional(),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().required(),
      id: Joi.string().required(),
    })
  ),
}).required();
