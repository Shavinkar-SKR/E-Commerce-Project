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

    // console.log({ keyword }); { keyword: { name: { '$regex': 'Inspiron', '$options': 'i' } } }
    // console.log({ ...keyword }); { name: { '$regex': 'Inspiron', '$options': 'i' } }
    this.query.find({ ...keyword }); //This means: "Find all products where the name contains 'product name', case-insensitively."

    return this; //return current class instance, by writing this allows for method chaining
  }

  filter() {
    const queryStrCopy = { ...this.queryStr };
    //query parameters before removing - reason is "keyword" not included as a property so remove keyword
    //for this url {{base_url}}/api/v1/products?keyword=Inspiron&category=Laptops
    //console.log(queryStrCopy);

    //removing parameters
    const removeFields = ["keyword"];
    removeFields.forEach((field) => delete queryStrCopy[field]);

    //after removing
    // console.log(queryStrCopy);

    let queryStr = JSON.stringify(queryStrCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g, (match) => `$${match}`);
    // console.log(queryStr);

    this.query.find(JSON.parse(queryStr)); //displays the products that is given as key=value in the url (e.g. ?category=Laptops)
    // console.log(queryStrCopy);
    return this;
  }

  paginate(resPerPage) {
    const currPage = Number(this.queryStr.page) || 1; //grabs the keyword page on the url passed and coverts it to number
    const skip = resPerPage * (currPage - 1); //this takes the count of the product to be skipped for the current page.
    // E.g if currPage=2, resPerPage=2 , then skip is 2, so it says skip the first two products and display the other products
    this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
