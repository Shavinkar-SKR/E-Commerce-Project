import { Fragment, useEffect } from "react";
import MetaData from "./layouts/MetaData"; //customed function imported to pass the title of this component as props
import { getProducts } from "../actions/productsAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./layouts/Loader";
import Product from "./product/Product";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { useState } from "react";

export default function Home() {
  const dispatch = useDispatch();
  const { products, loading, error, count, resPerPage } = useSelector(
    (state) => state.productsState
  );
  const [currentPage, setCurrentPage] = useState(1);

  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };

  useEffect(() => {
    if (error) {
      return toast.error(error, {
        position: "bottom-center",
      });
    }

    dispatch(getProducts(currentPage));
  }, [error, dispatch, currentPage]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products"} />
          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product, index) => (
                  <Product product={product} key={index} index={index} />
                ))}
            </div>
          </section>
          {count > 0 && count > resPerPage ? (
            <div className="d-flex justify-content-center mt-5">
              <ReactPaginate
                pageCount={Math.ceil(count / resPerPage)} // total pages
                onPageChange={(e) => setCurrentPageNo(e.selected + 1)} // starts from page 1
                forcePage={currentPage - 1} // keep pagination in sync
                containerClassName="pagination" // container styling
                pageClassName="page-item" // each page <li> styling
                pageLinkClassName="page-link" // each page <a> styling
                activeClassName="active" // active <li> styling
                previousLabel="Prev"
                nextLabel="Next"
                breakLabel="..."
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
              />
            </div>
          ) : null}
        </Fragment>
      )}
    </Fragment>
  );
}
