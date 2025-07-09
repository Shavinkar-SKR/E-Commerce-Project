const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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
    select: false, //It hides the field from being returned in queries like .find() or .findOne().
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
  //this middleware triggers everytime save function is called
  if (!this.isModified("password")) {
    //this checks if the password is unchanged before saving the document
    next();
  }
  this.password = await bcrypt.hash(this.password, 10); //It defines how many times the hashing algorithm is applied internally.
  //means: hash it using a salt, and repeat the hashing process 2^10 = 1024 times
}); //before saving a user document it hashes the password using bcrypt module

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

userSchema.methods.isPasswordValid = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex"); //generates a random token, raw token to send via email

  this.resetPasswordToken = crypto //hash the token using SHA-256 and store in DB
    .createHash("sha256") //creates a Hash object using the SHA-256 algorithm or chooses sha-256 algorithm.
    .update(resetToken) //feeds/puts the token into hash
    .digest("hex"); //finalizes the hash. Returns the hashed result

  this.resetPasswordTokenExpire = Date.now() + 1000 * 60 * 30; //set expiration time for token (30 minutes from now).
  //This is stored in DB so you can check if token is still valid

  return resetToken; //return the raw (unhashed) token, so it can be sent via email
};

let userModel = mongoose.model("User", userSchema);

module.exports = userModel;
