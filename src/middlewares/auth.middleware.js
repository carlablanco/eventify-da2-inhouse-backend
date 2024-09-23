const { response } = require("express");
const jwt = require("jsonwebtoken");

const { SECRET_KEY_JWT, NODE_ENV } = process.env;

const validateJwt = async (req, res = response, next) => {
  try {
    if (NODE_ENV === "development") {
      req.userId = 333;
      return next();
    }
    const jwtValidate = jwt.verify(
      req.body.jwt ?? req.headers.authorization.split(" ")[1],
      SECRET_KEY_JWT,
    );
    if (jwtValidate) {
      res.status(200).json({
        message: "Usuario autorizado",
      });
      next();
    } else {
      return res.status(401).json({
        message: "Usuario no autorizado",
      });
    }
  } catch (err) {
    return res.status(401).json({
      message: "Usuario no autorizado",
    });
  }
};

module.exports = validateJwt;
