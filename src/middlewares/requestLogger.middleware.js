
const pinoHttp = require("pino-http");
const crypto = require("crypto");

const logger = require("../config/logger");

const requestLogger = pinoHttp({
    logger,

    genReqId: (req, res) => {
        const requestId = crypto.randomUUID();

        res.setHeader("X-Request-ID", requestId);

        return requestId;
    },

    serializers: {
        req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url
        }),

        res: (res) => ({
            statusCode: res.statusCode
        })
    },

    customLogLevel: (req, res, err) => {
        if (err || res.statusCode >= 500) {
            return "error";
        }

        if (res.statusCode >= 400) {
            return "warn";
        }

        return "info";
    }
});

module.exports = requestLogger;
