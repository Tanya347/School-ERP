import "./login.scss"

import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { postURLs } from "../../config/endpoints/post"
import { toast } from "react-toastify";
import { useAuth } from "../../config/context/AuthContext"

// type will tell whether admin or student
function Login({ type }) {

  var url;

  if(type==="Faculty") {
    url = "/Assets/faculty.jfif"

  } else if(type==="Student") {
    url = "/Assets/student.jfif";

  } else {
    url = "/Assets/admin.jfif"
  }

  // function to navigate to a certain page once logged in
  const navigate = useNavigate();

  // sets the credentials entered by the user
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined
  })

  const {login} = useAuth();

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
        login(data.user)
        navigate(`/${data.user.role}`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to log in. Please try again.";
      toast.error(errorMessage);
      console.error(err);
      throw err;
    } finally {
      // setLoading(false);
    }
  }

  return (
    <div className="AdminLogin">

      <div className="img-container">
        <img src={url} alt="" />
      </div>

      <div className="lContainer">

        <h1>Welcome to {type} Portal!</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>

        <label htmlFor="username">Enter Username</label>
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange} // handlechange sets the value to usestate
          className="lInput"
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />

        <p style={{"marginTop": "20px", "marginBottom": "10px"}}>Forgot Password?</p>

        {/* When button is clicked called handleclick so all the operations can be performed*/}
        <button onClick={handleClick} className="lButton">
          Login
        </button>
      </div>
    </div>
  )
}

export default Login