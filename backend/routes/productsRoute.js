const express = require("express");
const {
  getProducts,
  newProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
  newReview,
  getReviews,
  deleteReview,
} = require("../controllers/productController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");
const router = express.Router();

//Product Routes
// Protect the /products route — only accessible if user is authenticated via JWT token in cookies
router.route("/products").get(getProducts);

router
  .route("/product/:id")
  .get(getOneProduct)
  .put(updateProduct)
  .delete(deleteProduct);
// router.route("/product/:id").get(getOneProduct);
// router.route("/product/:id").put(updateProduct);
// router.route("/product/:id").delete(deleteProduct); using method chaining it can written like this too if url is same

//Review routes
router.route("/review").put(isAuthenticatedUser, newReview);
router.route("/reviews").get(getReviews);
router.route("/review").delete(deleteReview);
//Admin routes - Product
router
  .route("admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct); //for this url if post request is triggered then newProduct handler function is called

module.exports = router;
