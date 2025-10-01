import Joi, { ObjectSchema } from "joi";
//register
export const register: ObjectSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
}).required();
//login
export const login: ObjectSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).required();
//forget code
export const forgetCode: ObjectSchema = Joi.object({
  email: Joi.string().email().required(),
}).required();
//reset password
export const resetPassword: ObjectSchema = Joi.object({
  email: Joi.string().email().required(),
  forgetCode: Joi.string().length(5).required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
}).required();
