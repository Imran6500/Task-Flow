const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");
const authenticate = require("./auth.middleware");
const validate = require("../../middlewares/validate");
const { authLimiter } = require("../../middlewares/rateLimit.middleware");

const {
    registerSchema,
    loginSchema,
    refreshTokenSchema
} = require("./auth.validation");

router.post(
    "/register",
    validate(registerSchema),
    authLimiter,
    authController.register
);

router.post(
    "/login",
    validate(loginSchema),
    authLimiter,
    authController.login
);

router.get(
    "/me",
    authenticate,
    authController.getProfile
);

router.post(
    "/refresh",
    validate(refreshTokenSchema),
    authLimiter,
    authController.refresh
);

router.post(
    "/logout",
    validate(refreshTokenSchema),
    authController.logout
);

module.exports = router;