import "./adminNavbar.scss";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import LogoutIcon from '@mui/icons-material/Logout';

import { DarkModeContext } from "../../config/context/darkModeContext";

import { useContext, useState } from "react";
import { Link} from "react-router-dom"

import AdminSidebar from "../sidebar/AdminSidebar"
import { AuthContext } from "../../config/context/AuthContext";

const AdminNavbar = () => {

  // calling dispatch function that enables dark mode
  const { Dispatch } = useContext(DarkModeContext);
  const { dispatch } = useContext(AuthContext)

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
}

  // use state for opening and closing sidebar 
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="navbar">

      {/* Side bar only gets opened when openSidebar becomes true */}
      {openSidebar && <AdminSidebar setOpen={setOpenSidebar} />}

      <div className="wrapper">

        {/* Home and brand icon */}
        <Link to="/admin" style={{ textDecoration: "none"}}>
          {/* <p className=""><img src={process.env.PUBLIC_URL + "/Assets/brand.png"} height="60px" alt="" /></p> */}
          <div className="logo">
            <img src="/Assets/logo.png" alt="" style={{height: "50px"}}/>
            <p>Admin Dashboard</p>
          </div>
        </Link>

        <div className="items">

          {/* Icon to toggle light and dark mode */}
          
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => Dispatch({ type: "TOGGLE" })}
            />
          </div>

          {/* Make openSidebar true and false based on how user clicks the icon */}

          <div className="item" onClick={() => setOpenSidebar(!openSidebar)}>
            <ListOutlinedIcon className="icon" />
          </div>

          <div className="item">
            <LogoutIcon className="icon" onClick={handleClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;