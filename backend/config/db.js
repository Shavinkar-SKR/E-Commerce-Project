const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI) //connects the mongodb locally with the uri in the .env file
    .then((con) => {
      console.log(`Connected to MongoDB on host: ${con.connection.host}`); //prints a message with the connection host
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDatabase;
