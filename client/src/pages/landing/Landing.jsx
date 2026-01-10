import "./landing.scss";

import DarkModeIcon from '@mui/icons-material/DarkMode';

import { Link } from 'react-router-dom'
import { useContext } from 'react';

import { DarkModeContext } from "../../utils/context/darkModeContext";
import { Tooltip } from "@mui/material";

const Landing = () => {

  const { Dispatch } = useContext(DarkModeContext);

  return (
    
    <div className="landing-container">
      <Tooltip title="Toggle Dark Mode" placement="left">
        <div className="dark-mode-toggle" onClick={() => Dispatch({ type: "TOGGLE" })}>
          <DarkModeIcon className="icon" />
        </div>
      </Tooltip>
      <h1>SmartCampus</h1>
      <img src="/Assets/landing.png" alt="" />
      <div className="button-container">
        
        <div className="not-admin">
        <Link to="/studentLogin">
          <button>Login as Student</button>
        </Link>
        
        <Link to="/facultyLogin">
          <button>Login as Faculty</button>
        </Link>
        </div>
        <div>
          <Link to="/adminLogin">
            <button>Login as Admin</button>
          </Link>
        </div>
        <div className="is-admin">
          <Link to="/registerSchool">
            <button>Register School</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Landing