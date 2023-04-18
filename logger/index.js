const devLogger = require("./devLogger");
const prodLogger = require("./prodLogger");

let logger = null;

if ([process.env.NODE_ENV, process.env.APP_ENV].includes("development")) {
  logger = devLogger();
}

if ([process.env.NODE_ENV, process.env.APP_ENV].includes("production")) {
  logger = prodLogger();
}

module.exports = logger;
