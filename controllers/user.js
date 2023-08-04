const BaseController = require("./base");

const { User } = require("../models/user");

class UserController extends BaseController {
  constructor() {
    super(User);
  }
}

module.exports = UserController;
