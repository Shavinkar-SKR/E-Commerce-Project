const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const userModel = require("../models/userModel");

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, avatar } = req.body; //Destructure user details (name, email, password, avatar) from request body

  //Create a new user document in MongoDB
  const user = await userModel.create({
    name,
    email,
    password,
    avatar,
  });
  // user.password = undefined; //Before sending the user in the response, manually set the password to undefined:
  //This does not delete the password from the database.
  //It just removes it from the response object.

  const token = user.getJwtToken();

  res.status(201).json({
    success: true,
    message: "New user created successfully",
    user,
    token,
  });
});
