import axios from "axios";
import { toast } from "react-toastify";

let storeRef;

export const injectStore = (store) => {
  storeRef = store;
};

const axiosInterceptor = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

axiosInterceptor.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && storeRef) {
      const state = storeRef.getState();
      if (state.auth?.user) {
        toast.error("Session expired. Please login again.");
        storeRef.dispatch({ type: "auth/logout/fulfilled" });
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInterceptor;
