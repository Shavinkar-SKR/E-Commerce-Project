const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const generateToken = require("../utils/jwt");

//Creates a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, avatar } = req.body; //Destructure user details (name, email, password, avatar) from request body

  //Create a new user document in MongoDB
  const user = await userModel.create({
    name,
    email,
    password,
    avatar,
  });
  //user.password = undefined; //Before sending the user in the response, manually set the password to undefined:
  //This does not delete the password from the database.
  //It just removes it from the response object.

  generateToken(user, 201, res);
});

//Login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body; //catching the email and password from request body

  //Checks if email and passwords are empty
  if (!email || !password) {
    return next(
      new ErrorHandler("Please enter the email and the password", 400)
    );
  }

  //finds the user in the db corresponding to the email and password is also attached for comparison
  const user = await userModel.findOne({ email }).select("+password");

  //Checks if user is absent
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  //Compares the user entered password with db stored password for an email
  if (!(await user.isPasswordValid(password))) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  generateToken(user, 201, res);
});

exports.logoutUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("User is not logged in", 400));
  }

  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};
