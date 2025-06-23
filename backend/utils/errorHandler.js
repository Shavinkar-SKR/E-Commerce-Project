class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor); //gives the flow of the error generated like in which file, which line the error is thrown
  }
}

module.exports = ErrorHandler;
