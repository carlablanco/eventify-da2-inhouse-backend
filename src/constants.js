const PORT = 3500
const NODE_ENV = 'development'
// const NODE_ENV=production

// Seccion para manejo de token
const SECRET_KEY_JWT = 'd9e7ff74c8d7c3ff41b4a3636a7645e1f100e4c9'
const REFRESH_TOKEN_SIZE = 32
const TOKEN_EXPIRATION = 3600000*168 // Seteo en un ahora la validez del access_token

// Seccion para conexion a base de datos


module.exports = {
    PORT, 
    NODE_ENV, 
    SECRET_KEY_JWT, 
    REFRESH_TOKEN_SIZE, 
    TOKEN_EXPIRATION
}