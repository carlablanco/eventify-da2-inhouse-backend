const UserService = require('../service/user.service');
const diccionarioMensajes = require('../utils/diccionarioMensajes');

const connectDB = require('../database/mongoConnect');

const User = require('../models/Users');
connectDB();

exports.all = async function (req, res) {

    try {
        const users = await User.find();

        return res.status(200).json(users)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }

}

exports.userById = async function (req, res) {
    
    if (!req.params.id){
        return res.status(diccionarioMensajes[10].statusHttp).json(
            {status: diccionarioMensajes[10].statusHttp, message: diccionarioMensajes[10].message})
    }

    try {
        var User = await UserService.getUserById(req.params.id)
        
        return res.status(diccionarioMensajes[0].statusHttp).json(
            {status: diccionarioMensajes[0].statusHttp, data: User, message: diccionarioMensajes[0].message});
    } catch (e) {
        
        return res.status(e.statusHttp).json({status: e.statusHttp, message: e.message});
    }

}
