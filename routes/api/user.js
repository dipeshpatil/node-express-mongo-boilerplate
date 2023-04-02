const express = require("express");

const UserController = require("../../controllers/userController");

const router = express.Router();
const userController = new UserController();

/**
 * @route   POST api/users
 * @desc    Register User
 * @access  Public
 */
router.get("/", userController.getAll.bind(userController));

module.exports = router;
