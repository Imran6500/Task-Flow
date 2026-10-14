const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const projectRoutes = require("./modules/projects/project.routes");
const taskRoutes = require("./modules/tasks/task.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "TaskFlow API is running"
    });
});

app.use("/api/v1/projects", projectRoutes);

app.use("/api/v1/projects/:projectId/tasks", taskRoutes);

app.use(errorHandler);

// Must be registered after routes
app.use(errorHandler);

module.exports = app;