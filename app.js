require("dotenv").config();

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const connectDB = require("./src/database/mongoConnect");
const users = require("./src/routes/v1/users");
const modules = require("./src/routes/v1/modules");
const roles = require("./src/routes/v1/roles");
const login = require("./src/routes/v1/login");
const healthCheck = require("./src/routes/v1/healthCheck");
const morgan = require("morgan");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Eventify API Documentation",
      description:
        "API Documentation for the Eventify project that is part of Integracion de Aplicaciones",
      contact: {
        name: "Homero J. Simpson",
      },
      servers: ["http://localhost:3000"],
    },
  },
  basePath: "/",
  apis: ["./src/routes/v1/*.js"],
};

// var userRouter = require('./src/routes/user.route');

// Instancio express
const app = express();

// Defino el tratamiento de logs
app.use(morgan("dev"));

// Defino el tratamiento del body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuro cors
const port = process.env.PORT || 3000;
app.use(cors());

// Defino rutas
app.use("/api/v1/login", login);
app.use("/api/v1/users", users);
app.use("/api/v1/modules", modules);
app.use("/api/v1/roles", roles);
app.use("/api/v1/health", healthCheck);
app.use(
  "/api/v1/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsdoc(swaggerOptions)),
);

// Inicio servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Conecto a la base de datos
connectDB();
