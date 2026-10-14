const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        throw new Error("MONGO_URI is missing from environment variables");
    }

    console.log("Connecting to MongoDB...");

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully");
};

module.exports = connectDB;