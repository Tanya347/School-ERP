import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import notificationReducer from "./slices/notificationSlice";
import { injectStore } from "../axiosInterceptor";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer
  }
});

injectStore(store);
