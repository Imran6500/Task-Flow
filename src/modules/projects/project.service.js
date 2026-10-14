const mongoose = require("mongoose");
const projectRepository = require("./project.repository");

const createProject = async (data) => {
    const existingProject = await projectRepository.findByName(data.name);

    if(existingProject){
       const error = new Error("Project with this name already exists");
       error.statusCode = 409;
       throw error;
    }
    
    const project = await projectRepository.create(data);

    return project;
};

const getAllProjects = async ({ page, limit, status, search }) => {
    const skip = (page - 1) * limit;

    const { projects, total } = await projectRepository.findAll({
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

const updateProject = async (id, data) => {
    const project = await getProjectById(id);


    if (data.name && data.name !== project.name) {
        const existingProject = await projectRepository.findByName(
            data.name
        );

        if (existingProject) {
            const error = new Error("Project name already exists");
            error.statusCode = 409;
            throw error;
        }
    }

    const updatedProject = await projectRepository.updateById(
        id,
        data
    );

    if (!updatedProject) {
       throw new NotFoundError("Project not found");
    }

    return updatedProject;
};

const deleteProject = async (id) => {
    await getProjectById(id);

    const deletedProject = await projectRepository.deleteById(id);

    if (!deletedProject) {
       throw new NotFoundError("Project not found");
    }

    return deletedProject;
};

const getProjectById = async(id) =>{
    if(!mongoose.isValidObjectId(id)){
        const error = new Error("Invalid project ID");
         error.statusCode = 400;
        throw error;
    }

    const project = await projectRepository.findById(id);

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