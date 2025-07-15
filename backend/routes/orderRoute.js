const express = require("express");
const router = express.Router();
const { newOrder, getOneOrder } = require("../controllers/orderController");
const { isAuthenticatedUser } = require("../middlewares/authenticate");

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getOneOrder);

module.exports = router;
