const jwt = require("jsonwebtoken");

const { appConfig } = require("./../config/config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "No Token, Authorization Denied!" });
  }
  try {
    const decoded = jwt.verify(token, appConfig.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: `Invalid Token! ${err.message}` });
  }
};
