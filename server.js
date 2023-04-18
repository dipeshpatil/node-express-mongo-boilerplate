const express = require("express");

if (![process.env.NODE_ENV, process.env.APP_ENV].includes("production"))
  require("dotenv").config({ path: "./config/environments/.env" });
const { appConfig } = require("./config/config");

const logger = require("./logger");

// Database Connection
const connectDatabase = require("./config/database");
connectDatabase();

// Routes
const userRoute = require("./routes/api/user");

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

// Server Check
app.get("/", (req, res) => res.send("API Running"));

// Register Routes
app.use("/api/users", userRoute);

// Server Port Configuration
const PORT = appConfig.port;
app.listen(PORT, () => {
  logger.info(`APP MODE => [${process.env.NODE_ENV ?? process.env.APP_ENV}]`);
  logger.info(`SERVER PORT => [${PORT}]`);
});
