const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //status code is set if passed as parameter otherwise sets to 500.

  if (process.env.NODE_ENV == "development") {
    //error is displayed in the development mode with stack trace for developers to find the location of the bug
    res.status(err.statusCode).json({
      success: false,
      message: err.message, // Human-readable error message
      stack: err.stack, // Shows where the error happened (file + line)
      error: err, // Includes the full error object
    });
  }

  if (process.env.NODE_ENV == "production") {
    //in the production mode error is displayed for the users withour the stack trace.
    let message = err.message; // Extract the error message
    let error = new ErrorHandler(message, 400);

    // Handle Mongoose validation errors (e.g., required fields missing)
    if (err.name == "ValidationError") {
      message = Object.values(err.errors).map((values) => values.message); //Object.values() gets the values of the errors object which is an array
      //as defined in the mongoose document, in the array it contains name, price, description,.... etc
      //for each property it has a message. So, that is retrieved here
      error = new ErrorHandler(message, 400); // Replace original error with custom error handler object
    }

    if (err.name == "CastError") {
      message = `Resource not found: ${err.path}`;
      error = new ErrorHandler(message, 404);
    }

    if ((err.code = 11000)) {
      message = `Duplicate ${Object.keys(err.keyValue)} error`;
      error = new ErrorHandler(message, 409); //409 - Conflict in request, such as duplicate resource (e.g., user already exists).
    }

    if ((err.name = "JSONWebTokenError")) {
      message = `JSON Web Token is invalid. Try again`;
      error = new ErrorHandler(message, 401); //401 - Unauthorized, Authentication required (e.g., missing/invalid token).
    }

    if ((err.name = "TokenExpiredError")) {
      message = `JSON Web Token is expired. Try again`;
      error = new ErrorHandler(message, 401);
    }

    res.status(err.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
