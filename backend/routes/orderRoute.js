const express = require("express");
const router = express.Router();
const {
  newOrder,
  getOneOrder,
  myorders,
  getOrders,
  updateOrder,
  deleteOrder,
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

router
  .route("/order/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);
module.exports = router;
