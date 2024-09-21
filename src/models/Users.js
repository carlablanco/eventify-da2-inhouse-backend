const mongoose = require('mongoose');

// Definir el esquema flexible para la colección 'users'
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
}, { strict: false });

// Verificar si el modelo ya está compilado o crearlo si no lo está
const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

module.exports = User;
