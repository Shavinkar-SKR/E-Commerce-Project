const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login first to access the resource", 401));
  }
  console.log("token " + token);

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  console.log("decode: " + decode);
  console.log("decode.id: " + decode.id);
  console.log("req.user: " + req.user);
  req.user = await userModel.findById(decode.id);
  console.log("req.user: " + req.user);

  next();
});
