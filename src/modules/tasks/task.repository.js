const Task = require("./task.model");

const create = async (data) => {
    return Task.create(data);
};

const findById = async (id) => {
    return Task.findById(id);
};

const findByProjectId = async ({
    projectId,
    skip,
    limit,
    status,
    priority
}) => {
    const filter = { projectId };

    if (status) {
        filter.status = status;
    }

    if (priority) {
        filter.priority = priority;
    }

    const [tasks, total] = await Promise.all([
        Task.find(filter)
            .sort({ createdAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),

        Task.countDocuments(filter)
    ]);

    return { tasks, total };
};

const updateById = async (taskId, projectId, data) => {
    return Task.findOneAndUpdate(
        { _id: taskId, projectId },
        data,
        {
            new: true,
            runValidators: true
        }
    );
};

const deleteById = async (taskId, projectId) => {
    return Task.findOneAndDelete({
        _id: taskId,
        projectId
    });
};

const findByIdAndProjectId = async (taskId, projectId) => {
    return Task.findOne({
        _id: taskId,
        projectId
    });
};

const existsByProjectId = async (projectId) => {
    return Task.exists({ projectId });
};

module.exports = {
    create,
    findById,
    findByProjectId,
    updateById,
    deleteById,
    findByIdAndProjectId
    ,
    existsByProjectId
};