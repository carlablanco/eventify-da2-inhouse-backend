let instance = null;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const RoleService = require("../services/role.service");

class RoleController {
  static getInstance() {
    if (!instance) {
      return new RoleController();
    }
    return instance;
  }

  async getRolesByModule(req, res) {
    try {
      const module = req.params.module;
      const roles = await RoleService.getRolesByModule(module);
      return res.status(200).json(roles);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        method: "getRolesByModule",
        message: err.message,
      });
    }
  }
}

module.exports = RoleController.getInstance();
