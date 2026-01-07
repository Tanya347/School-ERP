import "./mainSidebar.scss"

import DashboardIcon from "@mui/icons-material/Dashboard";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";

import { useState } from 'react'
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

import { sidebarConsts } from "./sidebarConsts";
import { checkEditor } from "../../utils/shared/commons";

import Tooltip from "../shared/tooltip/Tooltip";

const MainSidebar = () => {

    const [collapsed, setCollapsed] = useState(true);
    
    const { user } = useSelector(state => state.auth);

    const handleToggle = () => {
        setCollapsed(!collapsed);
    }

    const canAccess = (item, role) => item.roles?.includes(role);

    return (
        <div className={`nav-sidebar-container ${collapsed ? 'collapsed' : ''}`}>

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

                    {sidebarConsts.information
                        .filter(item => canAccess(item, user.role))
                            .map(item => (
                                <Link
                                    key={item.title}
                                    to={item.getPath ? item.getPath(user) : item.path}
                                    style={{ textDecoration: "none" }}
                                >
                                    <li>
                                        <Tooltip content={item.title} position="right">
                                        <item.icon className="icon" />
                                        </Tooltip>
                                        <span className="sidebar-item">{!collapsed && item.title}</span>
                                    </li>
                                </Link>
                    ))}

                    {checkEditor(user.role) && (
                        <p className={`title ${collapsed ? 'add-border' : ''}`}>
                            {!collapsed && 'Create and Update'}
                        </p>
                    )}
                    
                    {sidebarConsts.create
                        .filter(item => canAccess(item, user.role))
                        .map(item => (
                            <Link key={item.title} to={item.path} style={{ textDecoration: "none" }}>
                                <li>
                                    <Tooltip content={item.title} position="right">
                                    <item.icon className="icon" />
                                    </Tooltip>
                                    <span className="sidebar-item">{!collapsed && item.title}</span>
                                </li>
                            </Link>
                    ))}

                    <p className={`title ${collapsed ? 'add-border' : ''}`}>
                        {!collapsed && 'Account'}
                    </p>
                    
                    {sidebarConsts.user
                        .filter(item => canAccess(item, user.role))
                        .map(item => (
                            <Link
                            key={item.title}
                            to={item.getPath(user)}
                            style={{ textDecoration: "none" }}
                            >
                            <li>
                                <Tooltip content={item.title} position="right">
                                <item.icon className="icon" />
                                </Tooltip>
                                <span className="sidebar-item">{!collapsed && item.title}</span>
                            </li>
                        </Link>
                    ))}
                                 
                </ul>
            </motion.div >
        </div >
    )
}

export default MainSidebar