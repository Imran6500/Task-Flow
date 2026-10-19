const jwt = require("jsonwebtoken");

const { UnauthorizedError } = require("../../utils/AppError");
const userRepository = require("../users/user.repository");

const authenticate = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            throw new UnauthorizedError("Access token required");
        }

        const token = authorization.slice(7);

        if (!token) {
            throw new UnauthorizedError("Access token required");
        }

        let payload;

        try {
            payload = jwt.verify(
                token,
                process.env.JWT_ACCESS_SECRET,
                { algorithms: ["HS256"] }
            );
        } catch (error) {
            throw new UnauthorizedError("Invalid or expired access token");
        }

        if (!payload.sub || typeof payload.sub !== "string") {
            throw new UnauthorizedError("Invalid access token");
        }

        const user = await userRepository.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedError("User no longer exists");
        }

        req.user = {
            id: user._id.toString(),
            role: user.role
        };

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authenticate;