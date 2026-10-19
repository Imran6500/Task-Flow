const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");
const authenticate = require("./auth.middleware");
const validate = require("../../middlewares/validate");

const {
    registerSchema,
    loginSchema
} = require("./auth.validation");

router.post(
    "/register",
    validate(registerSchema),
    authController.register
);

router.post(
    "/login",
    validate(loginSchema),
    authController.login
);

router.get(
    "/me",
    authenticate,
    authController.getProfile
);

module.exports = router;