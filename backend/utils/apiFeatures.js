class APIFeatures {
  constructor(query, queryStr) {
    this.query = query; //A Mongoose query object (e.g., productModel.find())
    this.queryStr = queryStr; //The query parameters from req.query (e.g., ?keyword=phone)
  }

  search() {
    let keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword, //$regex operator to perform a partial match on the name field.
            $options: "i", //tells to avoid case-sensitive
          },
        }
      : {}; //If no keyword, it passes an empty object — meaning "no search filter applied.";

    // console.log({ keyword });
    // console.log({ ...keyword });
    this.query.find({ ...keyword }); //This means: "Find all products where the name contains 'product name', case-insensitively."

    return this; //return current class instance, by writing this allows for method chaining
  }
}

module.exports = APIFeatures;
