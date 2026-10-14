const {z} = require("zod");


const createProjectSchema = z.object({
    name:z.string().trim().min(3).max(100),
    description:z.string().trim().optional(),
}).strict();

const listProjectsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(["ACTIVE", "ARCHIVED"]).optional(),
    search: z.string().trim().optional()
}).strict();

const updateProjectsSchema = z.object({
    name: z.string().trim().min(3).max(100).optional(),
    description: z.string().trim().optional(),
    status: z.enum(["ACTIVE", "ARCHIVED"]).optional()
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field is required" }
);

module.exports = {
    createProjectSchema,
    listProjectsSchema,
    updateProjectsSchema
};