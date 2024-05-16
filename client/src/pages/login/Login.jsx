import "./login.scss"

import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'




// type will tell whether admin or student
function Login({ type }) {

  var url;
  var post_url;

  if(type==="Faculty") {
    url = "https://drive.google.com/uc?id=1pB5VggYKPL8B-7q7EnAUwKSKttXsC8bV"
    post_url = "http://localhost:5500/api/faculties/loginFaculty"

  } else if(type==="Student") {
    url = "https://drive.google.com/uc?id=1AO6eJhTrn8bF4U-JA9OcRP6pLq2P2E5p";
    post_url = "http://localhost:5500/api/students/loginStudent"

  } else {
    url = "https://drive.google.com/uc?id=1vbn0I0RkKFCyxbZfHtLcQ3j3GN0UCm-1"
    post_url = "http://localhost:5500/api/admins/loginAdmin"
  }


  // function to navigate to a certain page once logged in
  const navigate = useNavigate();


  // sets the credentials entered by the user
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined
  })


  // call login functions from authcontext
  const { loading, error, dispatch } = useContext(AuthContext)
  

  // set the use state to what the user entered
  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }



  const handleClick = async (e) => {
   
    e.preventDefault();
    
    dispatch({ type: "LOGIN_START" });
    
    try {
      const res = await axios.post(post_url, credentials, { withCredentials: false })
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      
      // if admin then redirect to /admin i.e. localhost:3000/admin/
      if (type === "Admin") {
          navigate("/admin")
      }

      // if not admin redirect to / i.e localhost:3000/
      else {
        navigate("/");
      }

    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data })
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
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>

        {/* If there is error display error message */}
        {error && <span>{error.message}</span>}
      </div>
    </div>
  )
}

export default Login