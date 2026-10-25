
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let databaseConnected = false;

beforeAll(async () => {
    process.env.NODE_ENV = "test";

    process.env.JWT_ACCESS_SECRET = "test-access-secret-only";
    process.env.JWT_REFRESH_SECRET = "test-refresh-secret-only";

    process.env.JWT_ACCESS_EXPIRES_IN = "15m";
    process.env.JWT_REFRESH_EXPIRES_IN = "7d";

    try {
        console.log("Starting test MongoDB...");

        mongoServer = await MongoMemoryServer.create();

        console.log("Test MongoDB started");

        await mongoose.connect(mongoServer.getUri(), {
            serverSelectionTimeoutMS: 10000
        });

        databaseConnected = true;

        console.log("Mongoose connected to test database");

        const User = require("../src/modules/users/user.model");
        const RefreshToken = require(
            "../src/modules/auth/refreshToken.model"
        );

        await User.init();
        await RefreshToken.init();

        console.log("Test database ready");
    } catch (error) {
        console.error("Test database setup failed:", error);
        throw error;
    }
}, 120000);

// Clear collections only when MongoDB is connected
afterEach(async () => {
    if (!databaseConnected || mongoose.connection.readyState !== 1) {
        return;
    }

    const collections = mongoose.connection.collections;

    for (const collection of Object.values(collections)) {
        await collection.deleteMany({});
    }
});

// Disconnect safely
afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    if (mongoServer) {
        await mongoServer.stop();
    }
}, 30000);
