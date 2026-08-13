import axios from "axios";
import { toast } from "react-toastify";

let storeRef;
let lastErrorMessage = null;
let lastErrorTime = 0;

const deduplicatedToast = (message) => {
  const now = Date.now();
  if (lastErrorMessage === message && (now - lastErrorTime < 2000)) {
    return;
  }
  lastErrorMessage = message;
  lastErrorTime = now;
  toast.error(message);
};

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
        deduplicatedToast("Session expired. Please login again.");
        storeRef.dispatch({ type: "auth/logout/fulfilled" });
      }
    }
    return Promise.reject(err);
  }
);

export { deduplicatedToast };
export default axiosInterceptor;
