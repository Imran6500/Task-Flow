const Project = require("./project.model");

const findByName = async (name) =>{
    return Project.findOne({name});
};

const create = async (data)=>{
    return Project.create(data);
}

const findAll = async ({ skip, limit, status, search }) => {
    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (search) {
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        filter.name = {
            $regex: escapedSearch,
            $options: "i"
        };
    }

    const [projects, total] = await Promise.all([
        Project.find(filter)
            .sort({ createdAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),

        Project.countDocuments(filter)
    ]);

    return { projects, total };
};

const updateById = async (id, data) => {
    return Project.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    })
}

const deleteById = async (id) => {
    return Project.findByIdAndDelete(id);
};

const findById = async (id) => {
    return Project.findById(id);
}

module.exports = {
    findByName,
    create,
    findAll,
    findById,
    updateById,
    deleteById
};