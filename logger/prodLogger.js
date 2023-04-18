const { createLogger, format, transports } = require("winston");
require("winston-mongodb");
const { combine, timestamp, label, printf } = format;

const { dbConfig } = require("../config/config");

const prodLogger = () => {
  const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });

  return createLogger({
    level: "debug",
    format: combine(
      label({ label: "right meow!" }),
      timestamp({ format: "HH:mm:ss" }),
      myFormat
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: "./logs/production.log",
      }),
      new transports.MongoDB({
        db: `mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/?retryWrites=true&w=majority`,
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      }),
    ],
  });
};

module.exports = prodLogger;
