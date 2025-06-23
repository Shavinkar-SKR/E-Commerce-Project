module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //status code is set if passed as parameter otherwise sets to 500.

  if (process.env.NODE_ENV == "development") {
    //error is displayed in the development mode with stack trace for developers to find the location of the bug
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack, //stack trace provides the location of the error occurred
    });
  }

  if (process.env.NODE_ENV == "production") {
    //in the production mode error is displayed for the users withour the stack trace.
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
};
