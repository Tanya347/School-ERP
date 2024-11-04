import "./navbar.scss";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

import { DarkModeContext } from "../../config/context/darkModeContext";

import { useContext, useEffect, useState } from "react";
import useFetch from "../../config/service/useFetch";
import { Link, useNavigate } from "react-router-dom"

import NavSidebar from "../sidebar/MainSidebar"
import { getQueries } from "../../config/endpoints/get";
import { useAuth } from "../../config/context/AuthContext";

const Navbar = () => {

  const { Dispatch } = useContext(DarkModeContext);
  const { user, logout } = useAuth();

  const queries = useFetch(getQueries).data;


  let path = user.role;

  const [messages, setMessages] = useState([])
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openMessages, setOpenMessages] = useState(false);

  // feeds all messages into the messages array whenever page rerenders or data changes  
  useEffect(() => {
    setMessages(queries.filter((item) => item.queryTo === user._id))
  }, [queries, user._id])

  
  // this function is used to go to a certain end point
  const navigate = useNavigate();
  
  const handleClick = async (e) => {
    e.preventDefault();
    await logout("Logged Out Successfully!");
  }

  // toggles open and close of notifications pop up
  const handleMessages = () => {
    setOpenMessages(!openMessages)
  }

  return (
    <div className="navbar">

      {openSidebar && <NavSidebar setOpen={setOpenSidebar} />}

      <div className="wrapper">

        {/* takes to main landing page and if it is darkmode changes the brand so it's visible*/}
        <Link to={`/${user.role}`}>
          {/* {darkMode ? <p className="brand"><img src={process.env.PUBLIC_URL + "/Assets/brand2.png"} height="60px" alt="" /></p> : <p className="brand"><img src={process.env.PUBLIC_URL + "/Assets/brand.png"} height="60px" alt="" /></p>} */}
          <div className="logo" style={{textDecoration: "none"}}>
            <img src="/Assets/logo.png" alt="" style={{height: "50px"}}/>
            <p>Edu-Sangam</p>
          </div>
        </Link>

        <div className="items">

          {/* For toggling dark mode */}
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => Dispatch({ type: "TOGGLE" })}
            />
          </div>

          {/* Messages */}
          {user.role === 'faculty' && <div className="item" id="notif">
            <MailOutlineIcon className="icon" onClick={handleMessages} />
            <div className="counter">{messages.length}</div> {/* Shows number of notifications */}
          </div>}

          {/* Messages drop down will show when user clicks and useState gets set to true */}
          {openMessages && <ul id="notif-menu">
            {messages?.map((item) => (
              <li>
                <h3>{item.title}</h3>
                <p>{item.description.slice(0, 25)} ...</p>
              </li>
            ))}

            {/* Takes to the page of all updates */}
            <Link to="/faculty/queries" style={{ textDecoration: "none" }}>
              <li id="more">
                View all new queries
              </li>
            </Link>
          </ul>}




          {/* Menu */}

          <div className="item" onClick={() => setOpenSidebar(!openSidebar)}>
            <ListOutlinedIcon className="icon" />
          </div>

          {/* Profile */}

          <div className="item">
            <img
              src={user.profilePicture || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"}
              alt=""
              className="avatar"
              onClick={() => navigate(`/${path}/single/${user._id}`)}
            />
          </div>

          <div className="item">
            <LogoutIcon className="icon" onClick={handleClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
