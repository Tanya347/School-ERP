import "./mainSidebar.scss"
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useAuth } from "../../config/context/AuthContext";
import { DarkModeContext } from "../../config/context/darkModeContext";
import Query from '../popUps/Query';
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { sidebarConsts } from "./sidebarConsts";
import Tooltip from "../tooltip/Tooltip";
import DarkModeIcon from '@mui/icons-material/DarkMode';


const MainSidebar = () => {

    const { Dispatch } = useContext(DarkModeContext);
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(true);
    
    // useState for opening query pop up
    const [openQuery, setOpenQuery] = useState(false);

    const handleToggle = () => {
        setCollapsed(!collapsed);
    }

    return (
        <div className={`navSidebarContainer ${collapsed ? 'collapsed' : ''}`}>

            <motion.div animate={{  width: collapsed ? "70px" : "250px" }} className="sidebar">
                <ul>

                    <li id="menu">
                        <ListOutlinedIcon className='icon' onClick={handleToggle} />
                        <h3>{!collapsed && 'MAIN MENU'}</h3>
                    </li>

                    <Link to={`/${user.role}`} style={{ textDecoration: "none" }}>
                        <li>
                            <Tooltip content="Dashboard" position="right">
                                <DashboardIcon className="icon" />
                            </Tooltip>
                            <span  className="sidebar-item">{!collapsed && 'Dashboard'}</span>
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
                                                <Tooltip content={item.title} position="right">
                                                    <item.icon className="icon" />
                                                </Tooltip>
                                                <span className="sidebar-item">{!collapsed && item.title}</span>
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
                                                <Tooltip content={item.title} position="right">
                                                    <item.icon className="icon" />
                                                </Tooltip>
                                                <span className="sidebar-item">{!collapsed && item.title}</span>
                                            </li>
                                        </Link>
                                    )
                                }
                            </>
                        ))
                    }

                    {user.role !== 'student' && <p className={`title ${collapsed ? 'add-border' : ''}`}>{!collapsed && 'Create and Update'}</p>}

                    {
                        sidebarConsts?.create?.map((item) => (
                            <>
                                {user.role === item.user && <Link to={item.path} style={{textDecoration: "none"}}>
                                    <li>
                                        <Tooltip content={item.title} position="right">
                                            <item.icon className="icon" />
                                        </Tooltip>
                                        <span className="sidebar-item">{!collapsed && item.title}</span>
                                    </li>
                                </Link>}
                            </>
                        ))
                    }
                    

                    {
                        sidebarConsts?.user?.map((item) => (
                            <>
                                {
                                    (item.user === 'admin' && user.role === 'admin') && (
                                        <Link
                                            to={item.getPath ? item.getPath(user) : item.path}
                                            style={{textDecoration: "none"}}
                                        >
                                            <li>
                                                <Tooltip content={item.title} position="right">
                                                    <item.icon className="icon" />
                                                </Tooltip>
                                                <span className="sidebar-item">{!collapsed && item.title}</span>
                                            </li>
                                        </Link>
                                    )
                                }
                            </>
                        ))
                    }
                    
                    {/* Toggle Theme */}
                    {collapsed ? (
                            <>
                            <p className={`title ${collapsed ? 'add-border' : ''}`}></p>
                            <li>
                                <DarkModeIcon
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
                    }
                </ul>
            </motion.div >

            {/* When use state becomes true pop up will show up */}
            {openQuery && <Query setOpen={setOpenQuery} user={user} />}
        </div >
    )
}

export default MainSidebar