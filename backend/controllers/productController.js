const productModel = require("../models/productModel");

//Get Product - /api/v1/products
exports.getProducts = async (req, res, next) => {
  const products = await productModel.find();
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
};

//Create Product - /api/v1/product/new
exports.newProduct = async (req, res, next) => {
  const product = await productModel.create(req.body);
  res.status(201).json({
    //201 HTTP status code - The request was successful and a new resource was created on the server
    success: true,
    product, //product: product - both are fine since JS handle product has key and value pair
  });
};
