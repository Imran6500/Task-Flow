
const mongoose = require("mongoose");
const appState = require("./config/appState");

const env = require("./config/env");
const logger = require("./config/logger");
const connectDB = require("./config/db");
const app = require("./app");

let server;
let isShuttingDown = false;

const SHUTDOWN_TIMEOUT_MS = 10000;

const startServer = async () => {
    try {
        await connectDB();
        server = app.listen(env.PORT, () => {
            logger.info(
                { port: env.PORT },
                "TaskFlow API server started"
            );
        });

    } catch (error) {
        logger.fatal(
            { err: error },
            "Failed to start TaskFlow API"
        );

        await mongoose.disconnect().catch(() => {});
        process.exit(1);
    }
};

const shutdown = async (signal) => {
    if (isShuttingDown) {
        return;
    }

   isShuttingDown = true;
   appState.isShuttingDown = true;

    logger.info(
        { signal },
        "Graceful shutdown started"
    );

    // Prevent the process from hanging forever.
    const forceShutdownTimer = setTimeout(() => {
        logger.fatal(
            "Shutdown timeout exceeded. Forcing exit."
        );

        process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);

    forceShutdownTimer.unref();

    try {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close((error) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve();
                });
            });
        }

        logger.info("HTTP server closed");

        await mongoose.disconnect();

        logger.info("MongoDB connection closed");

        clearTimeout(forceShutdownTimer);

        process.exit(0);
    } catch (error) {
        clearTimeout(forceShutdownTimer);

        logger.error(
            { err: error },
            "Error during graceful shutdown"
        );

        process.exit(1);
    }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
