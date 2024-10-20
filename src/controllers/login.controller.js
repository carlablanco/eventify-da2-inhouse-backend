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

      //let isUserRegistered = await AuthService.hasValidCredentials( email, password );
      // SNICOLINO: REEMPLAZO VALIDACION DE CREDENCIALES DE BBDD POR VALIDACION CON LDAP
      let isUserRegistered = await AuthService.ldapValidCredentials( email, password );
      console.log("LDAP-LOGIN = ", isUserRegistered );

      //if (isUserRegistered) {
      if (isUserRegistered.status == 0) {
        //const user = await UserService.getUserByEmail(email);
        //SNICOLINO: RECUPERO DATOS Y ROL DEL USUARIO DESDE LDAP
        const user = await UserService.ldapGetUserByEmail(email);
        console.log("LDAP-USER = ", user );

        //const token = jwt.sign(user.toJSON(), SECRET_KEY_JWT, {
        const token = jwt.sign(user, SECRET_KEY_JWT, {
          expiresIn: "1d",
        });

        return res.status(200).json({
          status: 200,
          user, 
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
