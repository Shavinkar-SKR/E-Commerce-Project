const generateToken = (user, statusCode, res) => {
  //Generating JWT Token
  const token = user.getJwtToken();

  //Cookie options for storing the token securely
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRY_TIME * 1000 * 60 * 60 * 24 //expiry is set to 7 days by converting it to milliseconds
    ),
    httpOnly: true, //This cookie will be accessible only via http, not JavaScript (for security)
  };

  res
    .status(statusCode)
    .cookie(
      "token" /*This is a name of the key*/,
      token /*This is the value of that key*/,
      options
    )
    .json({
      success: true,
      token,
      user,
    });
};

module.exports = generateToken;
