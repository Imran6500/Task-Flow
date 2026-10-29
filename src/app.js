require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { NotFoundError } = require("./utils/AppError");

// const { connectRedis, redisClient } = require("./config/redis");

// Import routes
const authRoutes = require("./modules/auth/auth.routes");
const projectRoutes = require("./modules/projects/project.routes");
const taskRoutes = require("./modules/tasks/task.routes");
const healthRoutes = require("./modules/health/health.routes");
const adminRoutes = require("./modules/admin/admin.routes");

// Import middleware
const authenticate = require("./modules/auth/auth.middleware");
const errorHandler = require("./middlewares/error.middleware");
const { apiLimiter } = require("./middlewares/rateLimit.middleware");
const requestLogger = require("./middlewares/requestLogger.middleware");

// Initialize Express
const app = express();

// ================================
// GLOBAL MIDDLEWARE
// ================================

// Add security-related HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

app.use(requestLogger);

// Parse incoming JSON requests
app.use(express.json({ limit: "1mb" }));



// ================================
// HEALTH CHECK
// ================================
app.use("/health", healthRoutes);

// ================================
// API ROUTES
// ================================

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/admin", apiLimiter, adminRoutes);

app.use("/api/v1/projects", apiLimiter, projectRoutes);

app.use(
    "/api/v1/projects/:projectId/tasks",
    apiLimiter,
    authenticate,
    taskRoutes
);

const { redisClient } = require("./config/redis");

app.get("/api/v1/cache-demo", async (req, res, next) => {
  try {
    const key = "demo:message";

    const cached = await redisClient.get(key);

    if (cached !== null) {
      return res.json({
        source: "redis",
        message: cached,
      });
    }

    const message = "Hello from Express!";

    await redisClient.set(key, message, { EX: 60 });

    return res.json({
      source: "generated",
      message,
    });
  } catch (error) {
    next(error);
  }
});

// ================================
// 404 ROUTE HANDLER
// ================================
app.use((req, res, next) => {
    next(
        new NotFoundError(
            "API endpoint not found",
            "ENDPOINT_NOT_FOUND"
        )
    );
});

app.use(errorHandler);

// ================================
// GLOBAL ERROR HANDLER
// ================================
// Must be registered after all routes.
app.use(errorHandler);


// Export Express app
module.exports = app;
