import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null
};

// Define action types
const actionTypes = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  DEACTIVATE: "DEACTIVATE",
  VERIFY_USER: "VERIFY_USER",
  SET_ERROR: "SET_ERROR",
  SET_LOADING: "SET_LOADING"
};

// Reducer function to handle state updates
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return { ...state, user: action.payload, loading: false, error: null };
    case actionTypes.LOGOUT:
      return { ...state, user: null, loading: false, error: null };
    case actionTypes.DEACTIVATE:
      return { ...state, user: null, loading: false, error: null };
    case actionTypes.VERIFY_USER:
      return { ...state, user: action.payload, loading: false };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case actionTypes.SET_LOADING:
      return { ...state, loading: true };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [cookies, removeCookie] = useCookies(["jwt"]);
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (userData) => {
    dispatch({ type: actionTypes.LOGIN, payload: userData });
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async (message) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      if(res.data.status === 'success') {
        toast.success(`${message}`);
      }
      removeCookie("jwt");
      dispatch({ type: actionTypes.LOGOUT });
      localStorage.removeItem("user");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to logout. Please try again.";
      toast.error(errorMessage);
      console.error(err);
      dispatch({ type: actionTypes.SET_ERROR, payload: "Logout error" });
    }
  };

  const deactivate = async () => {
    try { 
      const res = await axios.delete(`${process.env.REACT_APP_API_URL}/users`, {withCredentials: true});
      if(res.data.status === 'success') {
        toast.success("Deactivated Successfully. We're sorry to hear you go :(");
        removeCookie("jwt");
        dispatch({ type: actionTypes.DEACTIVATE });
        localStorage.removeItem("user");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to logout. Please try again.";
      toast.error(errorMessage);
      console.error(err);
      dispatch({ type: actionTypes.SET_ERROR, payload: "Logout error" });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        deactivate,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);