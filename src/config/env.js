
require("dotenv").config();

const { z } = require("zod");

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),

    PORT: z.coerce
        .number()
        .int()
        .min(1)
        .max(65535)
        .default(5000),

    MONGO_URI: z.string().min(1, "MONGO_URI is required"),

    JWT_ACCESS_SECRET: z
        .string()
        .min(32, "JWT_ACCESS_SECRET must contain at least 32 characters"),

    JWT_REFRESH_SECRET: z
        .string()
        .min(32, "JWT_REFRESH_SECRET must contain at least 32 characters"),

    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),

    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

    LOG_LEVEL: z
        .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
        .default("info")
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error("Invalid environment configuration:");

    console.error(
        z.treeifyError(result.error)
    );

    process.exit(1);
}

module.exports = Object.freeze(result.data);
