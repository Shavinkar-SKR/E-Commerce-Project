const app = require("./app");
const dotenv = require("dotenv");
const path = require("path");
const connectDatabase = require("./config/db");

dotenv.config({ path: path.join(__dirname, "config/.env") }); //path usesa method join() to concatenate the arguments.
// __dirname selects the complete path of this file which is server.js and stores the value i.e. E-commerce Project/backend

connectDatabase();

const server = app.listen(process.env.PORT, () => {
  //.listen creates a http server using express module
  console.log(
    `Server is running on Port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

//Handling Unhandled rejection error - this happens if Promise errors are not caught
//process is a global variable of Node, on() is an eventlistener.
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandled rejection error`);
  server.close(() => {
    //with server.close() only server is getting closed but node program is still running, so....
    process.exit(1); //to stop node program added a callback function stop using exit()
  });
});

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught exception error`);
  server.close(() => {
    process.exit(1);
  });
});

console.log(a); //at this place the uncaught exception error occurs, because a is not defined
