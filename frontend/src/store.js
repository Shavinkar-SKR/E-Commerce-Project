import { configureStore, combineReducers } from "@reduxjs/toolkit"; //combineReducers is used to combine multiple slice reducers into one.
// import thunk from "redux-thunk"; //importing redux-thunk middleware to handle asynchronous actions in Redux.
import productsReducer from "./slices/productsSlice";

const reducer = combineReducers({
  //creating a root reducer by combining individual reducers
  productsState: productsReducer,
});

const store = configureStore({
  reducer,
  //middleware: [thunk], //middleware array includes thunk to enable async actions
});

export default store;
