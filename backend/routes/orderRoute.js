const express = require("express");
const router = express.Router();
const {
  newOrder,
  getOneOrder,
  myorders,
  getOrders,
  updateOrder,
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

router
  .route("/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);

module.exports = router;
