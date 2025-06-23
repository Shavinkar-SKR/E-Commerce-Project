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

//Get One Product - api/v1/product/:id
exports.getOneProduct = async (req, res, next) => {
  const product = await productModel.findById(req.params.id); //searches a product based on the id passed in the url

  if (!product) {
    //if proudct is null then it shows a 404 error saying product not found
    res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    //if product is found with that id then it shows 200 success response
    success: true,
    product,
  });
};

//Update Product - /api/v1/product/:id
exports.updateProduct = async (req, res, next) => {
  let product = await productModel.findById(req.params.id);

  if (!product) {
    res.status(404).json({
      success: false,
      message: "Product not found!!!!",
    });
  }

  product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true, //ensures that Mongoose validation rules (like required, maxLength, enum, etc.) defined in the schema are enforced during the update.

    new: true, //it gives the updated product data instead of the old product data,
    // eg: if stock is updated to 10 where original value was 5, then it should show the all the properties of the product with the updated one
  });

  res.status(200).json({
    success: true,
    product,
  });
};
