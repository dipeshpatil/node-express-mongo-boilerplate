const mongoose = require("mongoose");

const { dbConfig } = require("./config");
const logger = require("../logger");

const connectDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    logger.info("DATABASE => [connected]");
  } catch (err) {
    logger.error(err.message);
  }
};

module.exports = connectDatabase;
