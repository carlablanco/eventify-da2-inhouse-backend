let instance = null;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const LogsService = require("../services/logs.service");

class LogsController {
  static getInstance() {
    if (!instance) {
      return new LogsController();
    }
    return instance;
  }

  async getLogs(req, res) {
    try {
      const logs = await LogsService.getLogs();
      return res.status(200).json(logs);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        method: "getLogs",
        message: err.message,
      });
    }
  }

  async getLogsByMail(req, res) {
    try {
      const mail = req.params.mail;
      const logs = await LogsService.getLogs(mail);
      return res.status(200).json(logs);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        method: "getLogsByMail",
        message: err.message,
      });
    }
  }
}

module.exports = LogsController.getInstance();
