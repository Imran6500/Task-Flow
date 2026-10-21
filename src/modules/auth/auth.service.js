const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const refreshTokenRepository = require("./refreshToken.repository");

const {
    hashToken,
    generateAccessToken,
    generateRefreshToken
} = require("./token.utils");

const userRepository = require("../users/user.repository");


const {
    ConflictError,
    NotFoundError,
    UnauthorizedError
} = require("../../utils/AppError");


// Register a new user
const register = async ({ name, email, password }) => {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new ConflictError("Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let user;

    try {
        user = await userRepository.create({
            name,
            email,
            passwordHash
        });
    } catch (error) {
        // Handles simultaneous registrations using the same email
        if (error.code === 11000) {
            throw new ConflictError("Email already registered");
        }

        throw error;
    }

    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email
    };
};

// Login existing user
const login = async ({ email, password }) => {
    const user = await userRepository.findByEmailWithPassword(email);

    if (!user) {
        throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
    }

    return createSession(user);
};

// Get authenticated user's profile
const getProfile = async (userId) => {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
    };
};

const createSession = async (user) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const decoded = jwt.decode(refreshToken);

    await refreshTokenRepository.create({
        userId: user._id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(decoded.exp * 1000)
    });

    return {
        accessToken,
        refreshToken,
        tokenType: "Bearer",
        expiresIn: "15m"
    };
};

const refreshSession = async (refreshToken) => {
    let payload;

    try {
        payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
            { algorithms: ["HS256"] }
        );
    } catch (error) {
        throw new UnauthorizedError("Invalid or expired refresh token");
    }

    if (payload.type !== "refresh" || !payload.sub) {
        throw new UnauthorizedError("Invalid refresh token");
    }

    const user = await userRepository.findById(payload.sub);

    if (!user) {
        throw new UnauthorizedError("User no longer exists");
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    const decoded = jwt.decode(newRefreshToken);

    const rotated = await refreshTokenRepository.rotate(
        hashToken(refreshToken),
        hashToken(newRefreshToken),
        new Date(decoded.exp * 1000)
    );

    if (!rotated) {
        throw new UnauthorizedError(
            "Refresh token already used or revoked"
        );
    }

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        tokenType: "Bearer",
        expiresIn: "15m"
    };
};

const logout = async (refreshToken) => {
    await refreshTokenRepository.revokeByHash(
        hashToken(refreshToken)
    );
};

module.exports = {
    register,
    login,
    getProfile,
    refreshSession,
    logout
};