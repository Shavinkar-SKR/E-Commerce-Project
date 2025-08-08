import axios from "axios";
import { loginFail, loginRequest, loginSucces } from "../slices/userSlice";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post("/api/v1/login", { email, password });
    dispatch(loginSucces(data));
  } catch (error) {
    dispatch(loginFail(error.response.data.message));
  }
};
