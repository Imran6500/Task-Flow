
const RefreshToken = require("./refreshToken.model");

const create = async (data) => {
    return RefreshToken.create(data);
};

const findByHash = async (tokenHash) => {
    return RefreshToken.findOne({ tokenHash });
};

const rotate = async (oldHash, newHash, newExpiresAt) => {
    return RefreshToken.findOneAndUpdate(
        {
            tokenHash: oldHash,
            revokedAt: null,
            expiresAt: { $gt: new Date() }
        },
        {
            $set: {
                tokenHash: newHash,
                expiresAt: newExpiresAt
            }
        },
        {
            new: true
        }
    );
};

const revokeByHash = async (tokenHash) => {
    return RefreshToken.findOneAndUpdate(
        {
            tokenHash,
            revokedAt: null
        },
        {
            $set: { revokedAt: new Date() }
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
            $set: { revokedAt: new Date() }
        }
    );
};

module.exports = {
    create,
    findByHash,
    rotate,
    revokeByHash,
    revokeAllByUserId
};
