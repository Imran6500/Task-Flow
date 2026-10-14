const { z } = require("zod");

const createTaskSchema = z.object({
    title: z.string().trim().min(3).max(150),

    description: z.string().trim().optional(),

    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),

    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

    dueDate: z.iso.datetime({ offset: true }).nullable().optional()
}).strict();

const listTasksSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional()
}).strict();

const updateTaskSchema = z.object({
    title: z.string().trim().min(3).max(150).optional(),
    description: z.string().trim().optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    dueDate: z.iso.datetime({ offset: true }).nullable().optional()
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field is required" }
);

module.exports = {
    createTaskSchema,
    listTasksSchema,
    updateTaskSchema
};