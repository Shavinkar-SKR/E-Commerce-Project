const app = require("./app");
const dotenv = require("dotenv");
const path = require("path");
const connectDatabase = require("./config/db");

dotenv.config({ path: path.join(__dirname, "config/.env") }); //path usesa method join() to concatenate the arguments.
// __dirname selects the complete path of this file which is server.js and stores the value i.e. E-commerce Project/backend

connectDatabase();

app.listen(process.env.PORT, () => {
  //.listen creates a http server using express module
  console.log(
    `Server is running on Port: ${process.env.PORT} in ${process.env.NODE_ENV}mode`
  );
});
