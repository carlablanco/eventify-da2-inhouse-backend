let instance = null;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserService = require("../services/user.service");
const AuthService = require("../services/auth.service");
const LogsModel = require("../models/Logs");
const UrisModel = require("../models/Uris");
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
      const { email, password, redirectUrl = "" } = req.body;

      let isUserRegistered = await AuthService.ldapValidCredentials(email, password);
      console.log("LDAP-LOGIN = ", isUserRegistered);

      if (isUserRegistered.status == 0) {
        const user = await UserService.getUserByEmail(email);

        console.log("LDAP-USER = ", user);

        delete user.userPassword;

        const fixedUser = {
          id: user.uid,
          email: user.cn,
          firstName: user.givenName,
          lastName: user.sn,
          phoneNumber: user.telephoneNumber,
          province: user.st,
          locality: user.l,
          street: user.street,
          modules: user.modules,
        };

        const token = jwt.sign(fixedUser, SECRET_KEY_JWT, {
          expiresIn: "1d",
        });

        LogsModel.registerLog(user.uid, user.cn, user.modules, logTypes.LOGIN);

        let validModules = user.modules.map(module => module.module);

        let redirectUrls = await UrisModel.find({ module: { $in: validModules } });

        let authorized = false;
        redirectUrls.forEach(module => {
          if (redirectUrl.includes(module.uri))
            authorized = true;
        });

        if (authorized || redirectUrl === "") {

          res.cookie('token', token, {
            httpOnly: true,     // Hace que la cookie no sea accesible desde JavaScript
            secure: true,       // En producción, asegúrate de usar `true` para HTTPS
            domain: ".deliver.ar",
            maxAge: 3600000,
            sameSite: "none"     // Expira en 1 hora
          });

          return res.status(200).json({
            status: 200,
            user: fixedUser,
            token,
            //redirectUrl: redirectUrl.uri !== "" ? redirectUrl.uri : undefined,
            message: "Token created successfully.",
          });
        }
        else {
          return res.status(401).json({
            message: "Unauthorized.",
          });
        }
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

  async logout(req, res) {
    try {
      res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        domain: ".deliver.ar",
        expires: new Date(0),   // Expira inmediatamente
        sameSite: "none"
      });

      return res.status(200).json({
        status: 200,
        message: "Logout successfully.",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        method: "logout",
        message: err.message,
      });
    }
  }
}

module.exports = LoginController.getInstance();
