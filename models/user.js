const mongoose = require("mongoose");
const { createHmac } = require("node:crypto");
// const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 32,
    trim: true,
  },
  lastName: {
    type: String,
    maxlength: 32,
    trim: 32,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  userInfo: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    requred: true,
  },
  salt: String,
  role: {
    type: Number,
    default: 0,
  },
  purchases: {
    type: Array,
    default: [],
  },
});

userSchema
  .virtual("pass")
  .set(function (pass) {
    this.pass = password;
    this.salt = uuidv4();
    this.password = this.securePassword(pass);
  })
  .get(function () {
    return this.pass;
  });

userSchema.method = {
  authenticate: function (pass) {
    return this.securePassword(pass) === this.password;
  },

  securePassword: function (pass) {
    if (!pass) return "";
    try {
      return createHmac("sha256", this.salt).update(pass).digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
