const mongoose = require("mongoose");
const projectRepository = require("./project.repository");
const { NotFoundError } = require("../../utils/AppError");


const createProject = async (ownerId, data) => {
   const existingProject = await projectRepository.findByName(
       data.name,
       ownerId
);

if (existingProject) {
    throw new ConflictError("Project already exists");
}

return projectRepository.create({
    ...data,
    ownerId
});
};

const getAllProjects = async ({ ownerId, page, limit, status, search }) => {
    const skip = (page - 1) * limit;

    const { projects, total } = await projectRepository.findAll({
        ownerId,
        skip,
        limit,
        status,
        search
    });

    return {
        projects,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const updateProject = async (projectId, ownerId, data) => {
    const project = await getProjectById(projectId, ownerId);


    if (data.name && data.name !== project.name) {
        const existingProject = await projectRepository.findByName(
            data.name,
            ownerId
        );

        if (existingProject) {
            const error = new Error("Project name already exists");
            error.statusCode = 409;
            throw error;
        }
    }

    const updatedProject = await projectRepository.updateById(
        projectId,
        ownerId,
        data
    );

    if (!updatedProject) {
       throw new NotFoundError("Project not found");
    }

    return updatedProject;
};

const deleteProject = async (projectId, ownerId) => {
    await getProjectById(projectId, ownerId);

    const deletedProject = await projectRepository.deleteById(projectId, ownerId);

    if (!deletedProject) {
       throw new NotFoundError("Project not found");
    }

    return deletedProject;
};

const getProjectById = async(projectId, ownerId) =>{
    if(!mongoose.isValidObjectId(projectId)){
        const error = new Error("Invalid project ID");
         error.statusCode = 400;
        throw error;
    }

    const project = await projectRepository.findById(projectId, ownerId);


    if(!project){
        throw new NotFoundError("Project not found");
    }

    return project;
}

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
};