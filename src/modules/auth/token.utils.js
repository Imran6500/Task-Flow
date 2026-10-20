const crypto = require("crypto");
const jwt = require("jsonwebtoken");

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
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m",
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
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d",
            algorithm: "HS256"
        }
    );
};

module.exports = {
    hashToken,
    generateAccessToken,
    generateRefreshToken
};