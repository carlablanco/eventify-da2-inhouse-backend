const PORT = 3000
const NODE_ENV = 'development'
// const NODE_ENV=production

// Seccion para manejo de token
const SECRET_KEY_JWT = 'd9e7ff74c8d7c3ff41b4a3636a7645e1f100e4c9'
const REFRESH_TOKEN_SIZE = 32
const TOKEN_EXPIRATION = 3600000*168 // Seteo en un ahora la validez del access_token
const MONGO_USER = ''
const MONGO_PASS = ''
const MONGO_DB = ''
const MONGO_CLUSTER = ''
const MONGO_APP_NAME = ''


// Seccion para conexion a base de datos


module.exports = {
    PORT, 
    NODE_ENV, 
    SECRET_KEY_JWT, 
    REFRESH_TOKEN_SIZE, 
    TOKEN_EXPIRATION,
    MONGO_USER, 
    MONGO_PASS, 
    MONGO_CLUSTER, 
    MONGO_APP_NAME,
    MONGO_DB
}