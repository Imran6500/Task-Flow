const mongoose = require("mongoose");
const env = require("./env");
const logger = require("./logger");
const connectDB = async () => {
  
    logger.info("Connecting to MongoDB...");

    await mongoose.connect(env.MONGO_URI);

    logger.info("MongoDB connected successfully");
};

module.exports = connectDB;