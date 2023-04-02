const mongoose = require("mongoose");

const BaseController = require("./baseController");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

class UserController extends BaseController {
  constructor() {
    super(User);
  }
}

module.exports = UserController;
