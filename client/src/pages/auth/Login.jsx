import "./login.scss"

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { loginSuccess } from "../../store/slices/authSlice";
import { postURLs } from "../../config/endpoints/post"

import ForgotPassword from "../../components/forgotPassword/ForgotPassword"

// type will tell whether admin or student
function Login({ type }) {
  
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined
  })

  const navigate = useNavigate();
  const dispatch = useDispatch();

  var url;

  if(type==="Faculty") {
    url = "/Assets/faculty.jfif"

  } else if(type==="Student") {
    url = "/Assets/student.jfif";

  } else {
    url = "/Assets/admin.jfif"
  }

  // set the use state to what the user entered
  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleClick = async (e) => {
   
    e.preventDefault();
    
    try {
      const { data } = await axios.post(postURLs(type, "login"), credentials, { withCredentials: true })
      
      if(data.status === "success") {
        toast.success("You have logged in successfully!");
        dispatch(loginSuccess(data.user));
        navigate(`/${data.user.role}`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to log in. Please try again.";
      toast.error(errorMessage);
      throw err;
    } finally {
      // setLoading(false);
    }
  }

  return (
    <div className="admin-login">

      <div className="img-container">
        <img src={url} alt="" />
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

        <button onClick={handleClick} className="l-button">
          Login
        </button>
      </div>
      {openModal && <ForgotPassword setOpen={setOpenModal} type={type.toLowerCase()} />}
    </div>
  )
}

export default Login