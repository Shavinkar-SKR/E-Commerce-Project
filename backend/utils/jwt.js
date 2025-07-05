const generateToken = (user, statusCode, res) => {
  //Generating JWT Token
  const token = user.getJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

module.exports = generateToken;
