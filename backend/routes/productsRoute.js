const express = require("express");
const { getProducts, newProduct } = require("../controllers/productController");
const router = express.Router();

router.route("/products").get(getProducts);

router.route("/product/new").post(newProduct); //for this url if post request is triggered then newProduct handler function is called

module.exports = router;
