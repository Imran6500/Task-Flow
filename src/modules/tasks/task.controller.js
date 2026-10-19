const taskService = require("./task.service");

const createTask = async (req, res) => {
    const task = await taskService.createTask(
        req.user.id,
        req.params.projectId,
        req.validatedBody
    );

    return res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task
    });
};

const getTasksByProject = async (req, res) => {
    const result = await taskService.getTasksByProject(
        req.user.id,
        req.params.projectId,
        req.validatedQuery
    );

    return res.status(200).json({
        success: true,
        data: result.tasks,
        pagination: result.pagination
    });
};

const updateTask = async (req, res) => {
    const task = await taskService.updateTask(
        req.user.id,
        req.params.projectId,
        req.params.taskId,
        req.validatedBody
    );

    return res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task
    });
};

const deleteTask = async (req, res) => {
    await taskService.deleteTask(
        req.user.id,
        req.params.projectId,
        req.params.taskId
    );

    return res.status(200).json({
        success: true,
        message: "Task deleted successfully"
    });
};

module.exports = {
    createTask,
    getTasksByProject,
    updateTask,
    deleteTask
};