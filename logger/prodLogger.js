const path = require("path");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, metadata } = format;

const prodLogger = () => {
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
        format: format.combine(logFormat),
      }),
      new transports.File({
        filename: "./logs/production.log",
        format: format.combine(logFormat),
      }),
    ],
    exitOnError: false,
  });
};

module.exports = prodLogger;
