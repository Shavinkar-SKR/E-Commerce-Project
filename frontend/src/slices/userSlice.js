import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    isAuthenticated: false,
  },
  reducers: {
    loginRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },

    loginSucces(state, action) {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    },

    loginFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
  },
});

const { actions, reducer } = authSlice;
export const { loginRequest, loginSucces, loginFail } = actions;
export default reducer;
