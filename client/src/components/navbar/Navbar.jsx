import "./navbar.scss";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import MailOutlineIcon from '@mui/icons-material/MailOutline';

import { DarkModeContext } from "../../config/context/darkModeContext";
import { AuthContext } from "../../config/context/AuthContext";

import { useContext, useEffect, useState } from "react";
import useFetch from "../../config/hooks/useFetch";
import { Link, useNavigate } from "react-router-dom"

import NavSidebar from "../sidebar/MainSidebar"
import { getQueries } from "../../source/endpoints/get";

const Navbar = () => {

  const { Dispatch} = useContext(DarkModeContext);
  const { user } = useContext(AuthContext)
  
  const queries = useFetch(getQueries).data
  // const updates = useFetch(`/updates/student/${user.class}`).data


  let path

  if(user.isFaculty) {
    path = "faculty"
  } else if(user.isStudent) {
    path = "student"
  }
  
  // use states for setting notifications, opening notification popup and opening side bar
  // const [notifs, setNotifs] = useState([])
  const [messages, setMessages] = useState([])
  // const [openNotif, setOpenNotif] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openMessages, setOpenMessages] = useState(false);

  // // feeds all notifications into the notifs array whenever page rerenders or data changes
  // useEffect(() => {
  //   setNotifs(updates)
  // }, [updates])

  // feeds all messages into the messages array whenever page rerenders or data changes  
  useEffect(() => {
    setMessages(queries.filter((item) => item.queryTo === user._id))
  }, [queries, user._id])



  // this function is used to go to a certain end point
  const navigate = useNavigate();

  // toggles open and close of notifications pop up
  // const handleNotif = () => {
  //   setOpenNotif(!openNotif)
  // }

  // toggles open and close of notifications pop up
  const handleMessages = () => {
    setOpenMessages(!openMessages)
  }

  return (
    <div className="navbar">

      {openSidebar && <NavSidebar setOpen={setOpenSidebar} />}

      <div className="wrapper">

        {/* takes to main landing page and if it is darkmode changes the brand so it's visible*/}
        <Link to={user.isFaculty? "/faculty" : "/student"}>
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

          {/* Notifications */}
          {/* {user.isStudent && <div className="item" id="notif">
            <NotificationsNoneOutlinedIcon className="icon" onClick={handleNotif} />
            <div className="counter">{notifs.length}</div> 
          </div>} */}

          {/* Notifs drop down will show when user clicks and useState gets set to true */}
          {/* {openNotif && <ul id="notif-menu">
            {notifs.map((item) => (
              <li>
                <h3>{item.title}</h3>
                <p>{item.desc.slice(0, 25)} ...</p>
              </li>
            ))}
          </ul>} */}




          {/* Messages */}
          {user.isFaculty && <div className="item" id="notif">
            <MailOutlineIcon className="icon" onClick={handleMessages} />
            <div className="counter">{messages.length}</div> {/* Shows number of notifications */}
          </div>}

          {/* Messages drop down will show when user clicks and useState gets set to true */}
          {openMessages && <ul id="notif-menu">
            {messages.map((item) => (
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
        </div>
      </div>
    </div>
  );
};

export default Navbar;
