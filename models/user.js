// Imports
const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuidv1");

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 100
    },
    lname: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 200,
      unique: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    salt: String,
    role: {
      type: Number,
      default: 0
    },
    history: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);


// Virtual Fields
userSchema.virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  encryptPassword: function(password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.model("User", userSchema);
