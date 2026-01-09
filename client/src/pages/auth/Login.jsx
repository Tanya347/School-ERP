import "./login.scss"

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import { Tooltip } from "@mui/material";

import { useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { loginSuccess } from "../../utils/store/slices/authSlice";
import { postURLs } from "../../utils/endpoints/post"
import axiosInterceptor from "../../utils/shared/axiosInterceptor";
import { loginImagePaths } from "../../utils/shared/constants";
import { DarkModeContext } from "../../utils/context/darkModeContext";
import { checkSuccess } from "../../utils/shared/commons";

import ForgotPassword from "../../components/forgotPassword/ForgotPassword"
import Loader from "../../components/shared/loader/Loader";

// type will tell whether admin or student
function Login({ type }) {
  
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined
  })
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { Dispatch } = useContext(DarkModeContext);
  const dispatch = useDispatch();

  // set the use state to what the user entered
  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleClick = async (e) => {
   
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInterceptor.post(postURLs(type, "login"), credentials)
      
      if(checkSuccess(data.status)) {
        toast.success("You have logged in successfully!");
        dispatch(loginSuccess(data.user));
        navigate(`/${data.user.role}`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to log in. Please try again.";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <Tooltip title="Toggle Dark Mode" placement="left">
        <div className="dark-mode-toggle" onClick={() => Dispatch({ type: "TOGGLE" })}>
          <DarkModeIcon className="icon" />
        </div>
      </Tooltip>
      <Tooltip title="Go Back" placement="left">
        <div className="back-icon" onClick={() => navigate("/")}>
          <ArrowCircleLeftOutlinedIcon className="icon" />
        </div>
      </Tooltip>
      <div className="img-container">
        <img src={loginImagePaths[type]} alt="" />
      </div>

      <div className="l-container">

        <h1>Welcome to {type} Portal!</h1>
        <p>Please enter your username and password to access your {type.toLowerCase()} account.</p>

        <label htmlFor="username">Enter Username</label>
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="l-input"
        />

        <div className="password-input">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="password"
            id="password"
            onChange={handleChange}
            className="l-input"
            style={{"width": "100%", "marginTop": "10px"}}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </span>
        </div>

        {type !== "Admin" && <p
          className="forgot-password-link"
          onClick={() => setOpenModal(true)}
        >
          Forgot Password?
        </p>}

        {loading && <Loader text="Logging in..." />}
        <button onClick={handleClick} className="l-button">
          Login
        </button>
      </div>
      {openModal && <ForgotPassword setOpen={setOpenModal} type={type.toLowerCase()} />}
    </div>
  )
}

export default Login