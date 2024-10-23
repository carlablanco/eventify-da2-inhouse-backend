require("dotenv").config();
const { client, LDAP_USERS_ROUTE_OBJECT } = require('../utils/ldapConnect');

class AuthService {

  /* async hasValidCredentials(email, password) {
    try {
      const user = await UserModel.findOne({ email });
      const passwordMatch = bcrypt.compareSync(password, user?.password);
      return !!(user && passwordMatch);
    } catch (err) {
      console.error(err);
      throw new Error("Error in credentials validation");
    }
  } */

  async ldapValidCredentials(email, password) {
    try {
      const userDn = `cn=${email},${LDAP_USERS_ROUTE_OBJECT}`;
      const ldapLogin = await client.bind(userDn, password);

      return ldapLogin;
    }
    catch (err) {
      console.log(err);
      throw new Error("Error with LDAP credentials validation");
    }

  }

}

module.exports = new AuthService();