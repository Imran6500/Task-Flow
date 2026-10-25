const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");

const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            sub: user._id.toString(),
            type: "access"
        },
        env.JWT_ACCESS_SECRET,
        {
            expiresIn: env.JWT_ACCESS_EXPIRES_IN,
            algorithm: "HS256"
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            sub: user._id.toString(),
            type: "refresh",
            jti: crypto.randomUUID()
        },
        env.JWT_REFRESH_SECRET,
        {
            expiresIn: env.JWT_REFRESH_EXPIRES_IN,
            algorithm: "HS256"
        }
    );
};


module.exports = {
    hashToken,
    generateAccessToken,
    generateRefreshToken
};