const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  //This field stores the _id of the user who placed the order.
  //ref: "User" tells Mongoose that this ID refers to a document in the User collection.
  //It creates a relationship between the order and the user who made it
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  orderItems: [
    //Array of items ordered
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      //This field stores the ID of the product that the user ordered.
      //It refers to a document in the Product collection.
      //Helps link each item in the order to a real product in your store.
      product: {
        type: mongoose.SchemaType.ObjectId,
        required: true,
        ref: "Product",
      },
    },
  ],
  itemsPrice: {
    //Price before tax and shipping
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    //Total cost = itemsPrice + taxPrice + shippingPrice
    type: Number,
    required: true,
    default: 0.0,
  },
  paidAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

let orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;
