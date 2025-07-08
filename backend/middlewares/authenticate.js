const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

//Middleware that handles authenticated user
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies; //extract the JWT token from cookies

  //if no token is present, user is not logged in
  if (!token) {
    return next(new ErrorHandler("Login first to access the resource", 401));
  }
  //console.log("token " + token);

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  //checks that the token was signed with the correct secret.
  //verifies the token wasn’t changed or expired. Returns decoded data
  //console.log("decode: " + decode);
  //console.log("decode.id: " + decode.id);

  req.user = await userModel.findById(decode.id);
  //makes it available in the rest of the request lifecycle
  //adding a new field user to the request body, user is found by id passed through decode
  //console.log("req.user: " + req.user);

  next(); //this lets the actual route (e.g. getProducts) run
  //if you don't call next(), the request gets stuck and your route handler (like getProducts) never runs.
});

//Middleware to restrict certain roles to create, update and delete a product
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      //checks if the current user's role is included in the allowed roles(refer productRoute.js for allowed roles)
      return next(
        new ErrorHandler(
          `${req.user.role} role is not allowed modify a resource`,
          403 //status code is set for forbidden, when a user is authenticated but cannot access the resource
        )
      );
    }
    next(); //if role is allowed, continue to the route handler
  };
};
