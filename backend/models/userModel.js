const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name"],
  },
  email: {
    type: String,
    required: [true, "Please enter the email"],
    unique: true, //Ensures no two users have the same email
    validate: [validator.isEmail, "Please enter a valid email"], //Validates email format
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    maxlength: [6, "Password cannot exceed 6 characters"],
    //select: false, //It hides the field from being returned in queries like .find() or .findOne().
    //const user = await User.findOne({ email }).select("+password");
  },
  avatar: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordTokenExpire: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10); //It defines how many times the hashing algorithm is applied internally.
  //means: hash it using a salt, and repeat the hashing process 2^10 = 1024 times
}); //before saving a user document it hashes the password using bcrypt module

let userModel = mongoose.model("User", userSchema);

module.exports = userModel;
