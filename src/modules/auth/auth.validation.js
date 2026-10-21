const { z } = require("zod");

const registerSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8).max(72)
}).strict();

const loginSchema = z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(1)
}).strict();

const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1)
}).strict();

module.exports = {
    registerSchema,
    loginSchema,
    refreshTokenSchema
};