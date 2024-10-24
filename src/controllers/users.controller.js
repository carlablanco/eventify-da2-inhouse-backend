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
      const users = await UserService.getUsers(req.query?.page);
      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        method: "getUsers",
        message: err,
      });
    }
  }

  async getUserByMail(req, res) {
    try {
      const mail = req.params.mail;
      let user = await UserService.getUserByEmail(mail);
      if (!user) {
        return res.status(404).json({
          method: "getUserByMail",
          message: "Not Found",
        });
      }
      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        method: "getUserByMail",
        message: err,
      });
    }
  }

  async getUsersByModule(req, res) {
    try {
      const module = req.params.module;
      const role = req.query.role;
      let users = [];
      if (role)
        users = await UserService.getUsersByRole(role, module);
      else
        users = await UserService.getUsersByModule(module);
      if (users.length === 0) {
        return res.status(404).json({
          method: "getUsersByModule",
          message: "Not Found",
        });
      }
      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        method: "getUsersByModule",
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
