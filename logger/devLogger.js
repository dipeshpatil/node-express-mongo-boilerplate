const path = require("path");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, metadata } = format;

const devLogger = () => {
  const logFormat = format.printf(
    (info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
  );

  return createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: combine(
      label({ label: path.basename(process.mainModule.filename) }),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      metadata({
        fillExcept: ["message", "level", "timestamp", "label"],
      })
    ),
    transports: [
      new transports.Console({
        format: format.combine(format.colorize(), logFormat),
      }),
      new transports.File({
        filename: "./logs/development.log",
        format: format.combine(logFormat),
      }),
    ],
    exitOnError: false,
  });
};

module.exports = devLogger;
