const projectService = require('./project.service');

const createProject = async (req, res) =>{
     const project = await projectService.createProject(  req.user.id, req.validatedBody);

     return res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: project
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

    return res.status(200).json({
        success: true,
        data: result.projects,
        pagination: result.pagination
    });
};

const getProjectById = async (req, res) => {
    const project = await projectService.getProjectById( req.params.id, req.user.id);

    return res.status(200).json({
        success: true,
        message: "Project fetched successfully",
        data: project
    });
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

    return res.status(200).json({
        success: true,
        message: "Project deleted successfully"
    });
};
 

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
};