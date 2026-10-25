const taskService = require("./task.service");
const ApiResponse = require("../../utils/ApiResponse");

const createTask = async (req, res) => {
    const task = await taskService.createTask(
        req.user.id,
        req.params.projectId,
        req.validatedBody
    );

    return ApiResponse.success(res,{
        message:"Task created successfully",
        data:task
    });
};

const getTasksByProject = async (req, res) => {
    const result = await taskService.getTasksByProject(
        req.user.id,
        req.params.projectId,
        req.validatedQuery
    );

    return ApiResponse.success(res,{
        message:"Task fetched successfully",
        data:result.tasks,
        meta:result.pagination
    })
};

const updateTask = async (req, res) => {
    const task = await taskService.updateTask(
        req.user.id,
        req.params.projectId,
        req.params.taskId,
        req.validatedBody
    );

   return ApiResponse.success(res,{
    message:"Task updated successfully",
    data:task,

   });
};

const deleteTask = async (req, res) => {
    await taskService.deleteTask(
        req.user.id,
        req.params.projectId,
        req.params.taskId
    );

   return ApiResponse.success(res,{
    message: "Task deleted successfully"
   });
};

module.exports = {
    createTask,
    getTasksByProject,
    updateTask,
    deleteTask
};