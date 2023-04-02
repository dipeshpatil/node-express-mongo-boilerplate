const mongoose = require("mongoose");

const BaseController = require("./baseController");

const userSchema = require("./../models/user");

const User = mongoose.model("user", userSchema);

class UserController extends BaseController {
  constructor() {
    super(User);
  }
}

module.exports = UserController;
