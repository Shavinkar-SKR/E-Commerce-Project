const products = require("../data/products.json");
const connectDb = require("../config/db");
const productModel = require("../models/productModel");
const dotenv = require("dotenv");

dotenv.config({ path: "backend/config/.env" });
connectDb();

const seeder = async () => {
  try {
    await productModel.deleteMany();
    console.log("Deleted the products");
    await productModel.insertMany(products);
    console.log("All the products are added");
  } catch (err) {
    console.log(err.message);
  }

  process.exit();
};

seeder();
