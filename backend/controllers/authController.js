const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const userModel = require("../models/userModel");
const sendEmail = require("../utils/email");
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

//Logout
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

//funtion handling to reset a password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email }); //finds the user with this email from the request body

  if (!user) {
    //if email is absent, throws an error message
    return next(new ErrorHandler("User not found with this email"), 404);
  }

  const resetToken = user.getResetToken(); //generated reset token is set here
  await user.save({ validateBeforeSave: false }); //after generating reset token it is saved to db and validations set to false before saving

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`; //reset url is defined for user reset the password
  //req.protocol give http or https and host gives 127.0.0.1

  const message = `
  Dear ${user.name},
  \n\n A password reset event has been triggered. The password reset window is limited to 30 minutes 
  \n\n To complete the password reset process, visit the following link:
  \n\n ${resetUrl} 
  \n\n If you have not requested this email, please ignore it. \n\n Thanks,\n The E-Commerce Market place
  `;

  try {
    sendEmail({
      email: user.email,
      subject: "Ecommerce Market place Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email was sent successfully to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});
