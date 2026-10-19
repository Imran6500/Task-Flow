const User = require("./user.model");

const findByEmail = async (email) => {
    return User.findOne({ email });
};

const findByEmailWithPassword = async (email) => {
    return User.findOne({ email }).select("+passwordHash");
};

const findById = async (id) => {
    return User.findById(id);
};

const create = async (data) => {
    return User.create(data);
};

module.exports = {
    findByEmail,
    findByEmailWithPassword,
    findById,
    create
};