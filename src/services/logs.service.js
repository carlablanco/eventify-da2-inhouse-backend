const LogsModel = require("../models/Logs");
const bcrypt = require("bcrypt");

class LogsService {
  async getLogs(username) {
    try {
      let logs = [];
      if (username)
        logs = await LogsModel.find({ username });
      else
        logs = await LogsModel.find();
      return logs;
    }
    catch (err) {
      console.log(err);
      throw new Error("Error in getLogs Service", err);
    }
  }
}

module.exports = new LogsService();
