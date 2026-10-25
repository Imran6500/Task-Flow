
const { AppError } = require("../utils/AppError");
const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
    const isOperational = err instanceof AppError;

    const statusCode = isOperational ? err.statusCode : 500;

    const requestId = req.id;

    if (isOperational) {
        req.log?.warn(
            { err, requestId, statusCode },
            "Operational API error"
        );
    } else {
        (req.log || logger).error(
            { err, requestId, statusCode },
            "Unexpected API error"
        );
    }

    if (res.headersSent) {
        return next(err);
    }

   
const errorResponse = {
    success: false,
    message: isOperational
        ? err.message
        : "Internal server error",
    error: {
        code: isOperational
            ? err.code
            : "INTERNAL_SERVER_ERROR"
    }
};

if (isOperational && Array.isArray(err.details)) {
    errorResponse.error.details = err.details;
}

return res.status(statusCode).json(errorResponse);

};

module.exports = errorHandler;
