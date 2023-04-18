const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const devLogger = () => {
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
        filename: "./logs/development.log",
        handleExceptions: true,
      }),
    ],
  });
};

module.exports = devLogger;
