module.exports = (func) => (req, res, next) => {
  // It catches any errors and passes them to the next middleware (i.e., error handling middleware)
  return Promise.resolve(func(req, res, next)).catch(next);
};
