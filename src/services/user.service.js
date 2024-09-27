// // Gettign the Newly created Mongoose Model we just created
// var LdapClient = require('ldapjs-client');
// var client = new LdapClient({ url: 'ldap://10.8.0.1:389' });
//
// const diccionarioMensajes = require('../utils/requestMessages');
//
// // Saving the context of this module inside the _the variable
// _this = this
//
// exports.getUserById = async function (idUser) {
//
//     try {
//         const options = {
//           filter: `(&(cn=${idUser}))`,
//           scope: 'sub',
//           attributes: ['sn', 'cn']
//         };
//
//         const entries = await client.search('dc=eventify,dc=local', options);
//
//         console.log(entries)
//         return entries;
//
//       } catch (e) {
//         console.log(e);
//       }
//
// }
//
// exports.login = async function (cn, pass) {
//
//     try {
//
//         var userDn = `cn=${cn}` + ",ou=eventify_sa,dc=eventify,dc=local"
//         const login = await client.bind( userDn , pass);
//
//         console.log(login)
//         return login;
//
//       } catch (e) {
//         console.log(e);
//       }
//
// }
//
//
//
//
//

const UserModel = require("../models/Users");
const bcrypt = require("bcrypt");

class UserService {
  async getUsers() {
    try {
      return await UserModel.find();
    } catch (err) {
      console.error(err);
      throw new Error("Error in getUsers Service");
    }
  }

  async getUserById(id) {
    try {
      return await UserModel.findOne({ _id: id });
    } catch (err) {
      console.error(err);
      throw new Error("Error in getUserById Service");
    }
  }

  async getUserByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (err) {
      console.error(err);
      throw new Error("Error in getUserById Service");
    }
  }

  async createUser(user) {
    try {
      const isUserRegistered = await UserModel.findOne({ email: user.email });
      if (isUserRegistered) {
        throw new Error("User already registered");
      } else {
        user.password = await bcrypt.hash(user.password, 10);
        await UserModel.create(user);
        return user;
      }
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }
}

module.exports = new UserService();
