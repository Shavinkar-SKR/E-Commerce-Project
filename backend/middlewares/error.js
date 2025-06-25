const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //status code is set if passed as parameter otherwise sets to 500.

  if (process.env.NODE_ENV == "development") {
    //error is displayed in the development mode with stack trace for developers to find the location of the bug
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack, //stack trace provides the location of the error occurred
      error: err,
    });
  }

  if (process.env.NODE_ENV == "production") {
    //in the production mode error is displayed for the users withour the stack trace.
    let message = err.message;
    let error = { ...err };

    if ((err.name = "ValidationError")) {
      message = Object.values(err.errors).map((values) => values.message);
      error = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
