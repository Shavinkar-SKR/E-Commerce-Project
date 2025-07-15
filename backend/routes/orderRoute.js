const express = require("express");
const router = express.Router();
const {
  newOrder,
  getOneOrder,
  myorders,
  getOrders,
} = require("../controllers/orderController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getOneOrder);
router.route("/myorders").get(isAuthenticatedUser, myorders);

//Admin routes
router
  .route("/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getOrders);

module.exports = router;
