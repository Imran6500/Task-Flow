const Project = require("./project.model");

const findByName = async (name, ownerId) => {
    return Project.findOne({ name, ownerId });
};

const create = async (data)=>{
    return Project.create(data);
}

const findAll = async ({
    ownerId,
    skip,
    limit,
    status,
    search
}) => {
    const filter = { ownerId };

    if (status) {
        filter.status = status;
    }

    if (search) {
        const escapedSearch = search.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

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

const updateById = async (id, ownerId, data) => {
    return Project.findOneAndUpdate(
        { _id: id, ownerId },
        data,
        { new: true, runValidators: true }
    );
};
const deleteById = async (id, ownerId) => {
    return Project.findOneAndDelete({
        _id: id,
        ownerId
    });
};
const findById = async (id, ownerId) => {
    return Project.findOne({ _id: id, ownerId });
};

module.exports = {
    findByName,
    create,
    findAll,
    findById,
    updateById,
    deleteById
};