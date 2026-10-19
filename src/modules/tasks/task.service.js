
const mongoose = require("mongoose");

const {
    BadRequestError,
    NotFoundError,
    ConflictError
} = require("../../utils/AppError");

const taskRepository = require("./task.repository");
const projectRepository = require("../projects/project.repository");

// Allowed task status transitions
const allowedTransitions = {
    TODO: ["IN_PROGRESS"],
    IN_PROGRESS: ["TODO", "DONE"],
    DONE: ["IN_PROGRESS"]
};

// Validate project and verify ownership
const getProject = async (ownerId, projectId) => {
    if (!mongoose.isValidObjectId(projectId)) {
        throw new BadRequestError("Invalid project ID");
    }

    const project = await projectRepository.findById(
        projectId,
        ownerId
    );

    if (!project) {
        throw new NotFoundError("Project not found");
    }

    return project;
};

// Validate task and verify that it belongs to the project
const getTaskForProject = async (ownerId, projectId, taskId) => {
    const project = await getProject(ownerId, projectId);

    if (!mongoose.isValidObjectId(taskId)) {
        throw new BadRequestError("Invalid task ID");
    }

    const task = await taskRepository.findByIdAndProjectId(
        taskId,
        projectId,
        ownerId
    );

    if (!task) {
        throw new NotFoundError("Task not found in this project");
    }

    return { project, task };
};

// CREATE TASK
const createTask = async (ownerId, projectId, data) => {
    const project = await getProject(ownerId, projectId);

    if (project.status === "ARCHIVED") {
        throw new ConflictError(
            "Cannot create tasks in an archived project"
        );
    }

    return taskRepository.create({
        ...data,
        projectId
    });
};

// GET TASKS BY PROJECT
const getTasksByProject = async (ownerId, projectId, filters) => {
    await getProject(ownerId, projectId);

    const { page, limit, status, priority } = filters;

    const skip = (page - 1) * limit;

    const { tasks, total } = await taskRepository.findByProjectId({
        projectId,
        skip,
        limit,
        status,
        priority
    });

    return {
        tasks,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

// UPDATE TASK
const updateTask = async (ownerId, projectId, taskId, data) => {
    const { project, task } = await getTaskForProject(
        ownerId,
        projectId,
        taskId
    );

    if (project.status === "ARCHIVED") {
        throw new ConflictError(
            "Cannot update tasks in an archived project"
        );
    }

    // Validate status transition
    if (data.status && data.status !== task.status) {
        const allowed = allowedTransitions[task.status] || [];

        if (!allowed.includes(data.status)) {
            throw new ConflictError(
                `Cannot move task from ${task.status} to ${data.status}`
            );
        }
    }

    const updatedTask = await taskRepository.updateById(
        taskId,
        projectId,
        data
    );

    if (!updatedTask) {
        throw new NotFoundError("Task not found");
    }

    return updatedTask;
};

// DELETE TASK
const deleteTask = async (ownerId, projectId, taskId) => {
    await getTaskForProject(ownerId, projectId, taskId);

    const deletedTask = await taskRepository.deleteById(
        taskId,
        projectId,
    );

    if (!deletedTask) {
        throw new NotFoundError("Task not found");
    }

    return deletedTask;
};

module.exports = {
    createTask,
    getTasksByProject,
    updateTask,
    deleteTask
};
