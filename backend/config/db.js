const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI) //connects the mongodb locally with the uri in the .env file
    .then((con) => {
      console.log(`Connected to MongoDB on host: ${con.connection.host}`); //prints a message with the connection host
    })
    //If there is no catch block, it shows uncaught rejection error - it cannot happen for invalid url...
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = connectDatabase;
