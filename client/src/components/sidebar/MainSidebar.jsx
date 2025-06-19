import "./mainSidebar.scss"
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useAuth } from "../../config/context/AuthContext";
import { DarkModeContext } from "../../config/context/darkModeContext";
import Query from '../popUps/Query';
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { sidebarConsts } from "./sidebarConsts";


const MainSidebar = () => {

    const { Dispatch } = useContext(DarkModeContext);
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(true);
    
    // useState for opening query pop up
    const [openQuery, setOpenQuery] = useState(false);

    const handleClick = async (e) => {
        e.preventDefault();
        await logout("Logged Out Successfully!");
    }

    const handleToggle = () => {
        setCollapsed(!collapsed);
    }

    return (
        <div className={`navSidebarContainer ${collapsed ? 'collapsed' : ''}`}>

            <motion.div animate={{  width: collapsed ? "50px" : "200px" }} className="sidebar">
                <ul>

                    <li id="menu">
                        <ListOutlinedIcon className='icon' onClick={handleToggle} />
                        <h3>{!collapsed && 'MAIN MENU'}</h3>
                    </li>

                    <Link to={`/${user.role}`} style={{ textDecoration: "none" }}>
                        <li>
                            <DashboardIcon className="icon" />
                            <span>{!collapsed && 'Dashboard'}</span>
                        </li>
                    </Link>

                    {/* All the Lists*/}

                    <p className={`title ${collapsed ? 'add-border' : ''}`}>{!collapsed && 'Information'}</p>

                    {
                        sidebarConsts?.information?.map((item) => (
                            <> 
                                {
                                    (item.user === user.role || 
                                    (item.user === 'both' && user.role !== 'admin')) && (
                                        <Link
                                            to={item.getPath ? item.getPath(user) : item.path}
                                            style={{ textDecoration: "none" }}
                                            key={item.title}
                                        >
                                            <li>
                                                <item.icon className="icon" />
                                                <span>{!collapsed && item.title}</span>
                                            </li>
                                        </Link>
                                    )
                                }
                            </>
                        ))
                    }

                    {
                        sidebarConsts.information.map((item) => (
                            <>
                                {
                                    (item.user === 'all') && (
                                        <Link
                                            to={item.getPath ? item.getPath(user) : item.path}
                                            style={{ textDecoration: "none" }}
                                            key={item.title}
                                        >
                                            <li>
                                                <item.icon className="icon" />
                                                <span>{!collapsed && item.title}</span>
                                            </li>
                                        </Link>
                                    )
                                }
                            </>
                        ))
                    }

                    <p className={`title ${collapsed ? 'add-border' : ''}`}>{!collapsed && 'Create'}</p>

                    {
                        sidebarConsts?.create?.map((item) => (
                            <>
                                {user.role === item.user && <Link to={item.path} style={{textDecoration: "none"}}>
                                    <li>
                                        <item.icon className="icon" />
                                        <span>{!collapsed && item.title}</span>
                                    </li>
                                </Link>}
                            </>
                        ))
                    }
                    
                    {/* On click set usestate to true */}
                    {user.role === 'student' && <li onClick={() => setOpenQuery(true)}>
                        <ContactSupportIcon className="icon" />
                        <span>{!collapsed && 'Query'}</span>
                    </li>}

                    {/* Options for Users */}
                    
                    <p className={`title ${collapsed ? 'add-border' : ''}`}>{!collapsed && 'User'}</p>

                    {
                        sidebarConsts?.user?.map((item) => (
                            <>
                                {
                                    (item.user === 'both'  && user.role !== 'admin') && <Link
                                        to={item.getPath ? item.getPath(user) : item.path}
                                        style={{textDecoration: "none"}}
                                    >
                                        <li>
                                            <item.icon className="icon" />
                                            <span>{!collapsed && item.title}</span>
                                        </li>
                                    </Link>
                                }
                            </>
                        ))
                    }

                    {/* Logout Button */}
                    <li onClick={handleClick}>
                        <ExitToAppIcon className="icon" />
                        <span>{!collapsed && 'Logout'}</span>
                    </li>
                    
                    {/* Toggle Theme */}
                    {/* {collapsed ? (
                            <>
                            <p className={`title ${collapsed ? 'add-border' : ''}`}></p>
                            <li>
                                <DarkModeOutlinedIcon
                                    className="icon"
                                    onClick={() => Dispatch({ type: "TOGGLE" })}
                                />
                            </li>
                            </>
                        ) : (
                            <>
                                <p className={`title ${collapsed ? 'add-border' : ''}`}>Theme</p>
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
                            </>
                        )
                    } */}
                </ul>
            </motion.div >

            {/* When use state becomes true pop up will show up */}
            {openQuery && <Query setOpen={setOpenQuery} user={user} />}
        </div >
    )
}

export default MainSidebar