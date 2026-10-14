const mongoose = require("mongoose");
const {
    BadRequestError,
    NotFoundError,
    ConflictError
} = require("../../utils/AppError");
const taskRepository = require("./task.repository");
const projectRepository = require("../projects/project.repository");

const createTask = async (projectId, data) => {
    // 1. Validate project ID
    if (!mongoose.isValidObjectId(projectId)) {
        throw new BadRequestError("Invalid project ID");
    }

    // 2. Check whether the project exists
    const project = await projectRepository.findById(projectId);

    if (!project) {
        throw new NotFoundError("Project not found");
    }

    // 3. Prevent creating tasks in archived projects
    if (project.status === "ARCHIVED") {
        throw new ConflictError("Cannot create tasks in an archived project");
    }

    // 4. Create task
    return taskRepository.create({
        ...data,
        projectId
    });
};

const getTasksByProject = async (projectId, filters) => {
    if (!mongoose.isValidObjectId(projectId)) {
        throw new BadRequestError("Invalid project ID");
    }

    const project = await projectRepository.findById(projectId);

    if (!project) {
        throw new NotFoundError("Project not found");
    }

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

const allowedTransitions = {
    TODO: ["IN_PROGRESS"],
    IN_PROGRESS: ["TODO", "DONE"],
    DONE: ["IN_PROGRESS"]
};
const updateTask = async (projectId, taskId, data) => {
    const { project, task } = await getTaskForProject(
        projectId,
        taskId
    );

    if (project.status === "ARCHIVED") {
        throw new ConflictError("Cannot update tasks in an archived project");
    }

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

const deleteTask = async (projectId, taskId) => {
    await getTaskForProject(projectId, taskId);

    const deletedTask = await taskRepository.deleteById(
        taskId,
        projectId
    );

    if (!deletedTask) {
        throw new NotFoundError("Task not found");
    }
};

const getTaskForProject = async (projectId, taskId) => {
    if (
        !mongoose.isValidObjectId(projectId) ||
        !mongoose.isValidObjectId(taskId)
    ) {
        throw new BadRequestError("Invalid project or task ID");
    }

    const project = await projectRepository.findById(projectId);

    if (!project) {
        throw new NotFoundError("Project not found");
    }

    const task = await taskRepository.findByIdAndProjectId(
        taskId,
        projectId
    );

    if (!task) {
        throw new NotFoundError("Task not found in this project");
    }

    return { project, task };
};
module.exports = {
    createTask,
    getTasksByProject,
    getTaskForProject,
    updateTask,
    deleteTask
};