
const express = require("express");

const authenticate = require("../auth/auth.middleware");
const authorize = require("../auth/authorize.middleware");

const router = express.Router();

router.get(
    "/dashboard",
    authenticate,
    authorize("ADMIN"),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Welcome to the admin dashboard",
            data: {
                userId: req.user.id,
                role: req.user.role
            }
        });
    }
);

module.exports = router;
