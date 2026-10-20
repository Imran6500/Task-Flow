const mongoose = require("mongoose");
const projectRepository = require("./project.repository");
const { NotFoundError, ConflictError } = require("../../utils/AppError");
const taskRepository = require("../tasks/task.repository");


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
    if (!mongoose.isValidObjectId(projectId)) {
        throw new BadRequestError("Invalid project ID");
    }

    // Verify project exists and belongs to this user
    const project = await projectRepository.findById(
        projectId,
        ownerId,
    );

    if (!project) {
        console.log("Project not found for deletion1");
        throw new NotFoundError("Project not found");
    }

    // Check if the project contains tasks
    const hasTasks = await taskRepository.existsByProjectId(
        projectId
    );

    if (hasTasks) {
        throw new ConflictError(
            "Cannot delete a project that contains tasks. Delete its tasks first."
        );
    }

    // Delete only the authenticated user's project
    const deletedProject = await projectRepository.deleteById(
        projectId,
        ownerId
    );

    if (!deletedProject) {
        console.log("Project not found for deletion2");
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