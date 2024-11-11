const { response } = require("express");
const jwt = require("jsonwebtoken");

const { SECRET_KEY_JWT, NODE_ENV } = process.env;

const validateJwt = async (req, res = response, next) => {



  if (req.cookies && req.cookies.token) {

    const refToken = req.cookies.token;

    const validacionJwt = jwt.verify(refToken, SECRET_KEY_JWT);

    if (!validacionJwt) {
      res.status(401).json({
        message: "Token invalido"
      })

      return;
    }

    req.usuarioSesion = jwt.decode(refToken, SECRET_KEY_JWT);

    next();



  } else {

    res.status(401).json({
      message: "No hay token provisto"
    })

  }

};

module.exports = validateJwt;
