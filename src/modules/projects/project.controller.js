const projectService = require('./project.service');
const ApiResponse = require('../../utils/ApiResponse');

const createProject = async (req, res) =>{
     const project = await projectService.createProject(  req.user.id, req.validatedBody);

     return ApiResponse.success(res,{
        message:"Project created successfully",
        data:project
     });


};

const getAllProjects = async (req, res) => {
    const { page, limit, status, search } = req.validatedQuery;

    const result = await projectService.getAllProjects({
        ownerId: req.user.id,
        page,
        limit,
        status,
        search
    });

    return ApiResponse.success(res, {
        message: "Projects fetched successfully",
        data: result.projects,
        meta: result.pagination
    });
};

const getProjectById = async (req, res) => {
    const project = await projectService.getProjectById( req.params.id, req.user.id);

    return ApiResponse.success(res, {
        message:"Project fetched successfully",
        data:project
    })
}

const updateProject = async (req, res) => {
    const project = await projectService.updateProject(
        req.params.id,
        req.user.id,
        req.validatedBody
    );

    return res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: project
    });
};

const deleteProject = async (req, res) => {
    await projectService.deleteProject(req.params.id, req.user.id);

    return ApiResponse.success(res,{
        message:"Project deleted successfully"
    });
};
 

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
};