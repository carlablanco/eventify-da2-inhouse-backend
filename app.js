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
const logs = require("./src/routes/v1/logs");
const login = require("./src/routes/v1/login");
const healthCheck = require("./src/routes/v1/healthCheck");
const serverHttp = require("https")
const morgan = require("morgan");
const fs = require("fs")
const cookieParser = require('cookie-parser');

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
const port = process.env.PORT || 3001;

app.use(cookieParser())

app.use(cors({
  origin: ["https://moduloexterno.eventify.dev:3005",
    "https://frontend.eventify.dev:3000",
    "https://frontend.deliver.ar:3000",
    "https://moduloexterno.deliver.ar:3008",
    "https://intranet.deliver.ar"
  ],
  credentials: true
}));

// Defino rutas
app.use("/api/v1/login", login);
app.use("/api/v1/users", users);
app.use("/api/v1/modules", modules);
app.use("/api/v1/roles", roles);
app.use("/api/v1/logs", logs);
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

/*const options = {
  key: fs.readFileSync('./key.backend.deliver.ar.pem'),
  cert: fs.readFileSync('./backend.deliver.ar.pem'),
};


serverHttp.createServer(options,app).listen(3001);
*/

// Conecto a la base de datos
connectDB();
