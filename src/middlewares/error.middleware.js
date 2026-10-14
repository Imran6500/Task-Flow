const { AppError } = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
    const isOperational = err instanceof AppError;

    if (!isOperational) {
        console.error("Unexpected error:", err);
    }

    const statusCode = isOperational ? err.statusCode : 500;

    return res.status(statusCode).json({
        success: false,
        message: isOperational
            ? err.message
            : "Internal server error"
    });
};

module.exports = errorHandler;