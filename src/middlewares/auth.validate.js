const { response } = require("express");
const jwt = require("jsonwebtoken");

const { SECRET_KEY_JWT, NODE_ENV } = process.env;

const validateJwt = async (req, res = response) => {
  try {
    if ((req.cookies && req.cookies.token) || req.headers?.authorization) {

      const refToken = req.cookies.token || req.headers?.authorization;

      const validacionJwt = jwt.verify(refToken, SECRET_KEY_JWT);

      if (!validacionJwt) {
        res.status(401).json({
          message: "Token invalido"
        })

        return;
      }

      req.usuarioSesion = jwt.decode(refToken, SECRET_KEY_JWT);

      return res.status(200).json({
        sesionData: req.usuarioSesion
      });
    }
    else {

      res.status(401).json({
        message: "No hay token provisto"
      })

      return;

    }
  }
  catch (error) {
    console.error("Failed token verify", error);
    return res.status(401).json({
      message: "Token invalido"
    })
  }

};

module.exports = validateJwt;
