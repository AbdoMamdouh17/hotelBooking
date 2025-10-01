import Joi from "joi";
//register
export const register = Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
}).required();
//# sourceMappingURL=auth.schema.js.map