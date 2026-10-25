
const pino = require("pino");
const env = require("./env");

const isProduction = env.NODE_ENV === "production";

const logger = pino({
    level: env.LOG_LEVEL || "info",

    redact: {
        paths: [
            "req.headers.authorization",
            "req.headers.cookie",
            "headers.authorization",
            "headers.cookie",
            "password",
            "passwordHash",
            "accessToken",
            "refreshToken"
        ],
        censor: "[REDACTED]"
    },

    transport: isProduction
        ? undefined
        : {
              target: "pino-pretty",
              options: {
                  colorize: true,
                  translateTime: "SYS:standard",
                  ignore: "pid,hostname"
              }
          }
});

module.exports = logger;
