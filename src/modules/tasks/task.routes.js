const express = require("express");
const validateQuery = require("../../middlewares/validateQuery");

const router = express.Router({ mergeParams: true });

const taskController = require("./task.controller");
const validate = require("../../middlewares/validate");

const {
    createTaskSchema,
    listTasksSchema,
    updateTaskSchema,
    deleteTaskSchema,

} = require("./task.validation");

router.post(
    "/",
    validate(createTaskSchema),
    taskController.createTask
);

router.get(
    "/",
    validateQuery(listTasksSchema),
    taskController.getTasksByProject
);

router.patch(
    "/:taskId",
    validate(updateTaskSchema),
    taskController.updateTask
);

router.delete(
    "/:taskId",
    validate(deleteTaskSchema, "params"),
    taskController.deleteTask
);

module.exports = router;