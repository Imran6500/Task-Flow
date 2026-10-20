const RefreshToken = require("./refreshToken.model");

const create = async (data) => {
    return RefreshToken.create(data);
};

const findByHash = async (tokenHash) => {
    return RefreshToken.findOne({ tokenHash });
};

const revokeByHash = async (tokenHash) => {
    return RefreshToken.findOneAndUpdate(
        {
            tokenHash,
            revokedAt: null
        },
        {
            revokedAt: new Date()
        },
        {
            new: true
        }
    );
};

const revokeAllByUserId = async (userId) => {
    return RefreshToken.updateMany(
        {
            userId,
            revokedAt: null
        },
        {
            revokedAt: new Date()
        }
    );
};

module.exports = {
    create,
    findByHash,
    revokeByHash,
    revokeAllByUserId
};