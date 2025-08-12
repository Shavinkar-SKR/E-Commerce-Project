const express = require("express"); //imports the express package
const app = express(); //creates an instance of the express
const productsRouter = require("./routes/productsRoute");
const errorMiddleware = require("./middlewares/error");
const authRouter = require("./routes/authRoute");
const cookieparser = require("cookie-parser");
const orderRouter = require("./routes/orderRoute");
const path = require("path");

app.use(express.json()); //It parses incoming requests with Content-Type: application/json and makes the parsed data available in req.body
// When you're sending data as a JSON object (usually from the frontend using fetch, axios, Postman, etc.),
// the Express app needs to parse that incoming raw JSON string.
// Hey, if any request comes with Content-Type: application/json, parse the body and make it available as req.body."
app.use(cookieparser()); //Parses cookies from incoming requests — needed for reading JWT token in authentication middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1", productsRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1", orderRouter);

app.use(errorMiddleware); //any error passed with next(err) from anywhere in the app will eventually hit this middleware and respond with JSON.

module.exports = app; //app object is set to export to other files
