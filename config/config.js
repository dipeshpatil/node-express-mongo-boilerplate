const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

let config = null;

try {
  config = yaml.load(
    fs.readFileSync(
      path.join(__dirname, "environments", `config.${process.env.APP_ENV}.yml`),
      "utf8"
    )
  );
} catch (e) {
  console.log(e);
}

module.exports = {
  dbConfig: config?.db,
  appConfig: config?.app,
};
