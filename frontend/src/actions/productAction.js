import axios from "axios";
import {
  productRequest,
  productSuccess,
  productFail,
} from "../slices/productSlice";

export const getOneProduct = async (dispatch) => {
  try {
    dispatch(productRequest());
    const { data } = await axios.get(
      "/api/v1/product/68839b7ed7f64e2d9dfa5538"
    );
    dispatch(productSuccess(data));
  } catch (error) {
    dispatch(productFail(error.response.data.message));
  }
};
