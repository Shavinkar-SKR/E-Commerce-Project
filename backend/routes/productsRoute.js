const express = require("express");
const {
  getProducts,
  newProduct,
  getOneProduct,
  updateProduct,
} = require("../controllers/productController");
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/product/new").post(newProduct); //for this url if post request is triggered then newProduct handler function is called
router.route("/product/:id").get(getOneProduct);
router.route("/product/:id").put(updateProduct);

module.exports = router;
