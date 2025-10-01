// Middleware للفاليديشن
export const validation = (schema) => {
    return (req, res, next) => {
        const data = { ...req.body, ...req.params, ...req.query };
        const validationResult = schema.validate(data, { abortEarly: false });
        if (validationResult.error) {
            // جمع رسائل الأخطاء كلها في array
            const errorMessage = validationResult.error.details.map((errorObj) => errorObj.message);
            return next(new Error(JSON.stringify(errorMessage), { cause: 400 }));
        }
        return next();
    };
};
//# sourceMappingURL=validation.middlware.js.map