let instance = null;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserService = require("../services/user.service");
const AuthService = require("../services/auth.service");
const LogsModel = require("../models/Logs");
const { logTypes } = require("../config/logs");

const { SECRET_KEY_JWT } = process.env;

class LoginController {
  static getInstance() {
    if (!instance) {
      return new LoginController();
    }
    return instance;
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      let isUserRegistered = await AuthService.ldapValidCredentials(email, password);
      console.log("LDAP-LOGIN = ", isUserRegistered);

      if (isUserRegistered.status == 0) {
        const user = await UserService.getUserByEmail(email);

        console.log("LDAP-USER = ", user);

        const token = jwt.sign(user, SECRET_KEY_JWT, {
          expiresIn: "1d",
        });

        LogsModel.registerLog(user.uid, user.cn, user.modules, logTypes.LOGIN);

        return res.status(200).json({
          status: 200,
          user,
          token,
          message: "Token created successfully.",
        });
      }
      else {
        return res.status(401).json({
          message: "Unauthorized.",
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        method: "login",
        message: err.message,
      });
    }
  }
}

module.exports = LoginController.getInstance();
