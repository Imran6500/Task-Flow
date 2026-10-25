
const { ValidationError } = require("../utils/AppError");

const validateQuery = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            const details = result.error.issues.map((issue) => ({
                field: issue.path.join(".") || "query",
                message: issue.message
            }));

            return next(
                new ValidationError(
                    "Query validation failed",
                    details
                )
            );
        }

        req.validatedQuery = result.data;
        next();
    };
};

module.exports = validateQuery;
