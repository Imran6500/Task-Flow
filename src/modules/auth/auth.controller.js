const ApiResponse = require("../../utils/ApiResponse");
const authService = require("./auth.service");

const register = async (req, res) => {
    const user = await authService.register(req.body);

    return ApiResponse.success(res,{
        message:"User registered successfully",
        data:user
    });
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(
            req.validatedBody
        );

        return ApiResponse.success(res,{
          message:"Login Successful",
          data: result
        });
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res) => {
    const user = await authService.getProfile(req.user.id);

    return ApiResponse.success(res,{
        message:"Profile fetched successfully",
        data:user
    });
};

const refresh = async (req, res) => {
    const result = await authService.refreshSession(
        req.body.refreshToken
    );

    return ApiResponse.success(res,{
        message:"Session refreshed successfully",
        data:result
    })
};

const logout = async (req, res) => {
    await authService.logout(
        req.body.refreshToken
    );

    return ApiResponse.success(res,{
        message:"Logged out successfully",
    });
};

module.exports = {
    register,
    login,
    getProfile,
    refresh,
    logout
};