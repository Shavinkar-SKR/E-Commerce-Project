const express = require("express"); //imports the express package
const app = express(); //creates an instance of the express
const productsRouter = require("./routes/productsRoute");

app.use(express.json()); //It parses incoming requests with Content-Type: application/json and makes the parsed data available in req.body
// When you're sending data as a JSON object (usually from the frontend using fetch, axios, Postman, etc.),
// the Express app needs to parse that incoming raw JSON string.
// Hey, if any request comes with Content-Type: application/json, parse the body and make it available as req.body."
app.use("/api/v1", productsRouter);

module.exports = app; //app object is set to export to other files
