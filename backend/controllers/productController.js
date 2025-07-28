const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

//Managing Products

//Get Product - /api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next) => {
  const resPerPage = 3;
  const apiFeatures = new APIFeatures(productModel.find(), req.query)
    .search()
    .filter()
    .paginate(resPerPage);

  //passes productModel.find() into the constructor. That does not execute the query immediately — it creates a Mongoose Query object, not a Promise yet.
  const products = await apiFeatures.query;
  const totalProductsCount = await productModel.countDocuments({});

  await new Promise((resolve) => setTimeout(resolve, 3000)); //to make visibility of the loading content
  // return next(new ErrorHandler("Unable to fetch data", 404));
  res.status(200).json({
    success: true,
    count: totalProductsCount,
    resPerPage,
    products,
  });
});

//Create Product - /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id; //attach the ID of the logged-in user to the request body (to track which user created the product)
  //req.user is set by the isAuthenticatedUser middleware after verifying the JWT token, in that id is set to the user field
  const product = await productModel.create(req.body);
  res.status(201).json({
    //201 HTTP status code - The request was successful and a new resource was created on the server
    success: true,
    product, //product: product - both are fine since JS handle product has key and value pair
  });
});

//Get One Product - api/v1/product/:id
exports.getOneProduct = async (req, res, next) => {
  const product = await productModel.findById(req.params.id); //searches a product based on the id passed in the url

  if (!product) {
    //if proudct is null then it shows a 404 error saying product not found
    // res.status(404).json({
    //   success: false,
    //   message: "Product not found",
    // });
    return next(new ErrorHandler("Product not found test", 404));
    //next() simply moves from one middleware to the next.
    //This creates an error object with message and statusCode.
    // This error object is passed to Express using next(err).
    // Express automatically forwards this error to any middleware that has the signature: (err, req, res, next) => {....}
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

//Delete Product - /api/v1/product:id
exports.deleteProduct = async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found with that id",
    });
  }

  await productModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product deleted!",
  });
};

//Managing Reviews

//Creating review - api/v1/review
exports.newReview = catchAsyncError(async (req, res, next) => {
  const { productId, rating, comment } = req.body; //productId is retrieved here to access the document of that product

  const review = {
    user: req.user.id, //stores the id of the current logged in user
    rating,
    comment,
  };

  const product = await productModel.findById(productId);

  //this checks if the user has already posted the comment for the product, returning a boolean value
  const isReviewed = product.reviews.find((review) => {
    return review.user.toString() == req.user.id.toString(); //user id is converted to string
  });

  if (isReviewed) {
    //updating the review
    //if true, comment and rating is updated to a new value from the request body passed
    product.reviews.forEach((review) => {
      if (review.user.toString() == req.user.id.toString()) {
        review.rating = rating;
        review.comment = comment;
      }
    });
  } else {
    //creating a review
    //if false, new review is added to the array using push method to reviews
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length; //numOfReviews is assigned with the length of thr array
  }

  //finding the average of the product reviews
  product.ratings =
    product.reviews.reduce((acc, review) => {
      return acc + review.rating;
    }, 0) / product.reviews.length;

  product.ratings = isNaN(product.ratings) ? 0 : product.ratings; //if array is empty, then it returns NaN value, so to avoid that assigning 0

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review Updated",
  });
});

//Get all reviews of a product - api/v1/reviews?id=productId
exports.getReviews = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.query.id);

  res.status(200).json({
    success: true,
    review: product.reviews,
  });
});

//Delete Review - api/v1/review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.query.productId); //finding the product by the id passed in the query string

  //filtering and storing the reviews that does not match the deleting review id
  const reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.id.toString();
  });

  //updating the number of reviews after deletion
  const numOfReviews = reviews.length;
  console.log(numOfReviews);

  //finding the average with the filtered reviews
  let ratings =
    product.reviews.reduce((acc, review) => {
      return acc + review.rating;
    }, 0) / reviews.length;

  ratings = isNaN(ratings) ? 0 : ratings;

  //saving the document
  await productModel.findByIdAndUpdate(req.query.productId, {
    ratings,
    reviews,
    numOfReviews,
  });

  res.status(200).json({
    success: true,
  });
});
