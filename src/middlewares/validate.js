const validate = (schema, source = "body") => {
    if (!schema || typeof schema.safeParse !== "function") {
        throw new Error("Invalid validation schema");
    }

    return (req, res, next) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.flatten()
            });
        }

        req.validated = {
            ...(req.validated || {}),
            [source]: result.data
        };

        next();
    };
};

module.exports = validate;