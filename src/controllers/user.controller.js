var UserService = require('../service/user.service');

const diccionarioMensajes = require('../utils/diccionarioMensajes');

// Saving the context of this module inside the _the variable
_this = this;

exports.getUserById = async function (req, res) {

    if (!req.query.id){
        return res.status(diccionarioMensajes[10].statusHttp).json(
            {status: diccionarioMensajes[10].statusHttp, message: diccionarioMensajes[10].message})
    }

    try {
        var User = await UserService.getUserById(req.query.id)
        
        return res.status(diccionarioMensajes[0].statusHttp).json(
            {status: diccionarioMensajes[0].statusHttp, data: User, message: diccionarioMensajes[0].message});
    } catch (e) {
        
        return res.status(e.statusHttp).json({status: e.statusHttp, message: e.message});
    }

}

exports.login = async function (req, res) {

    if (!req.query.cn || !req.query.pass){
        return res.status(diccionarioMensajes[8].statusHttp).json(
            {status: diccionarioMensajes[8].statusHttp, message: diccionarioMensajes[8].message})
    }

    try {
        var User = await UserService.login(req.query.cn, req.query.pass)
        
        return res.status(diccionarioMensajes[0].statusHttp).json(
            {status: diccionarioMensajes[0].statusHttp, data: User, message: diccionarioMensajes[0].message});
    } catch (e) {
        
        return res.status(e.statusHttp).json({status: e.statusHttp, message: e.message});
    }
}


