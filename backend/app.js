const express = require("express"); //imports the express package
const app = express(); //creates an instance of the express
const productsRouter = require("./routes/productsRoute");

app.use("/api/v1", productsRouter);

module.exports = app; //app object is set to export to other files
