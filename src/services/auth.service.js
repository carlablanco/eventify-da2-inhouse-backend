require("dotenv").config();
const bcrypt = require("bcrypt");
const UserModel = require("../models/Users");
const { LDAP_IP, LDAP_OU, LDAP_DC } = process.env;
var LdapClient = require('ldapjs-client');
var client = new LdapClient({ url: LDAP_IP });

class AuthService {

  async hasValidCredentials(email, password) {
    try {
      const user = await UserModel.findOne({ email });
      const passwordMatch = bcrypt.compareSync(password, user?.password);
      return !!(user && passwordMatch);
    } catch (err) {
      console.error(err);
      throw new Error("Error in credentials validation");
    }
  }

  async ldapValidCredentials(email, password) {

    try {
      var userDn = `cn=${email},ou=usuarios,${LDAP_OU},dc=${LDAP_DC}`
      const ldapLogin = await client.bind(userDn, password);

      return ldapLogin;

    } catch (err) {
      console.log(err);
      throw new Error("Error with LDAP credentials validation");
    }

  }

}

module.exports = new AuthService();