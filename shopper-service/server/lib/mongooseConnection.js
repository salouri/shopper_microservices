const mongoose = require("mongoose");
const config = require("../config");

const log = config.log();

const connectToMongoose = async (connectionString) => {
  try {
    await mongoose.connect(connectionString);

    log.info("Connected to MongoDB");
  } catch (error) {
    log.error("Error connecting to Mongoose:", error);
    process.exit(1);
  }
};

module.exports = connectToMongoose;
