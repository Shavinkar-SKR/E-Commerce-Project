const express = require("express");
const {
  getProducts,
  newProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");
const router = express.Router();

// Protect the /products route — only accessible if user is authenticated via JWT token in cookies
router.route("/products").get(isAuthenticatedUser, getProducts);

router
  .route("/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct); //for this url if post request is triggered then newProduct handler function is called
// router.route("/product/:id").get(getOneProduct);
// router.route("/product/:id").put(updateProduct);
// router.route("/product/:id").delete(deleteProduct); using method chaining it can written like this too if url is same

router
  .route("/product/:id")
  .get(getOneProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
