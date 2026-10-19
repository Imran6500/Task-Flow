
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// Import routes
const authRoutes = require("./modules/auth/auth.routes");
const projectRoutes = require("./modules/projects/project.routes");
const taskRoutes = require("./modules/tasks/task.routes");

// Import middleware
const authenticate = require("./modules/auth/auth.middleware");
const errorHandler = require("./middlewares/error.middleware");

// Initialize Express
const app = express();

// ================================
// GLOBAL MIDDLEWARE
// ================================

// Add security-related HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse incoming JSON requests
app.use(express.json({ limit: "1mb" }));

// ================================
// HEALTH CHECK
// ================================

app.get("/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "TaskFlow API is running"
    });
});

// ================================
// API ROUTES
// ================================

// Authentication routes
// Register and Login are public.
// /me is protected inside auth.routes.js.
app.use("/api/v1/auth", authRoutes);

// Project routes
// All project routes are protected
// by authenticate in project.routes.js.
app.use("/api/v1/projects", projectRoutes);

// Task routes
// All task routes require authentication.
app.use(
    "/api/v1/projects/:projectId/tasks",
    authenticate,
    taskRoutes
);

// ================================
// 404 ROUTE HANDLER
// ================================

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

// ================================
// GLOBAL ERROR HANDLER
// ================================

// Must be registered after all routes.
app.use(errorHandler);

// Export Express app
module.exports = app;
