const mongoose = require('mongoose');
const {
    MONGO_USER,
    MONGO_PASS,
    MONGO_CLUSTER,
    MONGO_APP_NAME,
    MONGO_DB
} = require("../constants");

const uri = "mongodb+srv://"+MONGO_USER+":"+MONGO_PASS+"@"+MONGO_CLUSTER+".arnnf.mongodb.net/"+MONGO_DB+"?retryWrites=true&w=majority&appName="+MONGO_APP_NAME+"";

const connectDB = async () => {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log("Conexión exitosa a MongoDB usando Mongoose!");
    } catch (error) {
      console.error("Error conectando a MongoDB: ", error);
      process.exit(1); // Finaliza la aplicación si falla la conexión
    }
  };
  
  // Exporta la función para ser usada en otros scripts
  module.exports = connectDB;