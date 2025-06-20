const mongoose = require("mongoose"); //exporting the mongoose model to create a product model
//using mongoose we can set the fields of a document, if fields are missing can be given validation errors

const productSchema = new mongoose.Schema({
  name: {
    type: String, //this is string type data
    required: [true, "Please enter the product name"], //this field is mandatory, and 2nd argument is error message if value is not given
    trim: true, //trim eliminates the spaces left and right
    maxLength: [100, "Product name cannot exceed 100 characters"], //maximum characters can be entered is 100, error message if it exceeds
  },
  price: {
    type: Number,
    //required:true,
    default: 0, //if default keyword is used then it is not must to give required keyword as true.
  },
  description: {
    type: String,
    required: [true, "Please enter the product description"],
  },
  ratings: {
    type: String,
    default: 0,
  },
  images: [
    {
      image: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter the product category"],
    enum: {
      //categories should not entered by the user, it should only be selected as from the options given, so enum is used
      values: [
        "Electronics",
        "Mobile phones",
        "Laptops",
        "Accessories",
        "Headphones",
        "Foods",
        "Books",
        "Clothes/Shoes",
        "Beauty/Health",
        "Sports",
        "Outdoor",
        "Home",
      ],
      message: "Please select correct category",
    },
  },
  seller: {
    type: String,
    required: [true, "Please enter product seller"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter the product stocks"],
    maxLength: [20, "Product stock is limited up to 20"],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const prodSchema = mongoose.model("Product", productSchema); //blueprint of the schema is given and in return it returns a model file

module.exports = prodSchema;
