
const { UnauthorizedError, ForbiddenError } = require("../../utils/AppError");

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(
                new UnauthorizedError("Authentication required")
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new ForbiddenError(
                    "You do not have permission to access this resource"
                )
            );
        }

        next();
    };
};

module.exports = authorize;
