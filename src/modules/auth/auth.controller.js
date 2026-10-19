const authService = require("./auth.service");

const register = async (req, res) => {
    const user = await authService.register(req.validatedBody);

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user
    });
};

const login = async (req, res, next) => {
    try {
        console.log("Request body:", req.body);
console.log("Validated body:", req.validated?.body);
        const result = await authService.login(
            req.validated.body
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res) => {
    const user = await authService.getProfile(req.user.id);

    return res.status(200).json({
        success: true,
        data: user
    });
};

module.exports = {
    register,
    login,
    getProfile
};