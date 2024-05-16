import "./navSidebar.scss"
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

import { motion } from "framer-motion";

import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from '@mui/icons-material/Task';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EditIcon from '@mui/icons-material/Edit';
import AddTaskIcon from '@mui/icons-material/AddTask';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddchartIcon from '@mui/icons-material/Addchart';
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNext';
import PostAddIcon from '@mui/icons-material/PostAdd';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { DarkModeContext } from "../../context/darkModeContext";

import Query from '../query/Query';


const NavSidebar = ({ setOpen }) => {

    const { Dispatch } = useContext(DarkModeContext);
    const { dispatch, user } = useContext(AuthContext)
    
    // useState for opening query pop up
    const [openQuery, setOpenQuery] = useState(false);

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGOUT" });
    }

    return (
        <div className='navSidebarContainer'>

            <motion.div animate={{ width: "200px" }} className="sidebar">
                <ul>

                    <li id='menu'>
                        <h2 >MAIN MENU</h2>
                        <CloseIcon className='icon' onClick={() => setOpen(false)} />
                    </li>


                    <p className="title">Main</p>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <li>
                            <DashboardIcon className="icon" />
                            <span>Dashboard</span>
                        </li>
                    </Link>

                    {/* All the Lists*/}

                    <p className="title">Information</p>

                    {/* Calender Page */}
                    <Link to="/events" style={{"textDecoration": "none"}}>
                        <li>
                            <CalendarMonthIcon className="icon"/>
                            <span>Calender</span>
                        </li>
                    </Link>

                    {/* Takes you to list of all tasks created by admin */}
                    <Link to={user.isFaculty? "/facTasks" : "/stuTasks"} style={{ textDecoration: "none" }}>
                        <li>
                            <TaskIcon className="icon" />
                            <span>Tasks</span>
                        </li>
                    </Link>

                    {/* Takes you to list of all tasks created by admin */}
                    <Link to={user.isFaculty? "/facVideo" : "/stuVideo"} style={{ textDecoration: "none" }}>
                        <li>
                            <OndemandVideoIcon className="icon" />
                            <span>Videos</span>
                        </li>
                    </Link>

                    {/* Takes you to list of all responses sent by faculties */}
                    {user.isStudent && <Link to="/responses" style={{ textDecoration: "none" }}>
                        <li>
                            <MarkChatReadIcon className="icon" />
                            <span>Responses</span>
                        </li>
                    </Link>}

                    {/* Create events/queries */}
                    <p className="title">Create</p>

                    {(user.isFaculty) && <Link to="/facTasks/new" style={{ textDecoration: "none" }}>
                        <li>
                            <AddTaskIcon className="icon" />
                            <span>Tasks</span>
                        </li>
                    </Link>}

                    {(user.isFaculty) && <Link to="/tests/new" style={{ textDecoration: "none" }}>
                        <li>
                            <NoteAddIcon className="icon" />
                            <span>Tests</span>
                        </li>
                    </Link>}

                    {(user.isFaculty) && <Link to="/attendance/new" style={{ textDecoration: "none" }}>
                        <li>
                            <PlaylistAddIcon className="icon" />
                            <span>Attendance</span>
                        </li>
                    </Link>}

                    {(user.isFaculty) && <Link to="/marks/new" style={{ textDecoration: "none" }}>
                        <li>
                            <AddchartIcon className="icon" />
                            <span>Marks</span>
                        </li>
                    </Link>}

                    {(user.isFaculty) && <Link to="/material/new" style={{ textDecoration: "none" }}>
                        <li>
                            <PostAddIcon className="icon" />
                            <span>Material</span>
                        </li>
                    </Link>}

                    {(user.isFaculty) && <Link to="/marks/new" style={{ textDecoration: "none" }}>
                        <li>
                            <QueuePlayNextIcon className="icon" />
                            <span>Videos</span>
                        </li>
                    </Link>}
                    

                    {/* Event can be created only when user is a part of technical team so it will only be visible to them */}
                    <Link to="/newEvent" style={{ textDecoration: "none" }}>
                        {user.subteam === "Technical Team" &&
                            <li>
                                <PersonAddIcon className="icon" />
                                <span>Event</span>
                            </li>
                        }
                    </Link>
                    
                    {/* On click set usestate to true */}
                    {user.isStudent && <li onClick={() => setOpenQuery(true)}>
                        <ContactSupportIcon className="icon" />
                        <span>Query</span>
                    </li>}

                    {/* Options for Users */}
                    
                    <p className="title">User</p>

                    {/* View Profile */}
                    <Link to={user.isFaculty? `/faculties/${user._id}` : `/students/${user._id}`} style={{ textDecoration: "none" }}>
                        <li>
                            <AccountCircleOutlinedIcon className="icon" />
                            <span>Profile</span>
                        </li>
                    </Link>

                    {/* Edit Profile */}
                    <Link to={user.isFaculty? `/faculties/${user._id}/edit` : `/students/${user._id}/edit`} style={{ textDecoration: "none" }}>
                        <li>
                            <EditIcon className="icon" />
                            <span>Edit Profile</span>
                        </li>
                    </Link>

                    {/* Logout Button */}
                    <li>
                        <ExitToAppIcon className="icon" />
                        <span onClick={handleClick}>Logout</span>
                    </li>
                    
                    {/* Toggle Theme */}
                    <p className="title">Theme</p>
                    <div className="theme">
                        <div
                            className="colorOption"
                            onClick={() => Dispatch({ type: "LIGHT" })}
                        ></div>
                        <div
                            className="colorOption"
                            onClick={() => Dispatch({ type: "DARK" })}
                        ></div>
                    </div>
                </ul>
            </motion.div >

            {/* When use state becomes true pop up will show up */}
            {openQuery && <Query setOpen={setOpenQuery} user={user} />}
        </div >
    )
}

export default NavSidebar