const mongoose = require("mongoose");
const appState = require("../../config/appState");
const ApiResponse = require("../../utils/ApiResponse");

const liveness = (req, res) => {
    return ApiResponse.success(res,{
        message:"TaskFlow API is alive"
    });
};

const readiness = (req, res) => {
    const mongoConnected = mongoose.connection.readyState === 1;

    const isReady =
        mongoConnected && !appState.isShuttingDown;

    if (!isReady) {
        return res.status(503).json({
            success: false,
            message: "TaskFlow API is not ready"
        });
    }

    return res.status(200).json({
        success: true,
        message: "TaskFlow API is ready"
    });
};

module.exports = {
    liveness,
    readiness
};