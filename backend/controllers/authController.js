const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const userModel = require("../models/userModel");
const sendEmail = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const generateToken = require("../utils/jwt");
const crypto = require("crypto");

//Creates a user - /api/v1/register
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

//Login - /api/v1/login
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

//Logout - /api/v1/logout
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

//Handles forgot password request - /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email }); //finds the user with the email from the request body

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
  `; //custom message that is sent as body to the email

  try {
    sendEmail({
      //sends the email with the subject and message to the user
      email: user.email, //recipient email address
      subject: "Ecommerce Market place Password Recovery",
      message, //email message content with reset link
    });

    res.status(200).json({
      //respond with success if email is sent
      success: true,
      message: `Email was sent successfully to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined; //remove the reset token and its expiry from the user model
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//Handles password reset logic using token - /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto //Takes the plain token from the URL, hash the token to match with DB stored hashed token
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userModel.findOne({
    //find user whose token matches and token has not expired
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() }, //$gt = greater than now
  });

  if (!user) {
    return next(
      new ErrorHandler("Password reset token is either invalid or expired"),
      401
    );
  }

  //if passwords do not match, return an error
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords does not match", 422));
  }

  //set new password and clear reset token fields
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save({ validateBeforeSave: false }); //disables validations like email format or required password (because you're not updating those fields)

  generateToken(user, 201, res); //log in the user automatically by generating JWT token
});

//Returns the data of an authenticated/logged in user - /api/v1/myprofile
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.user.id); //req.user object comes from isAuthenticated middleware
  res.status(200).json({
    success: true,
    user,
  });
});

//Functionality to update the password - /api/v1/password/change
exports.changePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select("+password"); //finds the user by id by attaching password field to be visible

  if (!(await user.isPasswordValid(req.body.oldPassword))) {
    //checks old password is incorrect
    return next(new ErrorHandler("Old Password is incorrect", 401));
  }

  user.password = req.body.password; //if old password is correct, assigns the new password
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

//Functionality to Update Profile - /api/v1/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await userModel.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
    user,
  });
});

//Admin - Get all users - api/v1/admin/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await userModel.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//Admin - Get a specific user - api/v1/admin/user/:id
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.params.id); //extracts id from the url passed and finds the corresponding user

  if (!user) {
    return next(
      new ErrorHandler(`User not found with this id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "User found",
    user,
  });
});

//Admin - Update user - api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await userModel.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "User updated",
    user,
  });
});

//Admin - Delete a user - api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with this id: ${req.params.id}`, 404)
    );
  }

  await userModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "User removed successfully",
  });
});
