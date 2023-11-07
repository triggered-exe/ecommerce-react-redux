import { configureStore,getDefaultMiddleware } from "@reduxjs/toolkit";

import { authReducer } from "./authenticationSlice";
import { productsReducer } from "./productsSlice";
export const store = configureStore({
  reducer: {
    authReducer,
    productsReducer
  },
  middleware: [...getDefaultMiddleware()]
})