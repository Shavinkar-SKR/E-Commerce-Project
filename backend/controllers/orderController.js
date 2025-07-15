const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const orderModel = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");

//Creates an order - api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await orderModel.create({
    shippingInfo,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});

//Get one order - api/v1/order/:id
exports.getOneOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate("user", "name email"); //Replaces user ID with corresponding full user document by only returning name and email
  //In Mongoose, when you reference another model using ref, you're storing just the ID of that document (like a foreign key in SQL).
  //But sometimes, you want the full details of the referenced document (like user or product), not just the ID.
  //That's where populate() comes in.

  if (!order) {
    return next(
      new ErrorHandler(`Order not found with this id ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//Get Logged In User Orders - api/v1/order/
exports.myorders = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderModel.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});
