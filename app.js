//Express
var express = require('express');
var cookieParser = require('cookie-parser');

//incorporo cors
var cors = require('cors');

//importo router
var indexRouter = require('./src/routes/index');
var userRouter = require('./src/routes/user.route'); 

//instancio el servidor
var app = express();

//engine que permite renderizar paginas web
app.set('view engine', 'jade');
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

//aplico cors
app.use(cors());
app.use(cookieParser());

//Indico las rutas de los endpoint
app.use('/', indexRouter);
app.use('/users', userRouter);


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  
});


// Setup server port
var port = process.env.PORT || 8080;
// Escuchar en el puerto
app.listen(port,()=>{
    console.log('Servidor iniciado en el puerto ',port);
});


module.exports = app;


