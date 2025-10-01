import { Request, Response, NextFunction } from "express";
import Joi, { Schema } from "joi";
import { Types } from "mongoose";

// Middleware function to validate ObjectId
export const isValidObjectId = (value: string, helpers: Joi.CustomHelpers) => {
  if (Types.ObjectId.isValid(value)) {
    return true;
  }
  return helpers.message({ custom: "Invalid ObjectId" });
};

// Middleware للفاليديشن
export const validation = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const validationResult = schema.validate(data, { abortEarly: false });

    if (validationResult.error) {
      // جمع رسائل الأخطاء كلها في array
      const errorMessage = validationResult.error.details.map(
        (errorObj) => errorObj.message
      );
      return next(new Error(JSON.stringify(errorMessage), { cause: 400 }));
    }

    return next();
  };
};
