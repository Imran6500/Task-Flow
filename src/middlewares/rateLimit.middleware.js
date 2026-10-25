
const { rateLimit } = require("express-rate-limit");
const { AppError } = require("../utils/AppError");
const env = require("../config/env");

const isTest = env.NODE_ENV === "test";

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    skip: () => isTest,

    handler: (req, res, next) => {
        next(
            new AppError(
                "Too many authentication requests. Please try again later.",
                429,
                "AUTH_RATE_LIMIT_EXCEEDED"
            )
        );
    }
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    skip: () => isTest,

    handler: (req, res, next) => {
        next(
            new AppError(
                "Too many requests. Please try again later.",
                429,
                "RATE_LIMIT_EXCEEDED"
            )
        );
    }
});

module.exports = {
    authLimiter,
    apiLimiter
};
