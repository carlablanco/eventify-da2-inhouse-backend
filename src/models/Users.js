const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  { strict: false },
);

const Users = model("Users", userSchema);

module.exports = Users;
