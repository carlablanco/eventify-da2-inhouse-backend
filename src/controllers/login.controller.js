let instance = null;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserService = require("../services/user.service");
const AuthService = require("../services/auth.service");

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
      let isUserRegistered = await AuthService.hasValidCredentials(
        email,
        password,
      );
      if (isUserRegistered) {
        const user = await UserService.getUserByEmail(email);
        const token = jwt.sign(user.toJSON(), SECRET_KEY_JWT, {
          expiresIn: "1d",
        });

        return res.status(200).json({
          status: 200,
          token,
          message: "Token created successfully.",
        });
      } else {
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
