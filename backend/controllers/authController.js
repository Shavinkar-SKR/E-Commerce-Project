const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const userModel = require("../models/userModel");

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  const user = await userModel.create({
    name,
    email,
    password,
    avatar,
  });

  res.status(201).json({
    success: true,
    message: "New user created successfully",
    user,
  });
});
