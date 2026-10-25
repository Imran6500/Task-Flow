
const express = require("express");

const {
    liveness,
    readiness
} = require("./health.controller");

const router = express.Router();

router.get("/live", liveness);
router.get("/ready", readiness);

module.exports = router;
