import "./mainSidebar.scss"
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from '@mui/icons-material/Task';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AssessmentIcon from '@mui/icons-material/Assessment';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EditIcon from '@mui/icons-material/Edit';
import AddTaskIcon from '@mui/icons-material/AddTask';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddchartIcon from '@mui/icons-material/Addchart';
import PostAddIcon from '@mui/icons-material/PostAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useAuth } from "../../config/context/AuthContext";
import { DarkModeContext } from "../../config/context/darkModeContext";
import Query from '../popUps/Query';

const MainSidebar = ({ setOpen }) => {

    const { Dispatch } = useContext(DarkModeContext);
    const { user, logout } = useAuth();
    
    // useState for opening query pop up
    const [openQuery, setOpenQuery] = useState(false);

    const handleClick = async (e) => {
        e.preventDefault();
        await logout("Logged Out Successfully!");
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
                    <Link to={`/${user.role}`} style={{ textDecoration: "none" }}>
                        <li>
                            <DashboardIcon className="icon" />
                            <span>Dashboard</span>
                        </li>
                    </Link>

                    {/* All the Lists*/}

                    <p className="title">Information</p>

                    {/* Calender Page */}
                    <Link to={`/${user.role}/calender`} style={{"textDecoration": "none"}}>
                        <li>
                            <CalendarMonthIcon className="icon"/>
                            <span>Calender</span>
                        </li>
                    </Link>

                    {(user.role === 'faculty') && <Link to="/faculty/attendance" style={{ textDecoration: "none" }}>
                        <li>
                            <CoPresentIcon className="icon" />
                            <span>Attendance</span>
                        </li>
                    </Link>}

                    {/* Takes you to list of all tasks created by admin */}
                    <Link to={`/${user.role}/tasks`} style={{ textDecoration: "none" }}>
                        <li>
                            <TaskIcon className="icon" />
                            <span>Tasks</span>
                        </li>
                    </Link>

                    {/* Takes you to list of all tasks created by admin */}
                    <Link to={`/${user.role}/tests`} style={{ textDecoration: "none" }}>
                        <li>
                            <NoteAddIcon className="icon" />
                            <span>Tests</span>
                        </li>
                    </Link>

                    {/* Takes you to list of all tasks created by admin */}
                    {user.role === 'faculty' && <Link to={"/faculty/class/students"} style={{ textDecoration: "none" }}>
                        <li>
                            <GroupsIcon className="icon" />
                            <span>Students</span>
                        </li>
                    </Link>}

                    {/* Takes you to list of all tasks created by admin */}
                    {user.role === 'faculty' && <Link to={"/faculty/marks"} style={{ textDecoration: "none" }}>
                        <li>
                            <AssessmentIcon className="icon" />
                            <span>Marks</span>
                        </li>
                    </Link>}


                    {/* Takes you to list of all responses sent by faculties */}
                    {user.role === 'student' && <Link to="/student/responses" style={{ textDecoration: "none" }}>
                        <li>
                            <MarkChatReadIcon className="icon" />
                            <span>Responses</span>
                        </li>
                    </Link>}

                    {/* Create events/queries */}
                    <p className="title">Create</p>

                    {(user.role === 'faculty') && <Link to="/faculty/tasks/new" style={{ textDecoration: "none" }}>
                        <li>
                            <AddTaskIcon className="icon" />
                            <span>Tasks</span>
                        </li>
                    </Link>}

                    {(user.role === 'faculty') && <Link to="/faculty/tests/new" style={{ textDecoration: "none" }}>
                        <li>
                            <PostAddIcon className="icon" />
                            <span>Tests</span>
                        </li>
                    </Link>}

                    {(user.role === 'faculty') && <Link to="/faculty/attendance/new" style={{ textDecoration: "none" }}>
                        <li>
                            <PlaylistAddIcon className="icon" />
                            <span>Attendance</span>
                        </li>
                    </Link>}

                    {(user.role === 'faculty') && <Link to="/faculty/marks/new" style={{ textDecoration: "none" }}>
                        <li>
                            <AddchartIcon className="icon" />
                            <span>Marks</span>
                        </li>
                    </Link>}
                    
                    <Link to={`/${user.role}/events`} style={{ textDecoration: "none" }}>
                            <li>
                                <EmojiEventsIcon className="icon" />
                                <span>Event</span>
                            </li>
                    </Link>
                    
                    {/* On click set usestate to true */}
                    {user.role === 'student' && <li onClick={() => setOpenQuery(true)}>
                        <ContactSupportIcon className="icon" />
                        <span>Query</span>
                    </li>}

                    {/* Options for Users */}
                    
                    <p className="title">User</p>

                    {/* View Profile */}
                    <Link to={`/${user.role}/single/${user._id}`} style={{ textDecoration: "none" }}>
                        <li>
                            <AccountCircleOutlinedIcon className="icon" />
                            <span>Profile</span>
                        </li>
                    </Link>

                    {/* Edit Profile */}
                    <Link to={`/${user.role}/edit/${user._id}`} style={{ textDecoration: "none" }}>
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

export default MainSidebar