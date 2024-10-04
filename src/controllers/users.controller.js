let instance = null;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserService = require("../services/user.service");

class UserController {
  static getInstance() {
    if (!instance) {
      return new UserController();
    }
    return instance;
  }

  async getUsers(req, res) {
    try {
      const users = await UserService.getUsers();
      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        method: "getUsers",
        message: err,
      });
    }
  }

  async getUserById(req, res) {
    try {
      const id = req.params.id;
      let user = await UserService.getUserById(id);
      if (!user) {
        return res.status(404).json({
          method: "getUserById",
          message: "Not Found",
        });
      }
      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        method: "getUserById",
        message: err,
      });
    }
  }

  async createUser(req, res) {
    try {
      let newUser = await UserService.createUser(req.body);
      return res.status(201).json({
        message: "Created!",
        user: newUser,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        method: "createUser",
        message: err.message,
      });
    }
  }
}

module.exports = UserController.getInstance();
