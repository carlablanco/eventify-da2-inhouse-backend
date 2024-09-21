const cors = require("cors");
const express = require("express");
const bodyParser = require('body-parser')

const users = require("./src/routes/v1/users");
const login = require("./src/routes/v1/login");
const healthCheck = require("./src/routes/v1/healthCheck");

const {
  PORT, 
  NODE_ENV, 
  SECRET_KEY_JWT, 
  REFRESH_TOKEN_SIZE, 
  TOKEN_EXPIRATION, 
 } = require("./src/constants");

// var userRouter = require('./src/routes/user.route'); 

// Instancio express
const app = express();
// Defino el tratamiento del body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Configuro cors
const port = PORT || 3000;
app.use(cors());

// Defino rutas
app.use('/api/v1/login', login);
app.use('/api/v1/users', users);
app.use('/api/v1/status', healthCheck);

// Inicio servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});