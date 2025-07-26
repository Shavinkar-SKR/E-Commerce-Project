import { Fragment, useEffect } from "react";
import MetaData from "./layouts/MetaData"; //customed function imported to pass the title of this component as props
import { getProducts } from "../actions/productsAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./layouts/Loader";
import Product from "./product/Product";

export default function Home() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.productsState);

  useEffect(() => {
    dispatch(getProducts);
  }, []);

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
                  <Product product={product} index={index} />
                ))}
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
}
