const UserModel = require("../models/Users");
const bcrypt = require("bcrypt");
const { LDAP_IP, LDAP_DC } = process.env;
var LdapClient = require('ldapjs-client');
var client = new LdapClient({ url: LDAP_IP });


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

  async ldapGetUserByEmail (email) {
    
    try {
        const options = {
          filter: `(&(cn=${email}))`,
          scope: 'sub',
          attributes: ['sn', 'cn', 'ou', 'telephoneNumber']
        };

        const entries = await client.search(`dc=${LDAP_DC}`, options);

        return entries[0];

      } catch (err) {
        console.log(err);
        throw new Error("Error in ldapGetUserById Service");
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
