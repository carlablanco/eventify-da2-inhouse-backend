let instance = null;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const ModuleService = require("../services/module.service");

class ModuleController {
  static getInstance() {
    if (!instance) {
      return new ModuleController();
    }
    return instance;
  }

  async getModules(req, res) {
    try {
      const modules = await ModuleService.getModules();
      return res.status(200).json(modules);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        method: "getModules",
        message: err,
      });
    }
  }
}

module.exports = ModuleController.getInstance();
