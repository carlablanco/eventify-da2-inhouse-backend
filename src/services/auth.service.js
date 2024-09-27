require("dotenv").config();
const bcrypt = require("bcrypt");
const UserModel = require("../models/Users");

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
}

module.exports = new AuthService();
