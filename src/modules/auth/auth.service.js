const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRepository = require("../users/user.repository");


const {
    ConflictError,
    NotFoundError,
    UnauthorizedError
} = require("../../utils/AppError");

// Generate JWT access token
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            sub: user._id.toString()
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
            algorithm: "HS256"
        }
    );
};

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
        throw error;
    }

    const accessToken = generateAccessToken(user);

    return {
        accessToken,
        tokenType: "Bearer",
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m"
    };
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

module.exports = {
    register,
    login,
    getProfile
};